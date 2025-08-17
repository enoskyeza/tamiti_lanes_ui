import type { BlockStatus } from '@/lib/types';

interface StatusDotProps {
  status: BlockStatus;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

const statusLabels = {
  draft: 'Draft',
  committed: 'Committed',
  completed: 'Completed',
  missed: 'Missed'
};

export function StatusDot({ 
  status, 
  size = 'md', 
  showLabel = false,
  className = ''
}: StatusDotProps) {
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className={`status-dot status-dot--${status} ${dotSize}`}
        title={statusLabels[status]}
      />
      {showLabel && (
        <span className="text-xs text-muted-foreground">
          {statusLabels[status]}
        </span>
      )}
    </div>
  );
}