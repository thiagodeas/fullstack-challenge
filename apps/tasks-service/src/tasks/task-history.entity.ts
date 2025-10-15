import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task.entity';

export type HistoryAction = 'CREATED' | 'UPDATED' | 'ASSIGNED' | 'COMMENTED' | 'STATUS_CHANGED';

@Entity({ name: 'task_history' })
export class TaskHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Task, (task) => task.history, { onDelete: 'CASCADE' })
  task!: Task;

  @Column({ type: 'uuid' })
  taskId!: string;

  @Column({ type: 'varchar', length: 50 })
  action!: HistoryAction;

  @Column({ type: 'jsonb', nullable: true })
  payload?: Record<string, any> | null;

  @Column({ type: 'uuid', nullable: true })
  actorId?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
