import { HttpExceptionFilter } from '../exception/exception.filter';
import { Roles } from './role.decorator';
import { AuthService } from './../auth/auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {
  Body,
  Controller,
  Post,
  Query,
  Get,
  Param,
  ParseIntPipe,
  HttpStatus,
  DefaultValuePipe,
  UseGuards,
  Headers,
  SetMetadata,
  Inject,
  LoggerService,
  InternalServerErrorException,
  UseFilters,
} from '@nestjs/common';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './user-info.interface';
import { UsersService } from './users.service';
import { ValidationPipe } from './../pipe/validation.pipe';
import { AuthGuard } from 'src/guards/auth.guard';
import { Logger as WinstonLogger } from 'winston';
import {
  WINSTON_MODULE_PROVIDER,
  WINSTON_MODULE_NEST_PROVIDER,
} from 'nest-winston';
import { Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

// @UseFilters(HttpExceptionFilter) // 특정 controller 전체에 적용
@Roles('user')
// @UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    // @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger, // using when use winston at controller
    // @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService, // use to replace embedded logger with winston
    @Inject(Logger) private readonly logger: LoggerService, // use to replace embedded logger involving bootstrap with winston
    private commandBus: CommandBus,
  ) {}

  // @UseFilters(HttpExceptionFilter) // 특정 endpoint에 적용
  // @UseGuards(AuthGuard)
  @Post()
  async createUser(
    @Body(/* ValidationPipe */) dto: CreateUserDto,
  ): Promise<void> {
    // this.printWinstonLog(dto);
    /** apply command Bus
    this.printLoggerServiceLog(dto);
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);  
     */
    const { name, email, password } = dto;
    const command = new CreateUserCommand(name, email, password);
    return this.commandBus.execute(command);
  }
  // private printWinstonLog(dto) {
  //   // console.log(this.logger);

  //   this.logger.error('error: ', dto);
  //   this.logger.warn('warn: ', dto);
  //   this.logger.info('info: ', dto);
  //   this.logger.http('http: ', dto);
  //   this.logger.verbose('verbose: ', dto);
  //   this.logger.debug('debug: ', dto);
  //   this.logger.silly('silly: ', dto);
  // }

  private printLoggerServiceLog(dto) {
    try {
      throw new InternalServerErrorException('test');
    } catch (e) {
      this.logger.error('error: ', +JSON.stringify(dto), e.stack);
    }

    this.logger.warn('warn: ' + JSON.stringify(dto));
    this.logger.log('log: ' + JSON.stringify(dto));
    this.logger.verbose('verbose: ' + JSON.stringify(dto));
    this.logger.debug('debug: ' + JSON.stringify(dto));
  }
  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    console.log(dto);
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    return await this.usersService.login(email, password);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getUserInfo(
    @Headers() headers: any,
    // @Param('id', ParseIntPipe) userId: string,
    @Param(
      'id',
      // new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    userId: string,
  ): Promise<UserInfo> {
    // const jwtString = headers.authorization.split('Bearer ')[1];
    // this.authService.verify(jwtString);
    return this.usersService.getUserInfo(userId);
  }

  @Get()
  findAll(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    console.log(offset, limit);
    return;
    // return this.usersService.findAll();
  }

  // create userdto only admin
  @Post('/onlyAdmin')
  // @SetMetadata('roles', ['admin'])
  @Roles('admin')
  createOnlyAdmin(@Body() createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    return this.usersService.createUser(name, email, password);
  }
}
