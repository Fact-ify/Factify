'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ConfidenceMeterProps {
  value: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export default function ConfidenceMeter({
  value,
  label = 'Confidence',
  size = 'md',
  showValue = true,
}: ConfidenceMeterProps) {
  const color =
    value >= 80 ? 'bg-factify-success' : value >= 60 ? 'bg-factify-gold' : 'bg-factify-error';

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3' };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className={cn('font-medium text-factify-navy', size === 'lg' ? 'text-sm' : 'text-xs')}>
          {label}
        </span>
        {showValue && (
          <span className={cn('font-bold text-factify-navy', size === 'lg' ? 'text-lg' : 'text-sm')}>
            {value}%
          </span>
        )}
      </div>
      <div className={cn('w-full rounded-full bg-factify-gray overflow-hidden', heights[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={cn('h-full rounded-full', color)}
        />
      </div>
    </div>
  );
}
