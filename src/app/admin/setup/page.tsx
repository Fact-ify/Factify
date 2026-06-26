import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import AdminSetupForm from '@/components/admin/admin-setup-form';
import { isAdminSetupRequired } from '@/lib/auth/admin-setup';

export const metadata: Metadata = {
  title: 'Admin Setup',
  description: 'Create the Factify admin account.',
};

export default async function AdminSetupPage() {
  try {
    const setupRequired = await isAdminSetupRequired();
    if (!setupRequired) {
      redirect('/admin/login');
    }
  } catch (error) {
    console.error('Admin setup page error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h1 className="text-lg font-semibold text-red-800 mb-2">Database connection failed</h1>
          <p className="text-sm text-red-700">
            Could not check admin setup status. Make sure DATABASE_URL is set correctly in your environment.
          </p>
        </div>
      </div>
    );
  }

  return <AdminSetupForm />;
}
