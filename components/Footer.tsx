
import React from 'react';
import { Youtube, Linkedin, Twitter, Mail } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

const Footer: React.FC = () => {
  const { t } = useThemeLanguage();

  return (
    <footer className="bg-black text-white py-16 px-6 md:px-12 rounded-t-[3rem] mt-12">
      <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        
        <div>
          <h2 className="text-2xl font-bold tracking-tighter uppercase mb-2">Event Horizon</h2>
          <p className="text-gray-500 text-sm max-w-xs">
            {t('footer_desc')}
          </p>
        </div>

        <div className="flex gap-8">
            <a href="https://www.youtube.com/@EventHorizonLab-n9g" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"><Youtube size={24} strokeWidth={1.5} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"><Linkedin size={24} strokeWidth={1.5} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"><Twitter size={24} strokeWidth={1.5} /></a>
            <a href="mailto:contact@eventhorizon.eu" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"><Mail size={24} strokeWidth={1.5} /></a>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 uppercase tracking-widest font-medium">
        <p>© 2023 Event Horizon. {t('footer_rights')}</p>
        <div className="flex gap-6">
            <a href="#" className="relative group hover:text-white transition-colors duration-300">
              {t('footer_legal')}
              <span className="absolute -bottom-1 left-0 w-full h-px bg-current origin-center scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
            </a>
            <a href="#" className="relative group hover:text-white transition-colors duration-300">
              {t('footer_privacy')}
              <span className="absolute -bottom-1 left-0 w-full h-px bg-current origin-center scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
            </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
