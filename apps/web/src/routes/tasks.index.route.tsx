import * as React from 'react';
import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch, getStoredTokens } from '../lib/api';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks',
  validateSearch: (s: Record<string, unknown>) => {
    return { page: Number(s.page ?? 1), size: Number(s.size ?? 10) };
  },
  component: TasksPage
});

type Task = { id: string; title: string; status: string; priority: string };

function TasksPage() {
  const tokens = getStoredTokens();
  if (!tokens?.accessToken) {
    if (typeof window !== 'undefined') window.location.href = '/login';
    return null;
  }
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const page = Number(params.get('page') ?? 1);
  const size = Number(params.get('size') ?? 10);
  const q = String(params.get('q') ?? '');
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['tasks', page, size],
    queryFn: async () => {
      const res = await apiFetch(`/api/tasks?page=${page}&size=${size}`);
      return res.json() as Promise<{ items: Task[]; total: number }>;
    }
  });
  const createTask = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiFetch('/api/tasks', { method: 'POST', body: JSON.stringify(payload) });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      if (typeof window !== 'undefined') (document.getElementById('new-task-form') as HTMLFormElement)?.reset();
    }
  });

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Tasks</h1>
      {isLoading && <div>Carregando…</div>}
      {error && <div className="text-red-600 text-sm">{(error as Error).message}</div>}

      <form id="new-task-form" className="grid grid-cols-1 md:grid-cols-2 gap-3 border rounded p-3"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const fd = new FormData(form);
          const payload = {
            title: fd.get('title'),
            description: fd.get('description'),
            priority: fd.get('priority'),
            status: fd.get('status'),
            deadline: fd.get('deadline') || null,
            assignees: []
          };
          createTask.mutate(payload);
        }}>
        <div>
          <Label>Título</Label>
          <Input name="title" required />
        </div>
        <div>
          <Label>Prazo</Label>
          <Input name="deadline" type="date" />
        </div>
        <div className="md:col-span-2">
          <Label>Descrição</Label>
          <Input name="description" />
        </div>
        <div>
          <Label>Prioridade</Label>
          <select name="priority" className="w-full border rounded px-2 py-2 text-sm">
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>
        </div>
        <div>
          <Label>Status</Label>
          <select name="status" className="w-full border rounded px-2 py-2 text-sm">
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="REVIEW">REVIEW</option>
            <option value="DONE">DONE</option>
          </select>
        </div>
        <div className="md:col-span-2 flex items-end">
          <Button type="submit" disabled={createTask.isPending}>{createTask.isPending ? 'Criando…' : 'Criar tarefa'}</Button>
        </div>
      </form>

      <div className="flex items-center gap-2 mt-2">
        <Label className="mb-0">Busca</Label>
        <Input defaultValue={q} placeholder="Título contém…" onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const v = (e.target as HTMLInputElement).value;
            const sp = new URLSearchParams(window.location.search);
            if (v) sp.set('q', v); else sp.delete('q');
            window.location.search = sp.toString();
          }
        }} />
      </div>
      <ul className="divide-y border rounded">
  {data?.items?.filter((t) => (q ? t.title.toLowerCase().includes(q.toLowerCase()) : true)).map((t: Task) => (
          <li key={t.id} className="p-2 flex items-center justify-between">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-xs text-gray-500">{t.status} • {t.priority}</div>
            </div>
            <a href={`/tasks/${t.id}`} className="underline">Abrir</a>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <a href={`?page=${Math.max(1, page - 1)}&size=${size}`} className="underline">Anterior</a>
        <a href={`?page=${page + 1}&size=${size}`} className="underline">Próxima</a>
      </div>
    </div>
  );
}
