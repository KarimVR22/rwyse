import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { ArrowRight } from 'lucide-react';

interface CollectionsPageProps {
  onNavigateToProduct: (slug: string) => void;
  onNavigateToShop: () => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  onNavigateToProduct,
  onNavigateToShop,
}) => {
  const { collections, products } = useStore();

  return (
    <div className="w-full bg-[#0b0b0d] text-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border-b border-neutral-800/80 pb-8 mb-12"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-2">
            CURATED CAPSULES // ARCHIVE
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold uppercase text-white tracking-tight">
            Collections & Lookbooks
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-xl font-light">
            Each RWYSE capsule is developed as a coherent architectural wardrobe, exploring proportions, drape, and materiality.
          </p>
        </motion.div>

        {/* Collections List */}
        <div className="space-y-24">
          {collections.map((col, index) => {
            const collectionProducts = products.filter((p) => p.collection === col.name);

            return (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="space-y-8"
              >
                {/* Lookbook Hero Card */}
                <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-neutral-900 border border-neutral-800 group">
                  <img
                    src={col.coverImage}
                    alt={col.name}
                    className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  
                  <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-end max-w-2xl">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-300 mb-1">
                      LOOKBOOK 0{index + 1}
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-display font-extrabold uppercase text-white tracking-tight">
                      {col.name}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-neutral-300 line-clamp-2 leading-relaxed font-light">
                      {col.description}
                    </p>
                  </div>
                </div>

                {/* Collection Products Grid */}
                {collectionProducts.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                        Capsule Garments ({collectionProducts.length})
                      </span>
                      <button
                        onClick={onNavigateToShop}
                        className="text-xs text-neutral-400 hover:text-white uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>View In Shop</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                      {collectionProducts.map((p, idx) => (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: idx * 0.08 }}
                        >
                          <ProductCard product={p} onNavigateToProduct={onNavigateToProduct} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
