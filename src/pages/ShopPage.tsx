import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { ProductCategory } from '../types';
import { SlidersHorizontal, X, ChevronDown, Check } from 'lucide-react';

interface ShopPageProps {
  onNavigateToProduct: (slug: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onNavigateToProduct }) => {
  const { products, collections, siteSettings } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [newArrivalsOnly, setNewArrivalsOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categories: string[] = ['All', 'Hoodies', 'Pants', 'T-Shirts', 'Jackets', 'Accessories'];
  const sizes: string[] = ['All', 'S', 'M', 'L', 'XL', 'XXL'];

  // Extract distinct colors from catalog
  const allColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.colors.forEach((c) => set.add(c.name)));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedCollection !== 'All' && p.collection !== selectedCollection) return false;
      if (selectedSize !== 'All') {
        const sizeObj = p.sizes.find((s) => s.size === selectedSize);
        if (!sizeObj || sizeObj.stock === 0) return false;
      }
      if (selectedColor !== 'All') {
        const hasColor = p.colors.some((c) => c.name === selectedColor);
        if (!hasColor) return false;
      }
      if (inStockOnly) {
        const totalStock = p.sizes.reduce((sum, s) => sum + s.stock, 0);
        if (p.isSoldOut || totalStock === 0) return false;
      }
      if (newArrivalsOnly && !p.isNewDrop) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'featured') return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'price-low') {
        const priceA = a.salePrice || a.price;
        const priceB = b.salePrice || b.price;
        return priceA - priceB;
      }
      if (sortBy === 'price-high') {
        const priceA = a.salePrice || a.price;
        const priceB = b.salePrice || b.price;
        return priceB - priceA;
      }
      return 0;
    });
  }, [products, selectedCategory, selectedCollection, selectedSize, selectedColor, inStockOnly, newArrivalsOnly, sortBy]);

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedCollection !== 'All' ? 1 : 0) +
    (selectedSize !== 'All' ? 1 : 0) +
    (selectedColor !== 'All' ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (newArrivalsOnly ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedCollection('All');
    setSelectedSize('All');
    setSelectedColor('All');
    setInStockOnly(false);
    setNewArrivalsOnly(false);
  };

  return (
    <div className="w-full bg-[#0b0b0d] text-white min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumbs */}
        <div className="mb-8 border-b border-neutral-800/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-2">
              CATALOG // ARCHIVE
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold uppercase text-white tracking-tight">
              All Silhouettes
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400 font-light max-w-xl">
              Contemporary streetwear crafted from 500 GSM loopback cotton and structured technical fabrics.
            </p>
          </div>

          {/* Quick Drop 01 Filter Badge */}
          <button
            onClick={() => {
              setSelectedCollection('DROP 01: RISE & GRIND');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-700/80 text-blue-200 text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer self-start md:self-auto transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>Filter Drop 01: Rise & Grind</span>
          </button>
        </div>

        {/* Category Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-neutral-800/40 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] whitespace-nowrap transition-colors border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-black border-white'
                  : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filter Toolbar / Secondary Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          
          {/* Left: Filter triggers & active indicators */}
          <div className="flex items-center flex-wrap gap-3">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="px-3.5 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-xs font-semibold uppercase tracking-wider text-neutral-200 flex items-center gap-2 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Quick in-stock filter */}
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`px-3 py-2 text-xs uppercase tracking-wider border transition-colors cursor-pointer ${
                inStockOnly
                  ? 'bg-neutral-800 border-white text-white'
                  : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              In Stock Only
            </button>

            {/* Quick New Drops filter */}
            <button
              onClick={() => setNewArrivalsOnly(!newArrivalsOnly)}
              className={`px-3 py-2 text-xs uppercase tracking-wider border transition-colors cursor-pointer ${
                newArrivalsOnly
                  ? 'bg-neutral-800 border-white text-white'
                  : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              New Drops
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-neutral-400 hover:text-white underline uppercase tracking-wider cursor-pointer ml-2"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Right: Results Count & Sort Dropdown */}
          <div className="flex items-center justify-between md:justify-end gap-4 text-xs">
            <span className="text-neutral-400 font-mono tracking-wider">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'PIECE' : 'PIECES'}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-neutral-400 uppercase tracking-widest text-[11px] hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-xs text-white px-3 py-2 focus:outline-none focus:border-neutral-600 uppercase tracking-wider font-mono cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

        </div>

        {/* Expanded Filters Drawer / Panel */}
        {mobileFiltersOpen && (
          <div className="p-6 bg-[#111116] border border-neutral-800 mb-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-white">Refine Catalog</span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Collection */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                  Collection
                </label>
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 p-2 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-neutral-600"
                >
                  <option value="All">All Collections</option>
                  {collections.map((col) => (
                    <option key={col.id} value={col.name}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border cursor-pointer ${
                        selectedSize === s
                          ? 'bg-white text-black border-white'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                  Color Shade
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 p-2 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-neutral-600"
                >
                  {allColors.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center border border-neutral-800/80 bg-neutral-900/30">
            <h3 className="text-base font-bold uppercase tracking-wider text-neutral-200">
              No matching garments found
            </h3>
            <p className="text-xs text-neutral-400 mt-2 max-w-sm mx-auto">
              We couldn't find any products matching your active filters. Try adjusting or resetting your selections.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className={filteredProducts.length === 1 ? 'max-w-md mx-auto md:mx-0' : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.3) }}
                >
                  <ProductCard
                    product={product}
                    onNavigateToProduct={onNavigateToProduct}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </div>
  );
};
