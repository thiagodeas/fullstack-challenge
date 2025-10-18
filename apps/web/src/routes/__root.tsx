import * as React from 'react';
import { Outlet, createRootRoute, Link } from '@tanstack/react-router';
import { io, Socket } from 'socket.io-client';

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white px-3 py-2 rounded shadow">
      {message}
    </div>
  );
}

function useSocketNotifications() {
  const [toasts, setToasts] = React.useState<string[]>([]);
  React.useEffect(() => {
    const socket: Socket = io('http://localhost:3004', {
      transports: ['websocket']
    });

    const pushToast = (label: string, payload: any) => {
      const msg = `${label}: ${payload?.taskId || ''}`.trim();
      setToasts((t) => [...t, msg].slice(-3));
      setTimeout(() => setToasts((t) => t.slice(1)), 4000);
    };

    socket.on('connect', () => pushToast('connected', {}));
  socket.on('task:created', (data: any) => pushToast('task:created', data));
  socket.on('task:updated', (data: any) => pushToast('task:updated', data));
  socket.on('comment:new', (data: any) => pushToast('comment:new', data));

    return () => {
      socket.disconnect();
    };
  }, []);

  return toasts;
}

export const Route = createRootRoute({
  component: () => {
    const toasts = useSocketNotifications();
    return (
      <div className="min-h-screen">
        <header className="border-b p-4 flex gap-4">
          <Link to="/" className="font-semibold">Home</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
        <div className="space-y-2">
          {toasts.map((t, i) => (
            <Toast key={i} message={t} />
          ))}
        </div>
      </div>
    );
  }
});
