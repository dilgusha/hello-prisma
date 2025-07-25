import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from 'src/app/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) { }
 async register(dto: RegisterUserDto) {
    const { userName, password } = dto;

    const existUser = await this.prisma.user.findFirst({
      where: { userName },
    });

    if (existUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    if (!userName || !password) {
      throw new HttpException('Username and password are required', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        userName,
        password: hashedPassword,
        role: 'USER',
      },
    });

    const payload = {
      // userId: newUser.id,
      roles: [newUser.role]  // Kullanıcının rollerini burada ekliyoruz
    };
    const token = this.jwtService.sign(payload);
    // const token = this.jwtService.sign({ userId: newUser.id });
    return { token };

  }

  async login(params: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { userName: params.userName },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const passwordValid = await bcrypt.compare(params.password, user.password);
    if (!passwordValid) {
      throw new HttpException('Username or password is incorrect', HttpStatus.UNAUTHORIZED);
    }

    const token = this.jwtService.sign({ userId: user.id, roles:user.role });
    return { token };
  }


 
}
