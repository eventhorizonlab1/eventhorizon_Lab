import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

function loadGTM() {
  if (document.querySelector('script[src*="googletagmanager"]')) return;
  
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-KRCSSZMW';
  document.head.appendChild(script);
}

export default function CookieConsent() {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent === 'accepted') {
      loadGTM();
    } else if (!consent) {
      // Show banner after a short delay for smoother UX
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
    loadGTM();
  };

  const handleRefuse = () => {
    localStorage.setItem('cookie-consent', 'refused');
    setVisible(false);
  };

  const isEn = language === 'en';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-white border border-black/10 rounded-2xl shadow-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 font-light leading-relaxed">
                {isEn
                  ? 'This site uses cookies via Google Tag Manager to analyze traffic and improve your experience. No personal data is shared with third parties.'
                  : 'Ce site utilise des cookies via Google Tag Manager pour analyser le trafic et améliorer votre expérience. Aucune donnée personnelle n\'est partagée avec des tiers.'}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={handleRefuse}
                className="flex-1 md:flex-none text-sm font-medium uppercase tracking-widest px-5 py-2.5 border border-black/20 rounded-full text-gray-600 hover:text-black hover:border-black transition-colors"
              >
                {isEn ? 'Refuse' : 'Refuser'}
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 md:flex-none text-sm font-medium uppercase tracking-widest px-5 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                {isEn ? 'Accept' : 'Accepter'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
