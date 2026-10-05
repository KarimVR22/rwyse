import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, ArrowRight, Package, Clock, Phone, MapPin } from 'lucide-react';

interface OrderConfirmationPageProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  orderId,
  onNavigate,
}) => {
  const { orders, siteSettings } = useStore();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-[#0b0b0d] text-white text-center">
        <h2 className="text-xl font-bold uppercase tracking-wider">Order Not Found</h2>
        <button
          onClick={() => onNavigate('/')}
          className="mt-4 px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest cursor-pointer"
        >
          Return to Flagship
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0b0b0d] text-white min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Celebration Header */}
        <div className="text-center pb-8 border-b border-neutral-800/80">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
            ORDER LOGGED // RISE WITH YOU
          </span>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold uppercase text-white tracking-tight">
            Order Confirmed
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            Thank you for choosing RWYSE, <strong>{order.customerName}</strong>. Your pieces have been allocated and are queued for studio assembly.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-800 font-mono text-xs">
            <span className="text-neutral-400 uppercase tracking-wider">Order Number:</span>
            <span className="text-white font-bold text-sm tracking-wider">{order.orderNumber}</span>
          </div>
        </div>

        {/* Next Steps Card */}
        <div className="my-8 p-6 bg-[#111116] border border-neutral-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-200">
            What Happens Next?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-300">
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">1. Concierge Verification</strong>
                <span className="text-neutral-400 text-[11px]">We will call your phone ({order.customerPhone}) to confirm delivery slot.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Package className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">2. Bespoke Packaging</strong>
                <span className="text-neutral-400 text-[11px]">Sealed inside our signature matte black garment protection bag.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">3. Courier Handover</strong>
                <span className="text-neutral-400 text-[11px]">Pay in cash upon arrival. Keep exact change ready.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="bg-[#111116] border border-neutral-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Garments Ordered ({order.items.length})
            </h3>
            <span className="text-xs font-mono text-neutral-400">Status: {order.status}</span>
          </div>

          <div className="divide-y divide-neutral-800/80">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-white">{item.name}</h4>
                    <span className="text-[11px] text-neutral-400">
                      {item.color} · Size {item.size} · Qty {item.quantity}
                    </span>
                  </div>
                </div>
                <div className="font-mono text-xs font-semibold text-white">
                  {(item.price * item.quantity).toFixed(2)} {siteSettings.currency}
                </div>
              </div>
            ))}
          </div>

          {/* Destination & Payment Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-800 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                DELIVERY DESTINATION
              </span>
              <div className="flex items-start gap-1.5 text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <span>{order.address}, {order.city} ({order.region})</span>
              </div>
              {order.notes && (
                <p className="mt-1 text-[11px] text-neutral-400 italic">Notes: "{order.notes}"</p>
              )}
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                PAYMENT TERMS
              </span>
              <span className="text-neutral-300">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery (Pay to Courier)' : 'Card Payment'}
              </span>
              <div className="mt-2 space-y-1 text-[11px] text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono">{order.subtotal.toFixed(2)} {siteSettings.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span className="font-mono">{order.deliveryFee === 0 ? 'FREE' : `${order.deliveryFee.toFixed(2)} ${siteSettings.currency}`}</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-1 border-t border-neutral-800 text-xs">
                  <span>Total Due:</span>
                  <span className="font-mono">{order.total.toFixed(2)} {siteSettings.currency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate(`/track?order=${order.orderNumber}`)}
              className="flex-1 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-[0.25em] hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Track Order Progress</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/shop')}
              className="px-6 py-3.5 bg-transparent border border-neutral-800 hover:border-neutral-600 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              Back to Catalog
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
