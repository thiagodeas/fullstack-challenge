import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notifications/notification.entity';

@Controller()
export class RmqEventsHandler {
  private readonly logger = new Logger(RmqEventsHandler.name);

  constructor(
    private readonly gateway: NotificationsGateway,
    @InjectRepository(Notification) private readonly notificationsRepo: Repository<Notification>
  ) {}

  @EventPattern('task.created')
  handleTaskCreated(@Payload() data: any) {
    this.logger.log(`Received task.created event`);
    // Persist notifications for assignees
    if (Array.isArray(data?.assignees)) {
      data.assignees.forEach(async (userId: string) => {
        await this.notificationsRepo.save({ userId, type: 'task:created', payload: data });
      });
    }
    this.gateway.emit('task:created', data);
  }

  @EventPattern('task.updated')
  handleTaskUpdated(@Payload() data: any) {
    this.logger.log(`Received task.updated event`);
    if (Array.isArray(data?.assignees)) {
      data.assignees.forEach(async (userId: string) => {
        await this.notificationsRepo.save({ userId, type: 'task:updated', payload: data });
      });
    }
    this.gateway.emit('task:updated', data);
  }

  @EventPattern('task.comment.created')
  handleCommentNew(@Payload() data: any) {
    this.logger.log(`Received task.comment.created event`);
    if (Array.isArray(data?.assignees)) {
      data.assignees.forEach(async (userId: string) => {
        await this.notificationsRepo.save({ userId, type: 'comment:new', payload: data });
      });
    }
    this.gateway.emit('comment:new', data);
  }
}
