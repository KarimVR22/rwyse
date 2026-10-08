import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProduct: (slug: string) => void;
  onNavigateToShop: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToProduct,
  onNavigateToShop,
}) => {
  const { products, siteSettings } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.collection.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelectProduct = (slug: string) => {
    onClose();
    onNavigateToProduct(slug);
  };

  const handleSeeAll = () => {
    onClose();
    onNavigateToShop();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            onClick={onClose}
          />

          <div className="min-h-full flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative w-full max-w-2xl bg-[#111116] border border-neutral-800 text-neutral-100 shadow-2xl p-6 sm:p-8 z-10"
            >
          
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
            <Search className="w-5 h-5 text-neutral-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="SEARCH HOODIE, CARGO, DROP 01..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-base sm:text-lg font-medium text-white placeholder-neutral-500 focus:outline-none uppercase tracking-wider font-mono"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white cursor-pointer ml-2"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Categories when empty */}
          {!query.trim() && (
            <div className="mt-6">
              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 block mb-3">
                POPULAR CATEGORIES
              </span>
              <div className="flex flex-wrap gap-2">
                {['Hoodies', 'Pants', 'T-Shirts', 'Jackets', 'Accessories'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setQuery(cat)}
                    className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {query.trim() && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-4">
                <span>
                  {filtered.length} {filtered.length === 1 ? 'RESULT' : 'RESULTS'} FOUND
                </span>
                {filtered.length > 0 && (
                  <button
                    onClick={handleSeeAll}
                    className="text-white hover:underline uppercase text-[11px] tracking-wider cursor-pointer"
                  >
                    See all in catalog
                  </button>
                )}
              </div>

              {filtered.length === 0 ? (
                <div className="py-12 text-center text-neutral-400">
                  <p className="text-sm">No items found matching "{query}"</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Try searching for "hoodie", "cargo", or "heavyweight"
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-800/80 max-h-96 overflow-y-auto">
                  {filtered.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod.slug)}
                      className="py-3 flex items-center gap-4 hover:bg-neutral-900/50 p-2 cursor-pointer transition-colors"
                    >
                      <div className="w-12 h-16 bg-neutral-900 border border-neutral-800 shrink-0 overflow-hidden">
                        <img
                          src={prod.colors[0]?.images[0]}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">
                          {prod.category} · {prod.collection}
                        </span>
                        <h4 className="text-xs font-semibold text-white uppercase tracking-wider truncate">
                          {prod.name}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-semibold text-neutral-200">
                          {(prod.salePrice || prod.price).toFixed(2)} {siteSettings.currency}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
