import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  DoorClosed,
  DoorOpen,
  MapPin,
  Clock,
  Instagram,
  ShoppingBag,
  Sparkles,
  X,
  Check,
  Send,
  Building2,
} from 'lucide-react';
import { heroImg, modelBlueImg } from '../../data/initialData';

export const StoreTabDrawer: React.FC = () => {
  const { siteSettings, showToast } = useStore();
  const { language, t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [vipContact, setVipContact] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const isTabActive = siteSettings.storeTabActive ?? true;
  if (!isTabActive) return null;

  const handleVipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vipContact.trim()) return;
    setIsSubscribed(true);
    showToast(t('store.vipSuccess'));
    setTimeout(() => {
      setVipContact('');
      setIsSubscribed(false);
    }, 4000);
  };

  const instagramLink = siteSettings.instagramUrl || 'https://www.instagram.com/rwy.se/';

  return (
    <>
      {/* 1. Lateral Floating Vertical Tab with Door Handle */}
      <aside
        className={`fixed z-40 top-1/2 -translate-y-1/2 ${
          isRTL ? 'start-0' : 'end-0'
        } transition-transform duration-300 ease-out select-none`}
        aria-label="RWYSE Physical Store Preview"
      >
        <button
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`group flex items-center gap-2.5 py-4 px-2.5 sm:px-3 bg-white/95 hover:bg-white text-neutral-900 hover:text-black border ${
            isRTL
              ? 'border-s-0 rounded-e-md border-neutral-300 shadow-[-6px_0_20px_rgba(0,0,0,0.12)]'
              : 'border-e-0 rounded-s-md border-neutral-300 shadow-[6px_0_20px_rgba(0,0,0,0.12)]'
          } backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-105`}
          title={t('store.badge')}
          aria-label="Open Store preview"
        >
          {/* Custom Crafted Metallic Door Handle Icon */}
          <div className="relative flex items-center justify-center w-7 h-7 rounded-sm bg-neutral-100 border border-neutral-300 group-hover:border-orange-500 transition-colors">
            {isHovered ? (
              <DoorOpen className="w-4 h-4 text-orange-600 transition-transform duration-300" />
            ) : (
              <DoorClosed className="w-4 h-4 text-neutral-700 group-hover:text-black transition-colors" />
            )}
            {/* Subtle glow dot signifying future opening */}
            <span className="absolute -top-1 -end-1 w-2 h-2 rounded-full bg-orange-500 animate-ping opacity-75" />
            <span className="absolute -top-1 -end-1 w-2 h-2 rounded-full bg-orange-500" />
          </div>

          {/* Vertical Text */}
          <div className="flex flex-col items-center">
            <span className="writing-vertical font-display font-extrabold uppercase text-[11px] sm:text-xs tracking-[0.25em] text-neutral-900 group-hover:tracking-[0.3em] transition-all">
              {t('store.tabLabel')}
            </span>
            <span className="writing-vertical text-[9px] font-mono uppercase tracking-widest text-orange-600 font-bold mt-1">
              {language === 'ar' ? 'قريباً' : 'SOON'}
            </span>
          </div>
        </button>
      </aside>

      {/* 2. Slide-over Luxury Preview Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-2xl bg-white border border-neutral-200 text-neutral-900 shadow-2xl p-6 sm:p-8 z-10 space-y-6 overflow-hidden rounded-xs"
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-5 end-5 p-2 text-neutral-500 hover:text-black bg-neutral-100 border border-neutral-200 hover:border-neutral-300 transition-colors cursor-pointer rounded-xs"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header Tag */}
                <div className="space-y-1.5 pe-8">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-orange-100 border border-orange-300 text-orange-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
                      <span>{siteSettings.storeOpeningDate || t('store.statusBadge')}</span>
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      TUNIS · ARCHITECTURE 2026
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-extrabold uppercase text-neutral-900 tracking-tight">
                    {siteSettings.storeOpeningMessage || t('store.modalTitle')}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 font-light">
                    {siteSettings.storeOpeningSubtitle || t('store.modalSubtitle')}
                  </p>
                </div>

                {/* Architectural Preview Visual Card */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100 border border-neutral-200 shadow-md">
                  <img
                    src={heroImg}
                    alt="RWYSE Flagship Store Concept"
                    className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-5 flex flex-col justify-end">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 block mb-1">
                      CONCEPT ARCHITECTURAL // PREVIEW
                    </span>
                    <h4 className="text-sm font-bold uppercase text-white tracking-wider">
                      Flagship Boutique — Les Berges du Lac 2
                    </h4>
                  </div>
                </div>

                {/* Transparent Notice about Physical Store Status */}
                <div className="p-4 bg-neutral-50 border border-neutral-200 text-xs space-y-2">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <p className="text-neutral-700 leading-relaxed font-light">
                      {t('store.notice')}
                    </p>
                  </div>
                </div>

                {/* Practical Store Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-neutral-50 border border-neutral-200 flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-neutral-900 block font-semibold">{t('store.locationTitle')}</strong>
                      <span className="text-neutral-600 text-[11px]">{t('store.location')}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-neutral-200 flex items-start gap-3">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-neutral-900 block font-semibold">
                        {language === 'ar' ? 'الطلبيات الإلكترونية' : 'Commandes en ligne'}
                      </strong>
                      <span className="text-neutral-600 text-[11px]">{t('store.onlineStatus')}</span>
                    </div>
                  </div>
                </div>

                {/* VIP Guestlist Form for Opening Event */}
                <div className="p-4 bg-neutral-50 border border-neutral-200 space-y-3">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                      <span>{t('store.vipListTitle')}</span>
                    </h5>
                    <p className="text-[11px] text-neutral-600 mt-0.5">
                      {t('store.vipListDesc')}
                    </p>
                  </div>

                  {isSubscribed ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 font-mono">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{t('store.vipSuccess')}</span>
                    </div>
                  ) : (
                    <form onSubmit={handleVipSubmit} className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder={t('store.vipPlaceholder')}
                        value={vipContact}
                        onChange={(e) => setVipContact(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-neutral-300 text-neutral-900 text-xs placeholder-neutral-400 font-mono focus:outline-none focus:border-black"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <span>{t('store.vipButton')}</span>
                        <Send className="w-3 h-3" />
                      </button>
                    </form>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-200">
                  <a
                    href={instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Instagram className="w-4 h-4 text-orange-600" />
                    <span>{t('store.followInstagram')}</span>
                  </a>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t('cart.continue')}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
