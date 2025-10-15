import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TasksProxyService {
  constructor(@Inject('TASKS_CLIENT') private readonly client: ClientProxy) {}

  list(query: { page?: number; size?: number }) {
    return firstValueFrom(this.client.send('tasks.list', query));
  }
  create(dto: any, actorId?: string) {
    return firstValueFrom(this.client.send('tasks.create', { dto, actorId }));
  }
  get(id: string) {
    return firstValueFrom(this.client.send('tasks.get', id));
  }
  update(id: string, dto: any, actorId?: string) {
    return firstValueFrom(this.client.send('tasks.update', { id, dto, actorId }));
  }
  remove(id: string) {
    return firstValueFrom(this.client.send('tasks.delete', id));
  }
  createComment(taskId: string, dto: any) {
    return firstValueFrom(this.client.send('tasks.comments.create', { taskId, dto }));
  }
  listComments(taskId: string, page?: number, size?: number) {
    return firstValueFrom(this.client.send('tasks.comments.list', { taskId, page, size }));
  }
}
