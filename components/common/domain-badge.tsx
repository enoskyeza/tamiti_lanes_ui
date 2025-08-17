import { Badge } from '@/components/ui/badge';
import { Briefcase, User } from 'lucide-react';
import type { Domain } from '@/lib/types';

interface DomainBadgeProps {
  domain: Domain;
  showIcon?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function DomainBadge({ 
  domain, 
  showIcon = true, 
  size = 'md',
  className = ''
}: DomainBadgeProps) {
  const isProfessional = domain === 'professional';
  
  return (
    <Badge
      variant="outline"
      className={`
        domain-badge
        ${isProfessional ? 'domain-badge--professional' : 'domain-badge--personal'}
        ${size === 'sm' ? 'text-xs px-1.5 py-0.5' : ''}
        ${className}
      `}
    >
      {showIcon && (
        isProfessional ? (
          <Briefcase className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}`} />
        ) : (
          <User className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}`} />
        )
      )}
      {isProfessional ? 'Professional' : 'Personal'}
    </Badge>
  );
}