import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsGateway } from './notifications/notifications.gateway';

@Controller()
export class RmqEventsHandler {
  private readonly logger = new Logger(RmqEventsHandler.name);

  constructor(private readonly gateway: NotificationsGateway) {}

  @EventPattern('task.created')
  handleTaskCreated(@Payload() data: any) {
    this.logger.log(`Received task.created event`);
    this.gateway.emit('task:created', data);
  }

  @EventPattern('task.updated')
  handleTaskUpdated(@Payload() data: any) {
    this.logger.log(`Received task.updated event`);
    this.gateway.emit('task:updated', data);
  }

  @EventPattern('task.comment.created')
  handleCommentNew(@Payload() data: any) {
    this.logger.log(`Received task.comment.created event`);
    this.gateway.emit('comment:new', data);
  }
}
