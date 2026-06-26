import type { NewsSource, SourceCategory } from '@/types';

export const newsSources: NewsSource[] = [
  { id: 'bbc', name: 'BBC', domain: 'bbc.com', logo: 'BBC', defaultCredibility: 96, category: 'Mainstream' },
  { id: 'reuters', name: 'Reuters', domain: 'reuters.com', logo: 'R', defaultCredibility: 98, category: 'Mainstream' },
  { id: 'cnn', name: 'CNN', domain: 'cnn.com', logo: 'CNN', defaultCredibility: 88, category: 'Mainstream' },
  { id: 'al-jazeera', name: 'Al Jazeera', domain: 'aljazeera.com', logo: 'AJ', defaultCredibility: 91, category: 'Mainstream' },
  { id: 'ap', name: 'Associated Press', domain: 'apnews.com', logo: 'AP', defaultCredibility: 97, category: 'Mainstream' },
  { id: 'guardian', name: 'The Guardian', domain: 'theguardian.com', logo: 'TG', defaultCredibility: 92, category: 'Mainstream' },
  { id: 'nytimes', name: 'New York Times', domain: 'nytimes.com', logo: 'NYT', defaultCredibility: 94, category: 'Mainstream' },
  { id: 'washingtonpost', name: 'Washington Post', domain: 'washingtonpost.com', logo: 'WP', defaultCredibility: 90, category: 'Mainstream' },
  { id: 'joy-news', name: 'Joy News', domain: 'myjoyonline.com', logo: 'JN', defaultCredibility: 82, category: 'Regional' },
  { id: 'citi-news', name: 'Citi News', domain: 'citinewsroom.com', logo: 'CN', defaultCredibility: 79, category: 'Regional' },
  { id: 'graphic-online', name: 'Graphic Online', domain: 'graphic.com.gh', logo: 'GO', defaultCredibility: 81, category: 'Regional' },
];

export function getSourceById(id: string): NewsSource | undefined {
  return newsSources.find((s) => s.id === id);
}

export function getSourceByDomain(domain: string): NewsSource | undefined {
  const normalized = domain.replace(/^www\./, '').toLowerCase();
  return newsSources.find(
    (s) => normalized === s.domain || normalized.endsWith(`.${s.domain}`)
  );
}

export function resolveSourceFromUrl(url: string): { sourceId: string; credibility: number; category: SourceCategory } {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
    const matched = getSourceByDomain(hostname);
    if (matched) {
      return { sourceId: matched.id, credibility: matched.defaultCredibility, category: matched.category };
    }
    if (hostname.includes('.gov')) {
      return { sourceId: 'government', credibility: 90, category: 'Government' };
    }
    if (hostname.includes('.edu')) {
      return { sourceId: 'academic', credibility: 88, category: 'Academic' };
    }
    return { sourceId: 'unknown', credibility: 45, category: 'Unknown' };
  } catch {
    return { sourceId: 'unknown', credibility: 40, category: 'Unknown' };
  }
}

export function getSourceName(sourceId: string, fallback?: string): string {
  return getSourceById(sourceId)?.name ?? fallback ?? 'Unknown Source';
}
