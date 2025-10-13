import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class HealthHandler {
  @MessagePattern('tasks.health')
  health() {
    return { status: 'ok' };
  }
}
