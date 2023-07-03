import { Module } from '@nestjs/common';
import { CustomDecoController } from './custom_decorator.controller';

@Module({ controllers: [CustomDecoController] })
export class CustomDecoModule {}
