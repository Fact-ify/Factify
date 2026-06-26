import { Suspense } from 'react';
import type { Metadata } from 'next';
import SearchPage from './search-page';

export const metadata: Metadata = {
  title: 'Search News',
  description: 'Browse and search news articles before verifying them with Factify.',
};

export default function Page() {
  return (
    <Suspense fallback={<div className="wrapper py-16 text-center text-factify-gray-dark">Loading...</div>}>
      <SearchPage />
    </Suspense>
  );
}
