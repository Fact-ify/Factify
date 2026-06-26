import type { EvidenceItem, VerificationReport, VerificationSource } from '@/types';
import { getSourceName, resolveSourceFromUrl } from '@/lib/sources';
import { quickVerifyArticle } from '@/lib/verification/quick-verify';

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
}

function inferStance(
  claim: string,
  item: EvidenceItem
): VerificationSource['stance'] {
  const cred = resolveSourceFromUrl(item.url).credibility;
  const claimWords = claim.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
  const titleLower = item.title.toLowerCase();
  const overlap = claimWords.filter((w) => titleLower.includes(w)).length;

  if (cred >= 80 && overlap >= 2) return 'Supports Claim';
  if (cred < 50 && overlap >= 2) return 'Contradicts Claim';
  if (cred >= 80) return 'Neutral';
  return 'Neutral';
}

export function buildRuleBasedReport(
  claim: string,
  evidence: EvidenceItem[]
): Omit<VerificationReport, 'id' | 'createdAt'> {
  const analysis = quickVerifyArticle({ title: claim, url: evidence[0]?.url ?? '' }, evidence);

  const sources: VerificationSource[] = evidence.slice(0, 8).map((item, index) => {
    const { sourceId, credibility, category } = resolveSourceFromUrl(item.url);
    return {
      id: `src-${index + 1}`,
      sourceId,
      url: item.url,
      publishedAt: formatDate(item.publishedAt),
      credibilityScore: credibility,
      stance: inferStance(claim, item),
      category,
      excerpt: item.excerpt,
    };
  });

  const supporting = sources.filter((s) => s.stance.includes('Supports')).length;
  const contradicting = sources.filter((s) => s.stance.includes('Contradicts')).length;

  const summary =
    analysis.classification === 'Real News'
      ? `Evidence from ${evidence.length} sources suggests this claim aligns with reporting from trusted outlets. Source credibility averaged ${analysis.credibility}%.`
      : analysis.classification === 'Fake News'
        ? `Analysis of ${evidence.length} sources indicates this claim lacks support from trusted news organizations and may be misleading or false.`
        : `Factify analyzed ${evidence.length} sources. The claim could not be fully confirmed. Review supporting and contradicting sources below.`;

  const aiExplanation =
    analysis.classification === 'Real News'
      ? `This claim is classified as Real News based on credibility (${analysis.credibility}%), evidence strength (${analysis.evidenceStrength}%), and corroboration from outlets such as ${getSourceName('reuters')}, ${getSourceName('bbc')}, or similar trusted sources where applicable. ${supporting} source(s) appear to support the claim.`
      : analysis.classification === 'Fake News'
        ? `This claim is classified as Fake News because source credibility (${analysis.credibility}%) and evidence strength (${analysis.evidenceStrength}%) fall below Factify's trust thresholds, with insufficient backing from mainstream wire services. ${contradicting > 0 ? `${contradicting} source(s) may contradict the claim.` : 'No strong trusted corroboration was found.'}`
        : `Factify retrieved ${evidence.length} articles from NewsAPI, GNews, Bing News, and Tavily. Metrics: credibility ${analysis.credibility}%, confidence ${analysis.confidence}%, evidence ${analysis.evidenceStrength}%. Manual review is recommended.`;

  return {
    claim,
    summary,
    verdict: analysis.verdict,
    confidence: analysis.confidence,
    riskLevel: analysis.riskLevel,
    sourceCredibility: analysis.credibility,
    evidenceStrength: analysis.evidenceStrength,
    aiExplanation,
    recommendations: [
      analysis.classification === 'Real News'
        ? 'This story appears corroborated. Still confirm key facts with the original publisher before sharing.'
        : 'Cross-check this claim against Reuters, AP, or BBC before sharing.',
      'Look for an official statement from the organization mentioned in the claim.',
      evidence.length === 0
        ? 'No matching news coverage was found. Treat as unverified until a trusted outlet reports it.'
        : `Review all ${evidence.length} sources listed in this report for full context.`,
    ],
    sources,
    category: 'General',
  };
}
