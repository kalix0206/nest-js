import { Module } from '@nestjs/common';
import { BatchController } from './dynamicScheduler.controller';
import { DynamicTaskService } from './dynamicScheduler.service';

@Module({
  controllers: [BatchController],
})
export class dynamicBatchModule {}
