import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { User, Package, Bookmark, MapPin, ArrowRight } from 'lucide-react';

interface AccountPageProps {
  onNavigate: (path: string) => void;
  onNavigateToProduct: (slug: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate, onNavigateToProduct }) => {
  const { orders, wishlist, products, siteSettings } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  const [customerProfile, setCustomerProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('rwyse_user_profile');
      if (saved) return JSON.parse(saved);
      if (orders.length > 0) {
        const latest = orders[0];
        return {
          name: latest.customerName || 'Client RWYSE',
          email: latest.customerEmail || 'client@rwyse.tn',
          phone: latest.customerPhone || '+216 -- --- ---',
          address: latest.address || 'Tunisie',
          city: latest.city || 'Tunis',
          postalCode: latest.postalCode || '1000',
        };
      }
    } catch {}
    return {
      name: 'Client RWYSE',
      email: 'client@rwyse.tn',
      phone: '+216 -- --- ---',
      address: 'Tunisie',
      city: 'Tunis',
      postalCode: '1000',
    };
  });

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="w-full bg-[#0b0b0d] text-white min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-neutral-800/80 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
              CLIENT PORTAL // VERIFIED
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold uppercase text-white tracking-tight">
              {customerProfile.name}
            </h1>
            <span className="text-xs text-neutral-400 font-mono mt-1 block">
              RWYSE Member · {customerProfile.email}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/track')}
              className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-xs font-semibold uppercase tracking-wider text-neutral-200 transition-colors cursor-pointer"
            >
              Order Tracker
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-neutral-800 mb-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs font-bold uppercase tracking-[0.2em] border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'orders' ? 'border-white text-white' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-xs font-bold uppercase tracking-[0.2em] border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'profile' ? 'border-white text-white' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 text-xs font-bold uppercase tracking-[0.2em] border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'addresses' ? 'border-white text-white' : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Saved Addresses
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="p-12 text-center bg-neutral-900/40 border border-neutral-800">
                <h3 className="text-sm font-bold uppercase text-white">No Orders Placed Yet</h3>
                <p className="text-xs text-neutral-400 mt-2">Discover our newest capsule drops in the shop.</p>
                <button
                  onClick={() => onNavigate('/shop')}
                  className="mt-4 px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest cursor-pointer"
                >
                  Shop Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 bg-[#111116] border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-neutral-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-white tracking-wider">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 border border-neutral-700 bg-neutral-900 text-neutral-300">
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-400 mt-1.5 flex items-center gap-2">
                        <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                        <span aria-hidden="true">·</span>
                        <span>{order.items.length} {order.items.length === 1 ? 'Garment' : 'Garments'}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-white font-mono font-semibold">
                          {order.total.toFixed(2)} {siteSettings.currency} (COD)
                        </span>
                      </div>

                      {/* Items thumbnails preview */}
                      <div className="mt-3 flex items-center gap-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="w-10 h-12 bg-neutral-900 border border-neutral-800 overflow-hidden" title={`${item.name} (${item.size})`}>
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center">
                      <button
                        onClick={() => onNavigate(`/track?order=${order.orderNumber}`)}
                        className="px-4 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Live Tracking</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-[#111116] border border-neutral-800 p-6 sm:p-8 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white border-b border-neutral-800 pb-3">
              Member Credentials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">Full Name</label>
                <input
                  type="text"
                  value={customerProfile.name}
                  onChange={(e) => setCustomerProfile({ ...customerProfile, name: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white"
                />
              </div>

              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">Email</label>
                <input
                  type="email"
                  value={customerProfile.email}
                  onChange={(e) => setCustomerProfile({ ...customerProfile, email: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  value={customerProfile.phone}
                  onChange={(e) => setCustomerProfile({ ...customerProfile, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button className="px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 cursor-pointer">
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="max-w-2xl space-y-4">
            <div className="p-6 bg-[#111116] border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-white" />
                  Primary Residence (Default for COD)
                </span>
                <span className="text-[10px] font-mono uppercase bg-neutral-900 border border-neutral-700 px-2 py-0.5 text-neutral-300">
                  Default
                </span>
              </div>
              <p className="text-xs text-neutral-300 pt-1 leading-relaxed">
                {customerProfile.name}<br />
                {customerProfile.address}<br />
                {customerProfile.city}, {customerProfile.postalCode}<br />
                Phone: {customerProfile.phone}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
