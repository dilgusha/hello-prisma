import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/user-create.dto";
import { ApiTags } from "@nestjs/swagger";
import { UpdateUserDto } from "./dto/user-update.dto";

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    // @Post()
    // create(@Body() dto: CreateUserDto) {
    //     return this.userService.create(dto);
    // }

    @Get(':id')
    findOne(@Param('id') id:number) {
        return this.userService.findOne({id})
    }

    @Get()
    findAll(){
        return this.userService.findAll();
    }

    @Post(':id')
    update(@Param('id')id:number, @Body()dto:UpdateUserDto){
        return this.userService.update(id, dto);
    }
}