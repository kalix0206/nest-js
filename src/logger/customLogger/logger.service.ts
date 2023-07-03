import { ConsoleLogger } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    super.error.apply(this, arguments);
    this.dosSomethig();
  }

  private dosSomethig() {}
}
