import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeLanguageProvider } from './context/ThemeLanguageContext';
import { CinematicProvider } from './context/CinematicContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

import posthog from 'posthog-js';

// Initialize PostHog
// In production, these should be environment variables
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || 'phc_PLACEHOLDER_KEY';
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

if (typeof window !== 'undefined' && POSTHOG_KEY !== 'phc_PLACEHOLDER_KEY') {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
  });
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeLanguageProvider>
      <CinematicProvider>
        <App />
      </CinematicProvider>
    </ThemeLanguageProvider>
  </React.StrictMode>
);