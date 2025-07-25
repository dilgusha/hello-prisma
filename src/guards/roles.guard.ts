import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';  // Metadata'yı almak için kullanıyoruz

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;  // Eğer roller tanımlanmamışsa, erişim izni verilir
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;  // Kullanıcı bilgisi (JWT doğrulaması sonrası)

    if (!user) {
      throw new ForbiddenException('No user found');
    }

    const hasRole = roles.some(role => user.roles?.includes(role));  // Kullanıcının rolünü kontrol et
    if (!hasRole) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;  // Kullanıcı uygun role sahipse, erişim sağlanır
  }
}
