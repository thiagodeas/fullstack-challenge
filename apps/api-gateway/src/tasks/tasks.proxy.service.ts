import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TasksProxyService {
  constructor(@Inject('TASKS_CLIENT') private readonly client: ClientProxy) {}

  list(query: { page?: number; size?: number }) {
    return firstValueFrom(this.client.send('tasks.list', query)).catch((err: any) => {
      const status =
        (typeof err?.status === 'number' && err.status) ||
        (typeof err?.statusCode === 'number' && err.statusCode) ||
        (typeof err?.response?.statusCode === 'number' && err.response.statusCode) ||
        500;
      const message = err?.message || err?.response?.message || 'Internal server error';
      throw new HttpException(message, status);
    });
  }
  create(dto: any, actorId?: string) {
    return firstValueFrom(this.client.send('tasks.create', { dto, actorId })).catch((err: any) => {
      const status =
        (typeof err?.status === 'number' && err.status) ||
        (typeof err?.statusCode === 'number' && err.statusCode) ||
        (typeof err?.response?.statusCode === 'number' && err.response.statusCode) ||
        500;
      const message = err?.message || err?.response?.message || 'Internal server error';
      throw new HttpException(message, status);
    });
  }
  get(id: string) {
    return firstValueFrom(this.client.send('tasks.get', id)).catch((err: any) => {
      const status =
        (typeof err?.status === 'number' && err.status) ||
        (typeof err?.statusCode === 'number' && err.statusCode) ||
        (typeof err?.response?.statusCode === 'number' && err.response.statusCode) ||
        500;
      const message = err?.message || err?.response?.message || 'Internal server error';
      throw new HttpException(message, status);
    });
  }
  update(id: string, dto: any, actorId?: string) {
    return firstValueFrom(this.client.send('tasks.update', { id, dto, actorId })).catch((err: any) => {
      const status =
        (typeof err?.status === 'number' && err.status) ||
        (typeof err?.statusCode === 'number' && err.statusCode) ||
        (typeof err?.response?.statusCode === 'number' && err.response.statusCode) ||
        500;
      const message = err?.message || err?.response?.message || 'Internal server error';
      throw new HttpException(message, status);
    });
  }
  remove(id: string) {
    return firstValueFrom(this.client.send('tasks.delete', id)).catch((err: any) => {
      const status =
        (typeof err?.status === 'number' && err.status) ||
        (typeof err?.statusCode === 'number' && err.statusCode) ||
        (typeof err?.response?.statusCode === 'number' && err.response.statusCode) ||
        500;
      const message = err?.message || err?.response?.message || 'Internal server error';
      throw new HttpException(message, status);
    });
  }
  createComment(taskId: string, dto: any) {
    return firstValueFrom(this.client.send('tasks.comments.create', { taskId, dto })).catch((err: any) => {
      const status =
        (typeof err?.status === 'number' && err.status) ||
        (typeof err?.statusCode === 'number' && err.statusCode) ||
        (typeof err?.response?.statusCode === 'number' && err.response.statusCode) ||
        500;
      const message = err?.message || err?.response?.message || 'Internal server error';
      throw new HttpException(message, status);
    });
  }
  listComments(taskId: string, page?: number, size?: number) {
    return firstValueFrom(this.client.send('tasks.comments.list', { taskId, page, size })).catch((err: any) => {
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
