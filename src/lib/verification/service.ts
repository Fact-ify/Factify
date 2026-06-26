import { generateObject } from 'ai';
import { z } from 'zod';
import { AI_MODEL, isAiAvailable } from '@/lib/ai/model';
import { gatherEvidence } from '@/lib/news/search';
import { resolveSourceFromUrl } from '@/lib/sources';
import { prisma } from '@/lib/db';
import { buildRuleBasedReport } from '@/lib/verification/rule-based-report';
import type { EvidenceItem, VerificationReport, VerificationSource } from '@/types';

const verificationSchema = z.object({
  summary: z.string(),
  verdict: z.enum(['Likely True', 'Likely False', 'Unverified', 'Partially True', 'Misleading']),
  confidence: z.number().min(0).max(100),
  riskLevel: z.enum(['Low', 'Medium', 'High', 'Critical']),
  sourceCredibility: z.number().min(0).max(100),
  evidenceStrength: z.number().min(0).max(100),
  aiExplanation: z.string(),
  recommendations: z.array(z.string()).min(2).max(6),
  category: z.string(),
  sources: z.array(
    z.object({
      url: z.string(),
      stance: z.enum(['Supports Claim', 'Contradicts Claim', 'Neutral', 'Contradicts Trusted Sources']),
      excerpt: z.string().optional(),
    })
  ),
});

function buildSearchQuery(content: string, mode: string): string {
  const trimmed = content.trim();
  if (mode === 'url') {
    try {
      const url = new URL(trimmed);
      return url.hostname + ' ' + url.pathname.split('/').pop()?.replace(/-/g, ' ');
    } catch {
      return trimmed;
    }
  }
  return trimmed.slice(0, 200);
}

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

function mapSources(
  aiSources: { url: string; stance: VerificationSource['stance']; excerpt?: string }[],
  evidence: EvidenceItem[]
): VerificationSource[] {
  const evidenceByUrl = new Map(evidence.map((e) => [e.url.split('?')[0], e]));

  return aiSources.map((source, index) => {
    const evidenceItem = evidenceByUrl.get(source.url.split('?')[0]);
    const { sourceId, credibility, category } = resolveSourceFromUrl(source.url);

    return {
      id: `src-${index + 1}`,
      sourceId,
      url: source.url,
      publishedAt: formatDate(evidenceItem?.publishedAt ?? new Date().toISOString()),
      credibilityScore: credibility,
      stance: source.stance,
      category,
      excerpt: source.excerpt ?? evidenceItem?.excerpt,
    };
  });
}

function fallbackReport(claim: string, evidence: EvidenceItem[]): Omit<VerificationReport, 'id' | 'createdAt'> {
  return buildRuleBasedReport(claim, evidence);
}

async function persistReport(report: Omit<VerificationReport, 'id' | 'createdAt'>, mode: string): Promise<VerificationReport> {
  const saved = await prisma.verificationReport.create({
    data: {
      ...report,
      mode,
      recommendations: report.recommendations as object,
      sources: report.sources as object,
    },
  });
  return {
    ...report,
    id: saved.id,
    createdAt: formatDate(saved.createdAt.toISOString()),
  };
}

export async function verifyClaim(
  content: string,
  mode: string
): Promise<VerificationReport> {
  const claim = content.trim();
  const searchQuery = buildSearchQuery(claim, mode);
  const evidence = await gatherEvidence(searchQuery);

  if (!isAiAvailable()) {
    const report = buildRuleBasedReport(claim, evidence);
    return persistReport(report, mode);
  }

  const evidenceContext = evidence
    .map(
      (item, i) =>
        `[${i + 1}] Title: ${item.title}\nURL: ${item.url}\nSource: ${item.source}\nDate: ${item.publishedAt}\nExcerpt: ${item.excerpt}\nProvider: ${item.provider}`
    )
    .join('\n\n');

  let analysis: z.infer<typeof verificationSchema>;

  try {
    const { object } = await generateObject({
      model: AI_MODEL,
      schema: verificationSchema,
      prompt: `You are Factify, a news verification AI. Analyze the following claim using ONLY the evidence provided.

CLAIM (${mode}):
${claim}

EVIDENCE FROM NEWS APIS AND SEARCH ENGINES:
${evidenceContext || 'No external evidence was retrieved.'}

Instructions:
- Base your verdict strictly on the evidence above
- Assign stance per source: Supports Claim, Contradicts Claim, Neutral, or Contradicts Trusted Sources
- Prefer wire services and mainstream outlets when assessing credibility
- If evidence is insufficient, verdict must be "Unverified"
- Include up to 8 most relevant sources with their URLs from the evidence
- Be conservative: do not mark Likely True without strong corroboration from trusted sources`,
    });
    analysis = object;
  } catch (error) {
    console.error('AI verification failed, using rule-based analysis:', error);
    const report = fallbackReport(claim, evidence);
    return persistReport(report, mode);
  }

  const sources = mapSources(analysis.sources, evidence);
  const sourceCredibility =
    sources.length > 0
      ? Math.round(sources.reduce((sum, s) => sum + s.credibilityScore, 0) / sources.length)
      : analysis.sourceCredibility;

  const reportData = {
    claim,
    summary: analysis.summary,
    verdict: analysis.verdict,
    confidence: analysis.confidence,
    riskLevel: analysis.riskLevel,
    sourceCredibility,
    evidenceStrength: analysis.evidenceStrength,
    aiExplanation: analysis.aiExplanation,
    recommendations: analysis.recommendations,
    sources,
    category: analysis.category,
    mode,
  };

  const saved = await prisma.verificationReport.create({
    data: {
      ...reportData,
      mode,
      recommendations: reportData.recommendations as object,
      sources: reportData.sources as object,
    },
  });

  return {
    ...reportData,
    id: saved.id,
    createdAt: formatDate(saved.createdAt.toISOString()),
  };
}

export async function getReportById(id: string): Promise<VerificationReport | null> {
  const report = await prisma.verificationReport.findUnique({ where: { id } });
  if (!report) return null;

  return {
    id: report.id,
    claim: report.claim,
    summary: report.summary,
    verdict: report.verdict as VerificationReport['verdict'],
    confidence: report.confidence,
    riskLevel: report.riskLevel as VerificationReport['riskLevel'],
    sourceCredibility: report.sourceCredibility,
    evidenceStrength: report.evidenceStrength,
    aiExplanation: report.aiExplanation,
    recommendations: report.recommendations as unknown as string[],
    sources: report.sources as unknown as VerificationSource[],
    category: report.category,
    createdAt: formatDate(report.createdAt.toISOString()),
  };
}
