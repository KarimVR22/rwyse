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
    <div className="w-full bg-[#FAFAFC] text-neutral-900 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumbs */}
        <div className="mb-8 border-b border-neutral-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500 block mb-2">
              CATALOG // ARCHIVE
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-extrabold uppercase text-neutral-900 tracking-tight">
              All Silhouettes
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-600 font-light max-w-xl">
              Contemporary streetwear crafted from 500 GSM loopback cotton and structured technical fabrics.
            </p>
          </div>

          {/* Quick Drop 01 Filter Badge */}
          <button
            onClick={() => {
              setSelectedCollection('DROP 01: RISE & GRIND');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer self-start md:self-auto transition-colors shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span>Filter Drop 01: Rise & Grind</span>
          </button>
        </div>

        {/* Category Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-neutral-200 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] whitespace-nowrap transition-colors border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white text-neutral-600 border-neutral-300 hover:border-black hover:text-black'
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
              className="px-3.5 py-2 bg-white border border-neutral-300 hover:border-black text-xs font-semibold uppercase tracking-wider text-neutral-900 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Quick in-stock filter */}
            <button
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`px-3 py-2 text-xs uppercase tracking-wider border transition-colors cursor-pointer shadow-xs ${
                inStockOnly
                  ? 'bg-black border-black text-white'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:border-black hover:text-black'
              }`}
            >
              In Stock Only
            </button>

            {/* Quick New Drops filter */}
            <button
              onClick={() => setNewArrivalsOnly(!newArrivalsOnly)}
              className={`px-3 py-2 text-xs uppercase tracking-wider border transition-colors cursor-pointer shadow-xs ${
                newArrivalsOnly
                  ? 'bg-black border-black text-white'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:border-black hover:text-black'
              }`}
            >
              New Drops
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-neutral-500 hover:text-black underline uppercase tracking-wider cursor-pointer ml-2"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Right: Results Count & Sort Dropdown */}
          <div className="flex items-center justify-between md:justify-end gap-4 text-xs">
            <span className="text-neutral-500 font-mono tracking-wider">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'PIECE' : 'PIECES'}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-neutral-500 uppercase tracking-widest text-[11px] hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-neutral-300 text-xs text-neutral-900 px-3 py-2 focus:outline-none focus:border-black uppercase tracking-wider font-mono cursor-pointer shadow-xs"
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
          <div className="p-6 bg-white border border-neutral-200 mb-8 space-y-6 shadow-sm animate-in fade-in duration-200 rounded-xs">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-900">Refine Catalog</span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Collection */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-2">
                  Collection
                </label>
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="w-full bg-white border border-neutral-300 p-2 text-xs text-neutral-900 uppercase tracking-wider focus:outline-none focus:border-black shadow-xs"
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
                <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-2">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border cursor-pointer ${
                        selectedSize === s
                          ? 'bg-black text-white border-black shadow-xs'
                          : 'bg-white border-neutral-300 text-neutral-700 hover:border-black'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-2">
                  Color Shade
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full bg-white border border-neutral-300 p-2 text-xs text-neutral-900 uppercase tracking-wider focus:outline-none focus:border-black shadow-xs"
                >
                  {allColors.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200">
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-neutral-300 text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-black cursor-pointer shadow-xs"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 cursor-pointer shadow-sm"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center border border-neutral-200 bg-white rounded-xs shadow-xs">
            <h3 className="text-base font-bold uppercase tracking-wider text-neutral-900">
              No matching garments found
            </h3>
            <p className="text-xs text-neutral-600 mt-2 max-w-sm mx-auto font-light">
              We couldn't find any products matching your active filters. Try adjusting or resetting your selections.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 cursor-pointer shadow-sm"
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
