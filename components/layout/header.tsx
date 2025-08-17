'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Settings, RotateCcw, FolderSync as Sync } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LaneToggle } from '@/components/common/lane-toggle';
import { useUIStore } from '@/lib/stores/ui';

interface HeaderProps {
  title: string;
  showDatePicker?: boolean;
  showLaneToggle?: boolean;
  showReplanButton?: boolean;
}

export function Header({ 
  title, 
  showDatePicker = false, 
  showLaneToggle = false,
  showReplanButton = false 
}: HeaderProps) {
  const { currentDate, setCurrentDate } = useUIStore();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleReplan = () => {
    // TODO: Implement replan functionality
    console.log('Replan triggered');
  };

  const handleSync = () => {
    // TODO: Implement sync functionality
    console.log('Sync triggered');
  };

  return (
    <header className="h-header border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40 safe-area-top">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">{title}</h1>
          
          {showDatePicker && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDatePickerOpen(true)}
              className="touch-target"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {format(currentDate, 'MMM d, yyyy')}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showLaneToggle && (
            <div className="hidden sm:block">
              <LaneToggle />
            </div>
          )}
          
          {showReplanButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReplan}
              className="touch-target"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Replan</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSync}
            className="touch-target"
          >
            <Sync className="w-4 h-4" />
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}