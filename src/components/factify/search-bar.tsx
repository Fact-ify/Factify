'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  placeholder?: string;
  size?: 'default' | 'large';
  showButton?: boolean;
  buttonText?: string;
  redirectTo?: '/verify' | '/search';
  className?: string;
}

export default function SearchBar({
  placeholder = 'Paste a news headline, article URL, or claim...',
  size = 'default',
  showButton = true,
  buttonText = 'Verify Now',
  redirectTo = '/verify',
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    router.push(`${redirectTo}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-factify-gray-dark/50" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`pl-12 ${size === 'large' ? 'h-14 text-base' : ''}`}
          aria-label="Search or verify news"
        />
      </div>
      {showButton && (
        <Button type="submit" size={size === 'large' ? 'lg' : 'default'} className="sm:shrink-0">
          {buttonText}
        </Button>
      )}
    </form>
  );
}
