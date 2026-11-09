import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/* The usual shadcn / Aceternity / Magic UI helper, so their components paste in unchanged. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* Bilingual strings, same contract as the rest of the site (window.tx / window.__lang). */
export function tx(en: string, nl: string): string {
  const w = window as unknown as { tx?: (en: string, nl: string) => string };
  return w.tx ? w.tx(en, nl) : en;
}
