import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Promotion } from '../../types';
import { Plus, Tag, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';

export const AdminPromotions: React.FC = () => {
  const { promotions, addPromotion, updatePromotion, deletePromotion, siteSettings } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState(15);
  const [minOrder, setMinOrder] = useState(100);
  const [maxUses, setMaxUses] = useState(250);
  const [expiresAt, setExpiresAt] = useState('2026-12-31');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    addPromotion({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      discountType,
      value: Number(value),
      minOrder: Number(minOrder),
      maxUses: Number(maxUses),
      active: true,
      expiresAt,
    });

    setCode('');
    setName('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
            CAMPAIGN CODES // MARKETING
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight">
            Promotions & Discounts
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-light">
            Create promotional coupon codes for drops, VIP customers, or community activations.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Promo Code</span>
        </button>
      </div>

      {/* Promotions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="p-6 bg-[#111116] border border-neutral-800 space-y-4 relative"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                  {promo.name}
                </span>
                <span className="text-lg font-bold font-mono text-white tracking-wider block mt-1">
                  {promo.code}
                </span>
              </div>
              <button
                onClick={() => deletePromotion(promo.id)}
                className="text-neutral-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                title="Delete code"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-1.5 border-y border-neutral-800 py-3 font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-400">Discount:</span>
                <strong className="text-emerald-400">
                  {promo.discountType === 'percentage' ? `${promo.value}% OFF` : `${promo.value} ${siteSettings.currency} OFF`}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Min. Order:</span>
                <span className="text-white">{promo.minOrder} {siteSettings.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Usage Count:</span>
                <span className="text-white">{promo.currentUses} / {promo.maxUses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Expires:</span>
                <span className="text-white">{promo.expiresAt}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-neutral-400">Status:</span>
              <button
                onClick={() => updatePromotion({ ...promo, active: !promo.active })}
                className={`px-3 py-1 text-[11px] font-mono uppercase tracking-wider cursor-pointer border ${
                  promo.active
                    ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                    : 'bg-neutral-900 border-neutral-700 text-neutral-500'
                }`}
              >
                {promo.active ? 'Active' : 'Disabled'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
            <div className="relative w-full max-w-md bg-[#111116] border border-neutral-800 text-neutral-100 shadow-2xl p-6 sm:p-8 z-10 space-y-6">
              
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">Create Promo Code</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VIP20"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono uppercase focus:outline-none focus:border-neutral-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1">Campaign Label *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Community Drop Discount"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-neutral-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider block mb-1">Type</label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white uppercase focus:outline-none"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (TND)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider block mb-1">Value *</label>
                    <input
                      type="number"
                      required
                      value={value}
                      onChange={(e) => setValue(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider block mb-1">Min Spend ({siteSettings.currency})</label>
                    <input
                      type="number"
                      value={minOrder}
                      onChange={(e) => setMinOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider block mb-1">Max Uses</label>
                    <input
                      type="number"
                      value={maxUses}
                      onChange={(e) => setMaxUses(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-white text-black font-bold uppercase tracking-wider hover:bg-neutral-200 cursor-pointer"
                  >
                    Deploy Promo
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
