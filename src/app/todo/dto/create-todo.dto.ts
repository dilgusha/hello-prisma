import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class CreateTodoDto {
    @ApiProperty()
    @IsString()
    title: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    description?: string;

    @IsOptional()
    @ApiProperty({default:false})
    @IsBoolean()
    completed?: boolean;

}