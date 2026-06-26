import type { DashboardSummary, TrendingFakeNews, VerificationReport } from '@/types';
import { prisma } from '@/lib/db';

const CATEGORY_COLORS = ['#C9A227', '#1B2A4A', '#4A90D9', '#E74C3C', '#27AE60', '#8E44AD'];

function formatReportDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export async function getDashboardSummary(): Promise<DashboardSummary & { recentReports: VerificationReport[] }> {
  const reports = await prisma.verificationReport.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const totalSearches = reports.length;
  const verifiedStories = reports.filter((r) => r.verdict !== 'Unverified').length;
  const fakeNewsDetected = reports.filter(
    (r) => r.verdict === 'Likely False' || r.verdict === 'Misleading'
  ).length;

  const now = new Date();
  const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(now);
    day.setDate(now.getDate() - (6 - i));
    const dayStart = new Date(day.setHours(0, 0, 0, 0));
    const dayEnd = new Date(day.setHours(23, 59, 59, 999));
    return reports.filter((r) => r.createdAt >= dayStart && r.createdAt <= dayEnd).length;
  });

  let high = 0;
  let medium = 0;
  let low = 0;
  for (const report of reports) {
    if (report.sourceCredibility >= 80) high++;
    else if (report.sourceCredibility >= 60) medium++;
    else low++;
  }
  const total = reports.length || 1;

  const categoryCounts = new Map<string, number>();
  for (const report of reports) {
    categoryCounts.set(report.category, (categoryCounts.get(report.category) ?? 0) + 1);
  }
  const popularCategories = [...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count], i) => ({ name, count, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }));

  const recentReports: VerificationReport[] = reports.slice(0, 10).map((r) => ({
    id: r.id,
    claim: r.claim,
    summary: r.summary,
    verdict: r.verdict as VerificationReport['verdict'],
    confidence: r.confidence,
    riskLevel: r.riskLevel as VerificationReport['riskLevel'],
    sourceCredibility: r.sourceCredibility,
    evidenceStrength: r.evidenceStrength,
    aiExplanation: r.aiExplanation,
    recommendations: r.recommendations as unknown as string[],
    sources: r.sources as unknown as VerificationReport['sources'],
    category: r.category,
    createdAt: formatReportDate(r.createdAt),
  }));

  return {
    totalSearches,
    verifiedStories,
    fakeNewsDetected,
    savedReports: reports.length,
    weeklyActivity,
    credibilityDistribution: {
      high: Math.round((high / total) * 100),
      medium: Math.round((medium / total) * 100),
      low: Math.round((low / total) * 100),
    },
    popularCategories: popularCategories.length
      ? popularCategories
      : [{ name: 'General', count: 0, color: CATEGORY_COLORS[0] }],
    sourceReliabilityTrends: [],
    recentReports,
  };
}

export async function getTrendingMisinformation(): Promise<TrendingFakeNews[]> {
  const reports = await prisma.verificationReport.findMany({
    where: { verdict: { in: ['Likely False', 'Misleading'] } },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  return reports.map((report, index) => ({
    id: `trend-${report.id}`,
    title: report.claim.slice(0, 80) + (report.claim.length > 80 ? '...' : ''),
    claim: report.claim,
    spreadLevel: (['Viral', 'High', 'Moderate', 'Emerging'] as const)[index % 4],
    platforms: ['Web', 'Social Media'],
    detectedAt: formatReportDate(report.createdAt),
    verdict: report.verdict as TrendingFakeNews['verdict'],
    reportId: report.id,
  }));
}
