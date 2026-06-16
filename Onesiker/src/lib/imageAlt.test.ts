import { describe, expect, it } from 'vitest';
import { getAlt, getSrc, type ImageEntry } from './imageAlt';

describe('getSrc', () => {
  it('returns the string itself for legacy string entries', () => {
    expect(getSrc('/img/foo.webp')).toBe('/img/foo.webp');
  });

  it('returns the .src field for object entries', () => {
    expect(getSrc({ src: '/img/foo.webp', alt_fr: 'x' })).toBe('/img/foo.webp');
  });
});

describe('getAlt', () => {
  it('returns the fallback for legacy string entries', () => {
    expect(getAlt('/img/foo.webp', 'fr', 'fallback')).toBe('fallback');
    expect(getAlt('/img/foo.webp', 'en', 'fallback')).toBe('fallback');
  });

  it('returns the localized alt for the requested language', () => {
    const entry: ImageEntry = { src: '/x.webp', alt_fr: 'oeuvre', alt_en: 'artwork' };
    expect(getAlt(entry, 'fr', 'fb')).toBe('oeuvre');
    expect(getAlt(entry, 'en', 'fb')).toBe('artwork');
  });

  it('falls back to the other language when the requested one is missing', () => {
    expect(getAlt({ src: '/x.webp', alt_fr: 'oeuvre' }, 'en', 'fb')).toBe('oeuvre');
    expect(getAlt({ src: '/x.webp', alt_en: 'artwork' }, 'fr', 'fb')).toBe('artwork');
  });

  it('treats an empty / whitespace alt as missing', () => {
    expect(getAlt({ src: '/x.webp', alt_fr: '   ', alt_en: 'art' }, 'fr', 'fb')).toBe('art');
    expect(getAlt({ src: '/x.webp', alt_fr: '', alt_en: '' }, 'fr', 'fb')).toBe('fb');
  });

  it('returns the fallback when both alts are missing', () => {
    expect(getAlt({ src: '/x.webp' }, 'fr', 'last-resort')).toBe('last-resort');
  });
});
