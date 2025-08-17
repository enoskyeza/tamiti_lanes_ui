'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO, isAfter, isBefore } from 'date-fns';
import { Play, Pause, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DomainBadge } from '@/components/common/domain-badge';
import { StatusDot } from '@/components/common/status-dot';
import { DifficultyStars } from '@/components/common/difficulty-stars';
import { ReadinessBar } from '@/components/common/readiness-bar';
import { api } from '@/lib/api';
import { useUIStore } from '@/lib/stores/ui';
import { formatTime, minutesToTimeString } from '@/lib/utils/date';
import type { TimeBlock, Task } from '@/lib/types';

export function TodayTimeline() {
  const { currentDate, laneMode, activeBlockId, setActiveTimer } = useUIStore();
  const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(new Set());

  const { data: blocksResponse, isLoading, error } = useQuery({
    queryKey: ['blocks', format(currentDate, 'yyyy-MM-dd')],
    queryFn: () => api.blocks.list({ 
      date: format(currentDate, 'yyyy-MM-dd'),
      scope: 'day'
    }),
  });

  const blocks = blocksResponse?.results || [];
  const now = new Date();

  // Filter blocks based on lane mode
  const filteredBlocks = blocks.filter(block => {
    if (laneMode === 'both') return true;
    return block.domain === laneMode;
  });

  const toggleBlockExpanded = (blockId: number) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(blockId)) {
      newExpanded.delete(blockId);
    } else {
      newExpanded.add(blockId);
    }
    setExpandedBlocks(newExpanded);
  };

  const handleStartTimer = (block: TimeBlock) => {
    setActiveTimer(block.id, new Date());
  };

  const handlePauseTimer = () => {
    setActiveTimer(null, null);
  };

  const handleCompleteBlock = (block: TimeBlock) => {
    // TODO: Implement complete block functionality
    console.log('Complete block:', block.id);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-4">
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={i} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="skeleton h-4 w-16" />
                <div className="skeleton h-6 w-20" />
              </div>
              <div className="skeleton h-5 w-3/4" />
              <div className="flex items-center gap-4">
                <div className="skeleton h-4 w-12" />
                <div className="skeleton h-4 w-16" />
                <div className="skeleton h-4 w-24" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">
            Failed to load your timeline
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  if (filteredBlocks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="p-8 text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Play className="w-12 h-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">No blocks scheduled</h3>
            <p className="text-muted-foreground">
              {laneMode === 'both' 
                ? "Generate a plan for today to get started"
                : `No ${laneMode} blocks scheduled for today`
              }
            </p>
          </div>
          <Button>Generate Plan for Today</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-4">
        {/* Start Next Button */}
        {filteredBlocks.some(block => 
          block.status === 'committed' && 
          !activeBlockId &&
          isBefore(parseISO(block.starts_at), now) &&
          isAfter(parseISO(block.ends_at), now)
        ) && (
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Ready to start your next block?</h3>
                <p className="text-sm text-muted-foreground">
                  Tap to begin your scheduled task
                </p>
              </div>
              <Button
                onClick={() => {
                  const nextBlock = filteredBlocks.find(block => 
                    block.status === 'committed' && 
                    isBefore(parseISO(block.starts_at), now) &&
                    isAfter(parseISO(block.ends_at), now)
                  );
                  if (nextBlock) handleStartTimer(nextBlock);
                }}
                className="touch-target"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Next
              </Button>
            </div>
          </Card>
        )}

        {/* Timeline Blocks */}
        <div className="space-y-3">
          {filteredBlocks.map((block) => {
            const isActive = activeBlockId === block.id;
            const isPast = isBefore(parseISO(block.ends_at), now);
            const isNow = isBefore(parseISO(block.starts_at), now) && isAfter(parseISO(block.ends_at), now);
            const isExpanded = expandedBlocks.has(block.id);
            const duration = Math.round(
              (parseISO(block.ends_at).getTime() - parseISO(block.starts_at).getTime()) / (1000 * 60)
            );

            return (
              <Card
                key={block.id}
                className={`
                  timeline-block timeline-block--${block.domain} 
                  ${isActive ? 'timeline-block--active' : ''}
                  ${isPast ? 'opacity-60' : ''}
                  cursor-pointer transition-all duration-200
                `}
                onClick={() => toggleBlockExpanded(block.id)}
              >
                <div className="space-y-3">
                  {/* Block Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="text-muted-foreground">
                        {formatTime(block.starts_at)}
                      </span>
                      <span className="text-muted-foreground">—</span>
                      <span className="text-muted-foreground">
                        {formatTime(block.ends_at)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({minutesToTimeString(duration)})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusDot status={block.status} size="sm" />
                      <DomainBadge domain={block.domain} size="sm" />
                    </div>
                  </div>

                  {/* Block Title and Context */}
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground leading-tight">
                      {block.title || 'Untitled Block'}
                    </h3>
                    {block.context && (
                      <p className="text-sm text-muted-foreground">
                        {block.context}
                      </p>
                    )}
                  </div>

                  {/* Block Controls (when active or scheduled to start) */}
                  {(isActive || isNow) && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      {isActive ? (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePauseTimer();
                            }}
                          >
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompleteBlock(block);
                            }}
                          >
                            <Square className="w-4 h-4 mr-2" />
                            Complete
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartTimer(block);
                          }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Expanded Details */}
                  {isExpanded && block.task && (
                    <div className="pt-3 border-t space-y-2 animate-slide-down">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Project:</span>
                          <span className="ml-2">Project {block.project || 'None'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Difficulty:</span>
                          <DifficultyStars difficulty={3} size="sm" showEmpty={false} />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Readiness:</span>
                        <ReadinessBar readiness={0.8} size="sm" showLabel={true} />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}