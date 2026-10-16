import React, { useState } from 'react';
import { RwyseLogo } from './RwyseLogo';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, Instagram, Check, Phone, MapPin, Globe, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { siteSettings, showToast } = useStore();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const instagramLink = siteSettings.instagramUrl || 'https://www.instagram.com/rwy.se/';
  const rawPhone = siteSettings.adminPhone || '+216 29 110 567';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    showToast(language === 'ar' ? 'شكراً لك ! تم تسجيل بريدك بنجاح.' : 'Merci ! Bienvenue dans le cercle RWYSE.');
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer
      className="w-full bg-[#F5F5F7] border-t border-neutral-200 text-neutral-600 select-none"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Top Banner / Community Statement */}
      <div className="border-b border-neutral-200 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 block">
              {language === 'ar' ? 'بيان المجتمع // RWYSE' : 'COMMUNITY DIRECTIVE'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-neutral-900 tracking-tight">
              {language === 'ar' ? 'نحن نرتقي معاً.' : 'WE RISE TOGETHER.'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl leading-relaxed font-light">
              {t('footer.brandStory')}
            </p>
          </div>

          {/* VIP Newsletter */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-neutral-200 p-5 rounded-xs shadow-xs">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-neutral-900 block mb-1">
                {language === 'ar' ? 'انضم إلى النخبة // القائمة البريدية' : 'JOIN THE INNER CIRCLE'}
              </span>
              <p className="text-xs text-neutral-600 mb-3 font-light">
                {language === 'ar'
                  ? 'كن أول من يحصل على الإصدارات المحدودة وخصومات الحرفاء المميزين.'
                  : 'Soyez les premiers informés des lancements privés et des drops limités.'}
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 p-3 bg-neutral-50 border border-neutral-300 text-emerald-700 text-xs font-mono">
                  <Check className="w-4 h-4" />
                  <span>
                    {language === 'ar'
                      ? 'تم تسجيلك بنجاح في القائمة الحصرية.'
                      : 'Bienvenue dans le cercle. Vérifiez vos e-mails.'}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'VOTRE ADRESSE EMAIL'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-black font-mono tracking-wider"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>{language === 'ar' ? 'انضمام' : 'Rejoindre'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand & Logo */}
          <div className="col-span-2 space-y-4">
            <button
              onClick={() => onNavigate('/')}
              className="text-start cursor-pointer focus-visible:outline-none"
              aria-label="RWYSE Home"
            >
              <RwyseLogo
                className="h-8 w-auto text-black hover:opacity-90 transition-opacity"
                variant="light"
                withSlogan
                autoSpin={siteSettings.logoAutoRotate ?? true}
              />
            </button>
            <p className="text-xs text-neutral-600 max-w-sm leading-relaxed font-light">
              {t('brand.sub')} — {t('footer.tunisia')}
            </p>

            {/* Instagram Official CTA */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-neutral-50 border border-neutral-300 hover:border-orange-500 text-neutral-900 text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs"
              >
                <Instagram className="w-4 h-4 text-orange-600" />
                <span>{t('instagram.follow')}</span>
              </a>

              <a
                href={`tel:${rawPhone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-300 text-neutral-800 hover:text-black text-xs font-mono shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                <span>{rawPhone}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/shop')}
                  className="hover:text-black transition-colors cursor-pointer text-neutral-600"
                >
                  {t('nav.shop')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/collections')}
                  className="hover:text-black transition-colors cursor-pointer text-neutral-600"
                >
                  {t('nav.collections')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/new-drops')}
                  className="hover:text-black transition-colors cursor-pointer text-neutral-600"
                >
                  {t('nav.newDrops')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/community')}
                  className="hover:text-black transition-colors cursor-pointer text-neutral-600"
                >
                  {t('nav.community')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Store Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
              {t('footer.customerService')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/track')}
                  className="hover:text-emerald-700 transition-colors cursor-pointer text-emerald-600 font-medium flex items-center gap-1"
                >
                  <span>{t('nav.track')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-black transition-colors cursor-pointer text-neutral-600"
                >
                  {t('nav.contact')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/account')}
                  className="hover:text-black transition-colors cursor-pointer text-neutral-600"
                >
                  {t('nav.account')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-black transition-colors cursor-pointer text-neutral-600"
                >
                  {t('nav.about')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Store & Language Switcher */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
              {language === 'ar' ? 'اللغة والمتجر' : 'Langue & Boutique'}
            </h4>
            <p className="text-[11px] text-neutral-600 leading-relaxed">
              {t('store.location')}
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
                className="px-3 py-1.5 rounded-xs bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-900 text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 text-neutral-500" />
                <span>{language === 'fr' ? 'العربية 🇹🇳 (AR)' : 'Français 🇫🇷 (FR)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div>
            <span>© {new Date().getFullYear()} {t('footer.rights')}</span>
          </div>

          <div className="flex items-center gap-5 text-[11px]">
            <span className="flex items-center gap-1.5 text-neutral-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('footer.securePayment')}</span>
            </span>

            {/* Direct Admin Access Button */}
            <button
              onClick={() => onNavigate('/admin')}
              className="text-[10px] text-neutral-500 hover:text-black uppercase tracking-widest px-2.5 py-1 border border-neutral-300 hover:border-black bg-white rounded-xs transition-colors cursor-pointer flex items-center gap-1.5"
              title="Accès Panneau d'Administration RWYSE"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>Espace Admin CMS</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
