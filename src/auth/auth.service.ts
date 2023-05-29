import { BadRequestException, Injectable } from "@nestjs/common";
import { LoginDto } from "./dtos/login.dto";
import { SignUpDto } from "./dtos/sign-up.dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { IBaseResponse } from "src/interfaces/base-response.interface";
import { JwtService } from "@nestjs/jwt";
import { IJwtPayload } from "src/interfaces/jwt-payload.interface";
import { ILoginResponse } from "./interfaces/login-response.interface";
import { CommonService } from "src/common/common.service";
import { GenderEnum } from "src/enums/gender.enum";

@Injectable()
export class AuthService{
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private commonService: CommonService
    ){}
    async signUp(data: SignUpDto): Promise<IBaseResponse>{
        const {password, email, gender, name} = data

        if(!(gender === GenderEnum.MALE || gender === GenderEnum.FEMALE)){
            throw new BadRequestException("Please select proper gender")
        }
        try{
            
            const user = await this.prismaService.user.findUnique({
                where: {
                    email: email
                }
            })
            if(user){
                throw new BadRequestException("Invalid Email or Password")
            }

            const saltOrRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltOrRounds);

            await this.prismaService.user.create({
                data: {
                    email: email,
                    password: hashedPassword,
                    name: name,
                    gender: gender
                }
            })

            return {
                statusCode: 200,
                message: "Register successfully"
            }
            
        }catch(e){
            this.commonService.catchError(e)
        }
    }
    async login(data: LoginDto): Promise<ILoginResponse>{
        const {email, password} = data

        try{
            const user = await this.prismaService.user.findUniqueOrThrow({
                where: {
                    email: email
                }
            })

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new BadRequestException("Incorrect email or password.");
            };

            const jwtPayload: IJwtPayload = {
                userId: user.id,
                email: user.email
            }

            const accessToken = this.jwtService.sign(jwtPayload)

            return {
                statusCode: 201,
                message: "Login successfully!",
                payload: {
                    accessToken
                }
            }
        }catch(e){
            this.commonService.catchError(e)
        }
    }
}