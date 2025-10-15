import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthProxyService } from './auth.proxy.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_CLIENT',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
            queue: process.env.RABBITMQ_AUTH_QUEUE || 'auth_queue',
            queueOptions: { durable: true }
          }
        })
      }
    ])
  ],
  controllers: [AuthController],
  providers: [AuthProxyService],
  exports: [AuthProxyService]
})
export class AuthModule {}
