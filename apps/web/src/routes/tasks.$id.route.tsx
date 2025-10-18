import * as React from 'react';
import { createRoute, useParams } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, getStoredTokens } from '../lib/api';

type Task = { id: string; title: string; description?: string; status: string; priority: string };
type Comment = { id: string; content: string; createdAt: string; authorId?: string };

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks/$id',
  component: TaskDetailPage
});

function TaskDetailPage() {
  const tokens = getStoredTokens();
  if (!tokens?.accessToken) {
    if (typeof window !== 'undefined') window.location.href = '/login';
    return null;
  }
  const { id } = useParams({ from: '/tasks/$id' } as any);
  const qc = useQueryClient();
  const taskQ = useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const res = await apiFetch(`/api/tasks/${id}`);
      return res.json() as Promise<Task>;
    }
  });
  const commentsQ = useQuery({
    queryKey: ['task', id, 'comments'],
    queryFn: async () => {
      const res = await apiFetch(`/api/tasks/${id}/comments?page=1&size=20`);
      return res.json() as Promise<{ items: Comment[]; total: number }>;
    }
  });

  const addComment = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiFetch(`/api/tasks/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content })
      });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['task', id, 'comments'] });
    }
  });

  const [content, setContent] = React.useState('');

  return (
    <div className="space-y-4">
      {taskQ.isLoading ? (
        <div>Carregando…</div>
      ) : taskQ.data ? (
        <div>
          <h1 className="text-2xl font-semibold">{taskQ.data.title}</h1>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{taskQ.data.description || '—'}</p>
          <div className="text-xs text-gray-500 mt-1">{taskQ.data.status} • {taskQ.data.priority}</div>
        </div>
      ) : (
        <div className="text-red-600 text-sm">Erro ao carregar tarefa</div>
      )}

      <section>
        <h2 className="font-medium mb-2">Comentários</h2>
        {commentsQ.isLoading ? (
          <div>Carregando…</div>
        ) : (
          <ul className="space-y-2">
            {commentsQ.data?.items?.map((c: Comment) => (
              <li key={c.id} className="border rounded p-2">
                <div className="text-sm">{c.content}</div>
                <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!content.trim()) return; addComment.mutate(content); setContent(''); }}>
        <input value={content} onChange={(e) => setContent(e.target.value)} className="flex-1 border rounded px-2 py-1" placeholder="Novo comentário" />
        <button disabled={addComment.isPending} className="bg-black text-white rounded px-3 py-1 disabled:opacity-50">Enviar</button>
      </form>
    </div>
  );
}
