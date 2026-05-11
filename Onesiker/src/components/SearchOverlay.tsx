import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X } from 'lucide-react';
import Fuse from 'fuse.js';
import { useLanguage } from '../context/LanguageContext';
import { useJsonData } from '../hooks/useJsonData';

type SearchItem = {
  id: string;
  section: 'news' | 'artworks' | 'bio' | 'custom';
  sectionLabel: string;
  anchor: string;
  title: string;
  snippet: string;
  haystack: string;
};

export default function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const news = useJsonData<any[]>('news') ?? [];
  const artworks = useJsonData<any[]>('artworks') ?? [];
  const bio = useJsonData<any>('bio');
  const customPages = useJsonData<Record<string, any>>('custom_pages') ?? {};
  const layout = useJsonData<any>('layout');

  // Localized section labels are looked up from layout.sections when possible
  // (so custom pages picked their own French/English title), with sensible defaults.
  const sectionLabel = (section: SearchItem['section'], customId?: string): string => {
    if (section === 'custom' && customId && layout?.sections) {
      const sec = layout.sections.find((s: any) => s.id === customId);
      if (sec?.title?.[language]) return sec.title[language];
    }
    const labels: Record<SearchItem['section'], { fr: string; en: string }> = {
      news: { fr: 'Actualités', en: 'News' },
      artworks: { fr: 'Atelier', en: 'Artworks' },
      bio: { fr: 'Onesiker', en: 'Onesiker' },
      custom: { fr: 'Page', en: 'Page' },
    };
    return labels[section][language];
  };

  const items = useMemo<SearchItem[]>(() => {
    const out: SearchItem[] = [];

    // News — one item per article, search FR+EN.
    news.forEach((n) => {
      if (!n || n.visible === false) return;
      const title = (language === 'fr' ? n.title_fr : n.title_en) || n.title_fr || n.title_en || '';
      const snippet = (language === 'fr' ? n.excerpt_fr : n.excerpt_en) || n.excerpt_fr || n.excerpt_en || '';
      out.push({
        id: `news-${n.id}`,
        section: 'news',
        sectionLabel: sectionLabel('news'),
        anchor: '#news',
        title,
        snippet,
        haystack: [n.title_fr, n.title_en, n.excerpt_fr, n.excerpt_en].filter(Boolean).join(' '),
      });
    });

    // Artworks — one item per category (name); image titles get folded into the haystack so the category surfaces on a deep-image match.
    artworks.forEach((cat) => {
      if (!cat || !cat.name) return;
      const imageTitles = (cat.images || []).map((img: any) => img?.title || '').filter(Boolean);
      out.push({
        id: `artworks-${cat.id}`,
        section: 'artworks',
        sectionLabel: sectionLabel('artworks'),
        anchor: '#artworks',
        title: cat.name,
        snippet: imageTitles.slice(0, 3).join(' · '),
        haystack: [cat.name, ...imageTitles].join(' '),
      });
    });

    // Bio — one item per language block (FR+EN merged into haystack).
    if (bio && (bio.fr || bio.en)) {
      const fr = bio.fr || {};
      const en = bio.en || {};
      const display = language === 'fr' ? fr : en;
      const paragraphs = [
        ...(fr.paragraphs || []),
        ...(en.paragraphs || []),
      ];
      out.push({
        id: 'bio',
        section: 'bio',
        sectionLabel: sectionLabel('bio'),
        anchor: '#bio',
        title: display.title || fr.title || en.title || 'Onesiker',
        snippet: (display.subtitle || display.baseline || (display.paragraphs || [])[0] || '').slice(0, 160),
        haystack: [fr.title, fr.subtitle, fr.baseline, en.title, en.subtitle, en.baseline, ...paragraphs].filter(Boolean).join(' '),
      });
    }

    // Custom pages — one item per page.
    Object.entries(customPages).forEach(([id, page]) => {
      if (!page) return;
      const title = (language === 'fr' ? page.title_fr : page.title_en) || page.title_fr || page.title_en || '';
      const content = (language === 'fr' ? page.content_fr : page.content_en) || page.content_fr || page.content_en || '';
      out.push({
        id: `custom-${id}`,
        section: 'custom',
        sectionLabel: sectionLabel('custom', id),
        anchor: `#${id}`,
        title,
        snippet: content.slice(0, 160),
        haystack: [page.title_fr, page.title_en, page.content_fr, page.content_en].filter(Boolean).join(' '),
      });
    });

    return out;
  }, [news, artworks, bio, customPages, layout, language]);

  // Fuse is light enough (~12 KB minified) to rebuild on every items change.
  const fuse = useMemo(() => new Fuse(items, {
    keys: ['haystack', 'title'],
    threshold: 0.4,
    ignoreLocation: true,
    minMatchCharLength: 2,
  }), [items]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).slice(0, 20).map((r) => r.item);
  }, [fuse, query]);

  const grouped = useMemo(() => {
    const g: Record<string, SearchItem[]> = {};
    results.forEach((r) => {
      (g[r.section] ??= []).push(r);
    });
    return g;
  }, [results]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Reset the query each time the user closes so the next open is fresh.
  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  const handleResultClick = (anchor: string) => {
    onClose();
    // Defer the scroll so the overlay's exit animation can release body overflow first.
    setTimeout(() => {
      const el = document.querySelector(anchor);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.location.hash = anchor;
    }, 80);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={t.search.title}
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <Search size={20} className="text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.search.placeholder}
                className="flex-1 bg-transparent outline-none text-base text-gray-900 placeholder:text-gray-400"
                aria-label={t.search.placeholder}
              />
              <button
                type="button"
                onClick={onClose}
                aria-label={t.search.close}
                className="text-gray-400 hover:text-gray-700 shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {!query.trim() ? (
                <p className="px-5 py-8 text-center text-sm text-gray-400">{t.search.hint}</p>
              ) : results.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-gray-400">{t.search.noResults}</p>
              ) : (
                <ul className="py-2">
                  {Object.entries(grouped).map(([section, group]) => (
                    <li key={section} className="px-2 pb-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 pt-3 pb-1">
                        {group[0]?.sectionLabel}
                      </p>
                      <ul>
                        {group.map((item) => (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => handleResultClick(item.anchor)}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                              <p className="text-sm font-medium text-gray-900 truncate">{item.title || '—'}</p>
                              {item.snippet && (
                                <p className="text-xs text-gray-500 truncate mt-0.5">{item.snippet}</p>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
