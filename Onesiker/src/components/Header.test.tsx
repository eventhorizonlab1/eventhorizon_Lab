import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import Header from './Header';
import { LanguageProvider } from '../context/LanguageContext';
import { translations } from '../translations';

const wrap = (ui: React.ReactElement) =>
  render(<LanguageProvider>{ui}</LanguageProvider>);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Header', () => {
  it('renders the Onesiker logo with a meaningful alt', () => {
    wrap(<Header />);
    const logo = screen.getByAltText('Onesiker') as HTMLImageElement;
    expect(logo.tagName).toBe('IMG');
    expect(logo.getAttribute('src')).toMatch(/TAG_ONESIKER\.png/);
  });

  it('exposes default French nav labels when no layout is provided', () => {
    wrap(<Header />);
    expect(screen.getAllByText(translations.fr.nav.artworks).length).toBeGreaterThan(0);
    expect(screen.getAllByText(translations.fr.nav.news).length).toBeGreaterThan(0);
    expect(screen.getAllByText(translations.fr.nav.contact).length).toBeGreaterThan(0);
  });

  it('switches nav labels to English when the EN button is clicked', () => {
    wrap(<Header />);

    expect(screen.getAllByText(translations.fr.nav.artworks).length).toBeGreaterThan(0);

    act(() => {
      screen.getByRole('button', { name: 'Switch to English' }).click();
    });

    expect(screen.getAllByText(translations.en.nav.artworks).length).toBeGreaterThan(0);
    expect(screen.queryByText(translations.fr.nav.artworks)).toBeNull();
  });

  it('honors the layout prop for nav links when provided', () => {
    const layout = {
      sections: [
        { id: 'custom', visible: true, title: { fr: 'Spécial', en: 'Special' } },
        { id: 'hidden', visible: false, title: { fr: 'Caché', en: 'Hidden' } },
      ],
    };
    wrap(<Header layout={layout} />);

    expect(screen.getAllByText('Spécial').length).toBeGreaterThan(0);
    expect(screen.queryByText('Caché')).toBeNull();
  });
});
