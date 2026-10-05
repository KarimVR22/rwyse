import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Users, Search, Phone, Mail, ShoppingCart, Eye, X } from 'lucide-react';
import { Order } from '../../types';

export const AdminCustomers: React.FC = () => {
  const { orders, siteSettings } = useStore();
  const [search, setSearch] = useState('');
  const [viewCustomer, setViewCustomer] = useState<{
    name: string;
    email: string;
    phone: string;
    city: string;
    orders: Order[];
  } | null>(null);

  // Group orders by customer phone/email
  const customerMap = new Map<string, { name: string; email: string; phone: string; city: string; orders: Order[] }>();

  orders.forEach((ord) => {
    const key = ord.customerPhone || ord.customerEmail;
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        name: ord.customerName,
        email: ord.customerEmail,
        phone: ord.customerPhone,
        city: ord.city,
        orders: [],
      });
    }
    customerMap.get(key)!.orders.push(ord);
  });

  const customerList = Array.from(customerMap.values()).map((c) => {
    const totalSpent = c.orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.total : sum), 0);
    const lastOrder = c.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    return {
      ...c,
      totalSpent,
      lastOrderDate: lastOrder ? new Date(lastOrder.createdAt).toLocaleDateString() : 'N/A',
      orderCount: c.orders.length,
    };
  });

  const filtered = customerList.filter((c) => {
    if (
      search.trim() &&
      !c.name.toLowerCase().includes(search.toLowerCase()) &&
      !c.phone.includes(search) &&
      !c.email.toLowerCase().includes(search.toLowerCase())
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
            CLIENT DIRECTORY // LIFETIME VALUE
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight">
            Customer Roster ({customerList.length})
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-light">
            Monitor client spending, delivery frequency, and purchase archives.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#111116] border border-neutral-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] font-mono uppercase text-neutral-400 border-b border-neutral-800 bg-neutral-900/60">
            <tr>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">City</th>
              <th className="py-3 px-4 font-mono">Orders Placed</th>
              <th className="py-3 px-4 font-mono">Total LTV</th>
              <th className="py-3 px-4">Last Order</th>
              <th className="py-3 px-4 text-right">History</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/70 text-neutral-300">
            {filtered.map((client, idx) => (
              <tr key={idx} className="hover:bg-neutral-900/30">
                <td className="py-3.5 px-4 font-semibold text-white uppercase tracking-wide">
                  {client.name}
                </td>
                <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-400">
                  <div>{client.phone}</div>
                  <div className="text-neutral-500 text-[10px]">{client.email}</div>
                </td>
                <td className="py-3.5 px-4">{client.city}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-white">
                  {client.orderCount} {client.orderCount === 1 ? 'order' : 'orders'}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                  {client.totalSpent.toFixed(2)} {siteSettings.currency}
                </td>
                <td className="py-3.5 px-4 font-mono text-neutral-400">
                  {client.lastOrderDate}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setViewCustomer(client)}
                    className="p-1.5 text-neutral-400 hover:text-white cursor-pointer"
                    title="View order history"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Order History Modal */}
      {viewCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setViewCustomer(null)} />
          <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
            <div className="relative w-full max-w-2xl bg-[#111116] border border-neutral-800 text-neutral-100 shadow-2xl p-6 sm:p-8 z-10 space-y-6">
              
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Client Profile</span>
                  <h3 className="text-base font-bold uppercase tracking-wider text-white">
                    {viewCustomer.name}
                  </h3>
                </div>
                <button onClick={() => setViewCustomer(null)} className="text-neutral-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-neutral-900 border border-neutral-800 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="text-neutral-500 uppercase text-[10px] block">Mobile Phone</span>
                  <span className="text-white">{viewCustomer.phone}</span>
                </div>
                <div>
                  <span className="text-neutral-500 uppercase text-[10px] block">Location</span>
                  <span className="text-white">{viewCustomer.city}</span>
                </div>
                <div>
                  <span className="text-neutral-500 uppercase text-[10px] block">Total Orders</span>
                  <span className="text-white">{viewCustomer.orders.length}</span>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
                  Purchased Orders
                </span>
                <div className="divide-y divide-neutral-800/80 border border-neutral-800 bg-neutral-900/30 max-h-60 overflow-y-auto">
                  {viewCustomer.orders.map((o) => (
                    <div key={o.id} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <strong className="font-mono text-white block">{o.orderNumber}</strong>
                        <span className="text-[11px] text-neutral-400">{new Date(o.createdAt).toLocaleDateString()} · {o.items.length} items</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-white block">{o.total.toFixed(2)} {siteSettings.currency}</span>
                        <span className="text-[10px] font-mono uppercase text-emerald-400">{o.status}</span>
                      </div>
                    </div>
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
