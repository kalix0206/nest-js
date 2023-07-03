import { dynamicBatchModule } from './task_scheduling/dynamicScheduler.module';
import { BatchModule } from './task_scheduling/batch.module';
import { HttpExceptionFilter } from './exception/exception.filter';
import { CustomDecoController } from './custom_decorator/custom_decorator.controller';
import authConfig from 'src/config/authConfig';
import { AuthGuard } from './guards/auth.guard';
import { LoggerMiddleware2 } from './logger/logger2.middleware';
import { LoggerMiddleware1 } from './logger/logger1.middleware';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config'; // using for env setting
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { CustomDecoModule } from './custom_decorator/custom_decorator.module';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { AppController } from './app.controller';
import { ExceptionModule } from './exception/exception.module';
import { LoggingModule } from './interceptor/logging.module';
import { HealthCheckController } from './health-check/health-check.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { DogHealthIndicator } from './health-check/dog-healthIndicator';

@Module({
  imports: [
    // BatchModule,
    // dynamicBatchModule, // require check logic!!
    ExceptionModule,
    UsersModule,
    EmailModule,
    TerminusModule,
    HttpModule,
    // CustomDecoModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    }),
    // using when not invole bootstrap logger
    // WinstonModule.forRoot({
    //   transports: [
    //     new winston.transports.Console({
    //       level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
    //       format: winston.format.combine(
    //         winston.format.timestamp(),
    //         nestWinstonModuleUtilities.format.nestLike('MyApp', {
    //           prettyPrint: true,
    //         }),
    //       ),
    //     }),
    //   ],
    // }),
    LoggingModule,
  ],
  controllers: [AppController, HealthCheckController],
  providers: [
    ConfigService,
    HealthCheckController,
    DogHealthIndicator,
    // declare using custom provider
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(LoggerMiddleware1, LoggerMiddleware2)
      // .exclude({ path: '/users', method: RequestMethod.GET })
      .forRoutes('/users'); // enable using forRoutes(UsersController)
  }
}

/**
 *  import - 이 모듈에서 사용하기 위한 프로바이더를 가진 다른 모듈을 import
 *  controllers / providers - 모듈 전반에 컨트롤러, 프로바이더를 사용할 수 있도록, Nest가 객체를 생성하고 주입
 *  export - 다른 모듈에서 import할 수 있도록(export시, public interface 또는 API로 간주됨
 */
