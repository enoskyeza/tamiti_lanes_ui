interface ReadinessBarProps {
  readiness: number; // 0..1
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ReadinessBar({ 
  readiness, 
  size = 'md', 
  showLabel = false,
  className = ''
}: ReadinessBarProps) {
  const percentage = Math.round(readiness * 100);
  
  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-xs text-muted-foreground min-w-fit">
          {percentage}%
        </span>
      )}
      <div className={`readiness-bar ${heights[size]}`}>
        <div 
          className="readiness-bar-fill"
          style={{ width: `${percentage}%` }}
          title={`Readiness: ${percentage}%`}
        />
      </div>
    </div>
  );
}