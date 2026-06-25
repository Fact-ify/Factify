'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TrendingFakeNews } from '@/data/mock/types';

interface TrendCardProps {
  trend: TrendingFakeNews;
  index?: number;
}

function getSpreadColor(level: string) {
  if (level === 'Viral') return 'error';
  if (level === 'High') return 'warning';
  return 'neutral';
}

export default function TrendCard({ trend, index = 0 }: TrendCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-4 p-4 rounded-xl border border-factify-gray bg-white card-hover"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50">
        <AlertTriangle className="h-5 w-5 text-red-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h4 className="font-semibold text-factify-navy text-sm">{trend.title}</h4>
          <Badge variant={getSpreadColor(trend.spreadLevel)}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {trend.spreadLevel}
          </Badge>
        </div>
        <p className="text-xs text-factify-gray-dark line-clamp-2 mb-2">{trend.claim}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-factify-gray-dark">
          <span>{trend.detectedAt}</span>
          <Badge variant={trend.verdict.includes('False') ? 'error' : 'warning'}>
            {trend.verdict}
          </Badge>
          <Link
            href={`/report/${trend.reportId}`}
            className="text-factify-gold font-medium hover:underline"
          >
            View Report →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
