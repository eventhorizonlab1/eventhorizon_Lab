import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type NavLink = { name: string; href: string };

export default function Header({ layout }: { layout?: any }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks: NavLink[] = layout?.sections
    ?.filter((s: any) => s.visible)
    .map((s: any) => ({
      name: s.title && s.title[language] ? s.title[language] : (s.id.charAt(0).toUpperCase() + s.id.slice(1)),
      href: `#${s.id}`
    })) || [
    { name: t.nav.news, href: '#news' },
    { name: t.nav.shop, href: '#shop' },
    { name: 'Onesiker', href: '#bio' },
    { name: t.nav.artworks, href: '#artworks' },
    { name: t.nav.contact, href: '#contacts' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="/" className="flex items-center" aria-label="Onesiker - retour à l'accueil">
          <img
            src="/TAG_ONESIKER.png?v=2"
            alt="Onesiker"
            width={1181}
            height={590}
            className="h-20 md:h-24 w-auto"
            referrerPolicy="no-referrer"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium uppercase tracking-widest transition-colors text-gray-800 hover:text-gray-500"
            >
              {link.name}
            </a>
          ))}
          <div className="flex items-center space-x-2 border-l border-gray-300 pl-6 ml-2">
            <button 
              type="button"
              onClick={() => setLanguage('fr')} 
              className={`text-xs font-medium uppercase tracking-widest transition-colors ${language === 'fr' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
              aria-label="Passer en français"
            >
              FR
            </button>
            <span className="text-gray-300 text-xs" aria-hidden="true">/</span>
            <button 
              type="button"
              onClick={() => setLanguage('en')} 
              className={`text-xs font-medium uppercase tracking-widest transition-colors ${language === 'en' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
              aria-label="Switch to English"
            >
              EN
            </button>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="md:hidden text-black"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-6 flex flex-col space-y-4 md:hidden"
          >
            {navLinks.map((link) => {
              const isShop = link.name === t.nav.shop;
              const mobileHref = isShop ? 'https://onesiker.sumupstore.com' : link.href;
              const mobileTarget = isShop ? '_blank' : undefined;
              const mobileRel = isShop ? 'noopener noreferrer' : undefined;
              return (
                <a
                  key={link.name}
                  href={mobileHref}
                  target={mobileTarget}
                  rel={mobileRel}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium uppercase tracking-widest text-gray-800"
                >
                  {link.name}
                </a>
              );
            })}
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-100 mt-2">
              <button 
                type="button"
                onClick={() => { setLanguage('fr'); setIsMobileMenuOpen(false); }} 
                className={`text-sm font-medium uppercase tracking-widest transition-colors ${language === 'fr' ? 'text-black' : 'text-gray-400'}`}
                aria-label="Passer en français"
              >
                FR
              </button>
              <span className="text-gray-300 text-sm" aria-hidden="true">/</span>
              <button 
                type="button"
                onClick={() => { setLanguage('en'); setIsMobileMenuOpen(false); }} 
                className={`text-sm font-medium uppercase tracking-widest transition-colors ${language === 'en' ? 'text-black' : 'text-gray-400'}`}
                aria-label="Switch to English"
              >
                EN
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
