import { format, parseISO, startOfDay, endOfDay, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isToday, isFuture, isPast } from 'date-fns';

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'HH:mm');
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d');
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy HH:mm');
}

export function getTimeRange(scope: 'day' | 'week' | 'month', date: Date) {
  switch (scope) {
    case 'day':
      return {
        start: startOfDay(date),
        end: endOfDay(date),
      };
    case 'week':
      return {
        start: startOfWeek(date, { weekStartsOn: 1 }), // Monday
        end: endOfWeek(date, { weekStartsOn: 1 }),
      };
    case 'month':
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
      };
  }
}

export function getWeekDays(date: Date) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

export function getRelativeDateText(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(d)) return 'Today';
  if (isSameDay(d, addDays(new Date(), 1))) return 'Tomorrow';
  if (isSameDay(d, addDays(new Date(), -1))) return 'Yesterday';
  
  if (isFuture(d)) {
    return `In ${Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days`;
  }
  
  if (isPast(d)) {
    return `${Math.ceil((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24))} days ago`;
  }
  
  return formatDateShort(d);
}

export function minutesToTimeString(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function parseTimeString(timeString: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
}

export function addMinutesToTime(timeString: string, minutesToAdd: number): string {
  const { hours, minutes } = parseTimeString(timeString);
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}