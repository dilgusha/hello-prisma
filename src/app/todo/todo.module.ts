import { Module } from "@nestjs/common";
import {  TodoController } from "./todo.controller";
import {  TodoService } from "./todo.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthModule } from "../auth/auth.module";
import { ClsModule } from "nestjs-cls";
import { UserModule } from "../user/user.module";

@Module({
   imports: [ClsModule, AuthModule,UserModule], 
  controllers: [TodoController],
  providers: [TodoService, PrismaService], 
})

export class TodoModule {}