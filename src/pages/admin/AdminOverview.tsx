import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
} from 'lucide-react';

export const AdminOverview: React.FC<{ onNavigateTab: (tab: any) => void }> = ({ onNavigateTab }) => {
  const { products, orders, siteSettings } = useStore();
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const totalSales = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.total : sum), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const preparingOrders = orders.filter((o) => o.status === 'Preparing').length;
  const shippedOrders = orders.filter((o) => o.status === 'Shipped').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
  const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length;

  const lowStockProducts = products.filter((p) => {
    const totalStock = p.sizes.reduce((sum, s) => sum + s.stock, 0);
    return totalStock > 0 && totalStock <= 6;
  });

  const outOfStockProducts = products.filter((p) => {
    const totalStock = p.sizes.reduce((sum, s) => sum + s.stock, 0);
    return totalStock === 0 || p.isSoldOut;
  });

  // Sales Trend Mock Data based on timeRange
  const trendData =
    timeRange === 'daily'
      ? [
          { label: '08:00', sales: 189, orders: 1 },
          { label: '11:00', sales: 340, orders: 2 },
          { label: '14:00', sales: 520, orders: 3 },
          { label: '17:00', sales: 860, orders: 5 },
          { label: '20:00', sales: 1240, orders: 7 },
          { label: '23:00', sales: 1480, orders: 8 },
        ]
      : timeRange === 'weekly'
      ? [
          { label: 'Mon', sales: 1240, orders: 6 },
          { label: 'Tue', sales: 1890, orders: 9 },
          { label: 'Wed', sales: 2450, orders: 12 },
          { label: 'Thu', sales: 1980, orders: 8 },
          { label: 'Fri', sales: 3200, orders: 15 },
          { label: 'Sat', sales: 4100, orders: 19 },
          { label: 'Sun', sales: 3850, orders: 17 },
        ]
      : [
          { label: 'Week 1', sales: 9400, orders: 48 },
          { label: 'Week 2', sales: 12600, orders: 64 },
          { label: 'Week 3', sales: 15200, orders: 78 },
          { label: 'Week 4', sales: 18900, orders: 95 },
        ];

  const maxSale = Math.max(...trendData.map((d) => d.sales));

  return (
    <div className="space-y-8">
      
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
            EXECUTIVE CONTROL // METRICS
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight">
            Store Overview
          </h1>
        </div>

        <div className="flex items-center gap-2 p-1 bg-neutral-900 border border-neutral-800 rounded-sm">
          <button
            onClick={() => setTimeRange('daily')}
            className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider cursor-pointer ${
              timeRange === 'daily' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeRange('weekly')}
            className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider cursor-pointer ${
              timeRange === 'weekly' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeRange('monthly')}
            className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider cursor-pointer ${
              timeRange === 'monthly' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Revenue */}
        <div className="p-6 bg-[#111116] border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider">
            <span>Total Gross Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
            {totalSales.toFixed(2)} <span className="text-xs font-normal text-neutral-400">{siteSettings.currency}</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.5% vs previous period</span>
          </div>
        </div>

        {/* Orders Placed */}
        <div className="p-6 bg-[#111116] border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider">
            <span>Total Orders</span>
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
            {orders.length}
          </div>
          <div className="text-[11px] text-neutral-400 font-mono">
            {pendingOrders} Pending · {preparingOrders + shippedOrders} In Transit
          </div>
        </div>

        {/* Active Products */}
        <div className="p-6 bg-[#111116] border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider">
            <span>Catalog Garments</span>
            <Package className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
            {products.length}
          </div>
          <div className="text-[11px] text-neutral-400 font-mono">
            {products.filter((p) => p.isNewDrop).length} In Active Drop 01
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="p-6 bg-[#111116] border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider">
            <span>Inventory Status</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
            {lowStockProducts.length + outOfStockProducts.length}
          </div>
          <div className="text-[11px] text-amber-300 font-mono">
            {lowStockProducts.length} low stock · {outOfStockProducts.length} sold out
          </div>
        </div>

      </div>

      {/* Interactive Sales Chart & Orders Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sales Trend Bar Visual (8 Cols) */}
        <div className="lg:col-span-8 bg-[#111116] border border-neutral-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                REVENUE VELOCITY
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Sales Trajectory ({timeRange.toUpperCase()})
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-400">
              Avg Order Value: <strong>194 {siteSettings.currency}</strong>
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-60 flex items-end gap-3 sm:gap-6 pt-6 px-2">
            {trendData.map((item, idx) => {
              const heightPercent = (item.sales / maxSale) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.sales} {siteSettings.currency}
                  </div>
                  <div className="w-full bg-neutral-800 hover:bg-white transition-colors rounded-xs relative" style={{ height: `${heightPercent}%` }}>
                    <div className="absolute inset-x-0 bottom-0 top-0 opacity-20 bg-white" />
                  </div>
                  <span className="text-[11px] font-mono uppercase text-neutral-400">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orders Breakdown (4 Cols) */}
        <div className="lg:col-span-4 bg-[#111116] border border-neutral-800 p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 block mb-1">
              LOGISTICS DISTRIBUTION
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Orders by Status
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-neutral-900/60 border border-neutral-800">
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="uppercase text-neutral-300">Pending Review</span>
              </div>
              <span className="font-mono font-bold text-white text-sm">{pendingOrders}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-900/60 border border-neutral-800">
              <div className="flex items-center gap-2 text-xs">
                <Package className="w-4 h-4 text-sky-400" />
                <span className="uppercase text-neutral-300">Preparing / Packaging</span>
              </div>
              <span className="font-mono font-bold text-white text-sm">{preparingOrders}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-900/60 border border-neutral-800">
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span className="uppercase text-neutral-300">Shipped with Courier</span>
              </div>
              <span className="font-mono font-bold text-white text-sm">{shippedOrders}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-900/60 border border-neutral-800">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="uppercase text-neutral-300">Delivered & Collected</span>
              </div>
              <span className="font-mono font-bold text-white text-sm">{deliveredOrders}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-900/60 border border-neutral-800">
              <div className="flex items-center gap-2 text-xs">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="uppercase text-neutral-300">Cancelled</span>
              </div>
              <span className="font-mono font-bold text-white text-sm">{cancelledOrders}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Best-Selling Products Table */}
      <div className="bg-[#111116] border border-neutral-800 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 block mb-1">
              PERFORMANCE RANKING
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Best-Selling Silhouettes
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('products')}
            className="text-xs text-neutral-400 hover:text-white uppercase tracking-wider flex items-center gap-1 cursor-pointer"
          >
            <span>Manage Catalog</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] font-mono uppercase text-neutral-400 border-b border-neutral-800 bg-neutral-900/40">
              <tr>
                <th className="py-3 px-4">Garment</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock Left</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {products.map((p) => {
                const totalStock = p.sizes.reduce((sum, s) => sum + s.stock, 0);
                return (
                  <tr key={p.id} className="hover:bg-neutral-900/30">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-10 h-12 bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                        <img src={p.colors[0]?.images[0]} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="font-semibold text-white uppercase tracking-wide">{p.name}</span>
                    </td>
                    <td className="py-3 px-4 text-neutral-400">{p.category}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-white">
                      {(p.salePrice || p.price).toFixed(2)} {siteSettings.currency}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={totalStock <= 4 ? 'text-amber-400 font-bold' : 'text-neutral-300'}>
                        {totalStock} units
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {totalStock === 0 ? (
                        <span className="text-red-400 uppercase text-[10px] font-bold">Sold Out</span>
                      ) : p.isNewDrop ? (
                        <span className="text-white uppercase text-[10px] font-bold">Drop 01</span>
                      ) : (
                        <span className="text-emerald-400 uppercase text-[10px]">Active</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
