import React, { useState, useEffect, useRef } from 'react';
import { NAV_LINKS } from '../constants';
import { motion, AnimatePresence, useScroll, useSpring, animate } from 'framer-motion';
import { X, Moon, Sun, Languages, ChevronDown } from 'lucide-react';
import { useThemeLanguage, SUPPORTED_LANGUAGES } from '../context/ThemeLanguageContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const { theme, toggleTheme, language, setLanguage, t } = useThemeLanguage();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setIsLangMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close lang menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      // Calculate target position
      const headerOffset = 0; 
      const targetPosition = element.getBoundingClientRect().top + window.scrollY - headerOffset;

      animate(window.scrollY, targetPosition, {
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1], // Custom cubic bezier for smooth, premium slide effect
        onUpdate: (latest) => window.scrollTo(0, latest)
      });
    }
    
    setIsMenuOpen(false);
  };

  // Logic: White text at top (dark hero), Black text when scrolled (white bg) OR when in dark mode (dark bg)
  let textColorClass = 'text-white';
  let navHoverClass = 'bg-white';
  
  if (isScrolled) {
    // Scrolled down
    textColorClass = 'text-black dark:text-white';
    navHoverClass = 'bg-black dark:bg-white';
  } else {
    // At top (Hero)
    textColorClass = 'text-white';
    navHoverClass = 'bg-white';
  }

  // Override if menu is open (Mobile)
  if (isMenuOpen) {
    textColorClass = 'text-black'; 
  }

  const headerBgClass = isScrolled 
    ? 'bg-white/90 dark:bg-eh-black/90 backdrop-blur-md py-4 border-b border-gray-100 dark:border-gray-800' 
    : 'bg-transparent py-6';

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out px-6 md:px-12 ${headerBgClass}`}
      >
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <a href="#" onClick={(e) => handleLinkClick(e, '#')} className={`text-xl md:text-2xl font-bold tracking-tighter uppercase z-50 relative transition-colors duration-300 ${textColorClass}`}>
            Event Horizon
          </a>

          {/* Desktop Nav & Controls */}
          <div className="hidden md:flex items-center gap-10">
            <nav className="flex gap-10">
              {NAV_LINKS.map((link) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-sm font-medium uppercase tracking-widest hover:opacity-50 transition-opacity relative group ${textColorClass}`}
                >
                  {link.label === 'Vidéos' ? t('nav_videos') : 
                   link.label === 'Articles' ? t('nav_articles') :
                   link.label === 'Écosystème' ? t('nav_ecosystem') :
                   t('nav_studio')}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${navHoverClass}`}></span>
                </a>
              ))}
            </nav>

            {/* Toggles */}
            <div className={`flex items-center gap-4 border-l pl-6 ${isScrolled ? 'border-gray-200 dark:border-gray-700' : 'border-white/20'}`}>
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${textColorClass} hover:bg-white/10`}
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              
              {/* Language Dropdown Trigger */}
              <div className="relative" ref={langMenuRef}>
                <button 
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className={`p-2 pl-3 pr-3 rounded-full font-bold text-xs uppercase tracking-widest transition-colors ${textColorClass} hover:bg-white/10 flex items-center gap-2`}
                  aria-label="Select Language"
                >
                   <span className="text-base leading-none">{currentLangObj.flag}</span>
                   <span>{currentLangObj.code}</span>
                   <ChevronDown size={12} className={`transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Language Dropdown Menu */}
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
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                            language === lang.code 
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

          {/* Mobile Menu Trigger */}
          <div 
            className="md:hidden w-10 h-10 flex flex-col justify-center items-end gap-1.5 cursor-pointer z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
               <X size={32} className="text-black" />
            ) : (
              <>
                <span className={`w-8 h-0.5 bg-current transition-colors ${textColorClass}`}></span>
                <span className={`w-5 h-0.5 bg-current group-hover:w-8 transition-all ${textColorClass}`}></span>
              </>
            )}
          </div>
        </div>

        {/* Scroll Progress Indicator */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-400 origin-left"
          style={{ scaleX }}
        />
      </header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-white flex flex-col justify-center items-center md:hidden overflow-y-auto"
          >
            <nav className="flex flex-col gap-8 text-center mb-12 mt-20">
              {NAV_LINKS.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-3xl font-bold uppercase tracking-tighter hover:text-gray-500 transition-colors text-black"
                >
                  {link.label === 'Vidéos' ? t('nav_videos') : 
                   link.label === 'Articles' ? t('nav_articles') :
                   link.label === 'Écosystème' ? t('nav_ecosystem') :
                   t('nav_studio')}
                </motion.a>
              ))}
            </nav>
            
            {/* Mobile Controls */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center gap-6 w-full px-8"
            >
               <div className="flex gap-4">
                 <button onClick={toggleTheme} className="p-4 rounded-full bg-gray-100 text-black flex items-center gap-2 font-bold uppercase text-xs tracking-widest">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                 </button>
               </div>

               {/* Mobile Language Grid */}
               <div className="w-full max-w-sm bg-gray-50 rounded-2xl p-4 grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <button 
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`flex flex-col items-center p-2 rounded-lg transition-colors ${language === lang.code ? 'bg-black text-white shadow-lg' : 'hover:bg-gray-200 text-gray-600'}`}
                    >
                      <span className="text-xl mb-1">{lang.flag}</span>
                      <span className="text-[10px] font-bold uppercase">{lang.code}</span>
                    </button>
                  ))}
               </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 pb-8 text-xs font-bold text-gray-400 uppercase tracking-widest"
            >
              © 2023 Event Horizon
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;