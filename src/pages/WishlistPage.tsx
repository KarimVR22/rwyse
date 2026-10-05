import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { Bookmark, ArrowRight } from 'lucide-react';

interface WishlistPageProps {
  onNavigateToProduct: (slug: string) => void;
  onNavigateToShop: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onNavigateToProduct,
  onNavigateToShop,
}) => {
  const { wishlist, products } = useStore();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="w-full bg-[#0b0b0d] text-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-neutral-800/80 pb-6 mb-8 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
              SAVED PIECES // PERSONAL ARCHIVE
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold uppercase text-white tracking-tight">
              Wishlist ({savedProducts.length})
            </h1>
          </div>
          <button
            onClick={onNavigateToShop}
            className="text-xs text-neutral-400 hover:text-white uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore All Pieces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {savedProducts.length === 0 ? (
          <div className="py-24 text-center border border-neutral-800/80 bg-neutral-900/30 max-w-lg mx-auto p-8">
            <div className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center mx-auto mb-4 text-neutral-500">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-wider text-white">
              No Pieces Saved Yet
            </h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Curate your private selection by tapping the bookmark icon on any garment in the catalog.
            </p>
            <button
              onClick={onNavigateToShop}
              className="mt-6 px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {savedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigateToProduct={onNavigateToProduct}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
