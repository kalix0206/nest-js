import { DecoAuthGuard } from './custon_decorator.auth.guard';
import { Controller, Get, UseGuards, ValidationPipe } from '@nestjs/common';
import { User, UserData } from './custom_decorator';
import { IsString } from 'class-validator';
// import { ValidationPipe } from 'src/pipe/validation.pipe';
interface User {
  name: string;
  email: string;
}
class UserEntity {
  @IsString()
  name: string;

  @IsString()
  email: string;
}

@UseGuards(DecoAuthGuard)
@Controller('customDeco')
export class CustomDecoController {
  //   @UseGuards(DecoAuthGuard)
  @Get('/customDecorator')
  getHello(@User() user: User) {
    console.log(user);
  }

  //   @UseGuards(DecoAuthGuard)
  @Get('/customDecorator1')
  getHello1(@UserData('name') name: string) {
    console.log(name);
  }

  //   @UseGuards(DecoAuthGuard)
  @Get('/customDecoratorWithPipe')
  getHello3(
    @UserData(new ValidationPipe({ validateCustomDecorators: true }))
    user: UserEntity,
  ) {
    console.log(user);
  }
}
