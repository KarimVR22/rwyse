import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { defaultSizeGuide } from '../../data/initialData';
import { X, Check } from 'lucide-react';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();
  const [unit, setUnit] = useState<'cm' | 'inches'>('cm');

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSizeGuideOpen(false)}
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-2xl bg-[#111116] border border-neutral-800 text-neutral-100 shadow-2xl p-6 sm:p-8 z-10">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-neutral-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400">RWYSE Studio Guide</span>
              <h2 className="text-lg font-bold uppercase tracking-wider text-white mt-0.5">
                Fit & Measurements Guide
              </h2>
            </div>
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close size guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center justify-between my-5">
            <p className="text-xs text-neutral-400">
              Measurements taken with garment lying flat.
            </p>
            <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-sm">
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                  unit === 'cm' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                CM
              </button>
              <button
                onClick={() => setUnit('inches')}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                  unit === 'inches' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Inches
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-neutral-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-900/80 text-neutral-400 uppercase tracking-widest text-[11px] border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4 font-semibold text-white">Size</th>
                  <th className="py-3 px-4">Chest (Pit to Pit)</th>
                  <th className="py-3 px-4">Length</th>
                  <th className="py-3 px-4">Shoulder Width</th>
                  <th className="py-3 px-4">Sleeve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                {defaultSizeGuide.map((row) => (
                  <tr key={row.size} className="hover:bg-neutral-900/40">
                    <td className="py-3 px-4 font-bold text-white bg-neutral-900/30">{row.size}</td>
                    <td className="py-3 px-4">
                      {unit === 'cm' ? row.chest.split('(')[0].trim() : row.chest.split('(')[1]?.replace(')', '').trim()}
                    </td>
                    <td className="py-3 px-4">
                      {unit === 'cm' ? row.length.split('(')[0].trim() : row.length.split('(')[1]?.replace(')', '').trim()}
                    </td>
                    <td className="py-3 px-4">
                      {unit === 'cm' ? row.shoulders.split('(')[0].trim() : row.shoulders.split('(')[1]?.replace(')', '').trim()}
                    </td>
                    <td className="py-3 px-4">
                      {unit === 'cm' ? row.sleeve.split('(')[0].trim() : row.sleeve.split('(')[1]?.replace(')', '').trim()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Architectural Fit Advice */}
          <div className="mt-6 p-4 bg-neutral-900/60 border border-neutral-800/80 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Signature Silhouette Philosophy
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              RWYSE garments are deliberately engineered with a wide chest circumference, rigid upright collars, and dropped shoulder armholes. They are designed to sit naturally off the frame without clinging.
            </p>
            <ul className="text-xs text-neutral-300 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-white shrink-0" />
                <span><strong>Standard Drape:</strong> Choose your regular standard sizing for our intended relaxed architectural box cut.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-white shrink-0" />
                <span><strong>Exaggerated Street Look:</strong> Size up by one size for extended sleeve stacks and maximum volume.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Understood
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
