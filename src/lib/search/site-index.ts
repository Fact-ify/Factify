export interface SiteSearchEntry {
  title: string;
  href: string;
  description: string;
  keywords: string[];
}

export const SITE_SEARCH_INDEX: SiteSearchEntry[] = [
  {
    title: 'Home',
    href: '/',
    description: 'Factify homepage and overview',
    keywords: ['home', 'factify', 'truth', 'landing'],
  },
  {
    title: 'Verify News',
    href: '/verify',
    description: 'Verify headlines, URLs, articles, and claims',
    keywords: ['verify', 'fact check', 'claim', 'headline', 'analysis'],
  },
  {
    title: 'Search News',
    href: '/search',
    description: 'Search and verify live news from global sources',
    keywords: ['search', 'news', 'articles', 'headlines', 'browse'],
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
    description: 'Verification analytics and trending misinformation',
    keywords: ['dashboard', 'analytics', 'stats', 'trending', 'reports'],
  },
  {
    title: 'About',
    href: '/about',
    description: 'Learn about Factify and our mission',
    keywords: ['about', 'mission', 'team', 'company'],
  },
  {
    title: 'Contact',
    href: '/contact',
    description: 'Get in touch with the Factify team',
    keywords: ['contact', 'support', 'email', 'help'],
  },
  {
    title: 'Pricing',
    href: '/pricing',
    description: 'Plans and pricing for Factify',
    keywords: ['pricing', 'plans', 'subscription', 'cost'],
  },
  {
    title: 'Privacy Policy',
    href: '/privacy',
    description: 'How Factify handles your data',
    keywords: ['privacy', 'policy', 'data', 'terms'],
  },
  {
    title: 'How It Works',
    href: '/#how-it-works',
    description: 'Three steps to verify any news story',
    keywords: ['how', 'works', 'steps', 'process'],
  },
  {
    title: 'Features',
    href: '/#features',
    description: 'Factify verification features and capabilities',
    keywords: ['features', 'capabilities', 'tools', 'ai'],
  },
];

export function searchSitePages(query: string, limit = 5): SiteSearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return SITE_SEARCH_INDEX.slice(0, 4);

  return SITE_SEARCH_INDEX.filter((entry) => {
    const haystack = [entry.title, entry.description, ...entry.keywords].join(' ').toLowerCase();
    return haystack.includes(q) || entry.keywords.some((k) => k.includes(q) || q.includes(k));
  }).slice(0, limit);
}
