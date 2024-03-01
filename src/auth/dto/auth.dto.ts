import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class SignUpDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    hash: string
}

export class SignInDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    hash: string
}