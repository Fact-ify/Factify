'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, ExternalLink, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ConfidenceMeter from '@/components/factify/confidence-meter';
import { getSourceById } from '@/lib/sources';
import { getVerificationDisplay } from '@/lib/verification/display-labels';
import type { NewsSearchResult } from '@/types';
import { cn } from '@/lib/utils';

interface NewsCardProps {
  article: NewsSearchResult;
  index?: number;
}

function TrustBadge({ display }: { display: ReturnType<typeof getVerificationDisplay> }) {
  const Icon =
    display.tone === 'positive'
      ? CheckCircle2
      : display.tone === 'caution'
        ? AlertCircle
        : HelpCircle;

  const className =
    display.tone === 'positive'
      ? 'bg-green-600 text-white border-0'
      : display.tone === 'caution'
        ? 'bg-amber-600 text-white border-0'
        : 'bg-factify-navy/80 text-white border-0';

  return (
    <Badge className={cn('gap-1 text-[10px] sm:text-xs', className)}>
      <Icon className="h-3 w-3 shrink-0" />
      {display.badge}
    </Badge>
  );
}

export default function NewsCard({ article, index = 0 }: NewsCardProps) {
  const source = getSourceById(article.sourceId);
  const { verification } = article;
  const display = getVerificationDisplay(verification);

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="rounded-xl border border-factify-gray bg-white overflow-hidden card-hover flex flex-col h-full"
    >
      <div className="relative h-40 sm:h-44 bg-factify-gray overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.thumbnail}
          alt={article.title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800';
          }}
        />
        <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1.5">
          <Badge variant="navy" className="text-[10px] sm:text-xs">
            {article.category}
          </Badge>
          <TrustBadge display={display} />
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-factify-gray-dark mb-2">
          <span className="font-semibold text-factify-navy">{source?.name ?? article.sourceId}</span>
          <span className="hidden sm:inline text-factify-gray">|</span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3 shrink-0" />
            {article.publishedAt}
          </span>
        </div>

        <h3 className="font-semibold text-factify-navy mb-2 line-clamp-2 leading-snug text-sm sm:text-base">
          {article.title}
        </h3>
        <p className="text-xs sm:text-sm text-factify-gray-dark line-clamp-2 mb-4">{article.summary}</p>

        <div
          className={cn(
            'rounded-lg border p-3 mb-4 space-y-2.5',
            display.tone === 'positive' && 'border-green-200 bg-green-50/50',
            display.tone === 'caution' && 'border-amber-200 bg-amber-50/50',
            display.tone === 'neutral' && 'border-factify-gray bg-factify-gray/20'
          )}
        >
          <p className="text-xs font-semibold text-factify-navy">Source check</p>
          <ConfidenceMeter value={verification.credibility} label={display.headline} size="sm" />
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-factify-gray-dark block">Confidence</span>
              <p className="font-semibold text-factify-navy">{verification.confidence}%</p>
            </div>
            <div>
              <span className="text-factify-gray-dark block">Evidence</span>
              <p className="font-semibold text-factify-navy">{verification.evidenceStrength}%</p>
            </div>
          </div>
          <p className="text-xs text-factify-gray-dark leading-relaxed">{display.detail}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          <Button variant="secondary" size="sm" className="flex-1 w-full" asChild>
            <Link href={`/verify?q=${encodeURIComponent(article.title)}`}>
              <ShieldCheck className="h-4 w-4" />
              Full report
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full sm:w-auto" asChild>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open article
            </a>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
