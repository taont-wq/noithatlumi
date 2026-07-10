import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = 'VNĐ'): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(price) + ` ${currency}`;
}

export function formatArea(area: number): string {
  return `${area.toFixed(1)} m²`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function parseJsonArray<T>(json: string | undefined | null, fallback: T[] = []): T[] {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T[];
  } catch {
    return fallback;
  }
}

export function truncate(str: string, length: number): string {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getApartmentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    AVAILABLE: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    RESERVED: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    SOLD: 'bg-red-500/10 text-red-500 border-red-500/20',
    DESIGNING: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    CONSTRUCTING: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    COMPLETED: 'bg-green-500/10 text-green-500 border-green-500/20',
    HIDDEN: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };
  return colors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
}
