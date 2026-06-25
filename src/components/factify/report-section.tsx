import { cn } from '@/lib/utils';

interface ReportSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
}

export default function ReportSection({
  title,
  children,
  className,
  highlight = false,
}: ReportSectionProps) {
  return (
    <section
      className={cn(
        'rounded-xl border bg-white p-6 shadow-factify-sm',
        highlight ? 'border-factify-gold/30 bg-factify-gold/5' : 'border-factify-gray',
        className
      )}
    >
      <h2 className="text-lg font-semibold text-factify-navy mb-4 pb-3 border-b border-factify-gray">
        {title}
      </h2>
      <div className="text-sm text-factify-navy/80 leading-relaxed">{children}</div>
    </section>
  );
}
