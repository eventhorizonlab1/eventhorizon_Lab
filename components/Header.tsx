import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Volume2, VolumeX } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { useCinematic } from '../context/CinematicContext';
import { useCinematicAudio } from '../src/hooks/useCinematicAudio';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, language, setLanguage, t } = useThemeLanguage();
  const { isMuted, toggleMute } = useCinematic();
  const { playClick, playHover } = useCinematicAudio();

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 50], [0, 1]);
  const headerY = useTransform(scrollY, [0, 50], [-20, 0]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reusable Audio Toggle Component
  const AudioToggle = () => (
    <button
      onClick={() => { toggleMute(); playClick(); }}
      onMouseEnter={playHover}
      className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative group"
      aria-label={isMuted ? "Activer le son" : "Couper le son"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isMuted ? (
          <motion.div
            key="muted"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <VolumeX size={20} className="text-gray-500" />
          </motion.div>
        ) : (
          <motion.div
            key="active"
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Volume2 size={20} className="text-black dark:text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );

  return (
    <>
      <motion.header
        style={{
          backgroundColor: isScrolled
            ? (theme === 'dark' ? 'rgba(10, 10, 10, 0.8)' : 'rgba(255, 255, 255, 0.8)')
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          borderBottom: isScrolled
            ? (theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)')
            : '1px solid transparent'
        }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 md:py-6"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* LOGO */}
          <div className="flex items-center gap-2 z-50 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white dark:bg-black rounded-full animate-pulse"></div>
            </div>
            <span className="text-lg font-bold tracking-widest uppercase text-black dark:text-white mix-blend-difference">
              Event Horizon
            </span>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
            {['videos', 'articles', 'ecosystem'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="text-sm font-medium uppercase tracking-widest text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors relative group"
                onMouseEnter={playHover}
                onClick={playClick}
              >
                {t(`nav_${item}`)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="hidden md:flex items-center gap-4">
            {/* Audio Toggle */}
            <AudioToggle />

            {/* Language Switch */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                <Globe size={14} />
                <span>{language}</span>
              </button>
              <div className="absolute top-full right-0 mt-2 w-24 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-black/5 dark:border-white/10 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0">
                {['fr', 'en', 'de', 'es', 'it'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setLanguage(lang as any); playClick(); }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold uppercase hover:bg-black/5 dark:hover:bg-white/10 ${language === lang ? 'text-blue-500' : 'text-black dark:text-white'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => { toggleTheme(); playClick(); }}
              className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="Toggle Theme"
            >
              <div className={`w-4 h-4 rounded-full transition-colors ${theme === 'dark' ? 'bg-white shadow-[0_0_10px_white]' : 'bg-black'}`}></div>
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden z-50 text-black dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white dark:bg-black pt-24 px-6 md:hidden flex flex-col gap-8"
          >
            <nav className="flex flex-col gap-6">
              {['videos', 'articles', 'ecosystem'].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-black uppercase tracking-tighter text-black dark:text-white"
                >
                  {t(`nav_${item}`)}
                </a>
              ))}
            </nav>

            <div className="h-px w-full bg-black/10 dark:bg-white/10"></div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-bold uppercase text-gray-500">Audio</span>
              <AudioToggle />
            </div>

            <div className="flex gap-4">
              {['fr', 'en'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang as any)}
                  className={`px-4 py-2 rounded border ${language === lang ? 'bg-black text-white dark:bg-white dark:text-black' : 'border-black/20 dark:border-white/20'}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
