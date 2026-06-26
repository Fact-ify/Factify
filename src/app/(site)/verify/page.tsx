'use client';

import { Suspense, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import VerificationForm from '@/components/factify/verification-form';
import VerificationResult from '@/components/factify/verification-result';
import { useVerificationStore } from '@/store/verification-store';

function VerifyPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const { currentReport, isAnalyzing, setCurrentReport, setIsAnalyzing } = useVerificationStore();

  const handleVerify = useCallback(
    async ({ mode, content }: { mode: string; content: string }) => {
      setIsAnalyzing(true);
      setCurrentReport(null);

      try {
        const res = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, mode }),
        });

        if (!res.ok) {
          throw new Error('Verification failed');
        }

        const report = await res.json();
        setCurrentReport(report);
      } catch {
        setCurrentReport(null);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [setCurrentReport, setIsAnalyzing]
  );

  useEffect(() => {
    if (initialQuery && !currentReport) {
      handleVerify({ mode: 'headline', content: initialQuery });
    }
  }, [initialQuery, currentReport, handleVerify]);

  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-factify-gray/20 min-h-screen">
      <div className="wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-factify-gold/10 border border-factify-gold/30 text-factify-gold text-xs font-semibold mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            News Verification
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-factify-navy mb-3">
            Verify News & Claims
          </h1>
          <p className="text-factify-gray-dark">
            Submit a headline, URL, article, or claim for AI-powered verification against trusted sources.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          <VerificationForm
            key={initialQuery}
            onSubmit={handleVerify}
            isLoading={isAnalyzing}
            initialContent={initialQuery}
          />

          <div>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-factify-gray bg-white p-8 sm:p-12 text-center shadow-factify-sm"
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-factify-gold/10 mb-4">
                  <div className="h-8 w-8 rounded-full border-2 border-factify-gold border-t-transparent animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-factify-navy mb-2">Analyzing...</h3>
                <p className="text-sm text-factify-gray-dark">
                  Cross-referencing NewsAPI, GNews, Bing, and Tavily sources
                </p>
              </motion.div>
            )}

            {!isAnalyzing && currentReport && (
              <VerificationResult report={currentReport} />
            )}

            {!isAnalyzing && !currentReport && (
              <div className="rounded-xl border border-dashed border-factify-gray bg-white/50 p-8 sm:p-12 text-center">
                <ShieldCheck className="h-12 w-12 text-factify-gray mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-factify-navy mb-2">Ready to Verify</h3>
                <p className="text-sm text-factify-gray-dark">
                  Submit news content in the form to receive a detailed verification report with sources.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="wrapper py-16 text-center">Loading...</div>}>
      <VerifyPageContent />
    </Suspense>
  );
}
