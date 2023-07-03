import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
@Injectable()
export class ClassRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // important !! when use decorator at class, should use context.getClass() not context.getHandler()
    const roles = this.reflector.get<string[]>('roles', context.getClass());

    console.log('ClassRolesGuard: ', roles);

    return true; // for test
  }
}
