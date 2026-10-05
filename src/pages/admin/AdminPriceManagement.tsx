import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BadgeDollarSign, Check, Percent, RefreshCw } from 'lucide-react';

export const AdminPriceManagement: React.FC = () => {
  const { products, updateProductPrice, deliveryZones, updateDeliveryZone, siteSettings } = useStore();
  const [editedPrices, setEditedPrices] = useState<Record<string, { price: number; salePrice?: number }>>({});
  const [discountPercent, setDiscountPercent] = useState<number>(10);

  const handlePriceChange = (id: string, price: number, salePrice?: number) => {
    setEditedPrices((prev) => ({
      ...prev,
      [id]: { price, salePrice },
    }));
  };

  const handleSaveItem = (id: string) => {
    const edit = editedPrices[id];
    if (!edit) return;
    updateProductPrice(id, edit.price, edit.salePrice);
    setEditedPrices((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleApplyGlobalDiscount = () => {
    products.forEach((p) => {
      const discounted = Math.round(p.price * (1 - discountPercent / 100));
      updateProductPrice(p.id, p.price, discounted);
    });
  };

  const handleClearAllDiscounts = () => {
    products.forEach((p) => {
      updateProductPrice(p.id, p.price, undefined);
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
            DYNAMIC PRICING ENGINE // INSTANT SYNC
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight">
            Price & Margin Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-light">
            All price alterations propagate instantly across the storefront, cart calculations, and checkout.
          </p>
        </div>

        {/* Global Batch Action */}
        <div className="flex items-center gap-2 p-2 bg-[#111116] border border-neutral-800 text-xs">
          <span className="text-neutral-400 uppercase text-[10px] font-mono">Quick Promo:</span>
          <input
            type="number"
            min="1"
            max="90"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(Number(e.target.value))}
            className="w-14 px-2 py-1 bg-neutral-900 border border-neutral-700 text-white font-mono text-center"
          />
          <span className="text-neutral-400">%</span>
          <button
            onClick={handleApplyGlobalDiscount}
            className="px-3 py-1 bg-white text-black font-bold uppercase text-[11px] hover:bg-neutral-200 cursor-pointer"
          >
            Apply to All
          </button>
          <button
            onClick={handleClearAllDiscounts}
            className="px-2 py-1 text-neutral-400 hover:text-white uppercase text-[11px] underline cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Product Pricing Table */}
      <div className="bg-[#111116] border border-neutral-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] font-mono uppercase text-neutral-400 border-b border-neutral-800 bg-neutral-900/60">
            <tr>
              <th className="py-3 px-4">Garment</th>
              <th className="py-3 px-4">Regular Price ({siteSettings.currency})</th>
              <th className="py-3 px-4">Promotional Sale Price ({siteSettings.currency})</th>
              <th className="py-3 px-4">Active Discount</th>
              <th className="py-3 px-4 text-right">Commit Changes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/70 text-neutral-300">
            {products.map((p) => {
              const currentEdit = editedPrices[p.id];
              const effectivePrice = currentEdit ? currentEdit.price : p.price;
              const effectiveSalePrice = currentEdit !== undefined ? currentEdit.salePrice : p.salePrice;

              const hasDiscount = effectiveSalePrice && effectiveSalePrice < effectivePrice;
              const discountPct = hasDiscount
                ? Math.round(((effectivePrice - (effectiveSalePrice || 0)) / effectivePrice) * 100)
                : 0;

              const isDirty = currentEdit !== undefined;

              return (
                <tr key={p.id} className="hover:bg-neutral-900/30">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-10 h-12 bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                      <img src={p.colors[0]?.images[0]} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <span className="font-semibold text-white uppercase tracking-wider block">{p.name}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">SKU: {p.sku}</span>
                    </div>
                  </td>

                  {/* Regular Price */}
                  <td className="py-3 px-4 font-mono">
                    <input
                      type="number"
                      value={effectivePrice}
                      onChange={(e) => handlePriceChange(p.id, Number(e.target.value), effectiveSalePrice)}
                      className="w-24 px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 focus:border-neutral-500 text-white font-mono"
                    />
                  </td>

                  {/* Promotional Sale Price */}
                  <td className="py-3 px-4 font-mono">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="None"
                        value={effectiveSalePrice ?? ''}
                        onChange={(e) => {
                          const val = e.target.value ? Number(e.target.value) : undefined;
                          handlePriceChange(p.id, effectivePrice, val);
                        }}
                        className="w-24 px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 focus:border-neutral-500 text-white font-mono"
                      />
                      {effectiveSalePrice && (
                        <button
                          onClick={() => handlePriceChange(p.id, effectivePrice, undefined)}
                          className="text-[10px] text-neutral-500 hover:text-red-400 underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Active Discount badge */}
                  <td className="py-3 px-4 font-mono">
                    {hasDiscount ? (
                      <span className="text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 border border-emerald-800 text-[11px]">
                        -{discountPct}% OFF
                      </span>
                    ) : (
                      <span className="text-neutral-500 text-[11px]">Full Price</span>
                    )}
                  </td>

                  {/* Commit Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      disabled={!isDirty}
                      onClick={() => handleSaveItem(p.id)}
                      className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-xs cursor-pointer ${
                        isDirty
                          ? 'bg-white text-black hover:bg-neutral-200'
                          : 'bg-neutral-900 text-neutral-600 border border-neutral-800 cursor-not-allowed'
                      }`}
                    >
                      {isDirty ? 'Update Live' : 'Synced'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
