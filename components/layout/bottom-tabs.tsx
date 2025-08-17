'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Calendar, List, Clock, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const tabs = [
  { 
    id: 'today', 
    label: 'Today', 
    icon: Clock, 
    href: '/today',
    badge: 0 
  },
  { 
    id: 'plan', 
    label: 'Plan', 
    icon: Calendar, 
    href: '/plan',
    badge: 0 
  },
  { 
    id: 'backlog', 
    label: 'Backlog', 
    icon: List, 
    href: '/backlog',
    badge: 5 
  },
  { 
    id: 'more', 
    label: 'More', 
    icon: MoreHorizontal, 
    href: '/more',
    badge: 0 
  },
];

export function BottomTabs() {
  const pathname = usePathname();

  return (
    <nav className="h-bottom-nav border-t bg-background safe-area-bottom md:hidden">
      <div className="container mx-auto px-2 h-full">
        <div className="flex items-center justify-around h-full">
          {tabs.map(({ id, label, icon: Icon, href, badge }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            
            return (
              <Link
                key={id}
                href={href}
                className={`
                  relative flex flex-col items-center justify-center gap-1 px-3 py-2 
                  touch-target min-w-0 flex-1 transition-colors duration-200
                  ${isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs flex items-center justify-center"
                    >
                      {badge > 99 ? '99+' : badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium truncate">{label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}