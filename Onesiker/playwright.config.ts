import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // The site preloads several fonts and large hero images. Waiting on the
    // full `load` event makes navigation flaky when network is slow / parallel.
    // `domcontentloaded` is enough — assertions wait for visibility anyway.
    navigationTimeout: 20_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // `vite preview` serves dist/ at port 4173. Run `npm run build` manually first
    // (or in CI) — the e2e suite assumes a fresh dist/ exists. We don't rebuild here
    // because the prebuild FTP sync is environment-dependent.
    command: `npx vite preview --port=${PORT} --strictPort --host 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env['CI'],
    timeout: 60_000,
  },
});
