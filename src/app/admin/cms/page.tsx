'use client';

import AdminShell from '@/components/admin/admin-shell';
import CMSHub from '@/components/admin/cms-hub';

export default function AdminCMSPage() {
  return (
    <AdminShell title="Content Management" description="Manage pages, articles, testimonials, and settings">
      <CMSHub />
    </AdminShell>
  );
}
