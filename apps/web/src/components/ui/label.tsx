import * as React from 'react';
import clsx from 'clsx';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return <label className={clsx('block text-sm font-medium mb-1', className)} {...props} />;
}
