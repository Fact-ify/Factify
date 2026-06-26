'use client';

import AdminShell from '@/components/admin/admin-shell';
import CMSTeamManager from '@/components/admin/cms-team-manager';

export default function AdminTeamPage() {
  return (
    <AdminShell
      title="Team Leaders"
      description="Manage leadership profiles, photos, and display order for the public site"
    >
      <CMSTeamManager />
    </AdminShell>
  );
}
