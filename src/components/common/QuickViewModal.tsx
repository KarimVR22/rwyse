import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Plus, Minus, ArrowRight, Ruler, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { resolveProductImage } from '../../utils/imageResolver';
import { hoodieImg } from '../../data/initialData';

interface QuickViewModalProps {
  onNavigateToProduct: (slug: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ onNavigateToProduct }) => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    setIsSizeGuideOpen,
    siteSettings,
  } = useStore();

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);

  const activeColor = quickViewProduct ? quickViewProduct.colors[selectedColorIdx] || quickViewProduct.colors[0] : null;
  const rawImages = activeColor ? (activeColor.images.length > 0 ? activeColor.images : quickViewProduct?.colors[0]?.images || []) : [];
  const images = rawImages.map((img) => resolveProductImage(img));
  const currentImg = images[selectedImgIdx] || images[0] || hoodieImg;

  const currentSizeObj = quickViewProduct?.sizes.find((s) => s.size === selectedSize);
  const isOutOfStock = currentSizeObj ? currentSizeObj.stock === 0 : false;
  const isLowStock = currentSizeObj ? currentSizeObj.stock > 0 && currentSizeObj.stock <= 4 : false;

  const handleAddToCart = () => {
    if (!quickViewProduct || !selectedSize || isOutOfStock || !activeColor) return;
    addToCart(quickViewProduct, activeColor.name, selectedSize, quantity);
    setQuickViewProduct(null);
  };

  const handleFullView = () => {
    if (!quickViewProduct) return;
    const slug = quickViewProduct.slug;
    setQuickViewProduct(null);
    onNavigateToProduct(slug);
  };

  return (
    <AnimatePresence>
      {quickViewProduct && activeColor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setQuickViewProduct(null)}
          />

          <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-3xl bg-[#111116] border border-neutral-800 text-neutral-100 shadow-2xl overflow-hidden z-10"
            >
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 text-neutral-400 hover:text-white bg-black/60 rounded-full cursor-pointer transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Left */}
            <div className="bg-[#141419] p-6 flex flex-col justify-between">
              <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-900 border border-neutral-800 relative">
                <img
                  src={currentImg}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIdx(idx)}
                      className={`w-14 h-18 overflow-hidden border transition-all shrink-0 cursor-pointer ${
                        selectedImgIdx === idx ? 'border-white' : 'border-neutral-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Right */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-neutral-400 uppercase tracking-widest">
                  <span>{quickViewProduct.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{quickViewProduct.collection}</span>
                </div>

                <h2 className="text-lg font-bold text-white uppercase tracking-wide mt-2">
                  {quickViewProduct.name}
                </h2>

                {/* Price */}
                <div className="mt-3 flex items-baseline gap-3">
                  {quickViewProduct.salePrice && quickViewProduct.salePrice < quickViewProduct.price ? (
                    <>
                      <span className="text-xl font-bold font-mono text-white">
                        {quickViewProduct.salePrice.toFixed(2)} {siteSettings.currency}
                      </span>
                      <span className="text-sm font-mono text-neutral-400 line-through">
                        {quickViewProduct.price.toFixed(2)} {siteSettings.currency}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold font-mono text-white">
                      {quickViewProduct.price.toFixed(2)} {siteSettings.currency}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-xs text-neutral-400 leading-relaxed line-clamp-3">
                  {quickViewProduct.description}
                </p>

                {/* Color Selector */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs tracking-wider uppercase mb-2">
                    <span className="text-neutral-400">Color:</span>
                    <span className="font-semibold text-white">{activeColor.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {quickViewProduct.colors.map((c, idx) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          setSelectedColorIdx(idx);
                          setSelectedImgIdx(0);
                        }}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                          selectedColorIdx === idx ? 'scale-110 border-white' : 'border-neutral-700 hover:border-neutral-500'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs tracking-wider uppercase mb-2">
                    <span className="text-neutral-400">Select Size:</span>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
                    >
                      <Ruler className="w-3 h-3" />
                      <span>Size Guide</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {quickViewProduct.sizes.map((s) => {
                      const disabled = s.stock === 0;
                      const isSelected = selectedSize === s.size;
                      return (
                        <button
                          key={s.size}
                          disabled={disabled}
                          onClick={() => setSelectedSize(s.size)}
                          className={`py-2 text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                            disabled
                              ? 'border-neutral-800 text-neutral-600 bg-neutral-950/50 cursor-not-allowed line-through'
                              : isSelected
                              ? 'border-white bg-white text-black'
                              : 'border-neutral-800 text-neutral-300 hover:border-neutral-500 bg-neutral-900/60'
                          }`}
                        >
                          {s.size}
                        </button>
                      );
                    })}
                  </div>

                  {selectedSize && (
                    <div className="mt-2 text-[11px]">
                      {isOutOfStock ? (
                        <span className="text-red-400 uppercase font-semibold tracking-wider">Sold out in size {selectedSize}</span>
                      ) : isLowStock ? (
                        <span className="text-amber-300 uppercase font-medium tracking-wider">
                          ⚠ Only {currentSizeObj?.stock} remaining in size {selectedSize}
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1 font-medium tracking-wider">
                          <Check className="w-3 h-3" /> In stock (Dispatches within 24h)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div className="mt-6 flex items-center gap-4">
                  <span className="text-xs uppercase tracking-wider text-neutral-400">Qty:</span>
                  <div className="flex items-center border border-neutral-800 bg-neutral-900">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 px-3 text-neutral-400 hover:text-white cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-mono font-bold px-3">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1.5 px-3 text-neutral-400 hover:text-white cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions Bottom */}
              <div className="mt-8 space-y-2.5">
                <button
                  disabled={!selectedSize || isOutOfStock}
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 text-xs font-bold uppercase tracking-[0.25em] transition-all cursor-pointer ${
                    !selectedSize || isOutOfStock
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                >
                  {!selectedSize
                    ? 'Select Size to Add'
                    : isOutOfStock
                    ? 'Sold Out'
                    : 'Add to Bag'}
                </button>

                <button
                  onClick={handleFullView}
                  className="w-full py-2.5 bg-transparent border border-neutral-800 hover:border-neutral-600 text-xs font-medium uppercase tracking-[0.2em] text-neutral-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>View Full Product Page</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
