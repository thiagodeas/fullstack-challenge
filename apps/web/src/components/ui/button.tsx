import * as React from 'react';
import clsx from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({ className, variant = 'default', size = 'md', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none';
  const variants: Record<string, string> = {
    default: 'bg-black text-white hover:bg-black/90',
    outline: 'border border-gray-300 hover:bg-gray-50',
    ghost: 'hover:bg-gray-100'
  };
  const sizes: Record<string, string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-9 px-4 text-sm',
    lg: 'h-10 px-5'
  };
  return <button className={clsx(base, variants[variant], sizes[size], className)} {...props} />;
}
