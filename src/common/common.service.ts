import { BadRequestException, HttpException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Request } from 'express'
import * as bcrypt from 'bcrypt'

export class CommonService{

    extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
    
    catchError(e: Prisma.PrismaClientKnownRequestError | HttpException){
        console.log(e)
        if(e instanceof Prisma.PrismaClientKnownRequestError){
            switch(e.code){
                case "P2002":
                    throw new BadRequestException()
                case "P2025":
                    throw new NotFoundException()
                default:
                    throw new InternalServerErrorException()
            }
        }else if(e instanceof HttpException){
            throw e
        }
        throw new InternalServerErrorException("Something wrong")
    }

    async hashPassword(password: string): Promise<string>{
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        return hashedPassword
    }
}