/* Static route tree (manual) */
import { Route as rootRoute } from './routes/__root';
import { createRouter } from '@tanstack/react-router';
import { Route as indexRoute } from './routes/index.route';
import { Route as loginRoute } from './routes/login.route';
import { Route as registerRoute } from './routes/register.route';
import { Route as tasksIndexRoute } from './routes/tasks.index.route';
import { Route as taskDetailRoute } from './routes/tasks.$id.route';

export const routeTree = (rootRoute as any).addChildren([
	indexRoute as any,
	loginRoute as any,
	registerRoute as any,
	tasksIndexRoute as any,
	taskDetailRoute as any
]);

export const router = createRouter({ routeTree } as any);
