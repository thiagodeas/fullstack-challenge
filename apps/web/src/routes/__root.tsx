import * as React from 'react';
import { Outlet, createRootRoute, Link } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
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
    </div>
  )
});
