'use client';

import AdminShell from '@/components/admin/admin-shell';
import DashboardPage from '@/app/(site)/dashboard/dashboard-page';

export default function AdminDashboardPage() {
  return (
    <AdminShell
      title="Analytics Dashboard"
      description="Verification activity, credibility metrics, and platform trends"
    >
      <div className="-m-4 lg:-m-6">
        <DashboardPage />
      </div>
    </AdminShell>
  );
}
