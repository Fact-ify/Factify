import type { EvidenceItem, RiskLevel, Verdict } from '@/types';
import { resolveSourceFromUrl } from '@/lib/sources';

export type NewsClassification = 'Real News' | 'Fake News' | 'Unverified';

export interface ArticleVerification {
  classification: NewsClassification;
  credibility: number;
  confidence: number;
  evidenceStrength: number;
  riskLevel: RiskLevel;
  verdict: Verdict;
}

const TRUSTED_CREDIBILITY = 80;
const REAL_MIN_CREDIBILITY = 70;
const REAL_MIN_EVIDENCE = 55;
const FAKE_MAX_CREDIBILITY = 48;

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

function isSameStory(urlA: string, urlB: string): boolean {
  if (urlA.split('?')[0] === urlB.split('?')[0]) return true;
  return false;
}

export function quickVerifyArticle(
  article: { title: string; url: string },
  evidencePool: EvidenceItem[]
): ArticleVerification {
  const articleSource = resolveSourceFromUrl(article.url);

  const related = evidencePool.filter((item) => {
    if (isSameStory(item.url, article.url)) return true;
    return titleSimilarity(article.title, item.title) >= 0.35;
  });

  const trustedSources = related.filter(
    (item) => resolveSourceFromUrl(item.url).credibility >= TRUSTED_CREDIBILITY
  );
  const lowCredSources = related.filter(
    (item) => resolveSourceFromUrl(item.url).credibility < 50
  );

  const avgRelatedCredibility =
    related.length > 0
      ? Math.round(
          related.reduce((sum, item) => sum + resolveSourceFromUrl(item.url).credibility, 0) /
            related.length
        )
      : articleSource.credibility;

  const sourceCredibility = Math.round((articleSource.credibility + avgRelatedCredibility) / 2);
  const evidenceStrength = Math.min(
    100,
    related.length * 10 + trustedSources.length * 18 - lowCredSources.length * 5
  );
  const confidence = Math.min(
    100,
    Math.round(sourceCredibility * 0.45 + evidenceStrength * 0.35 + Math.min(related.length, 8) * 3)
  );

  let classification: NewsClassification = 'Unverified';
  let verdict: Verdict = 'Unverified';
  let riskLevel: RiskLevel = 'Medium';

  const isReal =
    (articleSource.credibility >= TRUSTED_CREDIBILITY && trustedSources.length >= 1) ||
    (sourceCredibility >= REAL_MIN_CREDIBILITY &&
      evidenceStrength >= REAL_MIN_EVIDENCE &&
      trustedSources.length >= 1) ||
    (sourceCredibility >= 78 && evidenceStrength >= 50);

  const isFake =
    (articleSource.credibility <= FAKE_MAX_CREDIBILITY &&
      trustedSources.length === 0 &&
      (lowCredSources.length >= 2 || related.length <= 1)) ||
    (lowCredSources.length >= 3 && trustedSources.length === 0) ||
    (articleSource.category === 'Unknown' && trustedSources.length === 0 && evidenceStrength < 35);

  if (isReal && !isFake) {
    classification = 'Real News';
    verdict = evidenceStrength >= 70 ? 'Likely True' : 'Partially True';
    riskLevel = 'Low';
  } else if (isFake) {
    classification = 'Fake News';
    verdict = evidenceStrength < 25 ? 'Likely False' : 'Misleading';
    riskLevel = sourceCredibility < 35 ? 'Critical' : 'High';
  } else if (sourceCredibility >= 62 && evidenceStrength >= 45) {
    classification = 'Unverified';
    verdict = 'Partially True';
    riskLevel = 'Medium';
  } else if (sourceCredibility < 55) {
    classification = 'Fake News';
    verdict = 'Likely False';
    riskLevel = 'High';
  }

  return {
    classification,
    credibility: sourceCredibility,
    confidence,
    evidenceStrength: Math.max(0, evidenceStrength),
    riskLevel,
    verdict,
  };
}
