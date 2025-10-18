import * as React from 'react';
import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUser, login } from '../stores/auth';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const schema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6)
});

type FormData = z.infer<typeof schema>;

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage
});

function RegisterPage() {
  const navigateToTasks = () => { if (typeof window !== 'undefined') window.location.href = '/tasks'; };
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      await registerUser(data);
      // Auto login after register
      await login(data.email, data.password);
  navigateToTasks();
    } catch (e: any) {
      setError(e?.message || 'Falha no cadastro');
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Criar conta</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <Label>Email</Label>
          <Input {...register('email')} type="email" />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <Label>Username</Label>
          <Input {...register('username')} />
          {errors.username && <p className="text-red-600 text-sm">{errors.username.message}</p>}
        </div>
        <div>
          <Label>Senha</Label>
          <Input {...register('password')} type="password" />
          {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <Button disabled={isSubmitting}>{isSubmitting ? 'Enviando…' : 'Cadastrar'}</Button>
      </form>
    </div>
  );
}
