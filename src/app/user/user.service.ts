import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/user-create.dto";
import { UpdateUserDto } from "./dto/user-update.dto";
import { Prisma, User } from "@prisma/client";
import { FindOneParams, FindParams } from "src/shared/types/find.params";
import { ClsService } from "nestjs-cls";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService,
        private cls: ClsService,
    ) { }

    async findOne(where: { id: number }): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: Number(where.id)
            }
        });
        if (!user) throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        const { userName, ...rest } = user as any;
        return userName
    }


    async create(dto: CreateUserDto) {
        const { userName, password } = dto;
        const existUser = await this.prisma.user.findFirst({
            where: { userName },
        });
        if (existUser) {
            throw new Error('User with this username already exists');
        }
        const user = this.prisma.user.create({
            data: {
                userName,
                password,
                role: 'USER',
            }
        })

        return userName
    }

    findAll() {
        return this.prisma.user.findMany({
            select: {
                userName: true,
                role: true
            }
        })
    }

    async update(id: number, dto: UpdateUserDto) {
        const myUser = await this.cls.get<User>('user')
        if (!myUser) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        if (!id) {
            throw new Error("ID must be provided");
        }
        const userId = parseInt(id.toString(), 10);
        if (myUser.role == 'ADMIN' || userId == myUser.id) {
            return this.prisma.user.update({
                where: { id: myUser.id },
                data: dto
            })
        }
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
}