import { useState } from 'react';
import { Instagram, Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useJsonData } from '../hooks/useJsonData';
import CGUModal from './CGUModal';

type ContactData = { urls?: { name: string; url: string }[] };

const YoutubeSquare = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <polygon points="10 8 16 12 10 16 10 8" />
  </svg>
);

export default function Footer() {
  const { t } = useLanguage();
  const [isCguOpen, setIsCguOpen] = useState(false);
  const contactData = useJsonData<ContactData>('contact');

  const urls = contactData?.urls || [
    { name: 'Instagram', url: 'https://instagram.com/onesiker' },
    { name: 'Youtube', url: 'https://youtube.com/@Onesiker' }
  ];

  const getIconForName = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('instagram')) return <Instagram size={24} />;
    if (n.includes('youtube')) return <YoutubeSquare size={24} />;
    if (n.includes('facebook')) return <Facebook size={24} />;
    if (n.includes('twitter') || n.includes('x.com')) return <Twitter size={24} />;
    if (n.includes('linkedin')) return <Linkedin size={24} />;
    return <LinkIcon size={24} />;
  };
  
  return (
    <footer className="bg-white text-black py-12 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex-1 flex justify-center md:justify-start">
          <img
            src="/TAG_ONESIKER.png?v=2"
            alt="Onesiker"
            width={1181}
            height={590}
            className="h-16 w-auto"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="flex-1 flex justify-center space-x-6 flex-wrap gap-y-4">
          {urls.map((item, i: number) => (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors" title={item.name}>
              {getIconForName(item.name)}
            </a>
          ))}
        </div>

        <div className="flex-1 flex flex-col items-center md:items-end justify-center">
          <p className="text-gray-500 text-sm font-light text-center md:text-right">
            &copy; {new Date().getFullYear()} Onesiker. {t.footer.rights}
          </p>
          <button type="button" 
            onClick={() => setIsCguOpen(true)} 
            className="text-gray-600 hover:text-black text-xs font-medium mt-3 tracking-widest transition-colors cursor-pointer"
          >
            CGU
          </button>
        </div>
      </div>
      <CGUModal isOpen={isCguOpen} onClose={() => setIsCguOpen(false)} />
    </footer>
  );
}
