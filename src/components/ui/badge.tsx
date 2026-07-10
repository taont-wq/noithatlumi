import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'gold';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default:
      'bg-primary/10 text-primary border-transparent',
    secondary:
      'bg-secondary text-secondary-foreground border-transparent',
    outline:
      'text-foreground border-border',
    gold:
      'bg-gradient-to-r from-gold/20 to-gold-light/20 text-gold border-gold/30',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
