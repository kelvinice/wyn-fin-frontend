/**
 * Format a date string to a user-friendly format
 * @param dateStr ISO date string or Date object
 * @param formatStr Optional format string (defaults to 'medium' - e.g., Apr 29, 2023)
 * @returns Formatted date string
 */
export function formatDate(dateStr: string | Date, formatOption: Intl.DateTimeFormatOptions | 'short' | 'medium' | 'long' | 'full' = 'medium'): string {
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    
    // Handle predefined format options
    if (typeof formatOption === 'string') {
      switch(formatOption) {
        case 'short':
          return date.toLocaleDateString();
        case 'medium':
          return date.toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });
        case 'long':
          return date.toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        case 'full':
          return date.toLocaleDateString(undefined, { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        default:
          return date.toLocaleDateString();
      }
    }
    
    // Use custom format if provided
    return date.toLocaleDateString(undefined, formatOption);
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
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
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
      return formatDate(date, 'long');
    }
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return String(dateStr);
  }
}

/**
 * Get month name from month number (1-12)
 * @param month Month number (1-12)
 * @returns Month name
 */
export function getMonthName(month: number): string {
  return new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' });
}