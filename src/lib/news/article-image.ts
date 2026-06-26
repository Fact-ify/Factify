import type { EvidenceItem } from '@/types';
import type { NewsClassification } from '@/lib/verification/quick-verify';

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80',
  'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&q=80',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
];

export function isValidImageUrl(url?: string): url is string {
  if (!url || url === 'null' || url.includes('placeholder')) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeUrl(url: string): string {
  return url.split('?')[0].replace(/\/$/, '');
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3);
}

function titleSimilarity(a: string, b: string): number {
  const wordsA = new Set(tokenize(a));
  const wordsB = tokenize(b);
  if (wordsA.size === 0 || wordsB.length === 0) return 0;
  const overlap = wordsB.filter((w) => wordsA.has(w)).length;
  return overlap / Math.max(wordsA.size, wordsB.length);
}

function extractOgImage(html: string): string | undefined {
  const patterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1] && isValidImageUrl(match[1])) {
      return match[1].replace(/&amp;/g, '&');
    }
  }
  return undefined;
}

export async function fetchArticleOgImage(url: string): Promise<string | undefined> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FactifyBot/1.0; +https://factify.com)',
        Accept: 'text/html',
      },
      redirect: 'follow',
    });

    clearTimeout(timeout);
    if (!res.ok) return undefined;

    const html = await res.text();
    return extractOgImage(html.slice(0, 150_000));
  } catch {
    return undefined;
  }
}

function findPoolImage(item: EvidenceItem, pool: EvidenceItem[]): string | undefined {
  const normalized = normalizeUrl(item.url);

  for (const entry of pool) {
    if (normalizeUrl(entry.url) === normalized && isValidImageUrl(entry.imageUrl)) {
      return entry.imageUrl;
    }
  }

  let best: { score: number; imageUrl: string } | null = null;
  for (const entry of pool) {
    if (!isValidImageUrl(entry.imageUrl)) continue;
    const score = titleSimilarity(item.title, entry.title);
    if (score >= 0.4 && (!best || score > best.score)) {
      best = { score, imageUrl: entry.imageUrl! };
    }
  }

  return best?.imageUrl;
}

export async function resolveHeadlineImage(
  item: EvidenceItem,
  pool: EvidenceItem[],
  classification: NewsClassification,
  index: number
): Promise<string> {
  if (isValidImageUrl(item.imageUrl)) return item.imageUrl;

  const poolImage = findPoolImage(item, pool);
  if (poolImage) return poolImage;

  if (classification === 'Real News' && item.url) {
    const ogImage = await fetchArticleOgImage(item.url);
    if (ogImage) return ogImage;
  }

  return PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
}
