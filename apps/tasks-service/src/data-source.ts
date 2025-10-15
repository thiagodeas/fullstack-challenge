import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Task } from './tasks/task.entity';
import { Comment } from './tasks/comment.entity';
import { TaskHistory } from './tasks/task-history.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'challenge_db',
  entities: [Task, Comment, TaskHistory],
  migrations: ['src/migrations/*.{ts,js}']
});
