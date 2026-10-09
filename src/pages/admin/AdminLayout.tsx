import React from 'react';
import {
  LayoutDashboard,
  Package,
  BadgeDollarSign,
  ShoppingCart,
  Users,
  Boxes,
  Tag,
  Megaphone,
  Sliders,
  Truck,
  BarChart3,
  Bell,
  ExternalLink,
  LogOut,
  CheckCircle,
  ShieldAlert,
  Image as ImageIcon,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { RwyseLogo } from '../../components/common/RwyseLogo';

export type AdminTab =
  | 'overview'
  | 'products'
  | 'prices'
  | 'orders'
  | 'customers'
  | 'inventory'
  | 'promotions'
  | 'advertisements'
  | 'homepage'
  | 'media'
  | 'delivery'
  | 'analytics'
  | 'audit';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onExitAdmin: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onExitAdmin,
  onLogout,
  children,
}) => {
  const { orders, notifications, markNotificationRead, clearNotifications, setAdminSelectedOrderId } = useStore();
  const [showNotifications, setShowNotifications] = React.useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { id: 'prices', label: 'Prices & Margins', icon: <BadgeDollarSign className="w-4 h-4" /> },
    {
      id: 'orders',
      label: 'Orders & Tracking',
      icon: <ShoppingCart className="w-4 h-4" />,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
    },
    { id: 'inventory', label: 'Inventory & Stock', icon: <Boxes className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'promotions', label: 'Promotions', icon: <Tag className="w-4 h-4" /> },
    { id: 'advertisements', label: 'Banners & Ads', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'homepage', label: 'Homepage Control', icon: <Sliders className="w-4 h-4" /> },
    { id: 'media', label: 'Media & Images CMS', icon: <ImageIcon className="w-4 h-4 text-emerald-400" /> },
    { id: 'delivery', label: 'Regional Delivery', icon: <Truck className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'audit', label: 'Security & Audit Logs', icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-200 flex flex-col antialiased">
      
      {/* Top Bar */}
      <header className="h-16 border-b border-neutral-800 bg-[#0e0e12] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <RwyseLogo className="h-6 w-auto text-white" />
            <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded-xs">
              Command Suite
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-neutral-400 hover:text-white relative rounded-sm hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Admin Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#131318] border border-neutral-800 rounded-sm shadow-2xl p-4 z-50 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Live Alerts</span>
                    <span className="text-[10px] font-mono text-neutral-400">({notifications.length})</span>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[10px] text-neutral-400 hover:text-white uppercase tracking-wider cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="divide-y divide-neutral-800/80 max-h-72 overflow-y-auto mt-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-neutral-500">
                      No unread alerts
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          setShowNotifications(false);
                          if (n.orderId || n.type === 'order') {
                            if (n.orderId) {
                              setAdminSelectedOrderId(n.orderId);
                            }
                            onSelectTab('orders');
                          } else if (n.type === 'stock') {
                            onSelectTab('inventory');
                          }
                        }}
                        className={`p-3 cursor-pointer transition-colors rounded-sm hover:bg-neutral-800/80 ${
                          n.read ? 'opacity-65' : 'bg-neutral-900/90 border-l-2 border-emerald-500'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <strong className="text-white font-mono flex items-center gap-1.5">
                            {n.type === 'order' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                            {n.title}
                          </strong>
                          <span className="text-neutral-500 text-[10px] font-mono">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-neutral-300 mt-1 leading-snug">{n.message}</p>
                        {(n.orderId || n.type === 'order') && (
                          <div className="mt-2 flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-medium hover:underline">
                            <span>Ouvrir la commande</span>
                            <span>→</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* View Customer Storefront */}
          <button
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 transition-colors cursor-pointer"
          >
            <span>Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
            title="Exit Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Left */}
        <aside className="w-60 bg-[#0e0e12] border-r border-neutral-800 shrink-0 hidden md:flex flex-col justify-between p-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500 px-3 block mb-2">
              MANAGEMENT DOMAINS
            </span>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium uppercase tracking-wider rounded-sm transition-colors text-left cursor-pointer ${
                  currentTab === item.id
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] font-bold ${
                      currentTab === item.id ? 'bg-black text-white' : 'bg-amber-400 text-black'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-3 bg-neutral-950/60 border border-neutral-800/80 rounded-sm text-[11px] text-neutral-400">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Catalog Synced</span>
            </div>
            <span className="block text-[10px] text-neutral-500 mt-1">
              Changes reflect live across customer storefront without recompile.
            </span>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#09090b]">
          {/* Mobile Tab Scrollbar */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-6 border-b border-neutral-800">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap border cursor-pointer inline-flex items-center gap-1.5 ${
                  currentTab === item.id
                    ? 'bg-white text-black border-white'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full font-mono text-[9px] font-bold bg-amber-400 text-black">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {children}
        </main>

      </div>
    </div>
  );
};
