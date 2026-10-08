import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Plus, Minus, Trash2, ArrowRight, Tag, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  onNavigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
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

  const estimatedDelivery = subtotal === 0 ? 0 : 8;
  const total = Math.max(0, subtotal - discountAmount + estimatedDelivery);

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

  const handleCheckout = () => {
    setIsCartOpen(false);
    onNavigate('/checkout');
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    onNavigate('/cart');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-[#0e0e11] border-l border-neutral-800 text-neutral-100 flex flex-col shadow-2xl"
            >
          
          {/* Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <h2 className="text-sm font-bold uppercase tracking-[0.25em]">Shopping Bag</h2>
              <span className="text-xs text-neutral-400 font-mono">({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 text-neutral-500">
                  <X className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold tracking-wide uppercase">Your bag is empty</h3>
                <p className="text-xs text-neutral-400 mt-2 max-w-xs leading-relaxed">
                  Discover the newest heavyweight essentials and limited release drops.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigate('/shop');
                  }}
                  className="mt-6 px-6 py-2.5 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="divide-y divide-neutral-800/80">
                {cart.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    {/* Item Image */}
                    <div className="w-20 h-24 bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0 relative">
                      <img
                        src={item.product.colors.find((c) => c.name === item.selectedColor)?.images[0] || item.product.colors[0]?.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-neutral-100 uppercase tracking-wide leading-snug line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-neutral-500 hover:text-red-400 transition-colors p-0.5 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-400 tracking-wider">
                          <span>{item.selectedColor}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-neutral-200">Size {item.selectedSize}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-900">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-neutral-800 bg-neutral-950 rounded-xs">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs px-2 font-mono font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-semibold font-mono tracking-tight text-white">
                            {(item.price * item.quantity).toFixed(2)} {siteSettings.currency}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-800 bg-[#0b0b0e] space-y-4">
              
              {/* Promo Code Input */}
              {!appliedPromo ? (
                <form onSubmit={handleApplyPromo} className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="PROMO CODE (e.g. RISE10)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 uppercase tracking-widest font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold tracking-wider uppercase text-neutral-200 transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-red-400">{promoError}</p>
                  )}
                </form>
              ) : (
                <div className="flex items-center justify-between p-2.5 bg-neutral-900/90 border border-neutral-700 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="font-mono font-medium tracking-wide">
                      {appliedPromo.code} applied (-{appliedPromo.discountType === 'percentage' ? `${appliedPromo.value}%` : `${appliedPromo.value} ${siteSettings.currency}`})
                    </span>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-neutral-400 hover:text-white underline text-[11px] uppercase tracking-wider cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Price Calculations */}
              <div className="space-y-2 text-xs text-neutral-400 pt-1">
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
                    {estimatedDelivery === 0 ? 'FREE' : `${estimatedDelivery.toFixed(2)} ${siteSettings.currency}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                  <span className="tracking-wider uppercase">Total</span>
                  <span className="font-mono">{total.toFixed(2)} {siteSettings.currency}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-white text-black text-xs font-bold tracking-[0.25em] uppercase hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleViewCart}
                  className="w-full py-2.5 bg-transparent border border-neutral-800 hover:border-neutral-600 text-xs font-medium tracking-[0.2em] uppercase text-neutral-300 transition-colors cursor-pointer"
                >
                  View Full Bag
                </button>
              </div>

              <p className="text-[10px] text-center text-neutral-400 uppercase tracking-widest pt-1">
                Paiement seul à la livraison (Cash on Delivery) · Partout en Tunisie
              </p>
            </div>
          )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
