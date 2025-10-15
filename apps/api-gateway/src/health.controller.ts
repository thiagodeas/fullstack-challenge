import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './auth/public.decorator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @Public()
  getHealth() {
    return { status: 'ok' };
  }
}
