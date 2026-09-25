import { defineConfig } from '@playwright/test';
import base from './playwright.config.mjs';
export default defineConfig({ ...base, testIgnore: [], testMatch: '**/firebase.spec.mjs', webServer: { ...base.webServer, env: { VITE_FIREBASE_API_KEY: 'demo-key', VITE_FIREBASE_PROJECT_ID: 'demo-quan-huong', VITE_FIREBASE_APP_ID: 'demo-app', VITE_FIREBASE_EMULATOR_HOST: '127.0.0.1', VITE_FIREBASE_EMULATOR_PORT: '8080' } } });
