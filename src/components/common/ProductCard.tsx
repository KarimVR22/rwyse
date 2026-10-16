import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Bookmark, Eye, Plus, Check } from 'lucide-react';
import { motion } from 'motion/react';

import { resolveProductImage } from '../../utils/imageResolver';
import { hoodieImg } from '../../data/initialData';

interface ProductCardProps {
  product: Product;
  onNavigateToProduct: (slug: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigateToProduct }) => {
  const { isInWishlist, toggleWishlist, addToCart, setQuickViewProduct, siteSettings } = useStore();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [quickAdded, setQuickAdded] = useState(false);

  const activeColor = product.colors[selectedColorIndex] || product.colors[0];
  const rawPrimary = activeColor?.images[0] || product.colors[0]?.images[0];
  const rawHover = activeColor?.images[1] || rawPrimary;
  const primaryImg = resolveProductImage(rawPrimary);
  const hoverImg = resolveProductImage(rawHover);

  const totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);
  const isSoldOut = product.isSoldOut || totalStock === 0;
  const isLowStock = !isSoldOut && totalStock <= 5;
  const inWishlist = isInWishlist(product.id);
  const [addedSize, setAddedSize] = useState<string | null>(null);

  // Available size for 1-click quick add (first in-stock size, usually M or L)
  const defaultSize = product.sizes.find((s) => s.stock > 0)?.size || product.sizes[0]?.size;

  const handleQuickAddSize = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    if (isSoldOut) return;

    addToCart(product, activeColor.name, size, 1);
    setAddedSize(size);
    setQuickAdded(true);
    setTimeout(() => {
      setQuickAdded(false);
      setAddedSize(null);
    }, 1800);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    if (defaultSize) {
      handleQuickAddSize(e, defaultSize);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col cursor-pointer transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onNavigateToProduct(product.slug)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 border border-neutral-200/80">
        {/* Primary Image */}
        <img
          src={primaryImg}
          alt={product.name}
          className={`h-full w-full object-cover object-center transition-all duration-700 ease-out ${
            isHovered && hoverImg !== primaryImg ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Secondary Hover Image */}
        {hoverImg !== primaryImg && (
          <img
            src={hoverImg}
            alt={`${product.name} alternate view`}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        )}

        {/* Status indicator: Unboxed clean text tag & Fabric badge */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1 z-10 pointer-events-none">
          {isSoldOut ? (
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600 bg-neutral-100/90 px-2 py-0.5 border border-neutral-300">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-900 bg-amber-100/95 px-2 py-0.5 border border-amber-300">
              Low Stock · {totalStock} Left
            </span>
          ) : product.isNewDrop ? (
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-black px-2 py-0.5 border border-black shadow-xs">
              New Drop
            </span>
          ) : null}

          {/* Luxury Fabric Weight Badge */}
          {product.fabric && product.fabric.includes('500 GSM') && (
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-orange-600 bg-white/95 px-1.5 py-0.5 border border-orange-300/80 shadow-xs">
              500 GSM HEAVYWEIGHT
            </span>
          )}
        </div>

        {/* Technical Corner Crosshairs (High Fashion Detail) */}
        <div className="absolute top-1.5 left-1.5 font-mono text-[8px] text-neutral-400 opacity-60 pointer-events-none">+</div>
        <div className="absolute bottom-1.5 right-1.5 font-mono text-[8px] text-neutral-400 opacity-60 pointer-events-none">+</div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 cursor-pointer ${
            inWishlist
              ? 'bg-black text-white shadow-md'
              : 'bg-white/90 text-neutral-700 hover:text-black hover:bg-white backdrop-blur-xs border border-neutral-200 shadow-xs'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Actions Hover Drawer */}
        <div className="absolute inset-x-2 sm:inset-x-3 bottom-2 sm:bottom-3 flex flex-col gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 z-10">
          {!isSoldOut && (
            <div className="flex items-center justify-center gap-1 p-1 bg-black/90 backdrop-blur-md border border-white/20 shadow-xl">
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest px-1 hidden xs:inline">
                + Bag:
              </span>
              {product.sizes.map((s) => (
                <button
                  key={s.size}
                  disabled={s.stock <= 0}
                  onClick={(e) => handleQuickAddSize(e, s.size)}
                  className={`px-2 py-1 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                    s.stock <= 0
                      ? 'text-neutral-600 line-through cursor-not-allowed opacity-40'
                      : addedSize === s.size
                      ? 'bg-emerald-500 text-white scale-110 shadow-sm'
                      : 'text-white hover:bg-white hover:text-black hover:scale-105'
                  }`}
                  title={s.stock > 0 ? `Ajouter taille ${s.size}` : `${s.size} Épuisé`}
                >
                  {addedSize === s.size ? '✓' : s.size}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-1.5">
            <button
              onClick={handleQuickView}
              className="flex-1 py-1.5 sm:py-2 bg-white/95 hover:bg-white text-neutral-900 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-md border border-neutral-200 shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              <span>Aperçu Rapide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="mt-3.5 flex flex-col gap-1.5">
        
        {/* Category & Collection quiet metadata */}
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 uppercase tracking-widest">
          <span>{product.category}</span>
          <span aria-hidden="true">·</span>
          <span className="text-neutral-400 truncate">{product.collection}</span>
        </div>

        {/* Product Name */}
        <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 tracking-wide line-clamp-1 group-hover:text-black transition-colors">
          {product.name}
        </h3>

        {/* Price & Color swatches row */}
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {product.salePrice && product.salePrice < product.price ? (
              <>
                <span className="text-xs sm:text-sm font-bold font-mono text-neutral-900">
                  {product.salePrice.toFixed(2)} {siteSettings.currency}
                </span>
                <span className="text-[11px] font-mono text-neutral-400 line-through">
                  {product.price.toFixed(2)} {siteSettings.currency}
                </span>
              </>
            ) : (
              <span className="text-xs sm:text-sm font-bold font-mono text-neutral-900">
                {product.price.toFixed(2)} {siteSettings.currency}
              </span>
            )}
          </div>

          {/* Color Indicators */}
          {product.colors.length > 1 && (
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              {product.colors.map((color, idx) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColorIndex(idx)}
                  className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                    selectedColorIndex === idx
                      ? 'scale-125 border-black shadow-xs'
                      : 'border-neutral-300 hover:border-neutral-500'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={`Select color ${color.name}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sizes availability preview */}
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-neutral-500 tracking-wider">
          <span className="text-neutral-400 uppercase">Sizes:</span>
          {product.sizes.map((s) => (
            <span
              key={s.size}
              className={`${s.stock > 0 ? 'text-neutral-700 font-medium' : 'text-neutral-300 line-through'}`}
            >
              {s.size}
            </span>
          ))}
        </div>

      </div>
    </motion.div>
  );
};
