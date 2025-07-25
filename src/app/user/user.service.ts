import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/user-create.dto";
import { UpdateUserDto } from "./dto/user-update.dto";
import { Prisma, User } from "@prisma/client";
import { FindOneParams, FindParams } from "src/shared/types/find.params";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findOne(where: { id: number }): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: where.id
            }
        });
        if (!user) return null;
        // Map userName to username to match the expected type
        const { userName, ...rest } = user as any;
        return { ...rest, username: userName };
    }

    // async findByUserName(userName: string) {
    //     return this.prisma.user.findUnique({
    //         where: {
    //             userName
    //         }
    //     })
    // }

    // async create(dto: CreateUserDto) {
    //     const { userName, password } = dto;
    //     const existUser = await this.findByUserName(userName);
    //     if (existUser) {
    //         throw new Error('User with this username already exists');
    //     }

    //     return this.prisma.user.create({
    //         data: {
    //             userName,
    //             password,
    //             role: 'USER',
    //         }
    //     })
    // }

    findAll() {
        return this.prisma.user.findMany()
    }


    update(id: number, dto: UpdateUserDto) {
        if (!id) {
            throw new Error("ID must be provided");
        }
        const userId = parseInt(id.toString(), 10);

        return this.prisma.user.update({
            where: { id: userId },
            data: dto
        })
    }
}