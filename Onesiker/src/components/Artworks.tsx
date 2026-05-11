import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useJsonData } from '../hooks/useJsonData';
import { ChevronLeft, ChevronRight, ZoomIn, X, Download } from 'lucide-react';

import { type ArtworkImage, type ArtworkData } from '../data/artworks';
import { getAlt } from '../lib/imageAlt';

interface ProcessedArtwork {
  id: number;
  title: string;
  category: string;
  images: ArtworkImage[];
}

const ArtworkCard = React.memo(function ArtworkCard({
  art,
  index,
  activeCarouselId,
  setActiveCarouselId
}: {
  art: ProcessedArtwork,
  index: number,
  activeCarouselId: number | null,
  setActiveCarouselId: (id: number) => void
}) {
  const { t, language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const isCarousel = art.images && art.images.length > 1;

  // Data-driven: title and src come directly from the data
  const currentImage = isCarousel ? art.images[currentImageIndex] : art.images[0];
  const displayImage = currentImage?.src;
  const displayTitle = currentImage?.title || art.title;
  const altText = currentImage
    ? getAlt(currentImage, language, displayTitle || art.category)
    : (displayTitle || art.category);

  React.useEffect(() => {
    if (activeCarouselId !== null && activeCarouselId !== art.id && isCarousel) {
      setCurrentImageIndex(0);
    }
  }, [activeCarouselId, art.id, isCarousel]);

  React.useEffect(() => {
    if (currentImageIndex === 0 || isZoomed) return;

    const timer = setTimeout(() => {
      setCurrentImageIndex(0);
    }, 10000);

    return () => clearTimeout(timer);
  }, [currentImageIndex, lastInteraction, isZoomed]);

  React.useEffect(() => {
    if (isZoomed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isZoomed]);

  // Deep-link from the search overlay. SearchOverlay dispatches `atelier-zoom`
  // with { catId, imgIndex } once it has scrolled the matching tile into view.
  // setActiveCarouselId fires before setCurrentImageIndex so the existing
  // "reset to 0 when another carousel becomes active" effect (lines 42-46)
  // doesn't clobber the index we just set.
  React.useEffect(() => {
    const onZoomRequest = (e: Event) => {
      const detail = (e as CustomEvent<{ catId: number; imgIndex: number }>).detail;
      if (!detail || detail.catId !== art.id) return;
      const safeIndex = Math.max(0, Math.min(detail.imgIndex, art.images.length - 1));
      setActiveCarouselId(art.id);
      setCurrentImageIndex(safeIndex);
      setIsZoomed(true);
    };
    window.addEventListener('atelier-zoom', onZoomRequest);
    return () => window.removeEventListener('atelier-zoom', onZoomRequest);
  }, [art.id, art.images.length, setActiveCarouselId]);

  const handleCarouselInteraction = () => {
    setLastInteraction(Date.now());
    if (activeCarouselId !== art.id) {
      setActiveCarouselId(art.id);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleCarouselInteraction();
    setCurrentImageIndex((prev) => (prev + 1) % art.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleCarouselInteraction();
    setCurrentImageIndex((prev) => (prev === 0 ? art.images.length - 1 : prev - 1));
  };

  const goToImage = (e: React.MouseEvent, i: number) => {
    e.preventDefault();
    e.stopPropagation();
    handleCarouselInteraction();
    setCurrentImageIndex(i);
  };

  // Touch swipe support (double tap is natively handled by onDoubleClick with touchAction)
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isCarousel || touchStartX.current === null || touchStartY.current === null) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    
    // Only trigger if horizontal swipe is dominant and exceeds threshold
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      handleCarouselInteraction();
      if (deltaX < 0) {
        setCurrentImageIndex((prev) => (prev + 1) % art.images.length);
      } else {
        setCurrentImageIndex((prev) => (prev === 0 ? art.images.length - 1 : prev - 1));
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <>
      <motion.div
        id={`atelier-cat-${art.id}`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group flex flex-col scroll-mt-24"
      >
        <div 
          className="relative overflow-hidden bg-gray-100 w-full cursor-default md:cursor-pointer" 
          style={{ aspectRatio: '3/4', touchAction: 'manipulation' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsZoomed(true);
            handleCarouselInteraction();
          }}
        >
          <img
            src={displayImage}
            alt={altText}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${currentImageIndex === 0 ? 'scale-[1.30]' : 'scale-[1.10]'}`}
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          
          {/* Cover Overlay */}
          {currentImageIndex === 0 && isCarousel && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <h3 className="text-white text-3xl md:text-4xl font-display font-bold tracking-[0.2em] uppercase text-center px-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                {art.category}
              </h3>
            </div>
          )}

          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="absolute inset-0 border border-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Zoom Button */}
            <button type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsZoomed(true); }}
              className="absolute top-4 right-4 p-3 bg-black/20 text-white rounded-full hover:bg-black/40 transition-colors backdrop-blur-md opacity-100 md:opacity-0 md:group-hover:opacity-100 z-20"
              aria-label="Zoom image"
            >
              <ZoomIn size={20} />
            </button>

            {isCarousel && (
              <>
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <button type="button" onClick={prevImage} className="p-2 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] hover:opacity-70 transition-opacity" aria-label="Image précédente">
                    <ChevronLeft size={22} strokeWidth={2.5} />
                  </button>
                  <button type="button" onClick={nextImage} className="p-2 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] hover:opacity-70 transition-opacity" aria-label="Image suivante">
                    <ChevronRight size={22} strokeWidth={2.5} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-20">
                  {art.images.map((_: ArtworkImage, i: number) => (
                    <button type="button"
                      key={i}
                      onClick={(e) => goToImage(e, i)}
                      className={`w-2 h-2 rounded-full transition-colors ${i === currentImageIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'}`}
                      aria-label={`Image ${i + 1}${art.images[i]?.title ? ': ' + art.images[i].title : ''}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Text Below Image */}
        <div className="mt-4 min-h-[60px]">
          <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 transform translate-y-0 md:translate-y-2 md:group-hover:translate-y-0">
            <p className="text-gray-500 uppercase tracking-widest text-[10px] md:text-xs mb-1">{art.category}</p>
            <h3 className="text-black text-base md:text-lg font-display truncate pr-2">{displayTitle}</h3>
          </div>
        </div>
      </motion.div>

      {/* Lightbox Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm p-4 md:p-12"
          onClick={() => setIsZoomed(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button type="button"
            className="absolute top-6 right-6 p-2 text-black/70 hover:text-black bg-black/5 hover:bg-black/10 rounded-full transition-colors z-50"
            onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
            aria-label="Close zoom"
          >
            <X size={24} />
          </button>

          <div className="relative max-w-full max-h-full flex flex-col items-center justify-center w-full">
            <img
              src={displayImage}
              alt={altText}
              className="max-w-full max-h-[80vh] object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              loading="lazy"
              referrerPolicy="no-referrer"
            />

            <div className="mt-6 text-center flex flex-col items-center">
              {displayTitle && displayTitle !== art.title && (
                <h3 className="text-black text-xl md:text-2xl font-display tracking-widest uppercase mb-2">{displayTitle}</h3>
              )}
              <p className="text-gray-600 text-sm md:text-base mt-2">
                {t.artworks.interestedText}
                <a
                  href="#contacts"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed(false);
                  }}
                  className="text-black font-medium underline hover:text-gray-600 transition-colors"
                >
                  {t.artworks.contactLinkText}
                </a>
              </p>
            </div>

            {isCarousel && (
              <>
                <button type="button"
                  onClick={(e) => { e.stopPropagation(); prevImage(e); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-black hover:opacity-50 transition-opacity"
                  aria-label="Image précédente"
                >
                  <ChevronLeft size={28} strokeWidth={2.5} className="md:w-9 md:h-9" />
                </button>
                <button type="button"
                  onClick={(e) => { e.stopPropagation(); nextImage(e); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-black hover:opacity-50 transition-opacity"
                  aria-label="Image suivante"
                >
                  <ChevronRight size={28} strokeWidth={2.5} className="md:w-9 md:h-9" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
});

export default function Artworks() {
  const { t, language } = useLanguage();
  const [activeCarouselId, setActiveCarouselId] = useState<number | null>(null);
  const [shuffledData, setShuffledData] = useState<ArtworkData[]>([]);

  const rawArtworks = useJsonData<ArtworkData[]>('artworks');
  const ateliermeta = useJsonData<{ pdfUrl?: string }>('atelier_meta');
  const pdfUrl = ateliermeta?.pdfUrl ?? '/PDF/Portfolio_Artistique_Onesiker.pdf';

  // Shuffle is a one-shot effect: when the artworks payload first arrives, randomize
  // image order per artwork. Language changes must not re-trigger this — that's why
  // it depends on `rawArtworks` (the raw payload, stable across language switches via
  // the in-memory cache in useJsonData) and not on the shuffled state.
  useEffect(() => {
    if (!rawArtworks) return;
    const shuffled = rawArtworks
      .map((art) => {
        const images = [...art.images].filter((img) => img.visible !== false);
        if (images.length > 1) {
          for (let i = images.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = images[i]!;
            images[i] = images[j]!;
            images[j] = tmp;
          }
        }
        return { ...art, images };
      })
      .filter((art) => art.images.length > 0);
    setShuffledData(shuffled);
  }, [rawArtworks]);

  const artworks = React.useMemo(() => shuffledData.map((art, index) => ({
    ...art,
    title: t.artworks.items[index]?.title || `Artwork ${index + 1}`,
    category: art.name || t.artworks.items[index]?.category || "Catégorie"
  })), [shuffledData, t.artworks.items]);

  return (
    <section id="artworks" className="py-16 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tighter mb-2 md:mb-4">{t.artworks.title}</h2>
          <p className="text-gray-500 uppercase tracking-widest text-xs sm:text-sm mb-4">{t.artworks.subtitle}</p>
          <p className="text-gray-600 text-sm md:text-base mb-6 md:mb-8">
            {t.artworks.generalInterestedText}
            <a
              href="#contacts"
              className="text-black font-medium underline hover:text-gray-600 transition-colors"
            >
              {t.artworks.contactLinkText}
            </a>
          </p>
          <a
            href={pdfUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-white transition-colors border border-black hover:bg-black px-5 py-2.5 rounded-full w-fit"
          >
            <Download size={16} />
            {language === 'fr' ? 'Télécharger le portfolio' : 'Download Portfolio'}
          </a>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {artworks.map((art, index) => (
            <ArtworkCard
              key={art.id}
              art={art}
              index={index}
              activeCarouselId={activeCarouselId}
              setActiveCarouselId={setActiveCarouselId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
