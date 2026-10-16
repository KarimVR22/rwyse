import React from 'react';
import { useStore } from '../../context/StoreContext';

export const LuxuryBackgroundMotifs: React.FC = () => {
  const { siteSettings } = useStore();

  const isEnabled = siteSettings.bgPatternActive ?? true;
  if (!isEnabled) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. Subtle Architectural Dot-Matrix Pattern & Hairline Grid */}
      <div className="absolute inset-0 luxury-grid-pattern opacity-70" />
      <div className="absolute inset-0 luxury-hairline-lines opacity-40" />

      {/* 2. Soft Ambient Luxury Gradient Orbs (Ethereal Depth on White / Light Background) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 sm:w-[620px] sm:h-[620px] rounded-full bg-gradient-to-br from-amber-200/25 via-orange-100/15 to-transparent blur-3xl animate-float-slow" />
      <div className="absolute top-1/4 -right-40 w-96 h-96 sm:w-[680px] sm:h-[680px] rounded-full bg-gradient-to-bl from-blue-200/25 via-indigo-100/15 to-transparent blur-3xl animate-float-slow [animation-delay:4s]" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 sm:w-[580px] sm:h-[580px] rounded-full bg-gradient-to-tr from-sky-100/25 via-neutral-100/15 to-transparent blur-3xl animate-pulse-glow" />

      {/* 3. Luxury 4-Point Chrome Streetwear Stars */}
      <div className="absolute top-44 left-[15%] opacity-25 hidden md:block animate-pulse-glow">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 0L15.5 12.5L28 14L15.5 15.5L14 28L12.5 15.5L0 14L12.5 12.5L14 0Z" fill="#111115" />
        </svg>
      </div>

      <div className="absolute top-[65%] right-[12%] opacity-20 hidden md:block animate-float-slow">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <path d="M17 0L18.8 15.2L34 17L18.8 18.8L17 34L15.2 18.8L0 17L15.2 15.2L17 0Z" fill="#ff6400" />
        </svg>
      </div>

      {/* 4. Luxury Guilloché / Starburst Circular Seal */}
      <div className="absolute top-36 right-16 opacity-30 hidden lg:block animate-float-slow">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="58" stroke="#111115" strokeWidth="0.75" strokeDasharray="3 3" />
          <circle cx="60" cy="60" r="48" stroke="#ff6400" strokeWidth="0.5" />
          <circle cx="60" cy="60" r="38" stroke="#111115" strokeWidth="0.5" strokeDasharray="1 3" />
          {/* Compass cross */}
          <path d="M60 4V116M4 60H116" stroke="#111115" strokeWidth="0.6" />
          {/* Star glyph */}
          <path d="M60 40L63 57L80 60L63 63L60 80L57 63L40 60L57 57L60 40Z" fill="#111115" opacity="0.4" />
          <text x="60" y="24" textAnchor="middle" fill="#111115" fontSize="5.5" fontFamily="monospace" letterSpacing="0.25em">
            RWYSE · ATELIER
          </text>
          <text x="60" y="102" textAnchor="middle" fill="#111115" fontSize="5.5" fontFamily="monospace" letterSpacing="0.25em">
            EST. 2026 // TN
          </text>
        </svg>
      </div>

      {/* 5. Left Margin Technical Architectural Ruler */}
      <div className="hidden xl:flex absolute top-0 bottom-0 left-3 w-4 flex-col justify-between py-24 opacity-35">
        <div className="flex flex-col gap-3 font-mono text-[8px] text-neutral-400">
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((mark) => (
            <div key={mark} className="flex items-center gap-1.5">
              <span className="w-2.5 h-[1px] bg-neutral-400" />
              <span>{mark}</span>
            </div>
          ))}
        </div>
        <div className="font-mono text-[8px] text-neutral-400 tracking-widest writing-vertical uppercase">
          RWYSE ARCHITECTURAL RULER // 500 GSM CALIBRATION
        </div>
      </div>

      {/* 6. Right Margin Technical Millimeter Marking */}
      <div className="hidden xl:flex absolute top-0 bottom-0 right-3 w-4 flex-col justify-between py-24 opacity-35 items-end">
        <div className="font-mono text-[8px] text-neutral-400 tracking-widest writing-vertical uppercase">
          DROP 01 RAW ARCHIVE // CASH ON DELIVERY
        </div>
        <div className="flex flex-col gap-3 font-mono text-[8px] text-neutral-400 items-end">
          {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map((mark) => (
            <div key={mark} className="flex items-center gap-1.5">
              <span>{mark}</span>
              <span className="w-2.5 h-[1px] bg-neutral-400" />
            </div>
          ))}
        </div>
      </div>

      {/* 7. Luxury Micro-Crosshairs & Technical Streetwear Watermarks */}
      <div className="hidden lg:block">
        {/* Top Left Technical Coordinate & Barcode */}
        <div className="absolute top-28 left-8 flex flex-col gap-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span className="text-orange-500 font-bold">+</span>
            <span>36°48'N // 10°11'E</span>
          </div>
          <span className="text-[8px] text-neutral-400 tracking-[0.25em]">TUNIS ARCHIVE // DROP 01</span>
          {/* Micro Barcode SVG */}
          <div className="pt-1 opacity-50">
            <svg width="84" height="12" viewBox="0 0 84 12" fill="currentColor">
              <rect x="0" width="2" height="12" />
              <rect x="4" width="1" height="12" />
              <rect x="7" width="3" height="12" />
              <rect x="13" width="1" height="12" />
              <rect x="16" width="2" height="12" />
              <rect x="21" width="4" height="12" />
              <rect x="28" width="1" height="12" />
              <rect x="31" width="2" height="12" />
              <rect x="36" width="3" height="12" />
              <rect x="42" width="1" height="12" />
              <rect x="46" width="3" height="12" />
              <rect x="52" width="2" height="12" />
              <rect x="57" width="1" height="12" />
              <rect x="61" width="4" height="12" />
              <rect x="68" width="2" height="12" />
              <rect x="73" width="1" height="12" />
              <rect x="77" width="3" height="12" />
              <rect x="82" width="2" height="12" />
            </svg>
          </div>
        </div>

        {/* Top Right Technical Marker */}
        <div className="absolute top-36 right-10 flex flex-col items-end gap-1 font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span>SERIES 567 · BOX CUT</span>
            <span className="text-blue-500 font-bold">+</span>
          </div>
          <span className="text-[8px] text-neutral-400 tracking-[0.25em]">500 GSM ORGANIC TERRY</span>
          <div className="flex items-center gap-1 mt-1 opacity-70">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[7px] text-neutral-400">ARCHITECTURAL SILHOUETTE</span>
          </div>
        </div>

        {/* Center Lateral Decorative Watermark Crosses */}
        <div className="absolute top-1/2 left-6 -translate-y-1/2 flex flex-col gap-8 opacity-45">
          <span className="font-mono text-xs text-neutral-400">+</span>
          <span className="font-mono text-[9px] text-neutral-400 tracking-widest writing-vertical uppercase">
            RWYSE // BESPOKE ATELIER
          </span>
          <span className="font-mono text-xs text-neutral-400">+</span>
        </div>

        <div className="absolute top-2/3 right-8 flex flex-col gap-8 opacity-45">
          <span className="font-mono text-xs text-neutral-400">+</span>
          <span className="font-mono text-[9px] text-neutral-400 tracking-widest writing-vertical uppercase">
            RISE WITH YOU · 2026
          </span>
          <span className="font-mono text-xs text-neutral-400">+</span>
        </div>

        {/* Lower Left Subtle Diagonal Accent */}
        <div className="absolute bottom-28 left-8 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-400">
          <span className="w-6 h-[1px] bg-neutral-300" />
          <span>AUTONOMOUS STREET DISCIPLINE</span>
        </div>

        {/* Lower Right Quality Stamp */}
        <div className="absolute bottom-24 right-10 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-400">
          <span>AUTHENTICATED HEAVYWEIGHT</span>
          <span className="w-2.5 h-2.5 border border-neutral-400 rotate-45 inline-block" />
        </div>
      </div>

      {/* 8. Subtle Corner Crosshairs */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-neutral-300 pointer-events-none select-none">+</div>
      <div className="absolute top-4 right-4 font-mono text-[10px] text-neutral-300 pointer-events-none select-none">+</div>
      <div className="absolute bottom-4 left-4 font-mono text-[10px] text-neutral-300 pointer-events-none select-none">+</div>
      <div className="absolute bottom-4 right-4 font-mono text-[10px] text-neutral-300 pointer-events-none select-none">+</div>
    </div>
  );
};
