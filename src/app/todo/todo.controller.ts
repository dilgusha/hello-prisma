import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { AuthGuard } from 'src/guards/auth.guard';  // AuthGuard import ediyoruz
import { Roles } from 'src/guards/role.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('Todo')
@Controller('todo')
@UseGuards(AuthGuard)  
@Roles('USER')  
@ApiBearerAuth()  
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  // @Roles('USER')  // Sadece USER rolüne sahip kullanıcılar erişebilir
  create(@Body() dto: CreateTodoDto) {
    return this.todoService.create(dto);
  }
}
