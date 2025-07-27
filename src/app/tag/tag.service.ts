import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import { User } from '@prisma/client';

@Injectable()
export class TagService {
  constructor(
    private prisma: PrismaService,
    private cls: ClsService
  ) { }
  async create(dto: CreateTagDto) {
    return this.prisma.tag.create({
      data: {
        name: dto.name,
      }
    })
  }

  findAll() {
    return this.prisma.tag.findMany()
  }

  findOne(id: number) {
    return this.prisma.tag.findUnique({
      where: {
        id: Number(id)
      }
    })
  }

  update(id: number, dto: UpdateTagDto) {
    return this.prisma.tag.update({
      where: {
        id: Number(id)
      },
      data: {
        name: dto.name,
      }
    })
  }

  remove(id: number) {
    return this.prisma.tag.delete({
      where: {
        id: Number(id)
      }
    })
  }
}
