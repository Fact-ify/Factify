import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Factify — the AI-powered news verification platform helping users discover the truth.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
