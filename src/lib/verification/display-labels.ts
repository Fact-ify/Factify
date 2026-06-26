import type { NewsSearchResult } from '@/types';

type Verification = NewsSearchResult['verification'];

export type VerificationTone = 'positive' | 'caution' | 'neutral';

export interface VerificationDisplay {
  badge: string;
  tone: VerificationTone;
  headline: string;
  detail: string;
  shortMetric: string;
}

export function getVerificationDisplay(verification: Verification): VerificationDisplay {
  const { classification, credibility, confidence, evidenceStrength, verdict } = verification;

  if (classification === 'Real News') {
    return {
      badge: 'Strong sources',
      tone: 'positive',
      headline: `${credibility}% source credibility`,
      detail: `Backed by trusted outlets in our scan. Confidence ${confidence}%. Run a full report to confirm every detail.`,
      shortMetric: `${credibility}% credible`,
    };
  }

  if (classification === 'Fake News') {
    return {
      badge: 'Review recommended',
      tone: 'caution',
      headline: `${credibility}% source credibility`,
      detail: `Limited support from trusted sources in this scan (${evidenceStrength}% evidence). Verdict so far: ${verdict}. Open the full report before you share.`,
      shortMetric: `${credibility}% credible`,
    };
  }

  return {
    badge: 'Needs more checks',
    tone: 'neutral',
    headline: `${credibility}% source credibility`,
    detail: `Our first pass is inconclusive (confidence ${confidence}%). Use the full report to see all sources and the latest verdict.`,
    shortMetric: `${credibility}% credible`,
  };
}

export function countByTrustLevel(articles: NewsSearchResult[]) {
  let strong = 0;
  let review = 0;
  let pending = 0;

  for (const article of articles) {
    const tone = getVerificationDisplay(article.verification).tone;
    if (tone === 'positive') strong++;
    else if (tone === 'caution') review++;
    else pending++;
  }

  return { strong, review, pending };
}
