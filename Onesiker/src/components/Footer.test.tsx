import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import { LanguageProvider } from '../context/LanguageContext';
import { clearJsonCache } from '../hooks/useJsonData';
import { translations } from '../translations';

beforeEach(() => {
  clearJsonCache();
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response('null', {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

const wrap = (ui: React.ReactElement) =>
  render(<LanguageProvider>{ui}</LanguageProvider>);

describe('Footer', () => {
  it('renders the Onesiker logo with a meaningful alt', () => {
    wrap(<Footer />);
    const logo = screen.getByAltText('Onesiker') as HTMLImageElement;
    expect(logo.tagName).toBe('IMG');
    expect(logo.getAttribute('src')).toMatch(/TAG_ONESIKER\.png/);
  });

  it('renders the French copyright when language is fr', () => {
    wrap(<Footer />);
    expect(
      screen.getByText(new RegExp(translations.fr.footer.rights)),
    ).toBeInTheDocument();
  });

  it('renders the current year in the copyright', () => {
    wrap(<Footer />);
    const year = String(new Date().getFullYear());
    const copyright = screen.getByText(new RegExp(`${year}.*Onesiker`));
    expect(copyright).toBeInTheDocument();
  });

  it('renders the CGU button', () => {
    wrap(<Footer />);
    expect(screen.getByRole('button', { name: 'CGU' })).toBeInTheDocument();
  });

  it('renders default social links when contact data is empty', () => {
    wrap(<Footer />);
    const links = screen
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href')?.startsWith('https://'));
    expect(links.length).toBeGreaterThanOrEqual(2);
    expect(
      links.some((a) => a.getAttribute('href')?.includes('instagram.com')),
    ).toBe(true);
  });
});
