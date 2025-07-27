import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/user-create.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UpdateUserDto } from "./dto/user-update.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { Roles } from "src/guards/role.decorator";

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Roles('ADMIN')
    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }

    @Get(':id')
    @Roles('ADMIN')
    findOne(@Param('id') id: number) {
        return this.userService.findOne({ id })
    }

    @Get()
    @Roles('ADMIN')
    findAll() {
        return this.userService.findAll();
    }

    @Post(':id')
    update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
        return this.userService.update(id, dto);
    }
}