import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/app/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { ClsModule, ClsService } from 'nestjs-cls';

@Module({
  imports: [
    UserModule,  // UserModule-u burada import edin
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),  // JWT_SECRET .env-dən oxunur
        signOptions: { expiresIn: '1h' },  // Token müddətini təyin edin
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot(),
    ClsModule
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService,UserService],
  exports: [JwtModule],
})
export class AuthModule { }
