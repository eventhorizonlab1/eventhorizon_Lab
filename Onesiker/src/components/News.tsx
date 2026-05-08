import React, { useRef, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useJsonData } from '../hooks/useJsonData';

const renderTextWithLinks = (text: string) => {
  const parts = text.split(/(@[\w_]+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('@')) {
      const handle = part.substring(1);
      return (
        <a 
          key={i} 
          href={`https://instagram.com/${handle}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-black font-medium hover:text-gray-500 transition-colors"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const Carousel = ({ images, title }: { images: string[], title: string }) => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <img 
        src={images[index]} 
        alt={`${title} - image ${index + 1}`} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        referrerPolicy="no-referrer"
        loading="lazy"
      />
    </div>
  );
};

export default function News() {
  const { t, language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mouse drag/swipe for desktop
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartLeft = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    scrollStartLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
    scrollRef.current.style.userSelect = 'none';
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const dx = e.clientX - dragStartX.current;
    scrollRef.current.scrollLeft = scrollStartLeft.current - dx;
  }, []);

  const onMouseUp = useCallback(() => {
    if (!scrollRef.current) return;
    isDragging.current = false;
    scrollRef.current.style.cursor = 'grab';
    scrollRef.current.style.userSelect = '';
  }, []);

  const rawNews = useJsonData<any[]>('news');

  const newsItems = useMemo(
    () =>
      (rawNews ?? [])
        .filter((item: any) => item.visible !== false)
        .map((item: any) => ({
          ...item,
          title: language === 'fr' ? item.title_fr : item.title_en,
          date: language === 'fr' ? item.date_fr : item.date_en,
          excerpt: language === 'fr' ? item.excerpt_fr : item.excerpt_en,
          images: item.images,
          image: null,
        })),
    [rawNews, language],
  );

  return (
    <section id="news" className="py-16 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-24 flex flex-col md:flex-row md:items-end justify-between"
        >
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tighter mb-2 md:mb-4">{t.news.title}</h2>
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <p className="text-gray-500 uppercase tracking-widest text-xs sm:text-sm">{t.news.subtitle}</p>
              <div className="flex items-center text-white bg-black md:hidden animate-pulse px-3 py-1.5 rounded-full shadow-sm ml-auto sm:ml-4">
                <span className="text-[10px] font-bold uppercase tracking-widest mr-2">Swipe</span>
                <ArrowRight size={14} className="stroke-[3]" />
              </div>
            </div>
          </div>
          {/* Link reserved for future dedicated news page */}
        </motion.div>

        <div
          ref={scrollRef}
          className="flex flex-row overflow-x-auto snap-x snap-mandatory no-scrollbar gap-6 md:gap-12 pb-8 md:cursor-grab"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {newsItems.map((item, index) => (
            <motion.article 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group cursor-pointer w-[85%] sm:w-[60%] flex-shrink-0 snap-center md:w-[calc(33.333%_-_2rem)] md:snap-start"
            >
              <div className="overflow-hidden mb-6 aspect-[4/3]">
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    {item.images ? (
                      <Carousel images={item.images} title={item.title} />
                    ) : (
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    )}
                  </a>
                ) : (
                  <>
                    {item.images ? (
                      <Carousel images={item.images} title={item.title} />
                    ) : (
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    )}
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 md:mb-3">{item.date}</p>
              {item.link ? (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-80 transition-opacity">
                  <h3 className="text-xl md:text-2xl font-display font-semibold mb-2 md:mb-3 group-hover:text-gray-600 transition-colors">{item.title}</h3>
                </a>
              ) : (
                <h3 className="text-xl md:text-2xl font-display font-semibold mb-2 md:mb-3 group-hover:text-gray-600 transition-colors">{item.title}</h3>
              )}
              <p className="text-gray-600 font-light leading-relaxed text-sm md:text-base">{renderTextWithLinks(item.excerpt)}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
