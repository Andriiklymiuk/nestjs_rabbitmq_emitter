import { DynamicModule, INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientsModule,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { Err, Ok } from 'ts-results';

export const QUEUE_SERVICE = 'QUEUE_SERVICE';

export const getQueueConfigUrl = (configService: ConfigService): string => {
  const user = configService.get('RABBITMQ_USER');
  const password = configService.get('RABBITMQ_PASSWORD');
  const host = `${configService.get('RABBITMQ_HOST')}:${configService.get(
    'RABBITMQ_PORT',
  )}`;
  const connectionType = host.includes('localhost') ? 'amqp' : 'amqps';
  return `${connectionType}://${user}:${password}@${host}`;
};

export const setupQueueMicroservice = async (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const rabbitmqUrl = getQueueConfigUrl(configService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queueOptions: {
        durable: true,
      },
    },
  });
};

export const checkQueueConnection = async (
  client: ClientProxy,
): Promise<Ok<any> | Err<string>> => {
  return client
    .connect()
    .then(() => Ok(null))
    .catch((e) => Err(e));
};

const RabbitmqQueueModule: DynamicModule = ClientsModule.registerAsync([
  {
    name: QUEUE_SERVICE,
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      const rabbitmqUrl = getQueueConfigUrl(configService);
      return {
        transport: Transport.RMQ,
        options: {
          urls: [rabbitmqUrl],
          queue: QUEUE_SERVICE,
          queueOptions: {
            durable: true,
          },
        },
      };
    },
    inject: [ConfigService],
  },
]);

export default RabbitmqQueueModule;
