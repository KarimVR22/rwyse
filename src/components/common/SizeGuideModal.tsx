import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { defaultSizeGuide } from '../../data/initialData';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();
  const [unit, setUnit] = useState<'cm' | 'inches'>('cm');

  return (
    <AnimatePresence>
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSizeGuideOpen(false)}
          />

          <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative w-full max-w-2xl bg-white border border-neutral-200 text-neutral-900 shadow-2xl p-6 sm:p-8 z-10 rounded-xs"
            >
          
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-neutral-200">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500">RWYSE Studio Guide</span>
              <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-900 mt-0.5">
                Fit & Measurements Guide
              </h2>
            </div>
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-black transition-colors cursor-pointer"
              aria-label="Close size guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center justify-between my-5">
            <p className="text-xs text-neutral-500">
              Measurements taken with garment lying flat.
            </p>
            <div className="flex items-center p-1 bg-neutral-100 border border-neutral-200 rounded-sm">
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                  unit === 'cm' ? 'bg-white text-black shadow-xs' : 'text-neutral-500 hover:text-black'
                }`}
              >
                CM
              </button>
              <button
                onClick={() => setUnit('inches')}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                  unit === 'inches' ? 'bg-white text-black shadow-xs' : 'text-neutral-500 hover:text-black'
                }`}
              >
                Inches
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-neutral-200 rounded-xs">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-50 text-neutral-600 uppercase tracking-widest text-[11px] border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4 font-semibold text-neutral-900">Size</th>
                  <th className="py-3 px-4">Chest (Pit to Pit)</th>
                  <th className="py-3 px-4">Length</th>
                  <th className="py-3 px-4">Shoulder Width</th>
                  <th className="py-3 px-4">Sleeve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-neutral-700">
                {defaultSizeGuide.map((row) => (
                  <tr key={row.size} className="hover:bg-neutral-50">
                    <td className="py-3 px-4 font-bold text-neutral-900 bg-neutral-100/50">{row.size}</td>
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
          <div className="mt-6 p-4 bg-neutral-50 border border-neutral-200 space-y-2 rounded-xs">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
              Signature Silhouette Philosophy
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              RWYSE garments are deliberately engineered with a wide chest circumference, rigid upright collars, and dropped shoulder armholes. They are designed to sit naturally off the frame without clinging.
            </p>
            <ul className="text-xs text-neutral-700 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                <span><strong>Standard Drape:</strong> Choose your regular standard sizing for our intended relaxed architectural box cut.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                <span><strong>Exaggerated Street Look:</strong> Size up by one size for extended sleeve stacks and maximum volume.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer shadow-sm"
            >
              Understood
            </button>
          </div>

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
