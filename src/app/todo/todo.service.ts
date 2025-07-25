import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "generated/prisma";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { ClsService } from "nestjs-cls";

@Injectable()
export class TodoService {
    constructor(private prisma: PrismaService,
        private cls: ClsService,
        // private userService: UserService
    ) { }
    async create(dto: CreateTodoDto) {

        const myUser = await this.cls.get<User>('user');
        if (!myUser) {
            throw new HttpException("User not found in context", HttpStatus.NOT_FOUND);
        }

       
        return this.prisma.todo.create({
            data: {
                title: dto.title,
                description: dto.description,
                completed: dto.completed,
                userId: myUser.id
            }
        })
    }
}