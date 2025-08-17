'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/lib/stores/ui';

export function FAB() {
  const { setTaskModalOpen } = useUIStore();

  return (
    <Button
      onClick={() => setTaskModalOpen(true)}
      size="icon"
      className="
        fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-50
        w-14 h-14 rounded-full shadow-lg hover:shadow-xl
        bg-primary hover:bg-primary/90 text-primary-foreground
        touch-target transition-all duration-200 hover:scale-110
      "
      aria-label="Add new task"
    >
      <Plus className="w-6 h-6" />
    </Button>
  );
}