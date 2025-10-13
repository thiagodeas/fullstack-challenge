import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class HealthHandler {
  @MessagePattern('auth.health')
  health() {
    return { status: 'ok' };
  }
}
