import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TasksProxyService } from './tasks.proxy.service';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksProxyService) {}

  @Get()
  @ApiOperation({ summary: 'Lista tarefas com paginação' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  list(@Query('page') page?: number, @Query('size') size?: number) {
    return this.tasks.list({ page: page ? Number(page) : undefined, size: size ? Number(size) : undefined });
  }

  @Post()
  @ApiOperation({ summary: 'Cria tarefa e publica task.created' })
  create(@Req() req: any, @Body() dto: any) {
    const actorId = req.user?.sub;
    return this.tasks.create(dto, actorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém detalhes da tarefa' })
  get(@Param('id') id: string) {
    return this.tasks.get(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza tarefa e publica task.updated' })
  update(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    const actorId = req.user?.sub;
    return this.tasks.update(id, dto, actorId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove tarefa' })
  async remove(@Param('id') id: string) {
    await this.tasks.remove(id);
    return;
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Cria comentário e publica task.comment.created' })
  createComment(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    const actorId = req.user?.sub;
    return this.tasks.createComment(id, { ...dto, authorId: actorId });
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Lista comentários da tarefa com paginação' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  listComments(@Param('id') id: string, @Query('page') page?: number, @Query('size') size?: number) {
    return this.tasks.listComments(id, page ? Number(page) : undefined, size ? Number(size) : undefined);
  }
}
