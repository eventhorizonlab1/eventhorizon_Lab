export type ImageEntry = string | { src: string; alt_fr?: string; alt_en?: string; visible?: boolean };

export type Lang = 'fr' | 'en';

export function getSrc(entry: ImageEntry): string {
  return typeof entry === 'string' ? entry : entry.src;
}

export function getAlt(entry: ImageEntry, language: Lang, fallback: string): string {
  if (typeof entry === 'string') return fallback;
  const localized = language === 'fr' ? entry.alt_fr : entry.alt_en;
  return localized?.trim() || entry.alt_fr?.trim() || entry.alt_en?.trim() || fallback;
}

// Legacy entries are bare strings → no `visible` field → treat as visible.
// New entries with `visible: false` are filtered out of the public site.
export function isVisible(entry: ImageEntry): boolean {
  return typeof entry === 'string' || entry.visible !== false;
}
