import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Bookmark, Eye, Plus, Check } from 'lucide-react';
import { motion } from 'motion/react';

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
  const primaryImg = activeColor.images[0] || product.colors[0]?.images[0];
  const hoverImg = activeColor.images[1] || primaryImg;

  const totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);
  const isSoldOut = product.isSoldOut || totalStock === 0;
  const isLowStock = !isSoldOut && totalStock <= 5;
  const inWishlist = isInWishlist(product.id);

  // Available size for 1-click quick add (first in-stock size, usually M or L)
  const defaultSize = product.sizes.find((s) => s.stock > 0)?.size || product.sizes[0]?.size;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut || !defaultSize) return;

    addToCart(product, activeColor.name, defaultSize, 1);
    setQuickAdded(true);
    setTimeout(() => setQuickAdded(false), 1800);
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
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#141418] border border-white/[0.04]">
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

        {/* Status indicator: Unboxed clean text tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {isSoldOut ? (
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 bg-neutral-900/90 px-2 py-0.5 border border-neutral-700">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300 bg-black/85 px-2 py-0.5 border border-amber-900/50">
              Low Stock · {totalStock} Left
            </span>
          ) : product.isNewDrop ? (
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-black/85 px-2 py-0.5 border border-white/20">
              New Drop
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 cursor-pointer ${
            inWishlist
              ? 'bg-white text-black'
              : 'bg-black/40 text-neutral-300 hover:text-white hover:bg-black/70 backdrop-blur-xs'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Actions Hover Drawer (Always visible on mobile touch, hover on desktop) */}
        <div className="absolute inset-x-2 sm:inset-x-3 bottom-2 sm:bottom-3 flex gap-1.5 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleQuickView}
            className="flex-1 py-2 sm:py-2.5 bg-neutral-900/90 hover:bg-neutral-800 text-white text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest backdrop-blur-md border border-neutral-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Aperçu</span>
          </button>

          {!isSoldOut && (
            <button
              onClick={handleQuickAdd}
              className={`px-2.5 sm:px-3 py-2 sm:py-2.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest backdrop-blur-md transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                quickAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
              title={`Ajout Rapide (Taille ${defaultSize})`}
            >
              {quickAdded ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              <span className="inline">{quickAdded ? 'Ajouté' : defaultSize}</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Details Section */}
      <div className="mt-3.5 flex flex-col gap-1.5">
        
        {/* Category & Collection quiet metadata */}
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 uppercase tracking-widest">
          <span>{product.category}</span>
          <span aria-hidden="true">·</span>
          <span className="text-neutral-500 truncate">{product.collection}</span>
        </div>

        {/* Product Name */}
        <h3 className="text-xs sm:text-sm font-semibold text-neutral-100 tracking-wide line-clamp-1 group-hover:text-white transition-colors">
          {product.name}
        </h3>

        {/* Price & Color swatches row */}
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {product.salePrice && product.salePrice < product.price ? (
              <>
                <span className="text-xs sm:text-sm font-semibold font-mono text-white">
                  {product.salePrice.toFixed(2)} {siteSettings.currency}
                </span>
                <span className="text-[11px] font-mono text-neutral-400 line-through">
                  {product.price.toFixed(2)} {siteSettings.currency}
                </span>
              </>
            ) : (
              <span className="text-xs sm:text-sm font-semibold font-mono text-neutral-200">
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
                      ? 'scale-125 border-white shadow-sm'
                      : 'border-neutral-600 hover:border-neutral-400'
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
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-neutral-400 tracking-wider">
          <span className="text-neutral-500 uppercase">Sizes:</span>
          {product.sizes.map((s) => (
            <span
              key={s.size}
              className={`${s.stock > 0 ? 'text-neutral-300' : 'text-neutral-600 line-through'}`}
            >
              {s.size}
            </span>
          ))}
        </div>

      </div>
    </motion.div>
  );
};
