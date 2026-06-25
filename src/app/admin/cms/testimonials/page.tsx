'use client';

import AdminShell from '@/components/admin/admin-shell';
import CMSTestimonialsManager from '@/components/admin/cms-testimonials-manager';

export default function AdminCMSTestimonialsPage() {
  return (
    <AdminShell title="Testimonials" description="Manage testimonials displayed on the home page">
      <CMSTestimonialsManager />
    </AdminShell>
  );
}
