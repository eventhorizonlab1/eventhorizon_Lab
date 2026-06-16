import { useLanguage } from '../context/LanguageContext';
import { useJsonData } from '../hooks/useJsonData';
import { getAlt } from '../lib/imageAlt';

export default function CustomPage({ id }: { id: string }) {
  const allPages = useJsonData<Record<string, any>>('custom_pages');
  const { language } = useLanguage();
  const pageData = allPages?.[id];

  if (!pageData) return null;

  const title = language === 'fr' ? pageData.title_fr : pageData.title_en;
  const content = language === 'fr' ? pageData.content_fr : pageData.content_en;

  return (
    <section id={id} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {title && (
          <h2 className="text-3xl md:text-5xl font-light mb-12 tracking-wide uppercase">
            {title}
          </h2>
        )}
        
        {content && (
          <div className="prose prose-lg max-w-none mb-16 text-gray-700 whitespace-pre-line">
            {content}
          </div>
        )}

        {pageData.images && pageData.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pageData.images.map((img: any, idx: number) => (
              <div key={idx} className="group relative aspect-square overflow-hidden bg-gray-100 rounded-lg">
                <img
                  src={img.url}
                  alt={getAlt({ src: img.url, alt_fr: img.alt_fr, alt_en: img.alt_en }, language, img.title || title || 'Onesiker')}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {img.title && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <p className="text-white p-6 w-full text-center font-medium tracking-wide">
                      {img.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
