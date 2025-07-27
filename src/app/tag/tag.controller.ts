import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/guards/role.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Roles('ADMIN')
@Controller('tag')
@ApiTags('Tag')
@ApiBearerAuth()
export class TagController {
  constructor(private readonly tagService: TagService) { }
  @Post()
  create(@Body() dto: CreateTagDto) {
    return this.tagService.create(dto);
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tagService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateTagDto) {
    return this.tagService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tagService.remove(id);
  }
}
