'use client';

import AdminShell from '@/components/admin/admin-shell';
import CMSSettingsForm from '@/components/admin/cms-settings-form';

export default function AdminCMSSettingsPage() {
  return (
    <AdminShell title="Site Settings" description="Global brand identity and platform configuration">
      <CMSSettingsForm />
    </AdminShell>
  );
}
