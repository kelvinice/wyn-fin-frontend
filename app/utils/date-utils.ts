import { format, parseISO } from 'date-fns';

/**
 * Format a date string to a user-friendly format
 * @param dateStr ISO date string or Date object
 * @param formatStr Optional format string (defaults to 'PPP' - e.g., April 29, 2023)
 * @returns Formatted date string
 */
export function formatDate(dateStr: string | Date, formatStr: string = 'PPP'): string {
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(dateStr);
  }
}

/**
 * Format a date to a relative time (today, yesterday, etc.)
 * @param dateStr ISO date string or Date object
 * @returns Relative date string
 */
export function formatRelativeDate(dateStr: string | Date): string {
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateOnly.getTime() === today.getTime()) {
      return 'Today';
    } else if (dateOnly.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return format(date, 'PPP');
    }
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return String(dateStr);
  }
}