import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Copy, Check, MessageCircle, X, Shield, Clock } from 'lucide-react';

interface DirectCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DirectCallModal: React.FC<DirectCallModalProps> = ({ isOpen, onClose }) => {
  const { siteSettings, showToast } = useStore();
  const { language, t, isRTL } = useLanguage();
  const [copied, setCopied] = useState(false);

  const rawPhone = siteSettings.adminPhone || '+216 29 110 567';
  const cleanPhone = rawPhone.replace(/\s+/g, '');
  const whatsappNumber = (siteSettings.whatsappNumber || rawPhone).replace(/[^0-9]/g, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanPhone);
    setCopied(true);
    showToast(t('call.copied'));
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="min-h-full flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-white border border-neutral-200 text-neutral-900 shadow-2xl p-6 sm:p-7 z-10 space-y-5 rounded-xs"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 end-4 p-1.5 text-neutral-500 hover:text-black bg-neutral-100 border border-neutral-200 hover:border-neutral-300 transition-colors cursor-pointer rounded-xs"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title & Icon Header */}
              <div className="flex items-start gap-3.5 pe-8">
                <div className="w-10 h-10 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-600 shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wide text-neutral-900">
                    {t('call.modalTitle')}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5 font-light">
                    {t('call.modalSubtitle')}
                  </p>
                </div>
              </div>

              {/* Phone Display Card */}
              <div className="p-4 bg-neutral-50 border border-neutral-200 space-y-2 text-center rounded-xs">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 block">
                  LIGNE DIRECTE // DIRECT LINE
                </span>
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-neutral-900 tracking-widest block selection:bg-orange-500 selection:text-white">
                  {rawPhone}
                </span>
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-emerald-700">
                  <Clock className="w-3 h-3" />
                  <span>{t('call.availability')}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed font-light text-center">
                {t('call.deliveryNotice')}
              </p>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                {/* 1. Direct Call Link */}
                <a
                  href={`tel:${cleanPhone}`}
                  className="w-full py-3 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md rounded-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>{t('call.dial')}</span>
                </a>

                {/* 2. Copy Number */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full py-2.5 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-xs shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-mono">{t('call.copied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-neutral-500" />
                      <span>{t('call.copy')}</span>
                    </>
                  )}
                </button>

                {/* 3. WhatsApp Concierge */}
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-xs"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>{t('call.whatsapp')}</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
