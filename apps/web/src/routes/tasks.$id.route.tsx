import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/tasks/$id')({
  component: () => <div>Task details page (comments soon)</div>
});
