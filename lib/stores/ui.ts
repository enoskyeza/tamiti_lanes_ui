import { create } from 'zustand';
import type { Domain, CoachMode } from '../types';

interface UIState {
  // Lane view mode
  laneMode: 'personal' | 'professional' | 'both';
  setLaneMode: (mode: 'personal' | 'professional' | 'both') => void;

  // Coach settings
  coachMode: CoachMode;
  setCoachMode: (mode: CoachMode) => void;

  // Current date/view
  currentDate: Date;
  setCurrentDate: (date: Date) => void;

  // Modal/sheet state
  isTaskModalOpen: boolean;
  setTaskModalOpen: (open: boolean) => void;
  
  isSchedulePreviewOpen: boolean;
  setSchedulePreviewOpen: (open: boolean) => void;

  isDailyReviewOpen: boolean;
  setDailyReviewOpen: (open: boolean) => void;

  // Dev panel
  isDevPanelOpen: boolean;
  setDevPanelOpen: (open: boolean) => void;

  // Active timer
  activeBlockId: number | null;
  timerStarted: Date | null;
  setActiveTimer: (blockId: number | null, startTime: Date | null) => void;

  // Filters
  taskFilters: {
    domain?: Domain;
    project?: number;
    status?: string;
    context?: string;
  };
  setTaskFilters: (filters: UIState['taskFilters']) => void;
}

export const useUIStore = create<UIState>((set) => ({
  laneMode: 'both',
  setLaneMode: (mode) => set({ laneMode: mode }),

  coachMode: 'copilot',
  setCoachMode: (mode) => set({ coachMode: mode }),

  currentDate: new Date(),
  setCurrentDate: (date) => set({ currentDate: date }),

  isTaskModalOpen: false,
  setTaskModalOpen: (open) => set({ isTaskModalOpen: open }),

  isSchedulePreviewOpen: false,
  setSchedulePreviewOpen: (open) => set({ isSchedulePreviewOpen: open }),

  isDailyReviewOpen: false,
  setDailyReviewOpen: (open) => set({ isDailyReviewOpen: open }),

  isDevPanelOpen: false,
  setDevPanelOpen: (open) => set({ isDevPanelOpen: open }),

  activeBlockId: null,
  timerStarted: null,
  setActiveTimer: (blockId, startTime) => set({ 
    activeBlockId: blockId, 
    timerStarted: startTime 
  }),

  taskFilters: {},
  setTaskFilters: (filters) => set({ taskFilters: filters }),
}));