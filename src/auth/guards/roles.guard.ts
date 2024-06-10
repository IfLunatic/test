import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/user/entities/enum/userRole.enum';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    const isUserRoute = this.reflector.get<boolean>('isUserRoute', context.getHandler());

    if (requiredRoles) {
      return true; 
    }

    if (isUserRoute) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.roles) {
      return false; 
    }

    return user.roles.some(role => requiredRoles.includes(role));
  }
}
