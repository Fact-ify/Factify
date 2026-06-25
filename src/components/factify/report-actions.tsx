'use client';

import Link from 'next/link';
import { Share2, Download, Printer, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReportActions() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 print:hidden">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/verify">
          <ArrowLeft className="h-4 w-4" />
          Back to Verify
        </Link>
      </Button>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm">
          <Share2 className="h-4 w-4" />
          Share Report
        </Button>
        <Button variant="secondary" size="sm">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="secondary" size="sm" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          Print Report
        </Button>
      </div>
    </div>
  );
}
