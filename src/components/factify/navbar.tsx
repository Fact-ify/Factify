'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/verify', label: 'Verify News' },
  { href: '/search', label: 'Search News' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-factify-gray/60 bg-white/95 backdrop-blur-md">
      <nav className="wrapper flex h-16 items-center justify-between" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-factify-navy group-hover:bg-factify-gold transition-colors">
            <ShieldCheck className="h-5 w-5 text-factify-gold group-hover:text-factify-navy transition-colors" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-factify-navy">FACTIFY</span>
            <p className="text-[10px] text-factify-gray-dark leading-none hidden sm:block">
              Truth in Every Story
            </p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                pathname === link.href
                  ? 'text-factify-gold bg-factify-gold/10'
                  : 'text-factify-navy/70 hover:text-factify-navy hover:bg-factify-gray/50'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/signin">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/verify">Get Started</Link>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg hover:bg-factify-gray/50"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-factify-gray bg-white overflow-hidden"
          >
            <div className="wrapper py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-4 py-3 text-sm font-medium rounded-lg',
                    pathname === link.href
                      ? 'text-factify-gold bg-factify-gold/10'
                      : 'text-factify-navy/70'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t border-factify-gray mt-2">
                <Button variant="secondary" asChild>
                  <Link href="/signin">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/verify">Get Started</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
