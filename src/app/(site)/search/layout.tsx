import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search News',
  description: 'Search and browse news articles before verifying them with Factify.',
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
