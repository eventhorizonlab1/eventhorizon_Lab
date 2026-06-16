import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, renderHook, screen } from '@testing-library/react';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { translations } from '../translations';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('LanguageContext', () => {
  it('throws when useLanguage is called outside a LanguageProvider', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useLanguage())).toThrow(
      /useLanguage must be used within a LanguageProvider/,
    );

    consoleErrorSpy.mockRestore();
  });

  it('defaults to French and exposes the matching translation bundle', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    });

    expect(result.current.language).toBe('fr');
    expect(result.current.t).toBe(translations.fr);
  });

  it('updates language and translation bundle when setLanguage is called', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: ({ children }) => <LanguageProvider>{children}</LanguageProvider>,
    });

    act(() => {
      result.current.setLanguage('en');
    });

    expect(result.current.language).toBe('en');
    expect(result.current.t).toBe(translations.en);
    expect(result.current.t.nav.artworks).toBe(translations.en.nav.artworks);
  });

  it('re-renders consumers when the language changes', () => {
    function Probe() {
      const { language, t, setLanguage } = useLanguage();
      return (
        <div>
          <span data-testid="lang">{language}</span>
          <span data-testid="label">{t.nav.artworks}</span>
          <button type="button" onClick={() => setLanguage('en')}>
            switch
          </button>
        </div>
      );
    }

    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );

    expect(screen.getByTestId('lang').textContent).toBe('fr');
    expect(screen.getByTestId('label').textContent).toBe(translations.fr.nav.artworks);

    act(() => {
      screen.getByRole('button', { name: 'switch' }).click();
    });

    expect(screen.getByTestId('lang').textContent).toBe('en');
    expect(screen.getByTestId('label').textContent).toBe(translations.en.nav.artworks);
  });
});
