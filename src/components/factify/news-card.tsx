'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getSourceById } from '@/data/mock/sources';
import type { NewsArticle } from '@/data/mock/types';

interface NewsCardProps {
  article: NewsArticle;
  index?: number;
}

export default function NewsCard({ article, index = 0 }: NewsCardProps) {
  const source = getSourceById(article.sourceId);

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="rounded-xl border border-factify-gray bg-white overflow-hidden card-hover flex flex-col"
    >
      <div className="relative h-44 bg-factify-gray overflow-hidden">
        <Image
          src={article.thumbnail}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <Badge variant="navy" className="absolute top-3 left-3">
          {article.category}
        </Badge>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-factify-gray-dark mb-2">
          <span className="font-semibold text-factify-navy">{source?.name}</span>
          <span>·</span>
          <Calendar className="h-3 w-3" />
          <span>{article.publishedAt}</span>
        </div>
        <h3 className="font-semibold text-factify-navy mb-2 line-clamp-2 leading-snug">
          {article.title}
        </h3>
        <p className="text-sm text-factify-gray-dark line-clamp-2 mb-4 flex-1">
          {article.summary}
        </p>
        <Button variant="secondary" size="sm" className="w-full" asChild>
          <Link href={`/verify?q=${encodeURIComponent(article.title)}`}>
            <ShieldCheck className="h-4 w-4" />
            Verify
          </Link>
        </Button>
      </div>
    </motion.article>
  );
}
