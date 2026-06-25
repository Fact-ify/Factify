'use client';

import AdminShell from '@/components/admin/admin-shell';
import CMSArticlesManager from '@/components/admin/cms-articles-manager';

export default function AdminCMSArticlesPage() {
  return (
    <AdminShell title="Articles" description="Manage news articles for the search page">
      <CMSArticlesManager />
    </AdminShell>
  );
}
