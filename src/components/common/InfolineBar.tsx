import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { Truck, ShieldCheck, Phone, Sparkles, X, ArrowRight } from 'lucide-react';

interface InfolineBarProps {
  onNavigateToShop?: () => void;
}

export const InfolineBar: React.FC<InfolineBarProps> = ({ onNavigateToShop }) => {
  const { siteSettings } = useStore();
  const { language, t, isRTL } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  // Check if active
  const isActive = siteSettings.infolineActive ?? siteSettings.announcementActive ?? true;
  if (!isActive || dismissed) {
    return null;
  }

  const speedClass =
    siteSettings.infolineSpeed === 'slow'
      ? 'animate-marquee-slow'
      : siteSettings.infolineSpeed === 'fast'
      ? 'animate-marquee-fast'
      : 'animate-marquee';

  // Default messages if not customized in admin
  const defaultTextFr =
    siteSettings.infolineText ||
    siteSettings.announcementText ||
    '⚡ RWYSE DROP 01 LIVE · LIVRAISON EXPRESS 24/48H PARTOUT EN TUNISIE · PAIEMENT EN ESPÈCES À LA LIVRAISON (COD) · SERVICE CLIENT : ' +
      (siteSettings.adminPhone || '+216 29 110 567');

  const defaultTextAr =
    '⚡ إصدار RWYSE DROP 01 متوفر الآن · توصيل سريع 24/48 ساعة لكامل تراب الجمهورية التونسية · الدفع نقداً عند الاستلام (COD) · خدمة الحرفاء : ' +
    (siteSettings.adminPhone || '+216 29 110 567');

  const activeText = language === 'ar' ? defaultTextAr : defaultTextFr;

  return (
    <aside
      aria-label="Infoline"
      className="relative z-50 h-9 bg-[#F1F1F5] border-b border-neutral-200 text-neutral-800 text-[11px] overflow-hidden flex items-center select-none shadow-xs"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Visual Live Pill on Left/Right */}
      <div className="absolute inset-y-0 start-0 z-10 px-3 bg-[#EAEAEF] border-e border-neutral-300 flex items-center gap-1.5 shrink-0 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-neutral-900">
          {t('infoline.badge')}
        </span>
      </div>

      {/* Marquee Content */}
      <div className="flex-1 overflow-hidden ps-20 pe-10 py-1">
        <div className={`flex items-center gap-12 font-medium tracking-wider uppercase text-neutral-800 ${speedClass}`}>
          {/* Repeating sequence for continuous smooth loop */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-8 shrink-0">
              <span className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                <span className="font-semibold text-neutral-900">{activeText}</span>
              </span>
              <span className="text-neutral-400">·</span>
              <span className="flex items-center gap-2 text-neutral-900">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-semibold">{language === 'ar' ? 'أصلي 100% · قطن عضوي ثقيل 500 GSM' : '100% Authentique · Heavyweight 500 GSM'}</span>
              </span>
              <span className="text-neutral-400">·</span>
              <span className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-orange-600 shrink-0" />
                <span className="font-mono text-neutral-800 font-semibold">{siteSettings.adminPhone || '+216 29 110 567'}</span>
              </span>
              <span className="text-neutral-400">·</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dismiss Button */}
      <div className="absolute inset-y-0 end-0 z-10 pe-3 ps-2 bg-[#F1F1F5] border-s border-neutral-200 flex items-center shrink-0">
        <button
          onClick={() => setDismissed(true)}
          className="text-neutral-500 hover:text-black transition-colors p-1 cursor-pointer"
          title={language === 'ar' ? 'إخفاء' : 'Fermer'}
          aria-label="Fermer la barre d'information"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
