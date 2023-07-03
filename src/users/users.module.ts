import { HandlerRolesGuard } from '../guards/handlerRoles.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './../auth/auth.module';
import { UserEntity } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from './../email/email.module';
import { Logger, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ClassRolesGuard } from 'src/guards/classRoles.guard';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    CqrsModule,
  ], // enroll userEntity using forFeature
  controllers: [UsersController],
  providers: [
    UsersService,
    // { provide: APP_GUARD, useClass: HandlerRolesGuard },
    // { provide: APP_GUARD, useClass: ClassRolesGuard },
    Logger,
  ],
})
export class UsersModule {}
