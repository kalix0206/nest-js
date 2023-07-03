import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  Matches,
} from 'class-validator';
import { NotIn } from '../../utils/not-in';

export class CreateUserDto {
  @Transform((params) => params.value.trim())
  @NotIn('password', {
    message: 'password는 name과 같은 문자열을 포함할 수 없습니다.',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string;

  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  //   @Transform(({ value, obj }) => {
  //     if (obj.password.includes(obj.name.trim())) {
  //       throw new BadRequestException(
  //         'password는 name과 같은 문자열을 포함할 수 없습니다.',
  //       );
  //       return value.trim();
  //     }
  //   })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}
