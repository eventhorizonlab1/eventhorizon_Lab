import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeLanguageProvider } from './context/ThemeLanguageContext';
import { CinematicProvider } from './context/CinematicContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
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