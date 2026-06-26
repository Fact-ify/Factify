'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Filter, Loader2 } from 'lucide-react';
import NewsCard from '@/components/factify/news-card';
import { Input } from '@/components/ui/input';
import { newsSources } from '@/lib/sources';
import { countByTrustLevel } from '@/lib/verification/display-labels';
import type { NewsSearchResult } from '@/types';

const articleCategories = ['All', 'Politics', 'Business', 'Technology', 'Science', 'Environment', 'Health', 'News'];
const articleRegions = ['All', 'Global', 'Africa', 'Europe', 'North America', 'Asia'];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [source, setSource] = useState('All');
  const [region, setRegion] = useState('All');
  const [articles, setArticles] = useState<NewsSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setArticles([]);
      return;
    }

    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ q: debouncedQuery, category });
        const res = await fetch(`/api/news/search?${params}`);
        if (res.ok) {
          const data = await res.json();
          setArticles(data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [debouncedQuery, category]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      if (source !== 'All' && article.sourceId !== source) return false;
      if (region !== 'All' && article.region !== region) return false;
      return true;
    });
  }, [articles, source, region]);

  const { strong, review, pending } = countByTrustLevel(filteredArticles);

  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-factify-gray/20 min-h-screen">
      <div className="wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 px-1"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-factify-navy mb-3">Search News</h1>
          <p className="text-sm sm:text-base text-factify-gray-dark">
            Search live news with images and an instant source check. Each result shows a credibility
            score and whether more review is recommended.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-factify-gray-dark/50" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search news articles..."
              className="pl-10 sm:pl-12 h-12 sm:h-14 text-base"
              aria-label="Search news articles"
            />
          </div>
        </div>

        <div className="mb-6 sm:mb-8 rounded-xl border border-factify-gray bg-white overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-factify-gray/60 sm:hidden">
            <Filter className="h-4 w-4 text-factify-gold shrink-0" />
            <span className="text-sm font-medium text-factify-navy">Filters</span>
          </div>
          <div className="flex items-center gap-3 p-3 sm:p-4 overflow-x-auto custom-scrollbar">
            <Filter className="h-5 w-5 text-factify-gold shrink-0 hidden sm:block" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 min-w-[9.5rem] shrink-0 rounded-lg border border-factify-gray px-3 text-sm text-factify-navy focus:outline-none focus:ring-2 focus:ring-factify-gold bg-white"
              aria-label="Filter by category"
            >
              {articleCategories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="h-10 min-w-[9.5rem] shrink-0 rounded-lg border border-factify-gray px-3 text-sm text-factify-navy focus:outline-none focus:ring-2 focus:ring-factify-gold bg-white"
              aria-label="Filter by source"
            >
              <option value="All">All Sources</option>
              {newsSources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="h-10 min-w-[9.5rem] shrink-0 rounded-lg border border-factify-gray px-3 text-sm text-factify-navy focus:outline-none focus:ring-2 focus:ring-factify-gold bg-white"
              aria-label="Filter by region"
            >
              {articleRegions.map((r) => (
                <option key={r} value={r}>
                  {r === 'All' ? 'All Regions' : r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-sm text-factify-gray-dark mb-6 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
          {isLoading && (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </span>
          )}
          {!isLoading && debouncedQuery.trim() ? (
            <>
              <span>Showing {filteredArticles.length} articles with source checks</span>
              {filteredArticles.length > 0 && (
                <span className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  {strong > 0 && (
                    <span className="text-green-700 font-medium">{strong} strong sources</span>
                  )}
                  {review > 0 && (
                    <span className="text-amber-700 font-medium">{review} need review</span>
                  )}
                  {pending > 0 && (
                    <span className="text-factify-navy/70 font-medium">{pending} inconclusive</span>
                  )}
                </span>
              )}
            </>
          ) : (
            !isLoading && 'Enter a search term to find and verify news'
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredArticles.map((article, index) => (
            <NewsCard key={article.id} article={article} index={index} />
          ))}
        </div>

        {!isLoading && debouncedQuery.trim() && filteredArticles.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <p className="text-factify-gray-dark">No articles match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
