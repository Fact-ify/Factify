import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify News',
  description:
    'Submit headlines, URLs, articles, or claims for AI-powered verification against trusted sources.',
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
