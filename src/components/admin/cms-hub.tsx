'use client';

import Link from 'next/link';
import {
  FileText,
  Newspaper,
  MessageSquareQuote,
  Settings,
  LayoutDashboard,
  ArrowRight,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminStore } from '@/store/admin-store';

const cmsModules = [
  {
    href: '/admin/cms/pages',
    title: 'Pages',
    description: 'Edit landing, about, verify, and search page content.',
    iconName: 'fileText' as const,
    countKey: 'pages' as const,
  },
  {
    href: '/admin/cms/articles',
    title: 'Articles',
    description: 'Manage news articles displayed in search results.',
    iconName: 'newspaper' as const,
    countKey: 'articles' as const,
  },
  {
    href: '/admin/cms/testimonials',
    title: 'Testimonials',
    description: 'Edit customer testimonials on the home page.',
    iconName: 'messageSquare' as const,
    countKey: 'testimonials' as const,
  },
  {
    href: '/admin/cms/team',
    title: 'Team Leaders',
    description: 'Manage leadership photos, titles, and display order.',
    iconName: 'users' as const,
    countKey: 'teamMembers' as const,
  },
  {
    href: '/admin/cms/settings',
    title: 'Site Settings',
    description: 'Global brand settings, tagline, and platform stats.',
    iconName: 'settings' as const,
    countKey: null,
  },
];

const iconMap = {
  fileText: FileText,
  newspaper: Newspaper,
  messageSquare: MessageSquareQuote,
  users: Users,
  settings: Settings,
};

export default function CMSHub() {
  const { pages, articles, testimonials, teamMembers } = useAdminStore();

  const counts = {
    pages: pages.length,
    articles: articles.length,
    testimonials: testimonials.length,
    teamMembers: teamMembers.length,
  };

  const draftPages = pages.filter((p) => p.status === 'draft').length;
  const draftArticles = articles.filter((a) => a.status === 'draft').length;

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-factify-navy">{pages.length}</p>
            <p className="text-sm text-factify-gray-dark">Pages</p>
            {draftPages > 0 && (
              <Badge variant="warning" className="mt-2">{draftPages} draft</Badge>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-factify-navy">{articles.length}</p>
            <p className="text-sm text-factify-gray-dark">Articles</p>
            {draftArticles > 0 && (
              <Badge variant="warning" className="mt-2">{draftArticles} draft</Badge>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-factify-navy">{testimonials.length}</p>
            <p className="text-sm text-factify-gray-dark">Testimonials</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-factify-navy">{teamMembers.length}</p>
            <p className="text-sm text-factify-gray-dark">Team Leaders</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {cmsModules.map((mod) => {
          const Icon = iconMap[mod.iconName];
          return (
            <Link key={mod.href} href={mod.href}>
              <Card className="card-hover h-full">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-factify-gold/10">
                    <Icon className="h-5 w-5 text-factify-gold" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center justify-between">
                      {mod.title}
                      <ArrowRight className="h-4 w-4 text-factify-gray-dark" />
                    </CardTitle>
                    <p className="text-sm text-factify-gray-dark mt-1">{mod.description}</p>
                    {mod.countKey && (
                      <p className="text-xs text-factify-gold font-medium mt-2">
                        {counts[mod.countKey]} items
                      </p>
                    )}
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-factify-gold" />
            Content stored in your database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-factify-gray-dark">
            All CMS changes are saved to PostgreSQL and appear on the live site after you publish
            each item. Use Team Leaders to manage photos and display order on About and Home.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
