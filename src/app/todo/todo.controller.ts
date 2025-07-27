import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TodoService } from './todo.service';
import { CreateTodoDto, UpdateTodoDto } from './dto/create-todo.dto';
import { AuthGuard } from 'src/guards/auth.guard';  // AuthGuard import ediyoruz
import { Roles } from 'src/guards/role.decorator';

@ApiTags('Todo')
@Controller('todo')
@UseGuards(AuthGuard)
@Roles('USER')
@ApiBearerAuth()
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Post()
  @ApiOperation({ summary: 'Create todo' })
  create(@Body() dto: CreateTodoDto) {
    return this.todoService.create(dto);
  }

  // @UseGuards(ThrottlerGuard)
  // @Throttle(3,60) // 2 requests per minute
  @Get()
  @ApiOperation({ summary: 'Find todos' })
  findAll() {
    return this.todoService.findAll();
  }
  @Get('completed')
  @ApiOperation({ summary: 'Get Completed Todos' })
  completedTodos() {
    return this.todoService.completedTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one todo' })
  findOne(@Param('id') id: number) {
    return this.todoService.findOne(id);
  }

  @Post(':id/completed')
  @ApiOperation({ summary: 'Toggle Completed Button' })
  changeCompleted(@Param('id') id: number, @Body('completed') completed: boolean) {
    return this.todoService.toggleCompleted(id, completed);
  }


  @Post(':id')
  @ApiOperation({ summary: 'Todo Update' })
  update(@Param('id') id: number, @Body() dto: UpdateTodoDto) {
    return this.todoService.update(id, dto);
  }



  @Delete(':id')
  @ApiOperation({ summary: 'Delete todo' })
  delete(@Param('id') id: number) {
    return this.todoService.delete(id)
  }




}
