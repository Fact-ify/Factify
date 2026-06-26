'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Newspaper,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import AdminShell from '@/components/admin/admin-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/store/admin-store';

export default function AdminOverviewPage() {
  const { pages, articles, testimonials, user } = useAdminStore();
  const [stats, setStats] = useState({ totalSearches: 0, verifiedStories: 0, fakeNewsDetected: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => {
        setStats({
          totalSearches: data.totalSearches ?? 0,
          verifiedStories: data.verifiedStories ?? 0,
          fakeNewsDetected: data.fakeNewsDetected ?? 0,
        });
      })
      .finally(() => setLoadingStats(false));
  }, []);

  const statCards = [
    { label: 'Total Searches', value: stats.totalSearches, icon: Search },
    { label: 'Verified Stories', value: stats.verifiedStories, icon: ShieldCheck },
    { label: 'Fake News Detected', value: stats.fakeNewsDetected, icon: AlertTriangle },
    { label: 'CMS Pages', value: pages.length, icon: FileText },
  ];

  const quickLinks = [
    { href: '/admin/cms/pages', label: 'Edit Pages', count: pages.length },
    { href: '/admin/cms/articles', label: 'Manage Articles', count: articles.length },
    { href: '/admin/cms/testimonials', label: 'Testimonials', count: testimonials.length },
    { href: '/admin/dashboard', label: 'Full Analytics', count: null },
  ];

  return (
    <AdminShell title="Overview" description={`Welcome back, ${user?.name ?? 'Admin'}`}>
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-factify-gold" />
                  <Badge variant="navy">Live</Badge>
                </div>
                {loadingStats ? (
                  <Loader2 className="h-6 w-6 animate-spin text-factify-gold" />
                ) : (
                  <p className="text-2xl font-bold text-factify-navy">{stat.value.toLocaleString()}</p>
                )}
                <p className="text-sm text-factify-gray-dark">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-lg border border-factify-gray px-4 py-3 hover:bg-factify-gray/20 transition-colors"
                >
                  <span className="text-sm font-medium text-factify-navy">{link.label}</span>
                  <div className="flex items-center gap-2">
                    {link.count !== null && <Badge variant="neutral">{link.count}</Badge>}
                    <ArrowRight className="h-4 w-4 text-factify-gray-dark" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent CMS Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pages.slice(0, 4).map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between text-sm border-b border-factify-gray/50 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-factify-navy">{page.title}</p>
                    <p className="text-xs text-factify-gray-dark">Updated {page.lastUpdated}</p>
                  </div>
                  <Badge variant={page.status === 'published' ? 'success' : 'warning'}>{page.status}</Badge>
                </div>
              ))}
              <Button variant="secondary" size="sm" className="w-full mt-2" asChild>
                <Link href="/admin/cms/pages">
                  <Newspaper className="h-4 w-4" />
                  View All Pages
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
