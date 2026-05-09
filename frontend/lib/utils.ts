// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format a date string for display
 */
export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format minutes as hours
 */
export function formatMinutesAsHours(minutes: number): string {
  const hours = minutes / 60;
  return `${hours.toFixed(1)}h`;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayISO(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

/**
 * Add days to a date string
 */
export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

/**
 * Validate date format YYYY-MM-DD
 */
export function isValidDateFormat(dateStr: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

/**
 * Check if end date is after start date
 */
export function isEndAfterStart(startDate: string, endDate: string): boolean {
  return new Date(endDate) >= new Date(startDate);
}
