import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IsString } from 'class-validator';
import { Observable } from 'rxjs';

class UserEntity {
  @IsString()
  name: string;

  @IsString()
  email: string;
}

@Injectable()
export class DecoAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // example hardcoding
    request.user = {
      // name: 'tom',
      name: 1,
      email: 'tom@naver.com',
    };
    return true;
  }
}
