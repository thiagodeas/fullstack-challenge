import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginDto, RefreshDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthProxyService {
  constructor(@Inject('AUTH_CLIENT') private readonly client: ClientProxy) {}

  register(dto: RegisterDto) {
    return firstValueFrom(this.client.send('auth.register', dto));
  }

  login(dto: LoginDto) {
    return firstValueFrom(this.client.send('auth.login', dto));
  }

  refresh(dto: RefreshDto) {
    return firstValueFrom(this.client.send('auth.refresh', dto));
  }
}
