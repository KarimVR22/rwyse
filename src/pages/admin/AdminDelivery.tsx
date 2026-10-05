import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { DeliveryZone } from '../../types';
import { Truck, Check, Edit2 } from 'lucide-react';

export const AdminDelivery: React.FC = () => {
  const { deliveryZones, updateDeliveryZone, siteSettings } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feeVal, setFeeVal] = useState<number>(7);
  const [daysVal, setDaysVal] = useState<string>('24-48 Hours');

  const handleStartEdit = (zone: DeliveryZone) => {
    setEditingId(zone.id);
    setFeeVal(zone.fee);
    setDaysVal(zone.estimatedDays);
  };

  const handleSave = (zone: DeliveryZone) => {
    updateDeliveryZone({
      ...zone,
      fee: Number(feeVal),
      estimatedDays: daysVal,
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
          REGIONAL LOGISTICS // DISPATCH TARIFFS
        </span>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight">
          Regional Delivery Rates
        </h1>
        <p className="text-xs text-neutral-400 mt-1 font-light">
          Configure courier fees per governorate and region. Customers select their zone during checkout to compute exact Cash on Delivery totals.
        </p>
      </div>

      {/* Zones Table */}
      <div className="bg-[#111116] border border-neutral-800 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] font-mono uppercase text-neutral-400 border-b border-neutral-800 bg-neutral-900/60">
            <tr>
              <th className="py-3 px-4">Region / Governorates</th>
              <th className="py-3 px-4">Standard Delivery Fee</th>
              <th className="py-3 px-4">Estimated Transit Days</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/70 text-neutral-300">
            {deliveryZones.map((zone) => {
              const isEditing = editingId === zone.id;

              return (
                <tr key={zone.id} className="hover:bg-neutral-900/30">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {zone.region}
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={feeVal}
                          onChange={(e) => setFeeVal(Number(e.target.value))}
                          className="w-16 px-2 py-1 bg-neutral-900 border border-neutral-700 text-white font-mono text-xs"
                        />
                        <span className="text-neutral-400">{siteSettings.currency}</span>
                      </div>
                    ) : (
                      <span className="text-white font-bold">
                        {zone.fee} {siteSettings.currency}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-neutral-300">
                    {isEditing ? (
                      <input
                        type="text"
                        value={daysVal}
                        onChange={(e) => setDaysVal(e.target.value)}
                        className="px-2 py-1 bg-neutral-900 border border-neutral-700 text-white text-xs font-mono"
                      />
                    ) : (
                      <span>{zone.estimatedDays}</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {isEditing ? (
                      <button
                        onClick={() => handleSave(zone)}
                        className="px-3 py-1 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 cursor-pointer"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(zone)}
                        className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="Edit Tariff"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
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
