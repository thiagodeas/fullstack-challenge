import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LoginDto, RefreshDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthProxyService {
  constructor(@Inject('AUTH_CLIENT') private readonly client: ClientProxy) {}

  register(dto: RegisterDto) {
    return firstValueFrom(this.client.send('auth.register', dto)).catch((err: any) => {
      const status =
        (typeof err?.status === 'number' && err.status) ||
        (typeof err?.statusCode === 'number' && err.statusCode) ||
        (typeof err?.response?.statusCode === 'number' && err.response.statusCode) ||
        500;
      const message = err?.message || err?.response?.message || 'Internal server error';
      throw new HttpException(message, status);
    });
  }

  login(dto: LoginDto) {
    return firstValueFrom(this.client.send('auth.login', dto)).catch((err: any) => {
      const status =
        (typeof err?.status === 'number' && err.status) ||
        (typeof err?.statusCode === 'number' && err.statusCode) ||
        (typeof err?.response?.statusCode === 'number' && err.response.statusCode) ||
        500;
      const message = err?.message || err?.response?.message || 'Internal server error';
      throw new HttpException(message, status);
    });
  }

  refresh(dto: RefreshDto) {
    return firstValueFrom(this.client.send('auth.refresh', dto)).catch((err: any) => {
      const status =
        (typeof err?.status === 'number' && err.status) ||
        (typeof err?.statusCode === 'number' && err.statusCode) ||
        (typeof err?.response?.statusCode === 'number' && err.response.statusCode) ||
        500;
      const message = err?.message || err?.response?.message || 'Internal server error';
      throw new HttpException(message, status);
    });
  }
}
