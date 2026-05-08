import React, { Suspense, lazy, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SectionDivider from './components/SectionDivider';
import ErrorBoundary from './components/ErrorBoundary';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { useJsonData } from './hooks/useJsonData';

interface Section {
  id: string;
  type: string;
  visible: boolean;
  label?: string;
}

interface Layout {
  sections: Section[];
}

const News = lazy(() => import('./components/News'));
const Shop = lazy(() => import('./components/Shop'));
const Onesiker = lazy(() => import('./components/Onesiker'));
const Artworks = lazy(() => import('./components/Artworks'));
const Contacts = lazy(() => import('./components/Contacts'));
const CustomPage = lazy(() => import('./components/CustomPage'));
const Footer = lazy(() => import('./components/Footer'));
const CookieConsent = lazy(() => import('./components/CookieConsent'));
const ScrollToTop = lazy(() => import('./components/ScrollToTop'));

const Fallback = () => (
  <div className="w-full h-32 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin opacity-50"></div>
  </div>
);

function DynamicMeta() {
  const { language } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'fr'
      ? 'Onesiker - Artiste Contemporain'
      : 'Onesiker - Contemporary Artist';
  }, [language]);
  return null;
}

const componentsMap: Record<string, React.LazyExoticComponent<any>> = {
  news: News,
  shop: Shop,
  bio: Onesiker,
  artworks: Artworks,
  contact: Contacts,
  contacts: Contacts,
  custom: CustomPage,
};

// Reads layout.json + renders sections. Extracted so the surrounding ErrorBoundary
// can catch a layout-load failure without crashing the rest of the app (header,
// hero, footer, overlays still render).
function LayoutSections() {
  const layout = useJsonData<Layout>('layout');
  return (
    <>
      <Header layout={layout} />
      <main id="main">
        <ErrorBoundary name="Hero">
          <Hero />
        </ErrorBoundary>
        <SectionDivider />
        <Suspense fallback={<Fallback />}>
          {layout?.sections?.filter((s) => s.visible).map((section, index) => {
            const resolvedType = section.type === 'native' ? section.id : section.type;
            const Component = componentsMap[resolvedType];
            if (!Component) return null;

            const Cmp = Component as React.ComponentType<{ id?: string }>;
            return (
              <React.Fragment key={section.id || index}>
                <ErrorBoundary name={section.id || resolvedType}>
                  {resolvedType === 'custom' ? <Cmp id={section.id} /> : <Cmp />}
                </ErrorBoundary>
                <SectionDivider />
              </React.Fragment>
            );
          })}
        </Suspense>
      </main>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <DynamicMeta />
      <div className="relative min-h-screen">
        <a href="#main" className="skip-to-content">Aller au contenu</a>
        <ErrorBoundary name="Layout">
          <LayoutSections />
        </ErrorBoundary>
        <ErrorBoundary name="Footer" fallback={null}>
          <Suspense fallback={<Fallback />}>
            <Footer />
          </Suspense>
        </ErrorBoundary>
      </div>
      <ErrorBoundary name="Overlays" fallback={null}>
        <Suspense fallback={null}>
          <CookieConsent />
          <ScrollToTop />
        </Suspense>
      </ErrorBoundary>
    </LanguageProvider>
  );
}
