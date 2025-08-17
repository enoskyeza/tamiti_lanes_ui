import type { 
  Task, TimeBlock, User, Goal, CalendarEvent, Milestone, 
  DailyReview, PaginatedResponse, SchedulePreview 
} from './types';

const API_BASE = '/api';

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function request<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new APIError(
      errorData.detail || 'An error occurred',
      response.status,
      errorData
    );
  }

  return response.json();
}

export const api = {
  // Auth
  auth: {
    login: (email: string, password: string) => 
      request<{ access_token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
  },

  // Tasks
  tasks: {
    list: (params?: {
      status?: string;
      domain?: string;
      page?: number;
      page_size?: number;
    }) => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.set(key, value.toString());
          }
        });
      }
      return request<PaginatedResponse<Task>>(`/tasks?${searchParams}`);
    },

    create: (task: Partial<Task>) =>
      request<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify(task),
      }),

    update: (id: number, updates: Partial<Task>) =>
      request<Task>(`/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }),

    complete: (id: number) =>
      request<Task>(`/tasks/${id}/complete`, { method: 'POST' }),

    snooze: (id: number, until: string) =>
      request<Task>(`/tasks/${id}/snooze`, {
        method: 'POST',
        body: JSON.stringify({ until }),
      }),
  },

  // Schedule/Coach  
  schedule: {
    preview: (scope: 'day' | 'week' | 'month', date: string) =>
      request<SchedulePreview>('/schedule/preview', {
        method: 'POST',
        body: JSON.stringify({ scope, date }),
      }),

    commit: (blockIds: number[]) =>
      request<{ success: boolean }>('/schedule/commit', {
        method: 'POST',
        body: JSON.stringify({ block_ids: blockIds }),
      }),

    replan: (scope: 'day' | 'week' | 'month', date: string) =>
      request<SchedulePreview>('/replan', {
        method: 'POST',
        body: JSON.stringify({ scope, date }),
      }),
  },

  // Time Blocks
  blocks: {
    list: (params?: { date?: string; scope?: string }) => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.set(key, value.toString());
          }
        });
      }
      return request<PaginatedResponse<TimeBlock>>(`/blocks?${searchParams}`);
    },

    update: (id: number, updates: Partial<TimeBlock>) =>
      request<TimeBlock>(`/blocks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }),
  },

  // Events
  events: {
    list: (params?: { start?: string; end?: string }) => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.set(key, value.toString());
          }
        });
      }
      return request<PaginatedResponse<CalendarEvent>>(`/events?${searchParams}`);
    },

    create: (event: Partial<CalendarEvent>) =>
      request<CalendarEvent>('/events', {
        method: 'POST',
        body: JSON.stringify(event),
      }),
  },

  // Goals
  goals: {
    list: () => request<PaginatedResponse<Goal>>('/goals'),
    
    create: (goal: Partial<Goal>) =>
      request<Goal>('/goals', {
        method: 'POST',
        body: JSON.stringify(goal),
      }),
  },

  // Daily Reviews
  reviews: {
    list: (params?: { date?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.date) {
        searchParams.set('date', params.date);
      }
      return request<PaginatedResponse<DailyReview>>(`/reviews?${searchParams}`);
    },

    create: (review: Partial<DailyReview>) =>
      request<DailyReview>('/reviews', {
        method: 'POST',
        body: JSON.stringify(review),
      }),
  },

  // Analytics
  analytics: {
    get: (period: 'week' | 'month' | 'quarter' = 'week') =>
      request<{
        plan_realism: number;
        deep_work_min: number;
        context_switches: number;
        balance_index: number;
        estimate_drift: Record<string, number>;
      }>(`/analytics?period=${period}`),
  },

  // Dev Panel
  dev: {
    reset: (options?: {
      latencyMs?: number;
      failRatePct?: number;
      coachMode?: string;
      scope?: string;
    }) =>
      request<{ success: boolean }>('/dev/reset', {
        method: 'POST',
        body: JSON.stringify(options || {}),
      }),
  },
};