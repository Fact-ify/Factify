'use client';

import { useState } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AdminSidebar from './admin-sidebar';

interface AdminHeaderProps {
  title: string;
  description?: string;
}

export default function AdminHeader({ title, description }: AdminHeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-factify-gray bg-white px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-factify-gray/50 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5 text-factify-navy" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-factify-navy">{title}</h1>
            {description && (
              <p className="text-xs text-factify-gray-dark hidden sm:block">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-factify-gray-dark/50" />
            <Input placeholder="Search admin..." className="w-56 pl-9 h-9 text-sm" />
          </div>
          <button
            type="button"
            className="relative rounded-lg p-2 hover:bg-factify-gray/50"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-factify-navy" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-factify-gold" />
          </button>
          <Badge variant="success" className="hidden sm:inline-flex">Live</Badge>
        </div>
      </header>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-0 h-full">
            <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
