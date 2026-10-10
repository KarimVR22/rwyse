import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { Product360Viewer } from '../components/common/Product360Viewer';
import { Ruler, ShieldCheck, Truck, RotateCcw, Plus, Minus, Check, ArrowRight, Share2, Bookmark, Image as ImageIcon } from 'lucide-react';
import { resolveProductImage } from '../utils/imageResolver';
import { hoodieImg } from '../data/initialData';

interface ProductDetailPageProps {
  slug: string;
  onNavigateToProduct: (slug: string) => void;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  slug,
  onNavigateToProduct,
  onNavigate,
}) => {
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideOpen,
    siteSettings,
    showToast,
  } = useStore();

  const product = products.find((p) => p.slug === slug) || products[0];

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'shipping'>('details');
  const [mediaMode, setMediaMode] = useState<'photos' | '360'>('photos');

  // Fit Simulator State
  const [showFitCalculator, setShowFitCalculator] = useState(false);
  const [userHeight, setUserHeight] = useState(180);
  const [userWeight, setUserWeight] = useState(76);

  // Compute calculated size
  const calculatedSize = (() => {
    if (userHeight < 172 && userWeight < 68) return 'S';
    if (userHeight < 179 && userWeight < 78) return 'M';
    if (userHeight < 186 && userWeight < 88) return 'L';
    if (userHeight < 192 && userWeight < 98) return 'XL';
    return 'XXL';
  })();

  // When product or color changes, reset image
  useEffect(() => {
    setSelectedColorIdx(0);
    setSelectedImageIdx(0);
    // Auto-select first in-stock size if available
    const inStockSize = product?.sizes.find((s) => s.stock > 0)?.size || '';
    setSelectedSize(inStockSize);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, product]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-[#0b0b0d] text-white">
        <h2 className="text-2xl font-bold uppercase tracking-wider">Product Not Found</h2>
        <button
          onClick={() => onNavigate('/shop')}
          className="mt-4 px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const activeColor = product.colors[selectedColorIdx] || product.colors[0];
  const rawImages = activeColor?.images?.length ? activeColor.images : product.colors[0]?.images || [];
  const images = rawImages.map((img) => resolveProductImage(img));
  const currentImage = images[selectedImageIdx] || images[0] || hoodieImg;

  const currentSizeObj = product.sizes.find((s) => s.size === selectedSize);
  const isOutOfStock = currentSizeObj ? currentSizeObj.stock === 0 : false;
  const isLowStock = currentSizeObj ? currentSizeObj.stock > 0 && currentSizeObj.stock <= 4 : false;
  const inWishlist = isInWishlist(product.id);

  const priceToUse = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;

  const handleAddToCart = () => {
    if (!selectedSize || isOutOfStock) return;
    addToCart(product, activeColor.name, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedSize || isOutOfStock) return;
    addToCart(product, activeColor.name, selectedSize, quantity);
    onNavigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `${product.name} on RWYSE - Rise with you`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard.');
    }
  };

  // Recommended related products
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="w-full bg-[#0b0b0d] text-white min-h-screen py-6 sm:py-12 pb-28 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[11px] text-neutral-400 uppercase tracking-widest mb-8">
          <button onClick={() => onNavigate('/')} className="hover:text-white transition-colors cursor-pointer">
            Home
          </button>
          <span>/</span>
          <button onClick={() => onNavigate('/shop')} className="hover:text-white transition-colors cursor-pointer">
            Catalog
          </button>
          <span>/</span>
          <span className="text-neutral-500">{product.category}</span>
          <span>/</span>
          <span className="text-white truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Contiguous Purchase Module Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Gallery Left (7 Cols on Desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Optional 360 Switcher only if 360 frames exist */}
            {(activeColor.threeSixtyFrames?.length || product.threeSixtyFrames?.length) ? (
              <div className="flex items-center gap-2 p-1.5 bg-[#101015] border border-neutral-800 rounded-sm">
                <button
                  type="button"
                  onClick={() => setMediaMode('photos')}
                  className={`flex-1 py-2 px-3 text-[11px] font-mono uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    mediaMode === 'photos'
                      ? 'bg-white text-black shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Editorial Lookbook</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMediaMode('360')}
                  className={`flex-1 py-2 px-3 text-[11px] font-mono uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    mediaMode === '360'
                      ? 'bg-white text-black shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>360° Rotation</span>
                </button>
              </div>
            ) : null}

            {/* Main Stage Display Area */}
            {mediaMode === '360' && (activeColor.threeSixtyFrames?.length || product.threeSixtyFrames?.length) ? (
              <Product360Viewer
                productName={product.name}
                frames={activeColor.threeSixtyFrames || product.threeSixtyFrames || images}
              />
            ) : (
              <>
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#141418] border border-white/[0.06]">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImage}
                      src={currentImage}
                      alt={product.name}
                      initial={{ opacity: 0.6, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0.6 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>

                  {/* Status Indicator */}
                  <div className="absolute top-4 left-4 z-10">
                    {product.isSoldOut ? (
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 bg-neutral-900/90 px-3 py-1 border border-neutral-700">
                        Archived · Sold Out
                      </span>
                    ) : product.isNewDrop ? (
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-black/85 px-3 py-1 border border-white/20">
                        Drop 01 Official
                      </span>
                    ) : null}
                  </div>

                  {/* Wishlist floating button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-4 right-4 p-2.5 rounded-full transition-all cursor-pointer z-10 ${
                      inWishlist
                        ? 'bg-white text-black'
                        : 'bg-black/50 text-neutral-300 hover:text-white hover:bg-black/80 backdrop-blur-xs'
                    }`}
                    aria-label="Save to wishlist"
                  >
                    <Bookmark className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Thumbnail Row */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIdx(idx)}
                        className={`aspect-[3/4] overflow-hidden bg-neutral-900 border transition-all cursor-pointer ${
                          selectedImageIdx === idx
                            ? 'border-white opacity-100 ring-1 ring-white'
                            : 'border-neutral-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} view ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Editorial Lookbook Craft Detail Box */}
            <div className="mt-6 p-6 bg-neutral-900/40 border border-neutral-800/80 hidden sm:block">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 block mb-2">
                BESPOKE CRAFTSMANSHIP DIRECTIVE
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Engineered with high-density loopback knitting techniques in Tunisia. The garment undergoes an artisanal preshrink process to ensure the architectural shape, collar stance, and drape remain invariant across repeated wear.
              </p>
            </div>

          </div>

          {/* Sticky Purchase Module Right (5 Cols on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            
            {/* Header Lockup */}
            <div className="border-b border-neutral-800 pb-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-neutral-400 mb-2">
                <span>{product.category} · {product.collection}</span>
                <span className="font-mono text-neutral-500">SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                {product.salePrice && product.salePrice < product.price ? (
                  <>
                    <span className="text-2xl font-bold font-mono text-white">
                      {product.salePrice.toFixed(2)} {siteSettings.currency}
                    </span>
                    <span className="text-sm font-mono text-neutral-400 line-through">
                      {product.price.toFixed(2)} {siteSettings.currency}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                      Save {(product.price - product.salePrice).toFixed(0)} {siteSettings.currency}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold font-mono text-white">
                    {product.price.toFixed(2)} {siteSettings.currency}
                  </span>
                )}
              </div>

              <p className="mt-3 text-xs text-neutral-400 leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Color Swatches */}
            <div>
              <div className="flex items-center justify-between text-xs tracking-wider uppercase mb-2.5">
                <span className="text-neutral-400">Color Palette:</span>
                <span className="font-semibold text-white font-mono">{activeColor.name}</span>
              </div>
              <div className="flex items-center gap-2.5">
                {product.colors.map((c, idx) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedColorIdx(idx);
                      setSelectedImageIdx(0);
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                      selectedColorIdx === idx
                        ? 'border-white scale-110 shadow-md'
                        : 'border-neutral-700 hover:border-neutral-400'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColorIdx === idx && (
                      <span className={`w-1.5 h-1.5 rounded-full ${c.hex === '#111111' ? 'bg-white' : 'bg-black'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between text-xs tracking-wider uppercase mb-2.5">
                <span className="text-neutral-400">Available Sizes:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFitCalculator(!showFitCalculator)}
                    className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 underline cursor-pointer tracking-wider"
                  >
                    <span>{showFitCalculator ? 'Hide Fit Advisor' : 'Find My Size'}</span>
                  </button>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1.5 text-[11px] text-neutral-300 hover:text-white underline cursor-pointer tracking-wider"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Chart</span>
                  </button>
                </div>
              </div>

              {/* Interactive Fit Calculator */}
              {showFitCalculator && (
                <div className="mb-4 p-4 bg-neutral-900/90 border border-neutral-700/80 rounded-xs space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase text-neutral-300">
                    <span className="font-semibold text-white">Interactive Fit Simulator</span>
                    <span className="text-blue-400">RWYSE AI Fit Guide</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                        <span>Height:</span>
                        <strong className="text-white font-mono">{userHeight} cm</strong>
                      </div>
                      <input
                        type="range"
                        min="160"
                        max="205"
                        value={userHeight}
                        onChange={(e) => setUserHeight(Number(e.target.value))}
                        className="w-full accent-white cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                        <span>Weight:</span>
                        <strong className="text-white font-mono">{userWeight} kg</strong>
                      </div>
                      <input
                        type="range"
                        min="55"
                        max="120"
                        value={userWeight}
                        onChange={(e) => setUserWeight(Number(e.target.value))}
                        className="w-full accent-white cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 bg-black/60 border border-neutral-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase font-mono">Recommended Cut:</span>
                      <strong className="text-white font-mono text-sm">
                        Size {calculatedSize} ({userHeight > 182 ? 'Extended Drape' : 'True Box Drape'})
                      </strong>
                    </div>
                    <button
                      onClick={() => setSelectedSize(calculatedSize)}
                      className="px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-200 cursor-pointer"
                    >
                      Select Size {calculatedSize}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((s) => {
                  const outOfStock = s.stock === 0;
                  const isSelected = selectedSize === s.size;
                  return (
                    <button
                      key={s.size}
                      disabled={outOfStock}
                      onClick={() => setSelectedSize(s.size)}
                      className={`py-3 text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                        outOfStock
                          ? 'border-neutral-800 text-neutral-600 bg-neutral-950/40 cursor-not-allowed line-through'
                          : isSelected
                          ? 'border-white bg-white text-black font-bold shadow-md'
                          : 'border-neutral-800 text-neutral-200 hover:border-neutral-500 bg-neutral-900/50'
                      }`}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>

              {/* Stock status indicator */}
              <div className="mt-2.5 min-h-[20px] text-[11px]">
                {!selectedSize ? (
                  <span className="text-neutral-400">Please choose a size to view availability</span>
                ) : isOutOfStock ? (
                  <span className="text-red-400 font-semibold uppercase tracking-wider">
                    Sold Out in size {selectedSize}
                  </span>
                ) : isLowStock ? (
                  <span className="text-amber-300 font-medium uppercase tracking-wider">
                    ⚠ Low Stock · Only {currentSizeObj?.stock} remaining
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1.5 font-medium tracking-wider">
                    <Check className="w-3.5 h-3.5" /> Ready for immediate dispatch
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs uppercase tracking-wider text-neutral-400">Quantity:</span>
              <div className="flex items-center border border-neutral-800 bg-neutral-950">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 px-3 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono font-bold px-3">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 px-3 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Purchase Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                disabled={!selectedSize || isOutOfStock}
                onClick={handleAddToCart}
                className={`w-full py-4 text-xs font-bold uppercase tracking-[0.25em] transition-all cursor-pointer shadow-lg ${
                  !selectedSize || isOutOfStock
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                {!selectedSize
                  ? 'Select a Size'
                  : isOutOfStock
                  ? 'Sold Out'
                  : 'Add to Bag'}
              </button>

              <button
                disabled={!selectedSize || isOutOfStock}
                onClick={handleBuyNow}
                className={`w-full py-3.5 text-xs font-semibold uppercase tracking-[0.25em] border transition-all cursor-pointer ${
                  !selectedSize || isOutOfStock
                    ? 'border-neutral-800 text-neutral-600 cursor-not-allowed'
                    : 'border-neutral-700 bg-neutral-900/60 text-white hover:border-white'
                }`}
              >
                Buy Now (Direct Checkout)
              </button>

              <a
                href={`https://wa.me/21652000000?text=${encodeURIComponent(`Bonjour RWYSE, je souhaite commander la pièce "${product.name}" (${priceToUse} ${siteSettings.currency}) en taille ${selectedSize || 'standard'}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 text-xs font-semibold uppercase tracking-[0.2em] bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 flex items-center justify-center gap-2 transition-all cursor-pointer rounded-xs"
              >
                <span>Commander via WhatsApp</span>
              </a>
            </div>

            {/* Share & Trust badges */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-300" />
                <span>Authentic RWYSE Garment</span>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 hover:text-white cursor-pointer uppercase tracking-wider"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Piece</span>
              </button>
            </div>

            {/* Editorial Information Accordion */}
            <div className="pt-4 border-t border-neutral-800 space-y-3">
              <div className="flex border-b border-neutral-800">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-2 px-3 text-xs uppercase tracking-wider font-semibold border-b-2 cursor-pointer transition-colors ${
                    activeTab === 'details' ? 'border-white text-white' : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Features
                </button>
                <button
                  onClick={() => setActiveTab('fabric')}
                  className={`py-2 px-3 text-xs uppercase tracking-wider font-semibold border-b-2 cursor-pointer transition-colors ${
                    activeTab === 'fabric' ? 'border-white text-white' : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Fabric & Care
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`py-2 px-3 text-xs uppercase tracking-wider font-semibold border-b-2 cursor-pointer transition-colors ${
                    activeTab === 'shipping' ? 'border-white text-white' : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Shipping & Returns
                </button>
              </div>

              <div className="p-3 bg-neutral-900/30 text-xs text-neutral-300 leading-relaxed min-h-[100px]">
                {activeTab === 'details' && (
                  <ul className="space-y-1.5 list-disc list-inside text-neutral-300">
                    {product.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                )}

                {activeTab === 'fabric' && (
                  <div className="space-y-2">
                    <p><strong>Composition:</strong> {product.fabric}</p>
                    <p><strong>Fit:</strong> {product.fit}</p>
                    <p><strong>Care:</strong> {product.careInstructions}</p>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Truck className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                      <span><strong>Livraison Nationale Fixe 8 DT :</strong> Expédition en 24–48h sur tous les gouvernorats de Tunisie. Paiement uniquement à la livraison (Cash on Delivery).</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <RotateCcw className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                      <span><strong>14-Day Exchanges:</strong> Complimentary size exchange if garment is unworn with tags attached.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Recommended Pairings Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-neutral-800/80">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
                  COMPLETE THE LOOK
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-extrabold uppercase text-white tracking-tight">
                  Complementary Silhouettes
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onNavigateToProduct={onNavigateToProduct}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Sticky Bottom Bar for Mobile Devices */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-[#0c0c0f]/95 backdrop-blur-md border-t border-neutral-800 p-3 z-40 shadow-2xl safe-area-inset-bottom">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="min-w-0 flex-1">
            <span className="text-[11px] text-neutral-300 truncate font-medium block">{product.name}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-mono font-bold text-white">
                {priceToUse.toFixed(2)} {siteSettings.currency}
              </span>
              {selectedSize ? (
                <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">
                  Taille : {selectedSize}
                </span>
              ) : (
                <span className="text-[10px] text-amber-400">Choisir taille</span>
              )}
            </div>
          </div>

          <button
            disabled={isOutOfStock}
            onClick={() => {
              const inStock = product.sizes.filter((s) => s.stock > 0);
              if (!selectedSize && inStock.length > 0) {
                setSelectedSize(inStock[0].size);
                showToast(`Taille ${inStock[0].size} sélectionnée. Cliquez à nouveau pour ajouter au panier.`);
              } else {
                handleAddToCart();
              }
            }}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg rounded-xs ${
              isOutOfStock
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-white text-black hover:bg-neutral-200'
            }`}
          >
            {isOutOfStock ? 'Épuisé' : !selectedSize ? 'Sélectionner' : 'Ajouter au Panier'}
          </button>
        </div>
      </div>
    </div>
  );
};
