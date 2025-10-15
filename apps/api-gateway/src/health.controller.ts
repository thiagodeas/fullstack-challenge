import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './auth/public.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @Public()
  @SkipThrottle()
  getHealth() {
    return { status: 'ok' };
  }
}
