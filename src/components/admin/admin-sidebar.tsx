'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  MessageSquareQuote,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/store/admin-store';

const navItems = [
  { href: '/admin', label: 'Overview', iconName: 'layoutDashboard' as const, exact: true },
  { href: '/admin/dashboard', label: 'Analytics', iconName: 'barChart' as const },
  { href: '/admin/cms', label: 'CMS', iconName: 'layers' as const },
  { href: '/admin/cms/pages', label: 'Pages', iconName: 'fileText' as const },
  { href: '/admin/cms/articles', label: 'Articles', iconName: 'newspaper' as const },
  { href: '/admin/cms/testimonials', label: 'Testimonials', iconName: 'messageSquare' as const },
  { href: '/admin/cms/settings', label: 'Settings', iconName: 'settings' as const },
];

const iconMap = {
  layoutDashboard: LayoutDashboard,
  barChart: LayoutDashboard,
  layers: Layers,
  fileText: FileText,
  newspaper: Newspaper,
  messageSquare: MessageSquareQuote,
  settings: Settings,
};

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export default function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAdminStore();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="flex h-full w-64 flex-col border-r border-factify-gray bg-factify-navy text-white">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-factify-gold">
          <ShieldCheck className="h-5 w-5 text-factify-navy" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight">FACTIFY Admin</p>
          <p className="text-[10px] text-white/50">Content Management</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar" aria-label="Admin navigation">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.iconName];
            const active = isActive(item.href, item.exact);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-factify-gold text-factify-navy'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-4">
        {user && (
          <div className="mb-3 rounded-lg bg-white/5 px-3 py-2.5">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-white/50 truncate">{user.role}</p>
          </div>
        )}
        <Link
          href="/"
          className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
