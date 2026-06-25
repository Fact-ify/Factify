'use client';

import AdminShell from '@/components/admin/admin-shell';
import CMSPageList from '@/components/admin/cms-page-list';
import { useAdminStore } from '@/store/admin-store';

export default function AdminCMSPagesPage() {
  const pages = useAdminStore((s) => s.pages);

  return (
    <AdminShell title="Pages" description="Edit content for public-facing pages">
      <CMSPageList pages={pages} />
    </AdminShell>
  );
}
