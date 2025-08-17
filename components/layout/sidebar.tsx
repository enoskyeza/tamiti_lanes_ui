'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Calendar, List, Clock, MoreHorizontal, Settings, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const primaryItems = [
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
];

const secondaryItems = [
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: BarChart3, 
    href: '/analytics' 
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings, 
    href: '/settings' 
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-sidebar border-r bg-background hidden lg:flex flex-col">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-primary">
          Tamiti Lanes
        </h2>
      </div>
      
      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {primaryItems.map(({ id, label, icon: Icon, href, badge }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            
            return (
              <Link key={id} href={href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`
                    w-full justify-start h-10 px-3 text-sm font-medium
                    ${isActive ? 'bg-secondary text-secondary-foreground' : ''}
                  `}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {label}
                  {badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="ml-auto w-5 h-5 p-0 text-xs flex items-center justify-center"
                    >
                      {badge > 99 ? '99+' : badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>

        <Separator className="my-6" />

        <div className="space-y-1">
          {secondaryItems.map(({ id, label, icon: Icon, href }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            
            return (
              <Link key={id} href={href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`
                    w-full justify-start h-10 px-3 text-sm font-medium
                    ${isActive ? 'bg-secondary text-secondary-foreground' : ''}
                  `}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {label}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}