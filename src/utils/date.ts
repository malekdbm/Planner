import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export const WEDDING_DATE = '2026-06-16';
export const TRIP_END_DATE = '2026-07-03';

export function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function formatDate(iso: string, fmt = 'dd/MM/yyyy'): string {
  return format(parseISO(iso), fmt, { locale: fr });
}

export function formatDateLong(iso: string): string {
  return format(parseISO(iso), 'EEEE d MMMM yyyy', { locale: fr });
}

export function formatDateShort(iso: string): string {
  return format(parseISO(iso), 'EEE d MMM', { locale: fr });
}

export function formatTime(iso: string): string {
  return format(parseISO(iso), 'HH:mm', { locale: fr });
}

export function daysUntil(iso: string): number {
  return differenceInCalendarDays(parseISO(iso), new Date());
}

export function formatEUR(cents: number): string {
  const v = cents / 100;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(v);
}
