import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-factify-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'gradient-gold text-factify-navy hover:shadow-factify-gold hover:scale-[1.02] active:scale-[0.98]',
        secondary: 'border border-factify-gray bg-white text-factify-navy hover:bg-factify-gray/50 hover:border-factify-navy/20',
        navy: 'bg-factify-navy text-white hover:bg-factify-navy-light hover:scale-[1.02] active:scale-[0.98]',
        ghost: 'text-factify-navy hover:bg-factify-gray/50',
        outline: 'border-2 border-factify-gold text-factify-gold hover:bg-factify-gold hover:text-factify-navy',
        destructive: 'bg-factify-error text-white hover:bg-red-600',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-14 px-8 text-base',
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
