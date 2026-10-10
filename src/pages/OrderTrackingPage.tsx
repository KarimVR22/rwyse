import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Package, CheckCircle2, Clock, Truck, ShieldAlert, ArrowRight, MapPin } from 'lucide-react';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
  onNavigate: (path: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderNumber = '',
  onNavigate,
}) => {
  const { orders, trackOrderByNumber, siteSettings } = useStore();
  const [searchQuery, setSearchQuery] = useState(initialOrderNumber);
  const [searchedOrder, setSearchedOrder] = useState<typeof orders[0] | undefined>(
    initialOrderNumber ? trackOrderByNumber(initialOrderNumber) : orders[0]
  );
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialOrderNumber) {
      setSearchQuery(initialOrderNumber);
      const res = trackOrderByNumber(initialOrderNumber);
      setSearchedOrder(res);
    }
  }, [initialOrderNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setHasSearched(true);
    const result = trackOrderByNumber(searchQuery);
    setSearchedOrder(result);
  };

  const statusList = ['Pending', 'Confirmed', 'Preparing', 'Shipped', 'Delivered'];

  const getStepIcon = (status: string, isCurrent: boolean, isDone: boolean) => {
    if (searchedOrder?.status === 'Cancelled') {
      return <ShieldAlert className="w-4 h-4 text-red-400" />;
    }
    if (isDone) return <CheckCircle2 className="w-4 h-4 text-white" />;
    if (isCurrent) return <Clock className="w-4 h-4 text-white animate-pulse" />;
    return <div className="w-2 h-2 rounded-full bg-neutral-600" />;
  };

  return (
    <div className="w-full bg-[#0b0b0d] text-white min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-2">
            LOGISTICS PORTAL // REAL-TIME
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold uppercase text-white tracking-tight">
            Track Your Order
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-neutral-400 font-light">
            Enter your RWYSE order identifier (e.g. <strong>RWY-XXXXX</strong>) or phone number to monitor parcel transit.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="ENTER RWY-XXXXX OR PHONE"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 uppercase tracking-widest font-mono focus:outline-none focus:border-neutral-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Track
            </button>
          </form>
        </div>

        {/* Quick Demo Pickers if no search query */}
        {!searchedOrder && (
          <div className="mb-8 p-4 bg-neutral-900/40 border border-neutral-800 max-w-md mx-auto text-center">
            <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block mb-2">
              Recent Demonstrative Orders
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {orders.slice(0, 3).map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setSearchQuery(o.orderNumber);
                    setSearchedOrder(o);
                  }}
                  className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-200 uppercase tracking-wider cursor-pointer"
                >
                  {o.orderNumber} ({o.status})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Order Result Card */}
        {searchedOrder ? (
          <div className="bg-[#111116] border border-neutral-800 p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
            
            {/* Order Title Lockup */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-white" />
                  <span className="text-base sm:text-lg font-bold font-mono text-white tracking-wider">
                    {searchedOrder.orderNumber}
                  </span>
                </div>
                <div className="mt-1 text-xs text-neutral-400 flex items-center gap-2">
                  <span>Recipient: <strong>{searchedOrder.customerName}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Placed {new Date(searchedOrder.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="self-start sm:self-center">
                <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest font-mono border ${
                  searchedOrder.status === 'Delivered'
                    ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                    : searchedOrder.status === 'Cancelled'
                    ? 'bg-red-950/60 border-red-700 text-red-300'
                    : 'bg-neutral-900 border-neutral-600 text-white'
                }`}>
                  STATUS: {searchedOrder.status}
                </span>
              </div>
            </div>

            {/* Visual Stepper */}
            {searchedOrder.status === 'Cancelled' ? (
              <div className="p-4 bg-red-950/30 border border-red-800/80 text-red-300 text-xs flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <div>
                  <strong className="block text-sm">Order Cancelled</strong>
                  <span>This order has been cancelled. If you have questions, contact RWYSE studio support.</span>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 block mb-6">
                  PROGRESSION MILESTONES
                </span>

                {/* Progress bar container */}
                <div className="relative">
                  {/* Connection Line */}
                  <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-[2px] bg-neutral-800 -translate-y-1/2 z-0" />

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                    {statusList.map((step, idx) => {
                      const currentIdx = statusList.indexOf(searchedOrder.status);
                      const isDone = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={step} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center">
                          {/* Dot / Icon */}
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                            isDone
                              ? 'bg-white border-white text-black'
                              : isCurrent
                              ? 'bg-neutral-900 border-white text-white shadow-lg'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-600'
                          }`}>
                            {getStepIcon(step, isCurrent, isDone)}
                          </div>

                          {/* Label */}
                          <div>
                            <span className={`text-xs uppercase tracking-wider block font-semibold ${
                              isDone ? 'text-white' : 'text-neutral-500'
                            }`}>
                              {step}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400 block">
                              {idx === 0
                                ? 'Logged'
                                : idx === 1
                                ? 'Confirmed'
                                : idx === 2
                                ? 'In Packing'
                                : idx === 3
                                ? 'With Courier'
                                : 'Received'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Timeline Steps */}
            <div className="pt-6 border-t border-neutral-800 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 block">
                CARRIER LOG JOURNAL
              </span>
              <div className="space-y-3">
                {searchedOrder.trackingSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 border flex items-start justify-between gap-4 text-xs ${
                      step.completed
                        ? 'bg-neutral-900/60 border-neutral-800 text-neutral-200'
                        : 'bg-neutral-950/40 border-neutral-900 text-neutral-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${step.completed ? 'bg-white' : 'bg-neutral-700'}`} />
                      <div>
                        <strong className="block text-white uppercase tracking-wider font-mono">{step.title}</strong>
                        <span className="text-xs text-neutral-400 mt-0.5 block">{step.desc}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500 whitespace-nowrap">
                      {step.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination & Package Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-neutral-800 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                  DESTINATION DETAILS
                </span>
                <div className="p-3 bg-neutral-900/40 border border-neutral-800 space-y-1.5">
                  <div className="flex items-start gap-2 text-neutral-300">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <span>{searchedOrder.address}, {searchedOrder.city}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 pl-5">
                    Region: {searchedOrder.region}
                  </div>
                  <div className="text-[11px] text-neutral-400 pl-5 font-mono">
                    Contact: {searchedOrder.customerPhone}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                  PARCEL ITEMS ({searchedOrder.items.length})
                </span>
                <div className="p-3 bg-neutral-900/40 border border-neutral-800 space-y-2">
                  {searchedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-[11px]">
                      <span className="text-white truncate max-w-[180px]">{item.name}</span>
                      <span className="font-mono text-neutral-400">
                        {item.size} · {item.color} · x{item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-neutral-800 flex justify-between font-bold text-white text-xs">
                    <span>Total Due (COD):</span>
                    <span className="font-mono">{searchedOrder.total.toFixed(2)} {siteSettings.currency}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : hasSearched ? (
          <div className="p-12 bg-neutral-900/40 border border-neutral-800 text-center max-w-md mx-auto">
            <h3 className="text-base font-bold uppercase tracking-wider text-white">
              No Order Found
            </h3>
            <p className="text-xs text-neutral-400 mt-2">
              We couldn't locate an order with identifier "{searchQuery}". Please verify the digits and try again.
            </p>
          </div>
        ) : null}

      </div>
    </div>
  );
};
