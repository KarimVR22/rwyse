import React from 'react';
import { RwyseLogo } from '../components/common/RwyseLogo';
import { ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-[#0b0b0d] text-white min-h-[80vh] flex items-center justify-center p-6 select-none">
      <div className="max-w-lg text-center space-y-6">
        <RwyseLogo className="h-8 w-auto text-white mx-auto" />
        
        <div className="space-y-2 pt-4">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400 block">
            ERROR 404 // VOID ARCHIVE
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold uppercase text-white tracking-tight leading-none">
            LOST YOUR WAY?
          </h1>
          <h2 className="text-2xl sm:text-4xl font-display font-bold uppercase text-neutral-400 tracking-tight">
            RISE AGAIN.
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed font-light">
          The coordinate you requested does not exist or has been relocated to the permanent archive.
        </p>

        <div className="pt-4">
          <button
            onClick={() => onNavigate('/')}
            className="px-8 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-[0.25em] hover:bg-neutral-200 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xl"
          >
            <span>RETURN HOME</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
