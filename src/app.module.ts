import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { TodoModule } from './app/todo/todo.module';
import { ClsModule } from 'nestjs-cls';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 10,
          limit: 2,
        },
      ],
    }),
    ClsModule.forRoot({
      middleware: {
        mount: true,
        setup: (cls, req) => {
          cls.set('userId', req.headers['x-user-id']);
        },
      },
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    TodoModule,
    DatabaseModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    AppService
  ],
})
export class AppModule { }
