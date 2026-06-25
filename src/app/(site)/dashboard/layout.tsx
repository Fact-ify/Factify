import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your verification analytics, activity overview, and trending misinformation monitoring.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
