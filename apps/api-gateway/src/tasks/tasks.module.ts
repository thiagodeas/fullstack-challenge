import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TasksController } from './tasks.controller';
import { TasksProxyService } from './tasks.proxy.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TASKS_CLIENT',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
            queue: process.env.RABBITMQ_TASKS_QUEUE || 'tasks_queue',
            queueOptions: { durable: true }
          }
        })
      }
    ])
  ],
  controllers: [TasksController],
  providers: [TasksProxyService]
})
export class TasksModule {}
