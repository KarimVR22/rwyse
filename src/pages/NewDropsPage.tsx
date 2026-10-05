import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { editorialImg, hoodieImg } from '../data/initialData';
import { ArrowRight, Flame, ShieldCheck, Sparkles } from 'lucide-react';

interface NewDropsPageProps {
  onNavigateToProduct: (slug: string) => void;
  onNavigateToShop: () => void;
}

export const NewDropsPage: React.FC<NewDropsPageProps> = ({
  onNavigateToProduct,
  onNavigateToShop,
}) => {
  const { products, siteSettings } = useStore();

  const dropProducts = products.filter((p) => p.isNewDrop);

  if (!siteSettings.isNewDropActive) {
    return (
      <div className="w-full bg-[#0b0b0d] text-white min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold uppercase tracking-wider">Next Drop In Preparation</h2>
        <p className="text-xs text-neutral-400 mt-2 max-w-sm">
          The studio is currently finalizing the upcoming capsule. Check back soon or join our inner circle newsletter for early access.
        </p>
        <button
          onClick={onNavigateToShop}
          className="mt-6 px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest cursor-pointer"
        >
          Explore Current Collection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0b0b0d] text-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Drop Spotlight Hero */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-neutral-900 border border-neutral-800 mb-16">
          <img
            src={editorialImg}
            alt="RWYSE Drop 01: Origin"
            className="w-full h-full object-cover filter brightness-[0.68] contrast-[1.08]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20" />
          
          <div className="absolute inset-0 p-6 sm:p-12 lg:p-16 flex flex-col justify-end max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.25em]">
                ACTIVE DROP
              </span>
              <span className="text-[11px] font-mono text-neutral-300 uppercase tracking-widest">
                LAUNCHED OCTOBER 2026
              </span>
            </div>

            <h1 className="text-3xl sm:text-6xl font-display font-extrabold uppercase text-white tracking-tight">
              DROP 01: ORIGIN
            </h1>

            <p className="mt-3 text-xs sm:text-base text-neutral-300 leading-relaxed font-light max-w-xl">
              Discover the latest RWYSE pieces. An inaugural collection constructed from dense 500 GSM loopback cotton, featuring boxy cuts, double-layer upright hoods, and architectural cargo pants.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('drop-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-[0.25em] hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>SHOP THE DROP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Drop Features Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 bg-[#111116] border border-neutral-800 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400">
              SPECIFICATION 01
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              500 GSM French Terry
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Milled in Tunisia from premium combed organic yarns, delivering substantial weight without restricting natural drape.
            </p>
          </div>

          <div className="p-6 bg-[#111116] border border-neutral-800 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400">
              SPECIFICATION 02
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Architectural Silhouette
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Extended box cuts, lowered armholes, and upright rigid double hoods that hold structure throughout daily wear.
            </p>
          </div>

          <div className="p-6 bg-[#111116] border border-neutral-800 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400">
              SPECIFICATION 03
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Limited Batch Production
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Strictly capped inventory numbers. Once a size or color sells out, restocks are never guaranteed.
            </p>
          </div>
        </div>

        {/* Drop Products Grid */}
        <div id="drop-grid" className="pt-6 border-t border-neutral-800">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
                LIMITED RUN GARMENTS
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight">
                Drop 01 Pieces ({dropProducts.length})
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {dropProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onNavigateToProduct={onNavigateToProduct}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
