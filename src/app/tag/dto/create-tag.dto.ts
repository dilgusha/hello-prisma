import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTagDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;


}
