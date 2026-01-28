// ============================================
// DATE & TIME FORMATTING
// ============================================

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('az-AZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function formatDateTime(dateString: string | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('az-AZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatTime(dateString: string | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('az-AZ', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// ============================================
// PRICE FORMATTING
// ============================================

export function formatPrice(price: number | null | undefined): string {
  if (!price && price !== 0) return '-';
  return `€${price.toFixed(2)}`;
}

// ============================================
// STRING UTILITIES
// ============================================

export function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// ============================================
// NUMBER FORMATTING
// ============================================

export function formatNumber(num: number | null | undefined): string {
  if (!num && num !== 0) return '-';
  return new Intl.NumberFormat('az-AZ').format(num);
}
