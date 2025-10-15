import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );

  const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672';
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitUrl],
      queue: process.env.RABBITMQ_TASKS_QUEUE || 'tasks_queue',
      queueOptions: { durable: true }
    }
  });

  await app.startAllMicroservices();
  // eslint-disable-next-line no-console
  console.log('Tasks microservice connected to RabbitMQ');
}

bootstrap();
