'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Filter } from 'lucide-react';
import NewsCard from '@/components/factify/news-card';
import { Input } from '@/components/ui/input';
import {
  getArticlesForSearch,
  articleCategories,
  articleRegions,
} from '@/data/mock';
import { newsSources } from '@/data/mock/sources';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [source, setSource] = useState('All');
  const [region, setRegion] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  const articles = useMemo(
    () => getArticlesForSearch({ query, category, source, region }),
    [query, category, source, region]
  );

  return (
    <div className="py-12 lg:py-16 bg-factify-gray/20 min-h-screen">
      <div className="wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-factify-navy mb-3">
            Search News
          </h1>
          <p className="text-factify-gray-dark">
            Browse and search news articles before verifying them with Factify.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-factify-gray-dark/50" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search news articles..."
              className="pl-12 h-14 text-base"
              aria-label="Search news articles"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-8 p-4 rounded-xl border border-factify-gray bg-white">
          <Filter className="h-5 w-5 text-factify-gold shrink-0" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 rounded-lg border border-factify-gray px-3 text-sm text-factify-navy focus:outline-none focus:ring-2 focus:ring-factify-gold"
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
            className="h-10 rounded-lg border border-factify-gray px-3 text-sm text-factify-navy focus:outline-none focus:ring-2 focus:ring-factify-gold"
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
            className="h-10 rounded-lg border border-factify-gray px-3 text-sm text-factify-navy focus:outline-none focus:ring-2 focus:ring-factify-gold"
            aria-label="Filter by region"
          >
            {articleRegions.map((r) => (
              <option key={r} value={r}>
                {r === 'All' ? 'All Regions' : r}
              </option>
            ))}
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-10 rounded-lg border border-factify-gray px-3 text-sm text-factify-navy focus:outline-none focus:ring-2 focus:ring-factify-gold"
            aria-label="Filter by date"
          >
            <option value="All">All Dates</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>

        <p className="text-sm text-factify-gray-dark mb-6">
          Showing {articles.length} articles
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articles.map((article, index) => (
            <NewsCard key={article.id} article={article} index={index} />
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-factify-gray-dark">No articles match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
