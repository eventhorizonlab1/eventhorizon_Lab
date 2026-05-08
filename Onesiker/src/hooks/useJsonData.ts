import { useEffect, useState } from 'react';

// In-memory cache shared across all consumers — when Contacts and Footer both ask for
// contact.json, the second call returns the cached payload instead of refetching.
const dataCache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

// Cache-busting strategy:
// - In dev: timestamp per page-load so editing public/data/*.json reflects on reload.
// - In prod: VITE_BUILD_ID injected by vite.config.ts (one ID per build) — bytes are
//   identical between page-loads of the same build, so the browser HTTP cache works
//   for free instead of being bypassed every refresh.
const BUILD_ID = import.meta.env['VITE_BUILD_ID'] ?? '';
const isDev = import.meta.env.DEV;

function cacheBuster(): string {
  return isDev ? `t=${Date.now()}` : `v=${BUILD_ID}`;
}

export function clearJsonCache(name?: string): void {
  if (name) {
    dataCache.delete(name);
    inflight.delete(name);
  } else {
    dataCache.clear();
    inflight.clear();
  }
}

async function fetchJson<T>(name: string, signal: AbortSignal): Promise<T> {
  const res = await fetch(`/data/${name}.json?${cacheBuster()}`, { signal });
  if (!res.ok) throw new Error(`/data/${name}.json HTTP ${res.status}`);
  // SPA hosts often return index.html (HTTP 200) for missing static files.
  // Detect that here so we throw a clear error instead of letting JSON.parse
  // explode with an opaque "did not match the expected pattern" on Safari.
  const ct = res.headers.get('content-type') ?? '';
  if (!ct.includes('json')) {
    throw new Error(`/data/${name}.json returned non-JSON content-type "${ct}" — file likely missing on the server.`);
  }
  return (await res.json()) as T;
}

export function useJsonData<T>(name: string): T | null {
  const [data, setData] = useState<T | null>(() => (dataCache.get(name) as T) ?? null);
  const [error, setError] = useState<Error | null>(null);

  // Re-throw inside render so the nearest ErrorBoundary catches the failure
  // — keeps the JSON-load failure path consistent with section-render failures.
  if (error) throw error;

  useEffect(() => {
    let cancelled = false;

    const cached = dataCache.get(name) as T | undefined;
    if (cached !== undefined) {
      setData(cached);
      return;
    }

    const controller = new AbortController();
    let promise = inflight.get(name) as Promise<T> | undefined;

    if (!promise) {
      promise = fetchJson<T>(name, controller.signal).then((d) => {
        dataCache.set(name, d);
        inflight.delete(name);
        return d;
      });
      inflight.set(name, promise as Promise<unknown>);
    }

    promise
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err : new Error(String(err)));
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [name]);

  return data;
}
