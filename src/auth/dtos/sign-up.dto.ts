import { IsEmail, IsNotEmpty, IsStrongPassword, Length } from "class-validator"

export class SignUpDto{
    @IsEmail()
    email: string
    
    @Length(8, 24)
    @IsStrongPassword({
        minSymbols: 1,
        minUppercase: 1,
        minNumbers: 1
    })
    password: string

    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    gender: string
}