import { IsOptional, IsString, IsNotEmpty } from "class-validator"

export class EditBookmarkDTO {
    @IsString()
    @IsOptional()
    title?: string

    @IsOptional()
    @IsString()
    description?: string

    @IsString()
    @IsOptional()
    link?: string
}