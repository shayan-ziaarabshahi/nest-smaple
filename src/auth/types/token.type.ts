import { IsEmail, IsInt, IsNotEmpty } from "class-validator";

export class UserToken {
    @IsInt()
    @IsNotEmpty()
    sub: number
    @IsEmail()
    @IsNotEmpty()
    email: string
}