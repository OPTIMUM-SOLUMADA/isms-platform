import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex uppercase items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-theme to-theme-1 text-primary-foreground shadow-lg hover:bg-theme/90',
        destructive:
          'bg-gradient-to-br to-theme-danger from-destructive text-destructive-foreground shadow-lg hover:to-theme-danger/90 hover:from-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground border border-input shadow-sm hover:bg-secondary/80',
        primary:
          'bg-theme-2 text-foreground shadow-sm hover:bg-theme-2/80 text-white',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        "ghost-destructive": 'hover:bg-theme-danger/10 text-theme-danger',
        link: 'text-primary underline-offset-4 hover:underline',
        "outline-destructive":
          'border border-theme-danger bg-background shadow-sm text-theme-danger hover:bg-theme-danger hover:text-destructive-foreground',
        "outline-primary":
          'border border-theme-2-muted/50 bg-background shadow-sm text-theme-2-muted hover:bg-theme-2-muted hover:text-destructive-foreground',
      },
      size: {
        default: 'min-h-9 px-4 py-2',
        sm: 'min-h-8 rounded-md px-3 text-xs',
        lg: 'min-h-10 rounded-md px-8',
        icon: 'min-h-9 w-9',
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
