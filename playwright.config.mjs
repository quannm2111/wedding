import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  testIgnore: '**/firebase.spec.mjs',
  workers: 1,
  fullyParallel: false,
  use: { baseURL: 'http://127.0.0.1:4173', browserName: 'chromium', channel: 'msedge', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: { command: 'npm run dev -- --host 127.0.0.1 --port 4173 --strictPort', url: 'http://127.0.0.1:4173', reuseExistingServer: false, env: { VITE_FIREBASE_API_KEY: '', VITE_FIREBASE_PROJECT_ID: '', VITE_FIREBASE_APP_ID: '' } },
});
