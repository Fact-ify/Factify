import type { CMSPage, CMSSiteSettings, CMSArticle, CMSTestimonial } from '@/types';

export const defaultSiteSettings: CMSSiteSettings = {
  siteName: 'FACTIFY',
  tagline: 'Truth in Every Story',
  heroHeadline: 'Verify News Before You Believe It',
  heroSubheadline:
    'Factify uses AI and trusted news sources to analyze articles, claims, and URLs, helping you identify misinformation and discover the truth behind every story.',
  ctaHeadline: 'Discover the Truth Behind Every Story',
  ctaButtonText: 'Start Verifying News',
  statVerifications: 100000,
  statAccuracy: 95,
  statSources: 500,
  statMonitoring: '24/7',
};

export const defaultCmsPages: Omit<CMSPage, 'id' | 'lastUpdated'>[] = [
  {
    slug: 'home',
    title: 'Home Page',
    route: '/',
    description: 'Landing page hero, stats, and call-to-action content.',
    status: 'published',
    fields: [
      { id: 'home-hero-headline', key: 'heroHeadline', label: 'Hero Headline', type: 'text', value: defaultSiteSettings.heroHeadline },
      { id: 'home-hero-sub', key: 'heroSubheadline', label: 'Hero Subheadline', type: 'textarea', value: defaultSiteSettings.heroSubheadline },
      { id: 'home-cta-headline', key: 'ctaHeadline', label: 'CTA Headline', type: 'text', value: defaultSiteSettings.ctaHeadline },
      { id: 'home-cta-btn', key: 'ctaButtonText', label: 'CTA Button Text', type: 'text', value: defaultSiteSettings.ctaButtonText },
    ],
  },
  {
    slug: 'about',
    title: 'About Page',
    route: '/about',
    description: 'Mission statement and about page content.',
    status: 'published',
    fields: [
      { id: 'about-headline', key: 'headline', label: 'Page Headline', type: 'text', value: 'Helping You Verify Information Before Believing or Sharing It' },
      { id: 'about-intro', key: 'intro', label: 'Introduction', type: 'textarea', value: 'Factify is an AI-powered news verification platform that analyzes articles, headlines, claims, and URLs using source credibility analysis, fact-checking methodologies, and cross-referencing from trusted news outlets worldwide.' },
      { id: 'about-mission', key: 'missionQuote', label: 'Mission Quote', type: 'textarea', value: 'We believe that access to verified information is a fundamental right in the digital age. Factify exists to protect that right.' },
    ],
  },
  {
    slug: 'verify',
    title: 'Verify Page',
    route: '/verify',
    description: 'Verification page headings and helper text.',
    status: 'published',
    fields: [
      { id: 'verify-title', key: 'pageTitle', label: 'Page Title', type: 'text', value: 'Verify News & Claims' },
      { id: 'verify-desc', key: 'pageDescription', label: 'Page Description', type: 'textarea', value: 'Submit a headline, URL, article, or claim for AI-powered verification against trusted sources.' },
    ],
  },
  {
    slug: 'search',
    title: 'Search Page',
    route: '/search',
    description: 'News search page headings.',
    status: 'published',
    fields: [
      { id: 'search-title', key: 'pageTitle', label: 'Page Title', type: 'text', value: 'Search News' },
      { id: 'search-desc', key: 'pageDescription', label: 'Page Description', type: 'textarea', value: 'Browse and search news articles before verifying them with Factify.' },
    ],
  },
];

export const defaultCmsArticles: Omit<CMSArticle, 'id'>[] = [
  {
    title: 'Global Climate Summit Reaches Historic Agreement on Emissions',
    summary: 'Comprehensive coverage of the climate summit with verified details from trusted journalists.',
    sourceId: 'reuters',
    category: 'Environment',
    region: 'Global',
    status: 'published',
    publishedAt: 'June 25, 2026',
  },
  {
    title: 'AI Breakthrough Promises Faster Medical Diagnosis',
    summary: 'Researchers announce new AI model for early disease detection across multiple conditions.',
    sourceId: 'bbc',
    category: 'Technology',
    region: 'Europe',
    status: 'published',
    publishedAt: 'June 24, 2026',
  },
];

export const defaultCmsTestimonials: Omit<CMSTestimonial, 'id'>[] = [
  {
    name: 'Dr. Sarah Mitchell',
    role: 'Investigative Journalist',
    organization: 'Global News Network',
    content: 'Factify has transformed how our newsroom verifies breaking stories. The source credibility analysis saves us hours every day.',
    rating: 5,
    status: 'published',
  },
  {
    name: 'James Okonkwo',
    role: 'Media Literacy Educator',
    organization: 'University of Accra',
    content: 'I use Factify in my classrooms to teach students critical thinking about news and misinformation.',
    rating: 5,
    status: 'published',
  },
  {
    name: 'Emily Chen',
    role: 'Policy Researcher',
    organization: 'Institute for Digital Democracy',
    content: 'The detailed verification reports with supporting and contradicting sources are exactly what researchers need.',
    rating: 5,
    status: 'published',
  },
];
