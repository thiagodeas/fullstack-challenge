import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/task.entity';
import { Comment } from './tasks/comment.entity';
import { TaskHistory } from './tasks/task-history.entity';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HealthHandler } from './health.handler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'challenge_db',
        autoLoadEntities: true,
        synchronize: true
      })
    }),
    TypeOrmModule.forFeature([Task, Comment, TaskHistory]),
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATIONS_CLIENT',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
            queue: process.env.RABBITMQ_NOTIFICATIONS_QUEUE || 'notifications_queue',
            queueOptions: { durable: true }
          }
        })
      }
    ])
  ],
  controllers: [TasksController],
  providers: [HealthHandler, TasksService]
})
export class AppModule {}
