import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { setupQueueMicroservice } from './queue/queue';

const port = process.env.PORT || 7151;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await setupQueueMicroservice(app);
  await app.startAllMicroservices();

  await app.listen(port, async () => {
    console.log(`Nest queue server is running on http://localhost:${port}`);
  });
}
bootstrap();
