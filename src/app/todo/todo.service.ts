import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "generated/prisma";
import { CreateTodoDto, UpdateTodoDto } from "./dto/create-todo.dto";
import { ClsService } from "nestjs-cls";
import { todo } from "node:test";

@Injectable()
export class TodoService {
    constructor(private prisma: PrismaService,
        private cls: ClsService,
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
    async findAll() {
        const myUser = await this.cls.get<User>('user')
        if (!myUser) {
            throw new HttpException("User not found in context", HttpStatus.NOT_FOUND);
        }
        return this.prisma.todo.findMany({
            where: {
                userId: myUser.id
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                tags: true, 
            }
        })
    }
    async findOne(id: number) {
        const myUser = await this.cls.get<User>('user')
        if (!myUser) {
            throw new HttpException("User not found in context", HttpStatus.NOT_FOUND);
        }
        if (!id) {
            throw new HttpException("ID must be provided", HttpStatus.BAD_REQUEST);
        }
        const todo = await this.prisma.todo.findFirst({
            where: {
                id: Number(id),
                userId: myUser.id
            }
        });
        return todo;
    }

    async toggleCompleted(id: number, completed: boolean) {
        const myUser = await this.cls.get<User>('user')
        if (!myUser) {
            throw new HttpException("User not found in context", HttpStatus.NOT_FOUND);
        }
        const todo = await this.prisma.todo.findFirst({
            where: {
                id: Number(id),
                userId: myUser.id,
            },
        });
        if (!todo) {
            throw new HttpException("Todo not found or access denied", HttpStatus.NOT_FOUND);
        }
        return await this.prisma.todo.update({
            where: {
                id: Number(id),
            },
            data: {
                completed: !todo.completed,
            }
        });
    }

    async update(id: number, dto: UpdateTodoDto) {
        const myUser = await this.cls.get<User>('user')

        if (!myUser) {
            throw new HttpException("User not found in context", HttpStatus.NOT_FOUND);
        }
        const todo = await this.prisma.todo.findFirst({
            where: {
                id: Number(id),
                userId: myUser.id,
            },
        });
        if (!todo) {
            throw new HttpException("Todo not found or access denied", HttpStatus.NOT_FOUND);
        }
        return await this.prisma.todo.update({
            where: {
                id: Number(id),
            },
            data: {
                title: dto.title,
                description: dto.description,
                completed: dto.completed,
            }
        });
    }

    async delete(id: number) {
        const myUser = await this.cls.get<User>('user')
        if (!myUser) {
            throw new HttpException("User not found in context", HttpStatus.NOT_FOUND);
        }

        const deletedTodo = await this.prisma.todo.findFirst({
            where: {
                id: Number(id)
            }
        })
        if (!deletedTodo) {
            throw new HttpException("Todo not found", HttpStatus.NOT_FOUND);
        }

        this.prisma.todo.delete({ where: { id: Number(id) } });
        return {
            message: "Todo deleted successfully",
        }
    }

    async completedTodos() {
        const myUser = await this.cls.get<User>("user");
        if (!myUser) {
            throw new HttpException("User not found in context", HttpStatus.NOT_FOUND);
        }
        const todos = await this.prisma.todo.findMany({
            where: {
                userId: myUser.id,
                completed: true
            },
        });
        return todos;
    }

    async addTagToTodo(todoId: number, tagId: number) {
        const myUser = await this.cls.get<User>('user')
        if (!myUser) {
            throw new HttpException("User not found in context", HttpStatus.NOT_FOUND);
        }
        const todo = await this.prisma.todo.findUnique({
            where: {
                id: Number(todoId),
            }
        })
        const tag = await this.prisma.tag.findUnique({
            where: {
                id: Number(tagId),
            }
        })
        if (!todo || !tag) {
            throw new HttpException("Todo or Tag not found", HttpStatus.NOT_FOUND);
        }
        if (myUser.role == 'ADMIN' || todo?.userId == myUser.id) {
            return this.prisma.todo.update({
                where: {
                    id: Number(todoId)
                },
                data: {
                    tags: {
                        connect: { id: Number(tagId) }
                    }
                }
            })
        }
        throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);

    }

}