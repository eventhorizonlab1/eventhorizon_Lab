import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

function Bomb({ trigger = true }: { trigger?: boolean }) {
  if (trigger) throw new Error('boom');
  return <div data-testid="ok">ok</div>;
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ErrorBoundary', () => {
  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">hello</div>
      </ErrorBoundary>,
    );
    expect(screen.getByTestId('child').textContent).toBe('hello');
  });

  it('renders the custom fallback when a child throws', () => {
    render(
      <ErrorBoundary fallback={<div data-testid="fallback">caught</div>}>
        <Bomb />
      </ErrorBoundary>,
    );
    expect(screen.getByTestId('fallback').textContent).toBe('caught');
  });

  it('renders the French default fallback when document.lang starts with "fr"', () => {
    document.documentElement.lang = 'fr-FR';
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toMatch(/n'a pas pu être chargée/);
  });

  it('renders the English default fallback when document.lang is "en"', () => {
    document.documentElement.lang = 'en';
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toMatch(/could not be loaded/);
  });

  it('logs the error with the boundary name tag', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary name="news" fallback={<div>x</div>}>
        <Bomb />
      </ErrorBoundary>,
    );
    const taggedCall = errorSpy.mock.calls.find((call) => call[0] === '[news]');
    expect(taggedCall).toBeDefined();
  });
});
