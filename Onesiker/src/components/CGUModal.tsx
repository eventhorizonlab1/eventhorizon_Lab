import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useJsonData } from '../hooks/useJsonData';

interface CGUModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Block =
  | { type: 'p'; text: string }
  | {
      type: 'ul';
      items: Array<{
        label?: string;
        text?: string;
        sublist?: string[];
      }>;
    };

interface LegalSection {
  heading: string;
  blocks: Block[];
}

interface LegalLanguage {
  title: string;
  sections: LegalSection[];
}

interface LegalData {
  site: string;
  fr: LegalLanguage;
  en: LegalLanguage;
}

function renderBlock(block: Block, key: number) {
  if (block.type === 'p') {
    return (
      <p key={key} className="mt-2 first:mt-0">
        {block.text}
      </p>
    );
  }
  return (
    <ul key={key} className="list-disc pl-5 mt-2 space-y-2">
      {block.items.map((item, i) => (
        <li key={i}>
          {item.label && <strong>{item.label} :</strong>}
          {item.label && item.text && ' '}
          {item.text}
          {item.sublist && (
            <ul className="list-[circle] pl-5 mt-1 space-y-1">
              {item.sublist.map((sub, j) => (
                <li key={j}>{sub}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

// Inner content runs useJsonData('legal'). We isolate it in a child component so
// the hook only fires when the modal actually opens — a missing legal.json on
// prod must not crash Footer + Contacts (which both render <CGUModal isOpen={false}>).
function CGUContent({ language }: { language: string }) {
  const legal = useJsonData<LegalData>('legal');
  const content = legal?.[language as 'fr' | 'en'];
  const site = legal?.site ?? 'www.onesiker.org';

  return (
    <div className="overflow-y-auto w-full p-6 sm:p-10 hide-scrollbar">
      <h2
        id="cgu-modal-title"
        className="text-2xl sm:text-3xl font-bold mb-6 text-center uppercase tracking-tight"
      >
        {content?.title ?? (language === 'en' ? 'Terms of Use' : "Conditions Générales d'Utilisation")}
      </h2>

      <div className="space-y-6 text-sm sm:text-base text-gray-800 leading-relaxed font-light">
        <p className="font-medium text-center mb-8">Site : {site}</p>

        {content?.sections.map((section, i) => (
          <section key={i}>
            <h3 className="text-lg font-semibold mb-2 text-black">{section.heading}</h3>
            {section.blocks.map((block, j) => renderBlock(block, j))}
          </section>
        ))}
      </div>
    </div>
  );
}

export default function CGUModal({ isOpen, onClose }: CGUModalProps) {
  const { language } = useLanguage();

  // Prevent body scroll when modal is open + close on Escape (a11y standard).
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'unset';
      return;
    }
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cgu-modal-title"
        className="bg-white text-black w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label={language === 'en' ? 'Close' : 'Fermer'}
        >
          <X size={24} />
        </button>

        <CGUContent language={language} />
      </div>
    </div>
  );
}
