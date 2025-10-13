import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672';
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitUrl],
      queue: process.env.RABBITMQ_NOTIFS_QUEUE || 'notifications_queue',
      queueOptions: { durable: true }
    }
  });

  await app.startAllMicroservices();

  const port = process.env.PORT || 3004;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Notifications service running with WebSocket on port ${port}`);
}

bootstrap();
