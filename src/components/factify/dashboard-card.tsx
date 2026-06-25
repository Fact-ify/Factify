'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  index?: number;
}

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
  index = 0,
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-6 rounded-xl border border-factify-gray bg-white card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-factify-gold/10">
          <Icon className="h-5 w-5 text-factify-gold" />
        </div>
        {change && (
          <span
            className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              changeType === 'positive' && 'bg-green-50 text-green-700',
              changeType === 'negative' && 'bg-red-50 text-red-700',
              changeType === 'neutral' && 'bg-gray-100 text-gray-600'
            )}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-factify-navy mb-1">{value.toLocaleString()}</p>
      <p className="text-sm text-factify-gray-dark">{title}</p>
    </motion.div>
  );
}
