import { notFound } from 'next/navigation';
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReportSection from '@/components/factify/report-section';
import SourceCard from '@/components/factify/source-card';
import ConfidenceMeter from '@/components/factify/confidence-meter';
import ReportActions from '@/components/factify/report-actions';
import { getReportById } from '@/data/mock/reports';

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

function getVerdictIcon(verdict: string) {
  if (verdict.includes('False')) return AlertTriangle;
  if (verdict.includes('True')) return CheckCircle;
  return HelpCircle;
}

function getVerdictColor(verdict: string) {
  if (verdict.includes('False')) return 'text-red-600 bg-red-50 border-red-200';
  if (verdict.includes('True')) return 'text-green-700 bg-green-50 border-green-200';
  return 'text-amber-700 bg-amber-50 border-amber-200';
}

export async function generateStaticParams() {
  const { verificationReports } = await import('@/data/mock/reports');
  return verificationReports.map((report) => ({ id: report.id }));
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;
  const report = getReportById(id);

  if (!report) {
    notFound();
  }

  const VerdictIcon = getVerdictIcon(report.verdict);
  const supportingSources = report.sources.filter((s) => s.stance.includes('Supports'));
  const contradictingSources = report.sources.filter((s) => s.stance.includes('Contradicts'));

  return (
    <div className="py-12 lg:py-16 bg-factify-gray/20 min-h-screen print:bg-white">
      <div className="wrapper max-w-4xl">
        <ReportActions />

        <div className="mb-8 p-6 rounded-xl gradient-navy text-white">
          <p className="text-xs text-white/60 mb-1">Verification Report</p>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Factify Analysis Report</h1>
          <p className="text-sm text-white/70">Report ID: {report.id} · Generated: {report.createdAt}</p>
        </div>

        <div className="space-y-6">
          <ReportSection title="Claim">
            <p className="text-base font-medium">{report.claim}</p>
          </ReportSection>

          <ReportSection title="Summary">
            <p>{report.summary}</p>
          </ReportSection>

          <div className="grid sm:grid-cols-2 gap-6">
            <ReportSection title="Verdict">
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${getVerdictColor(report.verdict)}`}>
                <VerdictIcon className="h-8 w-8" />
                <span className="text-xl font-bold">{report.verdict}</span>
              </div>
            </ReportSection>

            <ReportSection title="Risk Level">
              <Badge
                variant={
                  report.riskLevel === 'Critical' || report.riskLevel === 'High'
                    ? 'error'
                    : report.riskLevel === 'Medium'
                      ? 'warning'
                      : 'success'
                }
                className="text-base px-4 py-2"
              >
                {report.riskLevel}
              </Badge>
            </ReportSection>
          </div>

          <ReportSection title="Confidence & Evidence Metrics">
            <div className="grid sm:grid-cols-3 gap-6">
              <ConfidenceMeter value={report.confidence} label="Confidence Score" size="lg" />
              <ConfidenceMeter value={report.sourceCredibility} label="Source Credibility" size="lg" />
              <ConfidenceMeter value={report.evidenceStrength} label="Evidence Strength" size="lg" />
            </div>
          </ReportSection>

          <ReportSection title="Evidence Analysis">
            <p>
              Factify analyzed {report.sources.length} sources during this verification. Evidence
              strength of {report.evidenceStrength}% indicates{' '}
              {report.evidenceStrength >= 80
                ? 'strong corroboration from multiple trusted outlets.'
                : report.evidenceStrength >= 60
                  ? 'moderate evidence with some conflicting reports.'
                  : 'limited or conflicting evidence from available sources.'}
            </p>
          </ReportSection>

          <ReportSection title="Source Analysis">
            <p>
              Source credibility averaged {report.sourceCredibility}% across all references.
              {supportingSources.length > 0 &&
                ` ${supportingSources.length} source(s) support the claim.`}
              {contradictingSources.length > 0 &&
                ` ${contradictingSources.length} source(s) contradict the claim.`}
            </p>
          </ReportSection>

          <ReportSection title="AI Reasoning">
            <p>{report.aiExplanation}</p>
          </ReportSection>

          <ReportSection title="Recommendations">
            <ul className="space-y-2">
              {report.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-factify-gold mt-2 shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </ReportSection>

          {supportingSources.length > 0 && (
            <ReportSection title="Supporting Sources" highlight>
              <div className="space-y-4 mt-2">
                {supportingSources.map((source, index) => (
                  <SourceCard key={source.id} source={source} index={index} />
                ))}
              </div>
            </ReportSection>
          )}

          {contradictingSources.length > 0 && (
            <ReportSection title="Contradicting Sources" highlight>
              <div className="space-y-4 mt-2">
                {contradictingSources.map((source, index) => (
                  <SourceCard key={source.id} source={source} index={index} />
                ))}
              </div>
            </ReportSection>
          )}

          <ReportSection title="Sources Used for Verification" highlight>
            <div className="space-y-4 mt-2">
              {report.sources.map((source, index) => (
                <SourceCard key={source.id} source={source} index={index} />
              ))}
            </div>
          </ReportSection>
        </div>
      </div>
    </div>
  );
}
