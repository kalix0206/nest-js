import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class HandlerRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const userId = 'user-id';

    const userRole = this.getUserRole(userId);

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    return roles?.includes(userRole) ?? true;
  }

  private getUserRole(userId: string): string {
    // return 'admin'; //from dB
    return 'user';
  }
}

/**
 *
 * HandlerRolesGuard는 Reflector를 주입받아야 하므로 main.ts에서 전역으로 설정 불가능
 *
 * controller에 @UseGuard 로 선언해주거나 custom provider 제공
 */
