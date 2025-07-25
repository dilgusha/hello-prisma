import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { TodoModule } from './app/todo/todo.module';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [ClsModule.forRoot({
    middleware: {
      // automatically mount the
      // ClsMiddleware for all routes
      mount: true,
      // and use the setup method to
      // provide default store values.
      setup: (cls, req) => {
        cls.set('userId', req.headers['x-user-id']);
      },
    },
  }), PrismaModule, UserModule, AuthModule, TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
