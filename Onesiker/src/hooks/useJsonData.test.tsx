import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';
import { clearJsonCache, useJsonData } from './useJsonData';

type FetchMock = ReturnType<typeof vi.fn> & typeof globalThis.fetch;

function Probe<T>({ name }: { name: string }) {
  const data = useJsonData<T>(name);
  return <div data-testid="probe">{data === null ? 'loading' : JSON.stringify(data)}</div>;
}

beforeEach(() => {
  clearJsonCache();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useJsonData', () => {
  it('loads JSON and exposes it', async () => {
    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ hello: 'world' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchSpy as unknown as FetchMock);

    render(<Probe name="greet" />);
    expect(screen.getByTestId('probe').textContent).toBe('loading');

    await waitFor(() => {
      expect(screen.getByTestId('probe').textContent).toBe('{"hello":"world"}');
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0]![0]).toMatch(/\/data\/greet\.json/);
  });

  it('throws an HTTP error so the ErrorBoundary catches it', async () => {
    const fetchSpy = vi.fn().mockResolvedValue(new Response('nope', { status: 500 }));
    vi.stubGlobal('fetch', fetchSpy as unknown as FetchMock);

    render(
      <ErrorBoundary name="test" fallback={<div data-testid="fallback">caught</div>}>
        <Probe name="bad" />
      </ErrorBoundary>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('fallback').textContent).toBe('caught');
    });
  });

  it('serves the cached value on a second mount (no second fetch)', async () => {
    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([1, 2, 3]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchSpy as unknown as FetchMock);

    const first = render(<Probe<number[]> name="cached" />);
    await waitFor(() => {
      expect(first.getByTestId('probe').textContent).toBe('[1,2,3]');
    });
    first.unmount();

    const second = render(<Probe<number[]> name="cached" />);
    // Cache hit on the synchronous initial render.
    expect(second.getByTestId('probe').textContent).toBe('[1,2,3]');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('dedupes concurrent requests for the same key', async () => {
    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchSpy as unknown as FetchMock);

    const { container } = render(
      <>
        <Probe name="shared" />
        <Probe name="shared" />
      </>,
    );

    await waitFor(() => {
      const probes = container.querySelectorAll('[data-testid="probe"]');
      expect(probes[0]?.textContent).toBe('{"ok":true}');
      expect(probes[1]?.textContent).toBe('{"ok":true}');
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('ignores AbortError when a component unmounts mid-flight', async () => {
    let abortReceived = false;
    const fetchSpy = vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          abortReceived = true;
          reject(new DOMException('aborted', 'AbortError'));
        });
      });
    });
    vi.stubGlobal('fetch', fetchSpy as unknown as FetchMock);

    const view = render(<Probe name="slow" />);
    await act(async () => {
      view.unmount();
    });

    expect(abortReceived).toBe(true);
    // No unhandled rejection / no console error triggered by the AbortError path.
  });
});
