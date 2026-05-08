import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Store } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useJsonData } from '../hooks/useJsonData';
import CGUModal from './CGUModal';

export default function Contacts() {
  const { t, language } = useLanguage();
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [isCguOpen, setIsCguOpen] = useState(false);
  const contactData = useJsonData<any>('contact');

  const content = contactData && contactData[language] ? contactData[language] : t.contact;
  const addressTitle = contactData?.address?.title || "Onesiker";
  const addressLines = (language === 'en' ? contactData?.address?.lines_en : contactData?.address?.lines_fr) || (language === 'en' ? 'Downtown\n31000 Toulouse' : 'Centre-ville\n31000 Toulouse');
  const email = contactData?.email || "contact.onesiker@gmail.com";
  const galleries = contactData?.galleries || [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Formspree ID pour south-painters@wanadoo.fr
    const formspreeId = 'meerpeka';

    setFormStatus('sending');
    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      if (response.ok) {
        setFormStatus('success');
        form.reset();
        setTimeout(() => setFormStatus('idle'), 3000);
      } else {
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 3000);
      }
    } catch {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  return (
    <section id="contacts" className="py-16 md:py-32 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tighter mb-4 md:mb-8">{content.title}</h2>
            <p className="text-gray-600 font-light leading-relaxed mb-8 md:mb-12 max-w-md text-sm md:text-base">
              {content.desc}
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex items-start space-x-4">
                <MapPin className="text-gray-400 mt-1" size={20} />
                <div>
                  <h4 className="font-medium uppercase tracking-widest text-sm mb-1">{addressTitle}</h4>
                  <p className="text-gray-500 font-light whitespace-pre-line">{addressLines}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mail className="text-gray-400 mt-1" size={20} />
                <div>
                  <h4 className="font-medium uppercase tracking-widest text-sm mb-1">Email</h4>
                  <p className="text-gray-500 font-light">
                    <a href={`mailto:${email}`} className="hover:text-black transition-colors">
                      {email}
                    </a>
                  </p>
                </div>
              </div>
              
              {galleries.length > 0 && (
                <div className="flex items-start space-x-4">
                  <Store className="text-gray-400 mt-1" size={20} />
                  <div className="space-y-4">
                    <h4 className="font-medium uppercase tracking-widest text-sm mb-1">{content.galleriesTitle || (language === 'en' ? 'Galleries' : 'Galeries')}</h4>
                    {galleries.map((gal: any, i: number) => {
                      const detailsHtml = language === 'en' ? gal.details_en : gal.details_fr;
                      return (
                        <div key={i} className="mb-4">
                          <p className="text-gray-500 font-light text-sm" dangerouslySetInnerHTML={{ __html: detailsHtml }} />
                          {gal.url && (
                            <a href={gal.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-black font-medium text-sm mt-1 hover:text-gray-600 transition-colors">
                              {language === 'en' ? 'Visit Website' : 'Visiter le site'}
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-6 sm:p-8 md:p-12 shadow-sm scroll-mt-24 md:scroll-mt-40"
            id="contact-form"
          >
            <p className="text-gray-600 font-light leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
              {content.formIntro}
            </p>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-2">{t.contact.name}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors bg-transparent"
                  placeholder={t.contact.placeholderName}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-2">{t.contact.email}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors bg-transparent"
                  placeholder={t.contact.placeholderEmail}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-medium uppercase tracking-widest text-gray-500 mb-2">{t.contact.message}</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-black transition-colors bg-transparent resize-none"
                  placeholder={t.contact.placeholderMessage}
                ></textarea>
              </div>
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="accept-cgu" 
                  name="accept-cgu" 
                  required 
                  className="mt-1 mr-3 h-4 w-4 shrink-0 focus:ring-black border-gray-300 rounded cursor-pointer accent-black"
                />
                <label htmlFor="accept-cgu" className="text-sm font-light text-gray-600">
                  {language === 'en' ? (
                    <>I have read and accept the <button type="button" onClick={() => setIsCguOpen(true)} className="underline hover:text-black">Terms of Use</button>.</>
                  ) : (
                    <>J'ai lu et j'accepte les <button type="button" onClick={() => setIsCguOpen(true)} className="underline hover:text-black">Conditions Générales d'Utilisation</button>.</>
                  )}
                </label>
              </div>
              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full bg-black text-white py-4 uppercase tracking-widest text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {formStatus === 'sending' ? (language === 'en' ? 'Sending...' : 'Envoi en cours...') :
                  formStatus === 'success' ? (language === 'en' ? 'Sent successfully!' : 'Envoyé avec succès !') :
                    formStatus === 'error' ? (language === 'en' ? 'Error. Try again.' : 'Erreur. Réessayez.') :
                      t.contact.send}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
      <CGUModal isOpen={isCguOpen} onClose={() => setIsCguOpen(false)} />
    </section>
  );
}
