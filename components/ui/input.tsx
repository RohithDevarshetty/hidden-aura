import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-snow-0 bg-snow-2 px-3 py-2 text-sm text-nord-0 ring-offset-snow-2 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-nord-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-frost-1 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
