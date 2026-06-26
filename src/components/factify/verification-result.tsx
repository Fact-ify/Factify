'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, HelpCircle, FileText, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { VerificationReport } from '@/types';
import ConfidenceMeter from './confidence-meter';
import SourceCard from './source-card';

interface VerificationResultProps {
  report: VerificationReport;
}

function getVerdictIcon(verdict: string) {
  if (verdict.includes('False')) return AlertTriangle;
  if (verdict.includes('True')) return CheckCircle;
  return HelpCircle;
}

function getVerdictColor(verdict: string) {
  if (verdict.includes('False')) return 'text-red-600 bg-red-50 border-red-200';
  if (verdict.includes('True')) return 'text-green-700 bg-green-50 border-green-200';
  if (verdict === 'Misleading') return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-factify-navy bg-factify-gray/30 border-factify-gray';
}

function getRiskVariant(risk: string) {
  if (risk === 'Critical') return 'error';
  if (risk === 'High') return 'error';
  if (risk === 'Medium') return 'warning';
  return 'success';
}

export default function VerificationResult({ report }: VerificationResultProps) {
  const VerdictIcon = getVerdictIcon(report.verdict);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Verdict Summary */}
      <div className="rounded-xl border border-factify-gray bg-white p-6 shadow-factify-sm">
        <h2 className="text-lg font-semibold text-factify-navy mb-6">Analysis Results</h2>

        <div className={`flex items-center gap-4 p-4 rounded-xl border mb-6 ${getVerdictColor(report.verdict)}`}>
          <VerdictIcon className="h-8 w-8 shrink-0" />
          <div>
            <p className="text-xs font-medium opacity-70">Verdict</p>
            <p className="text-xl font-bold">{report.verdict}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <ConfidenceMeter value={report.confidence} label="Confidence" size="lg" />
          <ConfidenceMeter value={report.sourceCredibility} label="Source Credibility" size="lg" />
          <ConfidenceMeter value={report.evidenceStrength} label="Evidence Strength" size="lg" />
          <div className="flex flex-col justify-center">
            <span className="text-xs font-medium text-factify-navy mb-1.5">Risk Level</span>
            <Badge variant={getRiskVariant(report.riskLevel)} className="w-fit text-sm px-3 py-1">
              {report.riskLevel}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={`/report/${report.id}`}>
              <FileText className="h-4 w-4" />
              Read Full Report
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href={`/report/${report.id}`}>
              <ExternalLink className="h-4 w-4" />
              Open Article
            </Link>
          </Button>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="rounded-xl border border-factify-gray bg-white p-6 shadow-factify-sm">
        <h3 className="text-lg font-semibold text-factify-navy mb-4">
          Why Factify Reached This Verdict
        </h3>
        <p className="text-sm text-factify-navy/80 leading-relaxed">{report.aiExplanation}</p>
      </div>

      {/* Sources Used for Verification - CRITICAL SECTION */}
      <div className="rounded-xl border-2 border-factify-gold/30 bg-factify-gold/5 p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-factify-gold pulse-gold" />
          <h3 className="text-lg font-semibold text-factify-navy">
            Sources Used for Verification
          </h3>
        </div>
        <p className="text-sm text-factify-gray-dark mb-6">
          All sources analyzed during this verification, with credibility scores and stance indicators.
        </p>
        <div className="space-y-4">
          {report.sources.map((source, index) => (
            <SourceCard key={source.id} source={source} index={index} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
