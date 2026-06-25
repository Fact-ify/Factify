'use client';

import { notFound } from 'next/navigation';
import { use } from 'react';
import AdminShell from '@/components/admin/admin-shell';
import CMSPageEditor from '@/components/admin/cms-page-editor';
import { useAdminStore } from '@/store/admin-store';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function AdminCMSPageEditorPage({ params }: PageProps) {
  const { slug } = use(params);
  const pages = useAdminStore((s) => s.pages);
  const page = pages.find((p) => p.slug === slug);

  if (!page) notFound();

  return (
    <AdminShell title={`Edit: ${page.title}`} description={page.route}>
      <CMSPageEditor page={page} />
    </AdminShell>
  );
}
