import React from 'react';

interface RwyseLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  withSlogan?: boolean;
}

export const RwyseLogo: React.FC<RwyseLogoProps> = ({
  className = 'h-7 w-auto',
  variant = 'auto',
  withSlogan = false,
}) => {
  const fillColor = variant === 'light' ? '#0c0c0e' : variant === 'dark' ? '#f4f4f6' : 'currentColor';

  return (
    <div className="inline-flex flex-col items-start select-none">
      <svg
        viewBox="0 0 615 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="RWYSE logo"
      >
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
      </svg>
      {withSlogan && (
        <span className="text-[9px] tracking-[0.32em] uppercase font-semibold text-neutral-400 mt-1 pl-0.5">
          Rise with you
        </span>
      )}
    </div>
  );
};
