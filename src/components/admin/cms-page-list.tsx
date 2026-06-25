'use client';

import Link from 'next/link';
import { ExternalLink, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CMSPage } from '@/data/mock/cms-content';

interface CMSPageListProps {
  pages: CMSPage[];
}

export default function CMSPageList({ pages }: CMSPageListProps) {
  return (
    <div className="grid gap-4">
      {pages.map((page) => (
        <Card key={page.id} className="card-hover">
          <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
            <div>
              <CardTitle className="text-base">{page.title}</CardTitle>
              <p className="text-sm text-factify-gray-dark mt-1">{page.description}</p>
            </div>
            <Badge variant={page.status === 'published' ? 'success' : 'warning'}>
              {page.status}
            </Badge>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-0">
            <div className="flex items-center gap-4 text-xs text-factify-gray-dark">
              <span>Route: {page.route}</span>
              <span>Updated: {page.lastUpdated}</span>
              <span>{page.fields.length} fields</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href={page.route} target="_blank">
                  <ExternalLink className="h-3.5 w-3.5" />
                  View
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={`/admin/cms/pages/${page.slug}`}>
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
