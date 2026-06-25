'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getSourceById } from '@/data/mock/sources';
import type { VerificationSource } from '@/data/mock/types';
import CredibilityBadge from './credibility-badge';

interface SourceCardProps {
  source: VerificationSource;
  index?: number;
}

function getStanceVariant(stance: string) {
  if (stance.includes('Supports')) return 'success';
  if (stance.includes('Contradicts Trusted')) return 'error';
  if (stance.includes('Contradicts')) return 'warning';
  return 'neutral';
}

export default function SourceCard({ source, index = 0 }: SourceCardProps) {
  const publisher = getSourceById(source.sourceId);
  const publisherName = publisher?.name ?? 'Unknown Source';
  const logo = publisher?.logo ?? '?';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="p-5 rounded-xl border border-factify-gray bg-white card-hover"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-factify-navy text-white text-sm font-bold">
          {logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="font-semibold text-factify-navy">{publisherName}</h4>
            <Badge variant="navy">{source.category}</Badge>
          </div>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-factify-gold hover:underline truncate block mb-3"
          >
            {source.url}
          </a>
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <CredibilityBadge score={source.credibilityScore} size="sm" />
            <span className="text-xs text-factify-gray-dark">Published: {source.publishedAt}</span>
          </div>
          <Badge variant={getStanceVariant(source.stance)}>{source.stance}</Badge>
          {source.excerpt && (
            <p className="mt-3 text-sm text-factify-gray-dark leading-relaxed">{source.excerpt}</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-factify-gray">
        <Button variant="secondary" size="sm" asChild>
          <a href={source.url} target="_blank" rel="noopener noreferrer">
            <Globe className="h-3.5 w-3.5" />
            Visit Source
          </a>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a href={source.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
            Open Article
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
