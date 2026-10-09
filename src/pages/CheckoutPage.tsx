import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Banknote, ShieldCheck, ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
  onOrderPlaced: (orderId: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate, onOrderPlaced }) => {
  const {
    cart,
    deliveryZones,
    appliedPromo,
    createOrder,
    siteSettings,
  } = useStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRegionId, setSelectedRegionId] = useState<string>(deliveryZones[0]?.id || '');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#0b0b0d] text-white text-center">
        <h2 className="text-xl font-bold uppercase tracking-wider">Your Bag is Empty</h2>
        <p className="text-xs text-neutral-400 mt-2 max-w-xs">
          Please add items to your shopping bag before proceeding to checkout.
        </p>
        <button
          onClick={() => onNavigate('/shop')}
          className="mt-6 px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest cursor-pointer"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const selectedZone = deliveryZones.find((z) => z.id === selectedRegionId) || deliveryZones[0];
  const deliveryFee = selectedZone?.fee ?? 8;

  const discountAmount = appliedPromo
    ? appliedPromo.discountType === 'percentage'
      ? (subtotal * appliedPromo.value) / 100
      : Math.min(subtotal, appliedPromo.value)
    : 0;

  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setFormError('Please fill in all required shipping fields (Name, Phone, City, Address).');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = cart.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        price: item.price,
        color: item.selectedColor,
        size: item.selectedSize,
        quantity: item.quantity,
        image:
          item.product.colors.find((c) => c.name === item.selectedColor)?.images[0] ||
          item.product.colors[0]?.images[0] ||
          '',
      }));

      const newOrder = await createOrder({
        customerName: fullName.trim(),
        customerEmail: email.trim() || 'customer@rwyse.tn',
        customerPhone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        region: selectedZone?.region || 'Tunis',
        postalCode: postalCode.trim() || '1000',
        notes: notes.trim(),
        items: orderItems,
        subtotal,
        deliveryFee,
        discountAmount,
        total,
        paymentMethod,
      });

      setIsSubmitting(false);
      onOrderPlaced(newOrder.id);
    } catch (err) {
      console.error('Error during order submission:', err);
      setIsSubmitting(false);
      setFormError('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="w-full bg-[#0b0b0d] text-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-neutral-800/80 pb-6 mb-8 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
              SECURE CHECKOUT
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight">
              Order Placement
            </h1>
          </div>
          <button
            onClick={() => onNavigate('/cart')}
            className="text-xs text-neutral-400 hover:text-white uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Bag</span>
          </button>
        </div>

        {formError && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Shipping & Payment Form Left (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* 1. Contact Information */}
              <div className="bg-[#111116] border border-neutral-800 p-6 sm:p-8">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                  STEP 01
                </span>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white mb-6">
                  Customer & Shipping Address
                </h2>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider block mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="e.g. Yassine Ben Amor"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 tracking-wide"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-neutral-400 uppercase tracking-wider block mb-1.5">
                        Phone Number (For Courier) *
                      </label>
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        required
                        placeholder="+216 XX XXX XXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-neutral-500"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 uppercase tracking-wider block mb-1.5">
                        Email Address (Receipt & Tracking)
                      </label>
                      <input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="yourname@domain.tn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                      />
                    </div>
                  </div>

                  {/* Delivery Zone / Region Selector */}
                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider block mb-1.5">
                      Delivery Region / Governorate *
                    </label>
                    <select
                      value={selectedRegionId}
                      onChange={(e) => setSelectedRegionId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white uppercase tracking-wider focus:outline-none focus:border-neutral-500 cursor-pointer"
                    >
                      {deliveryZones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.region} — {z.fee} {siteSettings.currency} ({z.estimatedDays})
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-[11px] text-neutral-400">
                      Estimated transit: {selectedZone?.estimatedDays}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-neutral-400 uppercase tracking-wider block mb-1.5">
                        Street Address / Residence & Apartment *
                      </label>
                      <input
                        type="text"
                        required
                        autoComplete="street-address"
                        placeholder="e.g. Résidence Les Palmiers, Apt 4B, Les Berges du Lac"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 uppercase tracking-wider block mb-1.5">
                        City / Municipality *
                      </label>
                      <input
                        type="text"
                        required
                        autoComplete="address-level2"
                        placeholder="e.g. Tunis"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider block mb-1.5">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="e.g. 1053"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full sm:w-1/3 px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider block mb-1.5">
                      Delivery Instructions / Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Optional notes for courier (e.g. please call 15 minutes before arrival)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Payment Method */}
              <div className="bg-[#111116] border border-neutral-800 p-6 sm:p-8">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                  ÉTAPE 02 // PAIEMENT SÉCURISÉ
                </span>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white mb-2">
                  Mode de Paiement Exclusif
                </h2>
                <p className="text-xs text-neutral-400 mb-6">
                  Sur RWYSE, le paiement s'effectue <strong>uniquement à la livraison</strong>. Aucune carte bancaire n'est requise en ligne.
                </p>

                <div className="space-y-3">
                  {/* Cash on Delivery Only */}
                  <div
                    className="p-5 border border-white bg-neutral-900 shadow-md relative"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white shrink-0 mt-0.5">
                          <Banknote className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold uppercase tracking-wider text-white">
                              Paiement Seul à la Livraison (Cash on Delivery)
                            </span>
                            <span className="text-[9px] font-mono uppercase bg-emerald-950/60 border border-emerald-700 text-emerald-300 px-2 py-0.5">
                              Exclusif
                            </span>
                          </div>
                          <p className="text-xs text-neutral-300 leading-relaxed">
                            Réglez le montant exact en espèces directement auprès du livreur à la réception de votre commande.
                          </p>
                          <ul className="text-[11px] text-neutral-400 space-y-1 pt-1.5 list-disc list-inside">
                            <li>Vérification physique de vos articles avant paiement</li>
                            <li>Zéro frais bancaires et aucune avance demandée</li>
                            <li>Reçu papier de livraison remis en main propre</li>
                          </ul>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border border-white bg-white text-black flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Order Review & Placement Right (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="bg-[#111116] border border-neutral-800 p-6 sm:p-8 space-y-6 lg:sticky lg:top-24">
                
                <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-white border-b border-neutral-800 pb-3">
                  Garments in Order ({cart.reduce((a, b) => a + b.quantity, 0)})
                </h2>

                {/* Items Mini List */}
                <div className="divide-y divide-neutral-800/80 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="py-3 flex items-center gap-3">
                      <div className="w-12 h-16 bg-neutral-900 border border-neutral-800 shrink-0 overflow-hidden">
                        <img
                          src={
                            item.product.colors.find((c) => c.name === item.selectedColor)?.images[0] ||
                            item.product.colors[0]?.images[0]
                          }
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-white uppercase tracking-wider truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-[10px] text-neutral-400 mt-0.5">
                          {item.selectedColor} · Size {item.selectedSize} · Qty {item.quantity}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-semibold text-neutral-200">
                          {(item.price * item.quantity).toFixed(2)} {siteSettings.currency}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals Breakdown */}
                <div className="space-y-2.5 text-xs text-neutral-400 pt-3 border-t border-neutral-800">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-neutral-200">{subtotal.toFixed(2)} {siteSettings.currency}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promotion ({appliedPromo?.code})</span>
                      <span className="font-mono">-{discountAmount.toFixed(2)} {siteSettings.currency}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery ({selectedZone?.region})</span>
                    <span className="font-mono text-neutral-200">
                      {deliveryFee === 0 ? 'FREE' : `${deliveryFee.toFixed(2)} ${siteSettings.currency}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-neutral-800">
                    <span className="uppercase tracking-wider">Total Due</span>
                    <span className="font-mono">{total.toFixed(2)} {siteSettings.currency}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 bg-white text-black text-xs font-bold uppercase tracking-[0.25em] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xl ${
                    isSubmitting ? 'opacity-70 cursor-wait' : ''
                  }`}
                >
                  <span>{isSubmitting ? 'Processing Order...' : 'Confirm & Place Order'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-center text-neutral-400 uppercase tracking-widest pt-1 leading-relaxed">
                  By confirming, you agree to receive phone confirmation from the RWYSE concierge prior to shipment.
                </p>

              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
