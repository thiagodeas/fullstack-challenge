import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Comment } from './comment.entity';
import { Task, TaskStatus } from './task.entity';
import { TaskHistory } from './task-history.entity';
import { CreateCommentDto, CreateTaskDto, UpdateTaskDto } from './tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasksRepo: Repository<Task>,
    @InjectRepository(Comment) private readonly commentsRepo: Repository<Comment>,
    @InjectRepository(TaskHistory) private readonly historyRepo: Repository<TaskHistory>,
    @Inject('NOTIFICATIONS_CLIENT') private readonly notifyClient: ClientProxy
  ) {}

  async paginate(page = 1, size = 10) {
    const [items, total] = await this.tasksRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * size,
      take: size
    });
    return { items, page, size, total };
  }

  async create(dto: CreateTaskDto, actorId?: string) {
    const task = this.tasksRepo.create({
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      priority: dto.priority ?? undefined,
      status: TaskStatus.TODO,
      assignees: dto.assignees ?? []
    });
    const saved = await this.tasksRepo.save(task);
    await this.historyRepo.save({ taskId: saved.id, action: 'CREATED', actorId, payload: { assignees: saved.assignees } });
    // emit task.created
    this.notifyClient.emit('task.created', { taskId: saved.id, assignees: saved.assignees }).subscribe();
    return saved;
  }

  async findById(id: string) {
    const task = await this.tasksRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, actorId?: string) {
    const task = await this.findById(id);
    const prevStatus = task.status;
    Object.assign(task, {
      title: dto.title ?? task.title,
      description: dto.description ?? task.description,
      dueDate: dto.dueDate !== undefined ? (dto.dueDate ? new Date(dto.dueDate) : null) : task.dueDate,
      priority: dto.priority ?? task.priority,
      status: dto.status ?? task.status,
      assignees: dto.assignees ?? task.assignees
    });
    const saved = await this.tasksRepo.save(task);
    await this.historyRepo.save({ taskId: saved.id, action: 'UPDATED', actorId, payload: dto });
    if (dto.status && dto.status !== prevStatus) {
      await this.historyRepo.save({ taskId: saved.id, action: 'STATUS_CHANGED', actorId, payload: { from: prevStatus, to: dto.status } });
    }
    // emit task.updated
    this.notifyClient.emit('task.updated', { taskId: saved.id, assignees: saved.assignees }).subscribe();
    return saved;
  }

  async remove(id: string) {
    const task = await this.findById(id);
    await this.tasksRepo.remove(task);
    return { deleted: true };
  }

  async addComment(taskId: string, dto: CreateCommentDto) {
    await this.findById(taskId);
    const comment = this.commentsRepo.create({ taskId, authorId: dto.authorId, content: dto.content });
    const saved = await this.commentsRepo.save(comment);
    await this.historyRepo.save({ taskId, action: 'COMMENTED', actorId: dto.authorId, payload: { commentId: saved.id } });
    // emit task.comment.created
    this.notifyClient.emit('task.comment.created', { taskId, commentId: saved.id }).subscribe();
    return saved;
  }

  async listComments(taskId: string, page = 1, size = 10) {
    const [items, total] = await this.commentsRepo.findAndCount({
      where: { taskId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * size,
      take: size
    });
    return { items, page, size, total };
  }
}
