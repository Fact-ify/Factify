'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAdminStore } from '@/store/admin-store';
import AdminSidebar from './admin-sidebar';
import AdminHeader from './admin-header';

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export default function AdminShell({ children, title, description }: AdminShellProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkSession } = useAdminStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-factify-gray/20">
        <Loader2 className="h-8 w-8 animate-spin text-factify-gold" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-factify-gray/20">
      <div className="hidden lg:block shrink-0">
        <AdminSidebar />
      </div>
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader title={title} description={description} />
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
