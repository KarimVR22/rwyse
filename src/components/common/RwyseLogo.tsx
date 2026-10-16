import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface RwyseLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  withSlogan?: boolean;
  interactiveSpin?: boolean;
  autoSpin?: boolean;
}

export const RwyseLogo: React.FC<RwyseLogoProps> = ({
  className = 'h-7 sm:h-8 w-auto',
  variant = 'auto',
  withSlogan = false,
  interactiveSpin = true,
  autoSpin = true,
}) => {
  const { language } = useLanguage();
  const [isSpinning, setIsSpinning] = useState(false);

  const fillColor = variant === 'dark' ? '#f4f4f6' : '#0a0a0a';

  const trigger360Spin = () => {
    if (!interactiveSpin || isSpinning) return;
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 1200);
  };

  return (
    <div
      className="inline-flex flex-col items-start select-none group/logo cursor-pointer perspective-1000"
      onMouseEnter={trigger360Spin}
      onClick={trigger360Spin}
      role="img"
      aria-label="RWYSE — Rise with you"
    >
      <div
        className={`preserve-3d transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isSpinning
            ? 'animate-spin-360'
            : autoSpin
            ? 'animate-auto-logo-spin'
            : 'group-hover/logo:scale-[1.03]'
        }`}
      >
        <svg
          viewBox="0 0 645 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Signature Iconic Orange Crescent Arc on Left (Matching official RWYSE identity) */}
          <path
            d="M26 6 C11 26, 4 55, 4 55 C4 55, 11 84, 26 104 C17 89, 12 72, 12 55 C12 38, 17 21, 26 6 Z"
            fill="#ff6400"
          />

          {/* Group containing RWYSE bold typographic glyphs */}
          <g transform="translate(18, 0)">
            {/* R */}
            <path
              d="M15 10H75C98 10 112 21 112 39C112 52 103 62 89 66L116 100H85L62 70H43V100H15V10ZM43 28V52H72C83 52 87 47 87 40C87 33 83 28 72 28H43Z"
              fill={fillColor}
            />
            {/* W */}
            <path
              d="M125 10H152L174 72L198 10H226L249 72L272 10H298L262 100H234L212 42L190 100H161L125 100L125 10Z"
              fill={fillColor}
            />
            {/* Y */}
            <path
              d="M305 10H334L364 57L394 10H423L378 68V100H350V68L305 10Z"
              fill={fillColor}
            />
            {/* S */}
            <path
              d="M433 76H460C460 83 466 87 478 87C490 87 496 82 496 76C496 70 489 67 470 63C442 57 433 50 433 34C433 17 449 10 477 10C504 10 520 18 520 35H494C494 28 488 24 477 24C466 24 460 28 460 34C460 40 467 43 487 47C513 52 523 60 523 75C523 93 506 101 477 101C446 101 433 93 433 76Z"
              fill={fillColor}
            />
            {/* E */}
            <path
              d="M532 10H600V28H560V46H595V64H560V82H602V100H532V10Z"
              fill={fillColor}
            />
          </g>
        </svg>
      </div>

      {withSlogan && (
        <span className="text-[9px] tracking-[0.32em] uppercase font-semibold text-neutral-600 mt-1 pl-1">
          {language === 'ar' ? 'ارتقِ مع نفسك' : 'Rise with you'}
        </span>
      )}
    </div>
  );
};
