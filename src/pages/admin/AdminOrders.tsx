import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { Search, Package, MapPin, Eye, X, Phone, Mail, CheckCircle } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, siteSettings } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statuses: Order['status'][] = ['Pending', 'Confirmed', 'Preparing', 'Shipped', 'Delivered', 'Cancelled'];

  const filtered = orders.filter((o) => {
    if (filterStatus !== 'All' && o.status !== filterStatus) return false;
    if (
      search.trim() &&
      !o.orderNumber.toLowerCase().includes(search.toLowerCase()) &&
      !o.customerName.toLowerCase().includes(search.toLowerCase()) &&
      !o.customerPhone.includes(search)
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
            FULFILLMENT DESK // REAL-TIME DISPATCH
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight">
            Order Management ({orders.length})
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-light">
            Status alterations instantly propagate to customer package tracking journals.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111116] border border-neutral-800 p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order #, customer, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['All', ...statuses].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider whitespace-nowrap cursor-pointer ${
                filterStatus === st
                  ? 'bg-white text-black font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#111116] border border-neutral-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] font-mono uppercase text-neutral-400 border-b border-neutral-800 bg-neutral-900/60">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer Details</th>
              <th className="py-3 px-4">Destination</th>
              <th className="py-3 px-4">Garments</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status & Dispatch</th>
              <th className="py-3 px-4 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/70 text-neutral-300">
            {filtered.map((ord) => (
              <tr key={ord.id} className="hover:bg-neutral-900/40">
                <td className="py-3 px-4 font-mono font-bold text-white tracking-wider">
                  {ord.orderNumber}
                  <span className="text-[10px] font-normal text-neutral-500 block">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <span className="font-semibold text-white block">{ord.customerName}</span>
                  <span className="font-mono text-neutral-400 text-[11px] block">{ord.customerPhone}</span>
                </td>

                <td className="py-3 px-4 text-[11px] text-neutral-400">
                  <span className="text-white block">{ord.city}</span>
                  <span className="truncate max-w-[160px] block">{ord.region}</span>
                </td>

                <td className="py-3 px-4">
                  <span className="font-mono text-white block">{ord.items.length} pieces</span>
                  <span className="text-[10px] text-neutral-400 truncate max-w-[180px] block">
                    {ord.items.map((i) => `${i.name} (${i.size})`).join(', ')}
                  </span>
                </td>

                <td className="py-3 px-4 font-mono font-semibold text-white">
                  {ord.total.toFixed(2)} {siteSettings.currency}
                  <span className="text-[10px] font-normal text-neutral-400 block uppercase">
                    {ord.paymentMethod.toUpperCase()}
                  </span>
                </td>

                {/* Status Switcher Dropdown */}
                <td className="py-3 px-4">
                  <select
                    value={ord.status}
                    onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order['status'])}
                    className={`px-2.5 py-1 text-xs font-mono uppercase tracking-wider border focus:outline-none cursor-pointer ${
                      ord.status === 'Delivered'
                        ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                        : ord.status === 'Cancelled'
                        ? 'bg-red-950/40 border-red-700 text-red-300'
                        : ord.status === 'Shipped'
                        ? 'bg-indigo-950/40 border-indigo-700 text-indigo-300'
                        : 'bg-neutral-900 border-neutral-700 text-white'
                    }`}
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => setSelectedOrder(ord)}
                    className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title="View Full Order Breakdown"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
            <div className="relative w-full max-w-2xl bg-[#111116] border border-neutral-800 text-neutral-100 shadow-2xl p-6 sm:p-8 z-10 space-y-6">
              
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Order Dossier</span>
                  <h3 className="text-base font-bold font-mono text-white tracking-wider">
                    {selectedOrder.orderNumber}
                  </h3>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-neutral-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer & Address Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-neutral-900/60 border border-neutral-800 text-xs">
                <div>
                  <strong className="text-white block uppercase tracking-wider mb-1">Customer Profile</strong>
                  <div>Name: <strong>{selectedOrder.customerName}</strong></div>
                  <div>Phone: <span className="font-mono text-white">{selectedOrder.customerPhone}</span></div>
                  <div>Email: <span className="font-mono">{selectedOrder.customerEmail}</span></div>
                </div>
                <div>
                  <strong className="text-white block uppercase tracking-wider mb-1">Delivery Destination</strong>
                  <div>{selectedOrder.address}</div>
                  <div>{selectedOrder.city}, {selectedOrder.postalCode}</div>
                  <div className="text-neutral-400">{selectedOrder.region}</div>
                  {selectedOrder.notes && (
                    <div className="mt-1 text-neutral-400 italic">"{selectedOrder.notes}"</div>
                  )}
                </div>
              </div>

              {/* Garments List */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Items in Parcel ({selectedOrder.items.length})
                </span>
                <div className="divide-y divide-neutral-800/80 border border-neutral-800 bg-neutral-900/30">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <strong className="text-white uppercase tracking-wide block">{item.name}</strong>
                          <span className="text-neutral-400 text-[11px] font-mono">
                            Color: {item.color} · Size: {item.size} · Quantity: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="font-mono font-semibold text-white text-right">
                        {(item.price * item.quantity).toFixed(2)} {siteSettings.currency}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 bg-neutral-900/60 border border-neutral-800 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono">{selectedOrder.subtotal.toFixed(2)} {siteSettings.currency}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount:</span>
                    <span className="font-mono">-{selectedOrder.discountAmount.toFixed(2)} {siteSettings.currency}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span className="font-mono">{selectedOrder.deliveryFee.toFixed(2)} {siteSettings.currency}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                  <span>Total Due (COD):</span>
                  <span className="font-mono">{selectedOrder.total.toFixed(2)} {siteSettings.currency}</span>
                </div>
              </div>

              {/* Status Update Trigger in Modal */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs uppercase text-neutral-400">Set Live Status:</span>
                <div className="flex gap-1.5">
                  {statuses.map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, st);
                        setSelectedOrder({ ...selectedOrder, status: st });
                      }}
                      className={`px-2.5 py-1 text-[11px] font-mono uppercase border cursor-pointer ${
                        selectedOrder.status === st
                          ? 'bg-white text-black font-bold border-white'
                          : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
