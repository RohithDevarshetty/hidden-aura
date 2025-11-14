import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        default: 'bg-primary text-nord-0 hover:bg-primary-dark focus-visible:ring-frost-2',
        secondary: 'bg-nord-3 text-snow-2 hover:bg-nord-2 focus-visible:ring-frost-0',
        outline: 'border border-frost-0/50 bg-frost-1/10 text-snow-2 hover:bg-frost-1/20 backdrop-blur-md focus-visible:ring-frost-2',
        ghost: 'text-snow-2 hover:bg-nord-2/20 backdrop-blur-sm focus-visible:ring-frost-0',
        danger: 'bg-aurora-red text-snow-2 hover:bg-[#a54e56] focus-visible:ring-aurora-red',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
