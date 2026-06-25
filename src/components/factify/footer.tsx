import Link from 'next/link';
import { ShieldCheck, Share2, Globe, Mail } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Verify News', href: '/verify' },
    { label: 'Search News', href: '/search' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Reports', href: '/report/report-1' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Admin', href: '/admin/login' },
  ],
  Resources: [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Features', href: '/#features' },
    { label: 'Trending Misinformation', href: '/dashboard' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-factify-navy text-white">
      <div className="wrapper py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-factify-gold">
                <ShieldCheck className="h-5 w-5 text-factify-navy" />
              </div>
              <div>
                <span className="text-lg font-bold">FACTIFY</span>
                <p className="text-xs text-white/60">Truth in Every Story</p>
              </div>
            </Link>
            <p className="text-sm text-white/70 max-w-sm leading-relaxed">
              Helping users verify information before believing or sharing it. AI-powered news
              verification trusted by journalists, researchers, and everyday users.
            </p>
            <div className="flex gap-3 mt-6">
              {[Share2, Globe, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-factify-gold hover:text-factify-navy transition-colors"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4 text-factify-gold">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} Factify. All rights reserved.
          </p>
          <p className="text-sm text-white/50">
            Built for truth. Powered by AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
