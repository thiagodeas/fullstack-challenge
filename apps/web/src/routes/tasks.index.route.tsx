import * as React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/tasks')({
  component: () => (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Tasks</h1>
      <div className="text-sm text-gray-500">Listagem com filtros e busca em breve…</div>
      <div className="pt-2">
        <Link to="/tasks/$id" params={{ id: '123' }} className="underline">Example task</Link>
      </div>
    </div>
  )
});
