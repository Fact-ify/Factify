import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToasterProvider } from './providers/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Factify — Truth in Every Story',
    template: '%s | Factify',
  },
  description:
    'Factify helps users verify the authenticity and credibility of news articles, headlines, claims, and URLs using AI and trusted news sources.',
  keywords: ['fact-checking', 'news verification', 'AI', 'misinformation', 'Factify'],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <ToasterProvider />
        <div className="isolate flex flex-col flex-1">{children}</div>
      </body>
    </html>
  );
}
