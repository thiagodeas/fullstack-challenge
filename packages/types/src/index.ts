export type JwtTokens = {
  accessToken: string;
  refreshToken: string;
};

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

export type TaskDTO = {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null; // ISO string
  priority: TaskPriority;
  status: TaskStatus;
  assignees: string[]; // user ids
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};

export type CommentDTO = {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: string;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  size: number;
  total: number;
};
