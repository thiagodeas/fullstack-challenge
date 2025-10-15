import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCommentDto, CreateTaskDto, UpdateTaskDto } from './tasks.dto';
import { TasksService } from './tasks.service';

@Controller()
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @MessagePattern('tasks.list')
  list(@Payload() { page = 1, size = 10 }: { page?: number; size?: number }) {
    return this.service.paginate(page, size);
  }

  @MessagePattern('tasks.create')
  create(@Payload() payload: { dto: CreateTaskDto; actorId?: string }) {
    return this.service.create(payload.dto, payload.actorId);
  }

  @MessagePattern('tasks.get')
  get(@Payload() id: string) {
    return this.service.findById(id);
  }

  @MessagePattern('tasks.update')
  update(@Payload() payload: { id: string; dto: UpdateTaskDto; actorId?: string }) {
    return this.service.update(payload.id, payload.dto, payload.actorId);
  }

  @MessagePattern('tasks.delete')
  remove(@Payload() id: string) {
    return this.service.remove(id);
  }

  @MessagePattern('tasks.comments.create')
  commentCreate(@Payload() payload: { taskId: string; dto: CreateCommentDto }) {
    return this.service.addComment(payload.taskId, payload.dto);
  }

  @MessagePattern('tasks.comments.list')
  commentsList(@Payload() payload: { taskId: string; page?: number; size?: number }) {
    return this.service.listComments(payload.taskId, payload.page ?? 1, payload.size ?? 10);
  }
}
