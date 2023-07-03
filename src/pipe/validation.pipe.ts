/* ValidationPipe 직접구현,,, but Nest의 ValidationPipe를 사용하자*/

/* eslint-disable @typescript-eslint/ban-types */

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
  //   transform(value: any, metadata: ArgumentMetadata) {
  //     console.log(metadata);
  //     return value;
  //   }
}

/**
 * value : 현재 파이프에 전달된 인수
 * metadata : 현재 파이프에 전달된 인수의 메타데이터
 */

/**
 * export interface ArgumentMetadata {
 * readonly type: Paramtype;
 * readonly metatype?: Type<any> | undefined;
 * readonly data?: string " undefined
 * }
 *
 * export declare type Paramtype = 'body' | 'query' | 'param' | 'custom'
 *
 * type : checking what is pipe input [본문인지.. 쿼리 매개변수인지.. 경로 매개변수인지.. 커스텀 매개변수인지..]
 * metaType : knowing type of router handler.. handler type 생략하거나 vanilajs사용시 undefined
 * data : string to be passed decorator
 *
 */
