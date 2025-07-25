import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsInt, IsOptional, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsInt()
    userId: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    userName: string

    @Type()
    @IsString()
    @Length(3, 150)
    @ApiProperty()
    password: string;

    @IsEnum(Role)
    role: Role;
}