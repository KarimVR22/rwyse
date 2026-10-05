import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AlertTriangle, Boxes, Plus, Check } from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { products, updateInventoryStock } = useStore();
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'out'>('all');

  const filtered = products.filter((p) => {
    const totalStock = p.sizes.reduce((sum, s) => sum + s.stock, 0);
    if (filterMode === 'low') return totalStock > 0 && totalStock <= 6;
    if (filterMode === 'out') return totalStock === 0 || p.isSoldOut;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
            STOCK CONTROLLER // REAL-TIME ALLOCATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight">
            Inventory & Stock
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-light">
            Adjust sizes and stock counts directly. Out-of-stock items automatically disable checkout purchase actions.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-neutral-900 border border-neutral-800">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 text-xs uppercase font-semibold tracking-wider cursor-pointer ${
              filterMode === 'all' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Pieces ({products.length})
          </button>
          <button
            onClick={() => setFilterMode('low')}
            className={`px-3 py-1 text-xs uppercase font-semibold tracking-wider cursor-pointer ${
              filterMode === 'low' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Low Stock
          </button>
          <button
            onClick={() => setFilterMode('out')}
            className={`px-3 py-1 text-xs uppercase font-semibold tracking-wider cursor-pointer ${
              filterMode === 'out' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sold Out
          </button>
        </div>
      </div>

      {/* Inventory Grid Table */}
      <div className="space-y-4">
        {filtered.map((prod) => {
          const totalStock = prod.sizes.reduce((sum, s) => sum + s.stock, 0);
          const isLow = totalStock > 0 && totalStock <= 6;
          const isOut = totalStock === 0 || prod.isSoldOut;

          return (
            <div
              key={prod.id}
              className="p-5 bg-[#111116] border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-18 bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                  <img
                    src={prod.colors[0]?.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white uppercase tracking-wide text-sm">{prod.name}</span>
                    {isOut ? (
                      <span className="text-[10px] font-mono uppercase bg-red-950/60 border border-red-800 text-red-300 px-2 py-0.5">
                        Sold Out
                      </span>
                    ) : isLow ? (
                      <span className="text-[10px] font-mono uppercase bg-amber-950/60 border border-amber-800 text-amber-300 px-2 py-0.5">
                        ⚠ Low Stock ({totalStock} left)
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono uppercase bg-neutral-900 border border-neutral-700 text-emerald-400 px-2 py-0.5">
                        Healthy ({totalStock} units)
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    <span>{prod.category}</span>
                    <span className="mx-2">·</span>
                    <span className="font-mono text-neutral-500">SKU: {prod.sku}</span>
                  </div>
                </div>
              </div>

              {/* Sizes & Stock Steppers */}
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {prod.sizes.map((s) => (
                  <div key={s.size} className="p-2.5 bg-neutral-900 border border-neutral-800 text-center min-w-[70px]">
                    <span className="text-[11px] font-mono font-bold text-white block mb-1">
                      {s.size}
                    </span>
                    <div className="flex items-center justify-center gap-1">
                      <input
                        type="number"
                        min="0"
                        value={s.stock}
                        onChange={(e) => updateInventoryStock(prod.id, s.size, Number(e.target.value))}
                        className={`w-12 px-1 py-1 text-center font-mono text-xs font-semibold bg-neutral-950 border border-neutral-700 focus:outline-none focus:border-white ${
                          s.stock === 0 ? 'text-red-400' : s.stock <= 3 ? 'text-amber-400' : 'text-white'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
