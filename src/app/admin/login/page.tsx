import type { Metadata } from 'next';
import AdminLoginForm from '@/components/admin/admin-login-form';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Sign in to the Factify admin console.',
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
