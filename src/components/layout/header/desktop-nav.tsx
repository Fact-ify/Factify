import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './nav-items';

export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex lg:items-center bg-[#F9FAFB] dark:bg-white/3 rounded-full p-1 max-h-fit">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-gray-500 dark:text-gray-400 text-sm px-4 py-1.5 rounded-full hover:text-primary-500 font-medium',
            {
              'bg-white dark:bg-white/5 font-medium text-gray-800 dark:text-white/90 shadow-xs':
                pathname === item.href,
            }
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
