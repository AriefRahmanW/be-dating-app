import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { SignUpDto } from "./dtos/sign-up.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "../../src/guards/auth.guard";

@Controller("auth")
export class AuthController{

    constructor(
        private authService: AuthService
    ){}

    @Post("sign-up")
    signUp(@Body() data: SignUpDto){
        return this.authService.signUp(data)
    }

    @Post("login")
    login(@Body() data: LoginDto){
        return this.authService.login(data)
    }

    @UseGuards(AuthGuard)
    @Get("profile")
    profile(
        @Req() req
    ){
        const {id} = req.user
        return this.authService.profile(id)
    }
}