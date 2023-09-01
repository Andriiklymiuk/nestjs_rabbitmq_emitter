import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { QUEUE_SERVICE, checkQueueConnection } from './queue';
import { randomUUID } from 'crypto';

@Injectable()
export class QueueService implements OnModuleInit, OnApplicationBootstrap {
  constructor(
    @Inject(QUEUE_SERVICE)
    private readonly queueClient: ClientProxy,
  ) {
    //
  }
  private readonly logger = new Logger(QueueService.name);
  async onModuleInit() {
    this.logger.log(`${QueueService.name} initialized`);
    const isQueueConnected = await checkQueueConnection(this.queueClient);
    if (isQueueConnected) {
      this.queueClient.emit(
        {},
        { id: randomUUID(), message: 'hello message from nestjs server' },
      );
    } else {
      this.logger.error('Queue is not connected, cannot send hello message');
    }
  }
  async onApplicationBootstrap() {
    this.logger.log(`${QueueService.name} bootstrapped`);
  }
  //
}
