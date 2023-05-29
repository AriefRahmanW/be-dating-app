import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CommonService } from "src/common/common.service";
import { IJwtPayload } from "src/interfaces/jwt-payload.interface";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private prismaService: PrismaService,
        private commonService: CommonService,
        private jwtService: JwtService
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest()
        
        const token = this.commonService.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        let jwtPayload: IJwtPayload
        
        try{
            jwtPayload = this.jwtService.verify<IJwtPayload>(token)
        }catch(e){
            throw new UnauthorizedException("Token expired")
        }
        
        try{
            const user = await this.prismaService.user.findFirstOrThrow({
                where: {
                    id: jwtPayload.userId
                },
                select: {
                    id: true,
                    email: true,
                    gender: true
                }
            })

            request.user = user
        }catch(e){
            this.commonService.catchError(e)
        }

        return true
    }
}