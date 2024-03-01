import { IsOptional, IsString } from "class-validator";

export class EditUserDTO {
    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    firstname?: string;

    @IsOptional()
    @IsString()
    lastname?: string
}