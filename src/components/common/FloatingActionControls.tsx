import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { Phone, MessageCircle, Instagram } from 'lucide-react';
import { DirectCallModal } from './DirectCallModal';
import { StoreTabDrawer } from './StoreTabDrawer';

export const FloatingActionControls: React.FC = () => {
  const { siteSettings } = useStore();
  const { language, t, isRTL } = useLanguage();
  const [callModalOpen, setCallModalOpen] = useState(false);

  const isEnabled = siteSettings.showFloatingControls ?? true;
  if (!isEnabled) {
    return <StoreTabDrawer />;
  }

  const rawPhone = siteSettings.adminPhone || '+216 29 110 567';
  const cleanPhone = rawPhone.replace(/\s+/g, '');
  const instagramUrl = siteSettings.instagramUrl || 'https://www.instagram.com/rwy.se/';
  const whatsappNumber = (siteSettings.whatsappNumber || rawPhone).replace(/[^0-9]/g, '');

  const handlePhoneClick = () => {
    // On small screens, launch tel: directly; on desktop open the helper modal with copy & info
    if (window.innerWidth < 768) {
      window.location.href = `tel:${cleanPhone}`;
    } else {
      setCallModalOpen(true);
    }
  };

  return (
    <>
      {/* 1. Left Floating Cluster (WhatsApp & Instagram) */}
      <div
        className={`fixed z-30 bottom-6 ${
          isRTL ? 'end-4 sm:end-6' : 'start-4 sm:start-6'
        } flex flex-col items-center gap-2.5 select-none`}
      >
        {/* WhatsApp Concierge Pill */}
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-emerald-600 hover:text-emerald-700 border border-neutral-300 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 cursor-pointer"
          title="WhatsApp Concierge"
          aria-label="WhatsApp Concierge"
        >
          <MessageCircle className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
          <span className="sr-only">WhatsApp Concierge</span>
          {/* Tooltip on hover (desktop) */}
          <span
            className={`hidden md:block absolute ${
              isRTL ? 'end-full me-2' : 'start-full ms-2'
            } px-2.5 py-1 bg-white border border-neutral-200 text-[10px] font-mono uppercase tracking-wider text-neutral-900 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xs shadow-md`}
          >
            WhatsApp Concierge
          </span>
        </a>

        {/* Instagram Quick Link */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-neutral-800 hover:text-orange-600 border border-neutral-300 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 cursor-pointer"
          title={t('instagram.button')}
          aria-label="Instagram official page"
        >
          <Instagram className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 text-orange-600" />
          <span className="sr-only">Instagram</span>
          <span
            className={`hidden md:block absolute ${
              isRTL ? 'end-full me-2' : 'start-full ms-2'
            } px-2.5 py-1 bg-white border border-neutral-200 text-[10px] font-mono uppercase tracking-wider text-neutral-900 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xs shadow-md`}
          >
            @rwy.se
          </span>
        </a>
      </div>

      {/* 2. Right Floating Cluster: Direct Call button */}
      <div
        className={`fixed z-30 bottom-6 ${
          isRTL ? 'start-4 sm:start-6' : 'end-4 sm:end-6'
        } flex flex-col items-center gap-2 select-none`}
      >
        <button
          onClick={handlePhoneClick}
          className="group relative flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-black/95 hover:bg-black text-white border border-neutral-800 hover:border-orange-500/70 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer"
          title={t('call.buttonLabel')}
          aria-label={t('call.buttonLabel')}
        >
          {/* Animated pulsing phone icon */}
          <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/20 text-orange-400">
            <Phone className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-30" />
          </div>

          <div className="flex flex-col text-start">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white group-hover:text-orange-300 transition-colors">
              {t('call.buttonLabel')}
            </span>
            <span className="text-[9px] font-mono text-neutral-300 hidden sm:block">
              {rawPhone}
            </span>
          </div>
        </button>
      </div>

      {/* 3. Physical Store Door Handle Tab (Always on right/left vertical edge) */}
      <StoreTabDrawer />

      {/* 4. Direct Call Modal */}
      <DirectCallModal isOpen={callModalOpen} onClose={() => setCallModalOpen(false)} />
    </>
  );
};
