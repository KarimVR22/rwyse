import React from 'react';
import { RwyseLogo } from '../components/common/RwyseLogo';
import { heroImg, editorialImg, hoodieImg, teeImg } from '../data/initialData';
import { ArrowRight } from 'lucide-react';

export const AboutPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-[#0b0b0d] text-white min-h-screen py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Manifesto Opening */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1.5px] bg-white" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.35em] text-neutral-400">
              PHILOSOPHICAL DIRECTIVE
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold uppercase text-white tracking-tight leading-[1.05]">
            RISE WITH YOU.
          </h1>

          <p className="mt-8 text-base sm:text-xl text-neutral-300 font-light leading-relaxed">
            RWYSE was born in Tunisia from a singular conviction: contemporary fashion should not be a fleeting costume, but an architectural armor for ambition, discipline, and communal elevation.
          </p>
        </div>

        {/* Editorial Split Showcase 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <div className="aspect-[4/3] bg-neutral-900 border border-neutral-800 overflow-hidden">
              <img
                src={heroImg}
                alt="RWYSE Architectural Campaign"
                className="w-full h-full object-cover filter contrast-[1.05]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block">
              PILLAR 01 // MATERIAL INVARIANCE
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight">
              Weight as Structure
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
              We reject paper-thin streetwear. Our signature pieces begin with custom 500 GSM loopback cotton terry, milled to our exacting physical tension. Every seam, double-needle topstitch, and collar rib is engineered to retain shape after hundred-day cycles of relentless urban wear.
            </p>
          </div>
        </div>

        {/* Editorial Split Showcase 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block">
              PILLAR 02 // PROPORTION & DRAPE
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight">
              Architectural Brutalism
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
              Inspired by brutalist concrete forms, our cuts emphasize horizontal shoulders, extended chest breadth, and deliberate drape. The garment stands separate from the body, affording confidence and effortless physical presence.
            </p>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="aspect-[4/3] bg-neutral-900 border border-neutral-800 overflow-hidden">
              <img
                src={editorialImg}
                alt="RWYSE Editorial Studio"
                className="w-full h-full object-cover filter contrast-[1.05]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Community Manifesto Block */}
        <div className="p-8 sm:p-14 bg-[#111116] border border-neutral-800 text-center space-y-6 max-w-4xl mx-auto">
          <RwyseLogo className="h-9 w-auto text-white mx-auto" />
          <h3 className="text-2xl sm:text-4xl font-display font-extrabold uppercase text-white tracking-tight">
            WE DO NOT RISE ALONE.
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mx-auto leading-relaxed font-light">
            Every garment we produce carries our promise: to accompany you through late-night creative sessions, early morning discipline, and the moments when you choose to push past limitations.
          </p>
          <div className="pt-4">
            <button
              onClick={() => onNavigate('/shop')}
              className="px-8 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-[0.25em] hover:bg-neutral-200 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xl"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
