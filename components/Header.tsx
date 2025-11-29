
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { motion, AnimatePresence, useScroll, useSpring, animate } from 'framer-motion';
import { X, Moon, Sun, ChevronDown } from 'lucide-react';
import { useThemeLanguage, SUPPORTED_LANGUAGES } from '../context/ThemeLanguageContext';
import { useCinematic } from '../context/CinematicContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const { theme, toggleTheme, language, setLanguage, t } = useThemeLanguage();
  const { isCinematic } = useCinematic();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    if (href === '#') {
      animate(window.scrollY, 0, {
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (latest) => window.scrollTo(0, latest)
      });
      setIsMenuOpen(false);
      return;
    }

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      const headerOffset = 0;
      const targetPosition = element.getBoundingClientRect().top + window.scrollY - headerOffset;

      animate(window.scrollY, targetPosition, {
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (latest) => window.scrollTo(0, latest)
      });
    }

    setIsMenuOpen(false);
  };

  let textColorClass = '';
  let navHoverClass = '';
  let separatorClass = '';

  if (isScrolled) {
    textColorClass = 'text-black dark:text-white';
    navHoverClass = 'bg-black dark:bg-white';
    separatorClass = 'border-gray-200 dark:border-gray-700';
  } else {
    if (theme === 'light') {
      textColorClass = 'text-black';
      navHoverClass = 'bg-black';
      separatorClass = 'border-black/10';
    } else {
      textColorClass = 'text-white';
      navHoverClass = 'bg-white';
      separatorClass = 'border-white/20';
    }
  }

  if (isMenuOpen) {
    textColorClass = 'text-black dark:text-white';
  }

  const headerBgClass = isScrolled
    ? 'bg-white/90 dark:bg-eh-black/90 backdrop-blur-md py-4 border-b border-gray-100 dark:border-gray-800'
    : 'bg-transparent py-6';

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <>
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-[100] -translate-y-[150%] focus:translate-y-0 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg transition-transform duration-300 outline-none focus:ring-4 focus:ring-blue-400"
      >
        Skip to content
      </a>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out px-4 md:px-8 lg:px-12 ${headerBgClass} ${isCinematic ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}
      >
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <a href="#" onClick={(e) => handleLinkClick(e, '#')} className={`text-xl md:text-2xl font-bold tracking-tighter uppercase z-50 relative transition-colors duration-300 ${textColorClass}`}>
            Event Horizon
          </a>

          {/* TABLET/DESKTOP MENU: Hidden on mobile AND tablet portrait (< 1024px) */}
          <div className="hidden lg:flex items-center gap-10">
            <nav className="flex gap-10">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-sm font-medium uppercase tracking-widest hover:opacity-50 transition-opacity relative group ${textColorClass}`}
                >
                  {t(link.key)}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${navHoverClass}`}></span>
                </a>
              ))}

              {/* Simulation Link */}
              <Link
                to="/simulation"
                className={`text-sm font-medium uppercase tracking-widest hover:opacity-50 transition-opacity relative group ${textColorClass}`}
              >
                Simulation
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${navHoverClass}`}></span>
              </Link>
            </nav>

            <div className={`flex items-center gap-4 border-l pl-6 transition-colors duration-300 ${separatorClass}`}>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${textColorClass} hover:bg-black/5 dark:hover:bg-white/10`}
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <div className="relative" ref={langMenuRef}>
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className={`p-2 pl-3 pr-3 rounded-full font-bold text-xs uppercase tracking-widest transition-colors ${textColorClass} hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2`}
                  aria-label="Select Language"
                >
                  <span className="text-base leading-none">{currentLangObj.flag}</span>
                  <span>{currentLangObj.code}</span>
                  <ChevronDown size={12} className={`transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isLangMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-4 w-[400px] max-h-[60vh] overflow-y-auto bg-white dark:bg-eh-gray shadow-2xl rounded-2xl border border-gray-100 dark:border-white/10 p-4 grid grid-cols-2 gap-2 z-[60] custom-scrollbar"
                    >
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left ${language === lang.code
                            ? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
                            : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200'
                            }`}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold uppercase tracking-wider">{lang.name}</span>
                            {language === lang.code && <span className="text-[9px] opacity-70 font-mono uppercase">Active</span>}
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* MOBILE/TABLET MENU TRIGGER - Visible below 1024px */}
          <button
            className="lg:hidden w-12 h-12 flex flex-col justify-center items-end gap-1.5 cursor-pointer z-50 p-2 bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg active:scale-95 transition-transform"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? t('common_close') : t('common_menu')}
            aria-expanded={isMenuOpen}
            type="button"
          >
            {isMenuOpen ? (
              <X size={32} className={`${textColorClass}`} />
            ) : (
              <>
                <span className={`w-8 h-0.5 bg-current transition-colors ${textColorClass}`}></span>
                <span className={`w-5 h-0.5 bg-current group-hover:w-8 transition-all ${textColorClass}`}></span>
              </>
            )}
          </button>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-400 origin-left"
          style={{ scaleX }}
        />
      </header>

      {/* Fullscreen Menu (Mobile & Tablet) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100dvh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-0 left-0 w-full z-40 bg-white dark:bg-eh-black flex flex-col lg:hidden overflow-hidden"
          >
            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto flex flex-col px-6 pt-28 pb-10 scrollbar-hide items-center justify-center md:justify-start">
              <nav className="flex flex-col gap-6 md:gap-8 items-center mb-auto md:mt-20">
                {NAV_LINKS.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tighter hover:text-gray-500 transition-colors text-black dark:text-white"
                  >
                    {t(link.key)}
                  </motion.a>
                ))}

                {/* Mobile Simulation Link */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + NAV_LINKS.length * 0.1 }}
                >
                  <Link
                    to="/simulation"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tighter hover:text-gray-500 transition-colors text-black dark:text-white"
                  >
                    Simulation
                  </Link>
                </motion.div>
              </nav>

              {/* Mobile Controls */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center gap-8 mt-8 w-full"
              >
                {/* Theme Toggle - Large Touch Target */}
                <button
                  onClick={toggleTheme}
                  className="w-full max-w-xs md:max-w-sm p-4 rounded-xl bg-gray-100 dark:bg-white/10 text-black dark:text-white flex items-center justify-center gap-3 font-bold uppercase text-sm tracking-widest transition-all active:scale-95"
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                  <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>

                {/* Language Grid */}
                <div className="w-full max-w-xs md:max-w-sm">
                  <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Language</p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 md:gap-4">
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl aspect-square transition-all active:scale-95 ${language === lang.code
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg ring-2 ring-offset-2 ring-black dark:ring-white scale-105'
                          : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                          }`}
                      >
                        <span className="text-2xl leading-none mb-1">{lang.flag}</span>
                        <span className="text-[10px] font-bold uppercase">{lang.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
              >
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  © 2026 Event Horizon
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
