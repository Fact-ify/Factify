import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CredibilityBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function CredibilityBadge({ score, size = 'md', showLabel = true }: CredibilityBadgeProps) {
  const variant =
    score >= 80 ? 'success' : score >= 50 ? 'warning' : 'error';

  const label = score >= 80 ? 'High' : score >= 50 ? 'Medium' : 'Low';

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={variant}
        className={cn(
          size === 'lg' && 'text-sm px-3 py-1',
          size === 'sm' && 'text-[10px] px-2'
        )}
      >
        {score}%
      </Badge>
      {showLabel && (
        <span className={cn('text-factify-gray-dark', size === 'lg' ? 'text-sm' : 'text-xs')}>
          {label} Credibility
        </span>
      )}
    </div>
  );
}
