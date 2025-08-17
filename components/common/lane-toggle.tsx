'use client';

import { Button } from '@/components/ui/button';
import { Briefcase, User, LayoutGrid } from 'lucide-react';
import { useUIStore } from '@/lib/stores/ui';

export function LaneToggle() {
  const { laneMode, setLaneMode } = useUIStore();

  const modes = [
    { id: 'personal' as const, icon: User, label: 'Personal', color: 'text-orange-600' },
    { id: 'both' as const, icon: LayoutGrid, label: 'Both', color: 'text-gray-600' },
    { id: 'professional' as const, icon: Briefcase, label: 'Professional', color: 'text-blue-600' },
  ];

  return (
    <div className="flex bg-muted rounded-lg p-1 gap-1">
      {modes.map(({ id, icon: Icon, label, color }) => (
        <Button
          key={id}
          variant={laneMode === id ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLaneMode(id)}
          className={`
            touch-target flex-1 px-3 py-1.5 text-xs font-medium
            ${laneMode === id ? '' : `hover:${color}`}
          `}
        >
          <Icon className="w-4 h-4 mr-1.5" />
          {label}
        </Button>
      ))}
    </div>
  );
}