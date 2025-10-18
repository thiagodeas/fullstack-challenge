import * as React from 'react';
import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { apiFetch, setStoredTokens } from '../lib/api';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage
});

function LoginPage() {
  const navigateToTasks = () => { if (typeof window !== 'undefined') window.location.href = '/tasks'; };
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      setStoredTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  navigateToTasks();
    } catch (err: any) {
      setError(err?.message || 'Erro ao logar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <Label>Senha</Label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Button disabled={loading}>{loading ? 'Entrando…' : 'Entrar'}</Button>
      </form>
    </div>
  );
}
