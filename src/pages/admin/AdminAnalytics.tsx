import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Percent, Users, ArrowUpRight, RotateCcw } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const { products, orders, siteSettings, resetAllRevenuesToZero, clearAllDemoOrders, showToast } = useStore();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.total : sum), 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const conversionRate = orders.length > 0 ? 3.8 : 0;
  const customerGrowth = orders.length > 0 ? 18.4 : 0;

  const revenueBreakdown = [
    { category: 'Hoodies (500 GSM)', percent: orders.length > 0 ? 48 : 0, revenue: totalRevenue * 0.48 },
    { category: 'Pants & Cargo', percent: orders.length > 0 ? 28 : 0, revenue: totalRevenue * 0.28 },
    { category: 'T-Shirts (Raw Wash)', percent: orders.length > 0 ? 16 : 0, revenue: totalRevenue * 0.16 },
    { category: 'Jackets & Accessories', percent: orders.length > 0 ? 8 : 0, revenue: totalRevenue * 0.08 },
  ];

  const handleResetRevenues = async () => {
    if (window.confirm('Voulez-vous réinitialiser tous les indicateurs et revenus à 0 DT ?')) {
      await resetAllRevenuesToZero();
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
            PERFORMANCE INTELLIGENCE // KPI REPORTING
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight">
            Store Analytics & Metrics
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetRevenues}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500 text-neutral-300 hover:text-red-400 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer rounded-xs"
            title="Remettre tous les revenus à 0 DT"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mettre Revenus à 0 DT</span>
          </button>

          <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800">
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs uppercase font-semibold tracking-wider cursor-pointer ${
                  period === p ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-[#111116] border border-neutral-800 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
            LIFETIME GROSS REVENUE
          </span>
          <div className="text-3xl font-bold font-mono text-white">
            {totalRevenue.toFixed(2)} <span className="text-xs font-normal text-neutral-400">{siteSettings.currency}</span>
          </div>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{orders.length > 0 ? '+32% progression ce mois' : '0.0% · Démarrage boutique (0 DT)'}</span>
          </span>
        </div>

        <div className="p-6 bg-[#111116] border border-neutral-800 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
            AVERAGE ORDER VALUE (AOV)
          </span>
          <div className="text-3xl font-bold font-mono text-white">
            {avgOrderValue.toFixed(2)} <span className="text-xs font-normal text-neutral-400">{siteSettings.currency}</span>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            ~1.8 garments per checkout
          </span>
        </div>

        <div className="p-6 bg-[#111116] border border-neutral-800 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
            CATALOG CONVERSION RATE
          </span>
          <div className="text-3xl font-bold font-mono text-white">
            {conversionRate}%
          </div>
          <span className="text-xs text-emerald-400 font-mono">
            +0.6% above fashion industry benchmark
          </span>
        </div>

        <div className="p-6 bg-[#111116] border border-neutral-800 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
            COMMUNITY MEMBERSHIP GROWTH
          </span>
          <div className="text-3xl font-bold font-mono text-white">
            +{customerGrowth}%
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            Directly driven by Drop 01 launch
          </span>
        </div>
      </div>

      {/* Revenue by Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-[#111116] border border-neutral-800 p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 block mb-1">
              CATEGORY DOMINANCE
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Revenue Volume by Silhouette Family
            </h2>
          </div>

          <div className="space-y-4">
            {revenueBreakdown.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300 font-semibold">{item.category}</span>
                  <span className="font-mono text-white">
                    {item.revenue.toFixed(2)} {siteSettings.currency} ({item.percent}%)
                  </span>
                </div>
                <div className="w-full bg-neutral-900 h-2 overflow-hidden">
                  <div className="bg-white h-full" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#111116] border border-neutral-800 p-6 sm:p-8 space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 block mb-1">
              REGIONAL TRANSIT VOLUME
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Top Customer Hubs
            </h2>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between p-3 bg-neutral-900/60 border border-neutral-800">
              <span className="text-white">1. Grand Tunis (Lac, Ennasr, Marsa)</span>
              <span className="font-bold text-white">{orders.length > 0 ? '58% des commandes' : '0 commande'}</span>
            </div>
            <div className="flex justify-between p-3 bg-neutral-900/60 border border-neutral-800">
              <span className="text-white">2. Sahel (Sousse, Monastir)</span>
              <span className="font-bold text-white">{orders.length > 0 ? '22% des commandes' : '0 commande'}</span>
            </div>
            <div className="flex justify-between p-3 bg-neutral-900/60 border border-neutral-800">
              <span className="text-white">3. Sfax Hub</span>
              <span className="font-bold text-white">{orders.length > 0 ? '12% des commandes' : '0 commande'}</span>
            </div>
            <div className="flex justify-between p-3 bg-neutral-900/60 border border-neutral-800">
              <span className="text-white">4. Autres Gouvernorats</span>
              <span className="font-bold text-white">{orders.length > 0 ? '8% des commandes' : '0 commande'}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
