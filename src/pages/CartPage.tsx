import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Minus, Trash2, ArrowRight, ArrowLeft, Tag, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';

interface CartPageProps {
  onNavigate: (path: string) => void;
  onNavigateToProduct: (slug: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate, onNavigateToProduct }) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    appliedPromo,
    applyPromo,
    removePromo,
    siteSettings,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discountAmount = appliedPromo
    ? appliedPromo.discountType === 'percentage'
      ? (subtotal * appliedPromo.value) / 100
      : Math.min(subtotal, appliedPromo.value)
    : 0;

  const deliveryFee = cart.length === 0 ? 0 : 8;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    if (!promoInput.trim()) return;

    const res = applyPromo(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="w-full bg-[#0b0b0d] text-white min-h-[75vh] flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-2">
            BAG STATUS // EMPTY
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight">
            Your Bag is Empty
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
            You haven't added any garments to your bag yet. Explore our foundational drop or curated monochrome collections.
          </p>
          <div className="mt-8">
            <button
              onClick={() => onNavigate('/shop')}
              className="px-8 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-[0.25em] hover:bg-neutral-200 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0b0b0d] text-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-neutral-800/80 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
              ORDER STAGING
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold uppercase text-white tracking-tight">
              Shopping Bag
            </h1>
          </div>
          <button
            onClick={() => onNavigate('/shop')}
            className="text-xs text-neutral-400 hover:text-white uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Fixed 8 DT Shipping Banner */}
        <div className="p-4 bg-neutral-900/60 border border-neutral-800 mb-8 flex items-center justify-between text-xs tracking-wider uppercase">
          <span className="text-neutral-200 flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>Tarif de livraison fixe : <strong>8 DT</strong> sur toute la Tunisie · Paiement seul à la livraison</span>
          </span>
          <span className="font-mono text-emerald-400 font-bold text-xs">8 DT EXPRESS</span>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Items Table Left (8 Cols) */}
          <div className="lg:col-span-8">
            <div className="border-t border-neutral-800 divide-y divide-neutral-800/80">
              {cart.map((item) => (
                <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-6 items-start">
                  
                  {/* Thumbnail */}
                  <div
                    onClick={() => onNavigateToProduct(item.product.slug)}
                    className="w-24 sm:w-28 aspect-[3/4] bg-neutral-900 border border-neutral-800 shrink-0 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={
                        item.product.colors.find((c) => c.name === item.selectedColor)?.images[0] ||
                        item.product.colors[0]?.images[0]
                      }
                      alt={item.product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between w-full h-full min-h-[110px]">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                            {item.product.category}
                          </span>
                          <h3
                            onClick={() => onNavigateToProduct(item.product.slug)}
                            className="text-sm sm:text-base font-semibold text-white uppercase tracking-wider hover:underline cursor-pointer"
                          >
                            {item.product.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-xs text-neutral-400">
                        <span>Color: <strong className="text-white">{item.selectedColor}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Size: <strong className="text-white font-mono">{item.selectedSize}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Unit: <span className="font-mono text-neutral-300">{item.price.toFixed(2)} {siteSettings.currency}</span></span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-3 border-t border-neutral-900">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-neutral-800 bg-neutral-950">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 px-3 text-neutral-400 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-mono font-bold px-3">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 px-3 text-neutral-400 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total for item */}
                      <div className="text-right">
                        <span className="text-sm sm:text-base font-bold font-mono text-white">
                          {(item.price * item.quantity).toFixed(2)} {siteSettings.currency}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Right (4 Cols) */}
          <div className="lg:col-span-4">
            <div className="bg-[#111116] border border-neutral-800 p-6 sm:p-8 space-y-6 lg:sticky lg:top-24">
              
              <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-white border-b border-neutral-800 pb-3">
                Order Summary
              </h2>

              {/* Promo code Form */}
              {!appliedPromo ? (
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="PROMO CODE"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 uppercase tracking-widest font-mono focus:outline-none focus:border-neutral-600"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold uppercase tracking-wider text-white transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-red-400">{promoError}</p>
                  )}
                </form>
              ) : (
                <div className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-700 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-mono font-medium">{appliedPromo.code} Applied</span>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-neutral-400 hover:text-white underline text-[11px] uppercase cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Calculation Rows */}
              <div className="space-y-3 text-xs text-neutral-400 pt-2 border-t border-neutral-800">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-200">{subtotal.toFixed(2)} {siteSettings.currency}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">-{discountAmount.toFixed(2)} {siteSettings.currency}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-mono text-neutral-200">
                    {deliveryFee === 0 ? 'FREE' : `${deliveryFee.toFixed(2)} ${siteSettings.currency}`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-neutral-800">
                  <span className="uppercase tracking-wider">Estimated Total</span>
                  <span className="font-mono">{total.toFixed(2)} {siteSettings.currency}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => onNavigate('/checkout')}
                className="w-full py-4 bg-white text-black text-xs font-bold uppercase tracking-[0.25em] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xl"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-[11px] text-neutral-400 space-y-2 border-t border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-neutral-200"><strong>Paiement seul en livraison</strong> (Réglez en espèces au livreur)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-neutral-300" />
                  <span>Expédition express suivie dans toute la Tunisie</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
