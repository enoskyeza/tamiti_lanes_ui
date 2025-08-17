import { http, HttpResponse } from 'msw';
import { seedData } from './seed';
import type { Task, TimeBlock, SchedulePreview, DailyReview, CalendarEvent, Milestone, Goal } from '../types';

const API_BASE = '/api';
let db = { ...seedData };

// Helper to add latency and simulate failures
const withLatency = async (handler: () => any) => {
  const latency = Math.random() * (1200 - 300) + 300;
  const failRate = 0.1; // 10% default failure rate
  
  await new Promise(resolve => setTimeout(resolve, latency));
  
  if (Math.random() < failRate) {
    return HttpResponse.json(
      { detail: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }
  
  return handler();
};

export const handlers = [
  // Auth
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    return withLatency(async () => {
      const data = await request.json() as { email: string; password: string };
      
      // 20% failure rate for auth
      if (Math.random() < 0.2) {
        return HttpResponse.json(
          { detail: 'Invalid credentials' },
          { status: 401 }
        );
      }
      
      return HttpResponse.json({
        access_token: 'mock-jwt-token',
        user: db.user,
      });
    });
  }),

  // Tasks
  http.get(`${API_BASE}/tasks`, async ({ request }) => {
    return withLatency(() => {
      const url = new URL(request.url);
      const status = url.searchParams.get('status');
      const domain = url.searchParams.get('domain');
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(url.searchParams.get('page_size') || '20');
      
      let tasks = [...db.tasks];
      
      if (status) {
        tasks = tasks.filter(t => t.status === status);
      }
      if (domain) {
        tasks = tasks.filter(t => t.domain === domain);
      }
      
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedTasks = tasks.slice(start, end);
      
      return HttpResponse.json({
        count: tasks.length,
        next: end < tasks.length ? `${API_BASE}/tasks?page=${page + 1}&page_size=${pageSize}` : null,
        previous: page > 1 ? `${API_BASE}/tasks?page=${page - 1}&page_size=${pageSize}` : null,
        results: paginatedTasks,
      });
    });
  }),

  http.post(`${API_BASE}/tasks`, async ({ request }) => {
    return withLatency(async () => {
      const taskData = await request.json() as Partial<Task>;
      const newTask: Task = {
        id: Math.max(...db.tasks.map(t => t.id)) + 1,
        project: null,
        context: '',
        notes: '',
        allow_split: false,
        dependencies: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...taskData,
      } as Task;
      
      db.tasks.push(newTask);
      return HttpResponse.json(newTask, { status: 201 });
    });
  }),

  http.patch(`${API_BASE}/tasks/:id`, async ({ params, request }) => {
    return withLatency(async () => {
      const id = parseInt(params.id as string);
      const updates = await request.json();
      const taskIndex = db.tasks.findIndex(t => t.id === id);
      
      if (taskIndex === -1) {
        return HttpResponse.json({ detail: 'Task not found' }, { status: 404 });
      }
      
      db.tasks[taskIndex] = {
        ...db.tasks[taskIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      
      return HttpResponse.json(db.tasks[taskIndex]);
    });
  }),

  // Schedule/Coach
  http.post(`${API_BASE}/schedule/preview`, async ({ request }) => {
    return withLatency(async () => {
      const { scope, date } = await request.json() as { scope: 'day' | 'week' | 'month'; date: string };
      
      // Mock schedule generation
      const mockBlocks: TimeBlock[] = db.tasks
        .filter(t => t.status === 'backlog')
        .slice(0, 5)
        .map((task, i) => ({
          id: 1000 + i,
          task: task.id,
          starts_at: new Date(Date.now() + i * 2 * 60 * 60 * 1000).toISOString(),
          ends_at: new Date(Date.now() + (i * 2 + task.estimate_min / 60) * 60 * 60 * 1000).toISOString(),
          status: 'draft' as const,
          source: 'scheduler' as const,
          domain: task.domain,
          title: task.title,
          context: task.context,
        }));
      
      const preview: SchedulePreview = {
        blocks: mockBlocks,
        conflicts: [],
        capacity_usage: {
          personal_min: 120,
          professional_min: 360,
          total_available_min: 600,
        },
      };
      
      return HttpResponse.json(preview);
    });
  }),

  http.post(`${API_BASE}/schedule/commit`, async ({ request }) => {
    return withLatency(async () => {
      const { block_ids } = await request.json() as { block_ids: number[] };
      
      // Move blocks from draft to committed
      db.timeBlocks.forEach(block => {
        if (block_ids.includes(block.id)) {
          block.status = 'committed';
        }
      });
      
      return HttpResponse.json({ success: true });
    });
  }),

  // Time Blocks
  http.get(`${API_BASE}/blocks`, async ({ request }) => {
    return withLatency(() => {
      const url = new URL(request.url);
      const date = url.searchParams.get('date');
      const scope = url.searchParams.get('scope') || 'day';
      
      let blocks = [...db.timeBlocks];
      
      if (date) {
        const targetDate = new Date(date);
        blocks = blocks.filter(block => {
          const blockDate = new Date(block.starts_at);
          return blockDate.toDateString() === targetDate.toDateString();
        });
      }
      
      return HttpResponse.json({
        count: blocks.length,
        next: null,
        previous: null,
        results: blocks,
      });
    });
  }),

  // Events
  http.get(`${API_BASE}/events`, async ({ request }) => {
    return withLatency(() => {
      const url = new URL(request.url);
      const startDate = url.searchParams.get('start');
      const endDate = url.searchParams.get('end');
      
      let events = [...db.events];
      
      if (startDate && endDate) {
        events = events.filter(event => {
          const eventDate = new Date(event.starts_at);
          return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
        });
      }
      
      return HttpResponse.json({
        count: events.length,
        next: null,
        previous: null,
        results: events,
      });
    });
  }),

  // Goals
  http.get(`${API_BASE}/goals`, async () => {
    return withLatency(() => {
      return HttpResponse.json({
        count: db.goals.length,
        next: null,
        previous: null,
        results: db.goals,
      });
    });
  }),

  // Daily Review
  http.get(`${API_BASE}/reviews`, async ({ request }) => {
    return withLatency(() => {
      const url = new URL(request.url);
      const date = url.searchParams.get('date');
      
      let reviews = [...db.dailyReviews];
      if (date) {
        reviews = reviews.filter(r => r.date === date);
      }
      
      return HttpResponse.json({
        count: reviews.length,
        next: null,
        previous: null,
        results: reviews,
      });
    });
  }),

  http.post(`${API_BASE}/reviews`, async ({ request }) => {
    return withLatency(async () => {
      const reviewData = await request.json() as Partial<DailyReview>;
      const newReview: DailyReview = {
        id: Math.max(...db.dailyReviews.map(r => r.id)) + 1,
        ...reviewData,
      } as DailyReview;
      
      db.dailyReviews.push(newReview);
      return HttpResponse.json(newReview, { status: 201 });
    });
  }),

  // Dev Panel
  http.post(`${API_BASE}/dev/reset`, async ({ request }) => {
    return withLatency(async () => {
      const options = await request.json();
      // Reset database and apply options
      db = { ...seedData };
      return HttpResponse.json({ success: true });
    });
  }),

  // Analytics
  http.get(`${API_BASE}/analytics`, async ({ request }) => {
    return withLatency(() => {
      const url = new URL(request.url);
      const period = url.searchParams.get('period') || 'week';
      
      // Mock analytics data
      const analytics = {
        plan_realism: 0.85,
        deep_work_min: 240,
        context_switches: 12,
        balance_index: 0.15,
        estimate_drift: {
          writing: 1.2,
          calls: 0.9,
          dev: 1.4,
          exercise: 0.8,
        },
      };
      
      return HttpResponse.json(analytics);
    });
  }),
];