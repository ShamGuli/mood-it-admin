import { format as dateFnsFormat } from 'date-fns';
import { de } from 'date-fns/locale';

/**
 * Format price range for display
 * @example formatPrice(79, 199) => "€79-199"
 * @example formatPrice(49) => "€49"
 */
export function formatPrice(min: number, max?: number): string {
  if (!max || min === max) {
    return `€${min.toFixed(0)}`;
  }
  return `€${min.toFixed(0)}-${max.toFixed(0)}`;
}

/**
 * Format date to German format
 * @example formatDate(new Date()) => "28.01.2026"
 */
export function formatDate(date: Date | string, formatStr = 'dd.MM.yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateFnsFormat(dateObj, formatStr, { locale: de });
}

/**
 * Format date and time
 * @example formatDateTime(new Date()) => "28.01.2026 12:30"
 */
export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'dd.MM.yyyy HH:mm');
}

/**
 * Format phone number with spaces
 * @example formatPhone("+43123456789") => "+43 123 456 789"
 */
export function formatPhone(phone: string): string {
  return phone.replace(/(\+\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
}

/**
 * Truncate text to specified length
 * @example truncate("Long text here", 10) => "Long text..."
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Generate initials from name
 * @example getInitials("John Doe") => "JD"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
