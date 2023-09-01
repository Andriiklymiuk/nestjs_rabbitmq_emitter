import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { ConfigModule } from '@nestjs/config';
import RabbitmqQueueModule from './queue';

@Module({
  imports: [RabbitmqQueueModule, ConfigModule],
  controllers: [QueueController],
  providers: [QueueService],
})
// eslint-disable-next-line prettier/prettier
export class QueueModule { }
