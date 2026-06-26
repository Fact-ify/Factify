'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Loader2,
  ShieldCheck,
  Newspaper,
  ArrowRight,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useClickOutside } from '@/hooks/use-click-outside';
import { searchSitePages } from '@/lib/search/site-index';
import { getVerificationDisplay } from '@/lib/verification/display-labels';
import type { NewsSearchResult } from '@/types';

interface GlobalSearchProps {
  className?: string;
  inputClassName?: string;
  onNavigate?: () => void;
}

function TrustIcon({ tone }: { tone: 'positive' | 'caution' | 'neutral' }) {
  if (tone === 'positive') return <CheckCircle2 className="h-3 w-3 text-green-600 shrink-0" />;
  if (tone === 'caution') return <AlertCircle className="h-3 w-3 text-amber-600 shrink-0" />;
  return <HelpCircle className="h-3 w-3 text-factify-navy/60 shrink-0" />;
}

export default function GlobalSearch({ className, inputClassName, onNavigate }: GlobalSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [newsResults, setNewsResults] = useState<NewsSearchResult[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  const containerRef = useClickOutside<HTMLDivElement>(() => setOpen(false));

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.trim().length < 2) {
      setNewsResults([]);
      return;
    }

    const controller = new AbortController();
    setIsLoadingNews(true);

    fetch(`/api/news/search?q=${encodeURIComponent(debouncedQuery.trim())}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setNewsResults(Array.isArray(data) ? data.slice(0, 5) : []))
      .catch(() => setNewsResults([]))
      .finally(() => setIsLoadingNews(false));

    return () => controller.abort();
  }, [debouncedQuery]);

  const siteResults = searchSitePages(query, 5);
  const trimmed = query.trim();

  const close = useCallback(() => {
    setOpen(false);
    onNavigate?.();
  }, [onNavigate]);

  const goToSearch = useCallback(
    (q?: string) => {
      const term = (q ?? trimmed).trim();
      if (!term) return;
      router.push(`/search?q=${encodeURIComponent(term)}`);
      setQuery('');
      close();
    },
    [trimmed, router, close]
  );

  const goToVerify = useCallback(
    (q?: string) => {
      const term = (q ?? trimmed).trim();
      if (!term) return;
      router.push(`/verify?q=${encodeURIComponent(term)}`);
      setQuery('');
      close();
    },
    [trimmed, router, close]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed) return;
    goToSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-factify-gray-dark/50 pointer-events-none" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search site and news..."
            className={cn('h-10 sm:h-9 pl-9 pr-3 text-sm w-full lg:w-72', inputClassName)}
            aria-label="Search site and news"
            aria-expanded={open}
            aria-autocomplete="list"
            role="combobox"
          />
        </div>
      </form>

      {open && (
        <div className="absolute left-0 right-0 sm:left-auto sm:right-0 top-full mt-2 sm:w-96 max-h-[min(70vh,520px)] overflow-y-auto rounded-xl border border-factify-gray bg-white shadow-factify-lg z-50 custom-scrollbar">
          {trimmed && (
            <div className="p-2 border-b border-factify-gray/60 space-y-1">
              <p className="px-2 pt-1 text-[10px] font-semibold uppercase tracking-wide text-factify-gray-dark">
                Quick actions
              </p>
              <button
                type="button"
                onClick={() => goToSearch()}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-factify-gray/30 transition-colors"
              >
                <Newspaper className="h-4 w-4 text-factify-gold shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-factify-navy">Search news</p>
                  <p className="text-xs text-factify-gray-dark truncate">&quot;{trimmed}&quot;</p>
                </div>
                <ArrowRight className="h-4 w-4 text-factify-gray-dark shrink-0" />
              </button>
              <button
                type="button"
                onClick={() => goToVerify()}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-factify-gray/30 transition-colors"
              >
                <ShieldCheck className="h-4 w-4 text-factify-gold shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-factify-navy">Verify claim</p>
                  <p className="text-xs text-factify-gray-dark truncate">&quot;{trimmed}&quot;</p>
                </div>
                <ArrowRight className="h-4 w-4 text-factify-gray-dark shrink-0" />
              </button>
            </div>
          )}

          <div className="p-2 border-b border-factify-gray/60">
            <p className="px-2 pt-1 pb-1 text-[10px] font-semibold uppercase tracking-wide text-factify-gray-dark">
              Site pages
            </p>
            {siteResults.length === 0 ? (
              <p className="px-3 py-2 text-xs text-factify-gray-dark">No matching pages</p>
            ) : (
              siteResults.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  onClick={close}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-factify-gray/30 transition-colors"
                >
                  <FileText className="h-4 w-4 text-factify-navy/60 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-factify-navy">{page.title}</p>
                    <p className="text-xs text-factify-gray-dark truncate">{page.description}</p>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="p-2">
            <p className="px-2 pt-1 pb-1 text-[10px] font-semibold uppercase tracking-wide text-factify-gray-dark flex items-center gap-2">
              News results
              {isLoadingNews && <Loader2 className="h-3 w-3 animate-spin" />}
            </p>

            {!trimmed && (
              <p className="px-3 py-2 text-xs text-factify-gray-dark">
                Type to search live news with source checks
              </p>
            )}

            {trimmed && !isLoadingNews && newsResults.length === 0 && (
              <p className="px-3 py-2 text-xs text-factify-gray-dark">
                No news found. Try the Search news action above.
              </p>
            )}

            {newsResults.map((article) => {
              const display = getVerificationDisplay(article.verification);
              return (
                <Link
                  key={article.id}
                  href={`/search?q=${encodeURIComponent(article.title)}`}
                  onClick={close}
                  className="flex gap-3 rounded-lg px-2 py-2 hover:bg-factify-gray/30 transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.thumbnail}
                    alt=""
                    className="h-12 w-12 rounded-md object-cover shrink-0 bg-factify-gray"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-factify-navy line-clamp-2 leading-snug">
                      {article.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <TrustIcon tone={display.tone} />
                      <span className="text-[10px] text-factify-gray-dark">
                        {display.badge} ({display.shortMetric})
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}

            {trimmed && newsResults.length > 0 && (
              <button
                type="button"
                onClick={() => goToSearch()}
                className="mt-1 w-full rounded-lg px-3 py-2 text-xs font-medium text-factify-gold hover:bg-factify-gold/10 transition-colors"
              >
                View all news results
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
