'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ShieldCheck,
  Home,
  Search,
  LayoutDashboard,
  Info,
  Newspaper,
} from 'lucide-react';
import GlobalSearch from '@/components/factify/global-search';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/verify', label: 'Verify', icon: ShieldCheck },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/about', label: 'About', icon: Info },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-factify-gray/60 bg-white/95 backdrop-blur-md">
      <nav className="wrapper flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0 min-w-0">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-factify-navy group-hover:bg-factify-gold transition-colors">
            <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-factify-gold group-hover:text-factify-navy transition-colors" />
          </div>
          <div className="min-w-0">
            <span className="text-base sm:text-lg font-bold tracking-tight text-factify-navy block truncate">
              FACTIFY
            </span>
            <p className="text-[10px] text-factify-gray-dark leading-none hidden sm:block">
              Truth in Every Story
            </p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 xl:px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                pathname === link.href
                  ? 'text-factify-gold bg-factify-gold/10'
                  : 'text-factify-navy/70 hover:text-factify-navy hover:bg-factify-gray/50'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center shrink-0">
          <GlobalSearch />
        </div>

        <div className="flex lg:hidden items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileSearchOpen((v) => !v);
              if (mobileOpen) setMobileOpen(false);
            }}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
              mobileSearchOpen
                ? 'bg-factify-gold/20 text-factify-navy'
                : 'bg-factify-gray/40 text-factify-navy hover:bg-factify-gray/60'
            )}
            aria-label={mobileSearchOpen ? 'Close search' : 'Open search'}
            aria-expanded={mobileSearchOpen}
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
              mobileOpen
                ? 'bg-factify-navy text-white'
                : 'bg-factify-gray/40 text-factify-navy hover:bg-factify-gray/60'
            )}
            onClick={() => {
              setMobileOpen((v) => !v);
              if (mobileSearchOpen) setMobileSearchOpen(false);
            }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-factify-gray bg-white overflow-hidden"
          >
            <div className="wrapper py-3">
              <GlobalSearch
                inputClassName="w-full"
                onNavigate={() => setMobileSearchOpen(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-factify-gray bg-white overflow-hidden"
          >
            <div className="wrapper py-3 flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl transition-colors',
                      active
                        ? 'text-factify-navy bg-factify-gold/15'
                        : 'text-factify-navy/80 hover:bg-factify-gray/40'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                        active ? 'bg-factify-gold text-factify-navy' : 'bg-factify-gray/50 text-factify-navy'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/search"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-factify-navy px-4 py-3.5 text-sm font-medium text-white"
              >
                <Newspaper className="h-5 w-5" />
                Browse news
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
