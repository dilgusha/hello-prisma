import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClsService } from 'nestjs-cls';
import { PrismaService } from 'src/prisma/prisma.service'; // PrismaService'yi ekliyoruz
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,  // PrismaService'yi inject ediyoruz
        private cls: ClsService,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers.authorization;

        // Authorization header'ının doğru olup olmadığını kontrol ediyoruz
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Invalid or missing authorization header');
        }

        const token = authHeader.split(' ')[1];  // Token'ı header'dan alıyoruz
        try {
            const payload = await this.jwtService.verify(token);  // JWT token'ı doğruluyoruz
            if (!payload.userId) throw new UnauthorizedException('Invalid token payload');

            // Kullanıcıyı Prisma ile buluyoruz
            const user = await this.prisma.user.findUnique({
                where: { id: payload.userId },  // Prisma ile kullanıcıyı ID'ye göre buluyoruz
            });
            if (!user) throw new UnauthorizedException('User not found');

            // CLS Service ile kullanıcı bilgisini set ediyoruz
            this.cls.set('user', user);

            // Roller doğrulaması
            const roles = this.reflector.get<Role[]>('roles', context.getHandler());
            if (roles && roles.length > 0) {
                const hasRole = roles.some((role) => user.role?.includes(role));  // Kullanıcının rolünü kontrol ediyoruz
                if (!hasRole) {
                    throw new ForbiddenException('You do not have permission to access this resource');
                }
            }
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new UnauthorizedException('Authentication failed');
        }

        return true;  // Kullanıcı doğrulandıysa, access izni veriyoruz
    }
}
