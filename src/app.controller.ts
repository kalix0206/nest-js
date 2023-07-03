import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/error')
  error(foo: any): string {
    return foo.bar();
  }
}
