export type Domain = 'personal' | 'professional';
export type Energy = 'low' | 'med' | 'high';
export type CoachMode = 'manual' | 'copilot' | 'autopilot';
export type TaskStatus = 'backlog' | 'planned' | 'in_progress' | 'done' | 'blocked';
export type BlockStatus = 'draft' | 'committed' | 'completed' | 'missed';

export interface Task {
  id: number;
  project: number | null;
  domain: Domain;
  context?: string;
  title: string;
  notes?: string;
  estimate_min: number;
  allow_split: boolean;
  difficulty: 1 | 2 | 3 | 4 | 5;
  importance: 1 | 2 | 3 | 4 | 5;
  due_at?: string | null;
  earliest_start_at?: string | null;
  latest_finish_at?: string | null;
  readiness: number; // 0..1
  energy_tag: Energy;
  status: TaskStatus;
  dependencies?: number[];
  created_at: string;
  updated_at: string;
}

export interface TimeBlock {
  id: number;
  task: number | null;
  starts_at: string;
  ends_at: string;
  status: BlockStatus;
  source: 'scheduler' | 'manual';
  domain: Domain;
  title?: string;
  project?: number;
  context?: string;
}

export interface AvailabilityTemplate {
  id: number;
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  start_time: string;
  end_time: string;
  energy_curve: Record<string, Energy>;
  personal_windows?: { start: string; end: string }[];
  professional_windows?: { start: string; end: string }[];
}

export interface BreakPolicy {
  id: number;
  work_min: number;
  short_break_min: number;
  long_break_every: number;
  long_break_min: number;
}

export interface Goal {
  id: number;
  domain: Domain;
  context: string;
  target: { unit: 'min/day' | 'min/week' | 'x/week' | 'min/month'; value: number };
  period?: 'week' | 'month' | 'quarter' | 'year';
  streak?: number;
  current_progress?: number;
}

export interface ActualTimeBlock {
  id: number;
  planned_block_id?: number | null;
  task?: number | null;
  domain: Domain;
  actual_start: string;
  actual_end: string;
  overrun_min?: number;
  interruption_reason?: string;
}

export interface EventLog {
  id: number;
  type: 'start' | 'pause' | 'extend' | 'snooze' | 'complete' | 'reschedule' | 'missed';
  task_id?: number | null;
  block_id?: number | null;
  at: string;
  note?: string;
}

export interface CalendarEvent {
  id: number;
  domain: Domain;
  title: string;
  starts_at: string;
  ends_at: string;
  all_day?: boolean;
  location?: string;
  notes?: string;
  rrule?: string | null;
  context?: string;
}

export interface Milestone {
  id: number;
  domain: Domain;
  project: number | null;
  title: string;
  due_at: string;
  importance: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface CoachSettings {
  mode: CoachMode;
  allow_cross_boundary_flex: boolean;
  weekly_quotas?: Goal[];
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  timezone: string;
  coach_settings: CoachSettings;
}

export interface DailyReview {
  id: number;
  date: string;
  planned_min: number;
  actual_min: number;
  completed_tasks: number;
  missed_blocks: number;
  interruptions: number;
  mood: 1 | 2 | 3 | 4 | 5;
  top_win?: string;
  main_blocker?: string;
  notes?: string;
  balance_score: number; // -1 to 1, negative = too much work
}

// API Response types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface SchedulePreview {
  blocks: TimeBlock[];
  conflicts: Array<{
    type: 'overlap' | 'boundary_violation' | 'capacity_exceeded';
    message: string;
    affected_blocks: number[];
  }>;
  capacity_usage: {
    personal_min: number;
    professional_min: number;
    total_available_min: number;
  };
}