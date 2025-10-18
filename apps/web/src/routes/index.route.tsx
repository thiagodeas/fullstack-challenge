import * as React from 'react';
import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <div>Welcome to Jungle Gaming Challenge</div>
});
