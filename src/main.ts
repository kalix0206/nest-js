import { AuthGuard } from './guards/auth.guard';
// import { ValidationPipe } from './pipe/validation.pipe'; // 자체 구현 validtaionPipe
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger3 } from './logger/logger_func.middleware';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { HttpExceptionFilter } from './exception/exception.filter';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { TransformInterceptor } from './interceptor/transform.interceptor';
/** setting using dotenv  
  import * as dotenv from 'dotenv';
  import * as path from 'path';

  dotenv.config({
    path: path.resolve(
      process.env.NODE_ENV === 'production'
        ? '.production.env'
        : process.env.NODE_ENV === 'stage'
        ? '.stage.env'
        : '.development.env',
    ),
  }); 
 * */

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
    // logger:
    //   process.env.NODE_ENV === 'production'
    //     ? ['error', 'warn', 'log']
    //     : ['error', 'warn', 'log', 'verbose', 'debug'],
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
  });
  // app.useGlobalGuards(new AuthGuard()); // use global guard
  app.use(logger3);
  // app.useGlobalPipes(new ValidationPipe()); // 전역으로 ValidationPipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    // new LoggingInterceptor(),
    new TransformInterceptor(),
  );
  await app.listen(3000);
}
bootstrap();

// const LOG_LEVERL_VALUES: Record<LogLevel, number> = {
//   debug: 0,
//   verbose: 1,
//   log: 2,
//   warn: 3,
//   error: 4,
// };
