import type { EvidenceItem, NewsSearchResult } from '@/types';
import { isValidImageUrl, resolveHeadlineImage } from '@/lib/news/article-image';
import { quickVerifyArticle } from '@/lib/verification/quick-verify';

interface NewsApiArticle {
  title?: string;
  url?: string;
  urlToImage?: string;
  source?: { name?: string };
  publishedAt?: string;
  description?: string;
  content?: string;
}

interface GNewsArticle extends NewsApiArticle {
  image?: string;
}

interface BingNewsItem {
  name?: string;
  url?: string;
  image?: {
    thumbnail?: { contentUrl?: string };
    contentUrl?: string;
  };
  provider?: { name?: string }[];
  datePublished?: string;
  description?: string;
}

interface TavilyResult {
  title?: string;
  url?: string;
  published_date?: string;
  content?: string;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}

function mergeEvidenceItems(existing: EvidenceItem, incoming: EvidenceItem): EvidenceItem {
  return {
    ...existing,
    title: existing.title.length >= incoming.title.length ? existing.title : incoming.title,
    excerpt: existing.excerpt.length >= incoming.excerpt.length ? existing.excerpt : incoming.excerpt,
    imageUrl: existing.imageUrl || incoming.imageUrl,
    publishedAt: existing.publishedAt || incoming.publishedAt,
  };
}

function dedupeEvidence(items: EvidenceItem[]): EvidenceItem[] {
  const byUrl = new Map<string, EvidenceItem>();
  for (const item of items) {
    const key = item.url.split('?')[0];
    const existing = byUrl.get(key);
    byUrl.set(key, existing ? mergeEvidenceItems(existing, item) : item);
  }
  return Array.from(byUrl.values());
}

export async function searchNewsApi(query: string): Promise<EvidenceItem[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return [];

  try {
    const params = new URLSearchParams({
      q: query,
      language: 'en',
      sortBy: 'relevancy',
      pageSize: '10',
      apiKey,
    });
    const res = await fetch(`https://newsapi.org/v2/everything?${params}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];

    const data = await res.json();
    return (data.articles ?? []).map((article: NewsApiArticle) => ({
      title: article.title ?? 'Untitled',
      url: article.url ?? '',
      source: article.source?.name ?? extractDomain(article.url ?? ''),
      domain: extractDomain(article.url ?? ''),
      publishedAt: article.publishedAt ?? new Date().toISOString(),
      excerpt: article.description ?? article.content?.slice(0, 300) ?? '',
      imageUrl: isValidImageUrl(article.urlToImage) ? article.urlToImage : undefined,
      provider: 'newsapi' as const,
    })).filter((item: EvidenceItem) => item.url);
  } catch {
    return [];
  }
}

export async function searchGNews(query: string): Promise<EvidenceItem[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) return [];

  try {
    const params = new URLSearchParams({
      q: query,
      lang: 'en',
      max: '10',
      apikey: apiKey,
    });
    const res = await fetch(`https://gnews.io/api/v4/search?${params}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];

    const data = await res.json();
    return (data.articles ?? []).map((article: GNewsArticle) => ({
      title: article.title ?? 'Untitled',
      url: article.url ?? '',
      source: article.source?.name ?? extractDomain(article.url ?? ''),
      domain: extractDomain(article.url ?? ''),
      publishedAt: article.publishedAt ?? new Date().toISOString(),
      excerpt: article.description ?? '',
      imageUrl: isValidImageUrl(article.image) ? article.image : undefined,
      provider: 'gnews' as const,
    })).filter((item: EvidenceItem) => item.url);
  } catch {
    return [];
  }
}

export async function searchBing(query: string): Promise<EvidenceItem[]> {
  const apiKey = process.env.BING_SEARCH_API_KEY;
  if (!apiKey) return [];

  try {
    const params = new URLSearchParams({
      q: query,
      count: '10',
      mkt: 'en-US',
      freshness: 'Month',
    });
    const res = await fetch(`https://api.bing.microsoft.com/v7.0/news/search?${params}`, {
      headers: { 'Ocp-Apim-Subscription-Key': apiKey },
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];

    const data = await res.json();
    return (data.value ?? []).map((item: BingNewsItem) => {
      const imageUrl = item.image?.thumbnail?.contentUrl ?? item.image?.contentUrl;
      return {
        title: item.name ?? 'Untitled',
        url: item.url ?? '',
        source: item.provider?.[0]?.name ?? extractDomain(item.url ?? ''),
        domain: extractDomain(item.url ?? ''),
        publishedAt: item.datePublished ?? new Date().toISOString(),
        excerpt: item.description ?? '',
        imageUrl: isValidImageUrl(imageUrl) ? imageUrl : undefined,
        provider: 'bing' as const,
      };
    }).filter((item: EvidenceItem) => item.url);
  } catch {
    return [];
  }
}

export async function searchTavily(query: string): Promise<EvidenceItem[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: 'advanced',
        max_results: 10,
        include_answer: false,
      }),
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];

    const data = await res.json();
    return (data.results ?? []).map((item: TavilyResult) => ({
      title: item.title ?? 'Untitled',
      url: item.url ?? '',
      source: extractDomain(item.url ?? ''),
      domain: extractDomain(item.url ?? ''),
      publishedAt: item.published_date ?? new Date().toISOString(),
      excerpt: item.content?.slice(0, 300) ?? '',
      provider: 'tavily' as const,
    })).filter((item: EvidenceItem) => item.url);
  } catch {
    return [];
  }
}

export async function gatherEvidence(query: string): Promise<EvidenceItem[]> {
  const results = await Promise.allSettled([
    searchNewsApi(query),
    searchGNews(query),
    searchBing(query),
    searchTavily(query),
  ]);

  const combined: EvidenceItem[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      combined.push(...result.value);
    }
  }

  return dedupeEvidence(combined)
    .sort((a, b) => {
      const aHasImage = isValidImageUrl(a.imageUrl) ? 1 : 0;
      const bHasImage = isValidImageUrl(b.imageUrl) ? 1 : 0;
      return bHasImage - aHasImage;
    })
    .slice(0, 20);
}

export async function searchNewsArticles(query: string, category?: string): Promise<NewsSearchResult[]> {
  const evidence = await gatherEvidence(query);
  const { resolveSourceFromUrl } = await import('@/lib/sources');

  const filtered = evidence.filter(
    (item) =>
      !category || category === 'All' || item.title.toLowerCase().includes(category.toLowerCase())
  ).slice(0, 12);

  const articles = await Promise.all(
    filtered.map(async (item, index) => {
      const { sourceId } = resolveSourceFromUrl(item.url);
      const verification = quickVerifyArticle({ title: item.title, url: item.url }, evidence);
      const thumbnail = await resolveHeadlineImage(
        item,
        evidence,
        verification.classification,
        index
      );

      return {
        id: `article-${index}-${Buffer.from(item.url).toString('base64url').slice(0, 8)}`,
        title: item.title,
        summary: item.excerpt,
        sourceId,
        url: item.url,
        thumbnail,
        publishedAt: new Date(item.publishedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        category: category && category !== 'All' ? category : 'News',
        region: 'Global',
        verification: {
          classification: verification.classification,
          credibility: verification.credibility,
          confidence: verification.confidence,
          evidenceStrength: verification.evidenceStrength,
          riskLevel: verification.riskLevel,
          verdict: verification.verdict,
        },
      };
    })
  );

  return articles;
}
