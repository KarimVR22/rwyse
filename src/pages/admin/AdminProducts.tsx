import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory } from '../../types';
import { Plus, Search, Edit3, Copy, Trash2, X, Check, Eye, RotateCcw, AlertTriangle, Cloud, RefreshCw } from 'lucide-react';
import { hoodieImg } from '../../data/initialData';

export const AdminProducts: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    siteSettings,
    logAuditAction,
    syncAllProductsToCloud,
    isSyncingCatalog,
    isCloudSynced,
  } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'info' | 'media3d' | 'stock'>('info');
  const [preview360Index, setPreview360Index] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: 150,
    salePrice: '',
    category: 'Hoodies' as ProductCategory,
    collection: 'DROP 01: ORIGIN',
    description: '',
    fabric: '100% Combed Organic Cotton (500 GSM)',
    fit: 'Architectural Boxy Streetwear Fit',
    careInstructions: 'Machine wash cold inside out. Hang dry.',
    sku: 'RWY-HD-001',
    isFeatured: true,
    isNewDrop: true,
    isSoldOut: false,
    status: 'published' as 'published' | 'draft' | 'archived',
    colorName: 'Onyx Black',
    colorHex: '#111111',
    imageUrl: hoodieImg,
    threeDModelUrl: '',
    threeSixtyFramesInput: '',
    stockS: 10,
    stockM: 10,
    stockL: 10,
    stockXL: 5,
    stockXXL: 2,
  });

  const categories: ProductCategory[] = ['Hoodies', 'Pants', 'T-Shirts', 'Jackets', 'Accessories'];

  const filtered = products.filter((p) => {
    if (selectedCat !== 'All' && p.category !== selectedCat) return false;
    if (search.trim() && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      slug: '',
      price: 160,
      salePrice: '',
      category: 'Hoodies',
      collection: 'DROP 01: ORIGIN',
      description: 'Engineered from custom 500 GSM loopback organic cotton with dropped shoulders and rigid upright hood.',
      fabric: '100% Combed Organic Cotton (500 GSM)',
      fit: 'Signature architectural oversized silhouette',
      careInstructions: 'Cold gentle wash. Line dry in shade.',
      sku: `RWY-${Math.floor(100 + Math.random() * 900)}`,
      isFeatured: true,
      isNewDrop: true,
      isSoldOut: false,
      status: 'published',
      colorName: 'Royal Blue',
      colorHex: '#1e3a8a',
      imageUrl: hoodieImg,
      threeDModelUrl: '',
      threeSixtyFramesInput: '',
      stockS: 15,
      stockM: 20,
      stockL: 18,
      stockXL: 8,
      stockXXL: 4,
    });
    setEditingProduct(null);
    setActiveModalTab('info');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    const sStock = p.sizes.find((s) => s.size === 'S')?.stock ?? 0;
    const mStock = p.sizes.find((s) => s.size === 'M')?.stock ?? 0;
    const lStock = p.sizes.find((s) => s.size === 'L')?.stock ?? 0;
    const xlStock = p.sizes.find((s) => s.size === 'XL')?.stock ?? 0;
    const xxlStock = p.sizes.find((s) => s.size === 'XXL')?.stock ?? 0;

    setFormData({
      name: p.name,
      slug: p.slug,
      price: p.price,
      salePrice: p.salePrice ? String(p.salePrice) : '',
      category: p.category,
      collection: p.collection,
      description: p.description,
      fabric: p.fabric,
      fit: p.fit,
      careInstructions: p.careInstructions,
      sku: p.sku,
      isFeatured: p.isFeatured,
      isNewDrop: p.isNewDrop,
      isSoldOut: p.isSoldOut,
      status: p.status || 'published',
      colorName: p.colors[0]?.name || 'Standard',
      colorHex: p.colors[0]?.hex || '#111111',
      imageUrl: p.colors[0]?.images[0] || hoodieImg,
      threeDModelUrl: p.threeDModelUrl || '',
      threeSixtyFramesInput: p.threeSixtyFrames?.join('\n') || '',
      stockS: sStock,
      stockM: mStock,
      stockL: lStock,
      stockXL: xlStock,
      stockXXL: xxlStock,
    });
    setEditingProduct(p);
    setActiveModalTab('info');
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const sizes = [
      { size: 'S', stock: Number(formData.stockS) },
      { size: 'M', stock: Number(formData.stockM) },
      { size: 'L', stock: Number(formData.stockL) },
      { size: 'XL', stock: Number(formData.stockXL) },
      { size: 'XXL', stock: Number(formData.stockXXL) },
    ];

    const slug =
      formData.slug.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const salePriceNum = formData.salePrice ? Number(formData.salePrice) : undefined;

    const frames = formData.threeSixtyFramesInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: formData.name,
        slug,
        price: Number(formData.price),
        salePrice: salePriceNum,
        category: formData.category,
        collection: formData.collection,
        description: formData.description,
        fabric: formData.fabric,
        fit: formData.fit,
        careInstructions: formData.careInstructions,
        sku: formData.sku,
        isFeatured: formData.isFeatured,
        isNewDrop: formData.isNewDrop,
        isSoldOut: formData.isSoldOut,
        status: formData.status,
        threeDModelUrl: formData.threeDModelUrl.trim() || undefined,
        threeSixtyFrames: frames.length > 0 ? frames : undefined,
        sizes,
        colors: [
          {
            name: formData.colorName,
            hex: formData.colorHex,
            images: [formData.imageUrl],
            threeDModelUrl: formData.threeDModelUrl.trim() || undefined,
            threeSixtyFrames: frames.length > 0 ? frames : undefined,
          },
        ],
      });
      logAuditAction('Modification Produit', `Produit ${formData.name} mis à jour (SKU: ${formData.sku})`);
    } else {
      addProduct({
        name: formData.name,
        slug,
        price: Number(formData.price),
        salePrice: salePriceNum,
        category: formData.category,
        collection: formData.collection,
        description: formData.description,
        fabric: formData.fabric,
        fit: formData.fit,
        careInstructions: formData.careInstructions,
        sku: formData.sku,
        isFeatured: formData.isFeatured,
        isNewDrop: formData.isNewDrop,
        isSoldOut: formData.isSoldOut,
        status: formData.status,
        threeDModelUrl: formData.threeDModelUrl.trim() || undefined,
        threeSixtyFrames: frames.length > 0 ? frames : undefined,
        sizes,
        colors: [
          {
            name: formData.colorName,
            hex: formData.colorHex,
            images: [formData.imageUrl],
            threeDModelUrl: formData.threeDModelUrl.trim() || undefined,
            threeSixtyFrames: frames.length > 0 ? frames : undefined,
          },
        ],
        details: [
          'High-density 500 GSM loopback organic cotton',
          'Architectural boxy streetwear silhouette with drop shoulders',
          'Garment-dyed and enzyme washed for ultra-soft handfeel',
          'Engineered and produced in Tunisia',
        ],
      });
      logAuditAction('Création Produit', `Nouveau produit ${formData.name} créé (SKU: ${formData.sku})`);
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
            CATALOG MANAGEMENT // INVENTORY
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight">
            Product Archive
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-emerald-950/80 border border-emerald-800 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Synchro Cloud Live Active (Visible par tous les clients externes)</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={syncAllProductsToCloud}
            disabled={isSyncingCatalog}
            title="Pousser l'ensemble du catalogue et photos sur Firestore pour tous les visiteurs"
            className="px-4 py-2.5 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-200 text-xs font-semibold uppercase tracking-wider hover:text-white transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSyncingCatalog ? (
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
            ) : (
              <Cloud className="w-4 h-4 text-emerald-400" />
            )}
            <span>{isSyncingCatalog ? 'Synchronisation...' : 'Pousser vers le Cloud'}</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Piece</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111116] border border-neutral-800 p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer ${
                selectedCat === cat
                  ? 'bg-white text-black font-semibold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#111116] border border-neutral-800 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] font-mono uppercase text-neutral-400 border-b border-neutral-800 bg-neutral-900/60">
            <tr>
              <th className="py-3 px-4">Garment</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Total Stock</th>
              <th className="py-3 px-4">Badges</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/70 text-neutral-300">
            {filtered.map((prod) => {
              const totalStock = prod.sizes.reduce((sum, s) => sum + s.stock, 0);

              return (
                <tr key={prod.id} className="hover:bg-neutral-900/40">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-10 h-12 bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                      <img src={prod.colors[0]?.images[0]} alt={prod.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <span className="font-semibold text-white uppercase tracking-wider block">{prod.name}</span>
                      <span className="text-[10px] text-neutral-400">{prod.collection}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-400">{prod.sku}</td>
                  <td className="py-3 px-4">{prod.category}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-white">
                    {(prod.salePrice || prod.price).toFixed(2)} {siteSettings.currency}
                    {prod.salePrice && (
                      <span className="text-[10px] text-neutral-400 line-through block font-normal">
                        {prod.price} {siteSettings.currency}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {totalStock === 0 ? (
                      <span className="px-2 py-0.5 bg-red-950/60 border border-red-800 text-red-400 font-bold text-[10px]">
                        ÉPUISÉ (0)
                      </span>
                    ) : totalStock <= 5 ? (
                      <span className="px-2 py-0.5 bg-amber-950/60 border border-amber-800 text-amber-300 font-bold text-[10px] flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" />
                        <span>STOCK FAIBLE ({totalStock})</span>
                      </span>
                    ) : (
                      <span className="text-neutral-300 text-xs">{totalStock} unités</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-mono uppercase bg-cyan-950/60 border border-cyan-800 text-cyan-300 px-1.5 py-0.5 flex items-center gap-1">
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>360°</span>
                      </span>
                      {prod.isNewDrop && (
                        <span className="text-[9px] font-mono uppercase bg-neutral-900 border border-neutral-700 text-white px-1.5 py-0.5">
                          Drop
                        </span>
                      )}
                      {prod.isFeatured && (
                        <span className="text-[9px] font-mono uppercase bg-neutral-900 border border-neutral-700 text-amber-300 px-1.5 py-0.5">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="Edit piece"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => duplicateProduct(prod.id)}
                        className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="Duplicate piece"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete piece"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
            <div className="relative w-full max-w-2xl bg-[#111116] border border-neutral-800 text-neutral-100 shadow-2xl p-6 sm:p-8 z-10 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                  {editingProduct ? 'Edit Garment' : 'Add New Garment'}
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="flex border-b border-neutral-800 text-xs font-mono uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setActiveModalTab('info')}
                  className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors cursor-pointer ${
                    activeModalTab === 'info'
                      ? 'border-white text-white'
                      : 'border-transparent text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  1. Info & Prix
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalTab('media3d')}
                  className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeModalTab === 'media3d'
                      ? 'border-white text-white'
                      : 'border-transparent text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>2. Vues & Photos 360°</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalTab('stock')}
                  className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors cursor-pointer ${
                    activeModalTab === 'stock'
                      ? 'border-white text-white'
                      : 'border-transparent text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  3. Stocks & Statut
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                {activeModalTab === 'info' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-neutral-400 uppercase tracking-wider block mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="text-neutral-400 uppercase tracking-wider block mb-1">Price (TND) *</label>
                        <input
                          type="number"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-neutral-400 uppercase tracking-wider block mb-1">Sale Price (Optional)</label>
                        <input
                          type="number"
                          placeholder="e.g. 149"
                          value={formData.salePrice}
                          onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-neutral-400 uppercase tracking-wider block mb-1">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-neutral-400 uppercase tracking-wider block mb-1">SKU</label>
                        <input
                          type="text"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-neutral-400 uppercase tracking-wider block mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-neutral-400 uppercase tracking-wider block mb-1">Collection</label>
                        <input
                          type="text"
                          value={formData.collection}
                          onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-neutral-400 uppercase tracking-wider block mb-1">Image Principale (URL)</label>
                        <input
                          type="text"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeModalTab === 'media3d' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-neutral-900/60 border border-neutral-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Séquence Photos Multi-angles (Rotation 360°)</span>
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {formData.threeSixtyFramesInput.split('\n').filter(Boolean).length} frames chargées
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        Ajoutez les URLs des photos prises tout autour du vêtement (face, 15°, 30°, 45°... 360°).
                      </p>
                      <textarea
                        rows={4}
                        placeholder="Une URL d'image par ligne (ex: https://.../angle-01.jpg)"
                        value={formData.threeSixtyFramesInput}
                        onChange={(e) => setFormData({ ...formData, threeSixtyFramesInput: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 text-white font-mono text-xs"
                      />
                      
                      {/* Live 360 Preview Slider */}
                      {formData.threeSixtyFramesInput.split('\n').filter(Boolean).length > 1 && (
                        <div className="mt-3 p-3 bg-black/60 border border-neutral-800 space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-400">
                            <span>Aperçu interactif 360°</span>
                            <span>Frame {preview360Index + 1} / {formData.threeSixtyFramesInput.split('\n').filter(Boolean).length}</span>
                          </div>
                          <div className="h-28 bg-neutral-950 flex items-center justify-center overflow-hidden border border-neutral-800">
                            <img
                              src={formData.threeSixtyFramesInput.split('\n').filter(Boolean)[preview360Index]}
                              alt="Preview 360"
                              className="h-full object-contain"
                            />
                          </div>
                          <input
                            type="range"
                            min="0"
                            max={formData.threeSixtyFramesInput.split('\n').filter(Boolean).length - 1}
                            value={preview360Index}
                            onChange={(e) => setPreview360Index(Number(e.target.value))}
                            className="w-full cursor-pointer accent-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeModalTab === 'stock' && (
                  <div className="space-y-4">
                    {/* Stock By Size */}
                    <div className="p-3 bg-neutral-900/60 border border-neutral-800 space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                        Allocation des stocks par taille
                      </span>
                      <div className="grid grid-cols-5 gap-2">
                        {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                          const key = `stock${sz}` as keyof typeof formData;
                          return (
                            <div key={sz}>
                              <span className="text-[10px] font-mono text-neutral-400 block mb-0.5">{sz}</span>
                              <input
                                type="number"
                                min="0"
                                value={formData[key] as number}
                                onChange={(e) => setFormData({ ...formData, [key]: Number(e.target.value) })}
                                className="w-full px-2 py-1 bg-neutral-950 border border-neutral-800 text-white font-mono text-center"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-neutral-400 uppercase tracking-wider block mb-1">Statut Publication</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white"
                        >
                          <option value="published">Publié (En ligne)</option>
                          <option value="draft">Brouillon (Non visible)</option>
                          <option value="archived">Archivé</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-neutral-400 uppercase tracking-wider block mb-1">Nom du coloris</label>
                        <input
                          type="text"
                          value={formData.colorName}
                          onChange={(e) => setFormData({ ...formData, colorName: e.target.value })}
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white"
                        />
                      </div>
                    </div>

                    {/* Status Toggles */}
                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isNewDrop}
                          onChange={(e) => setFormData({ ...formData, isNewDrop: e.target.checked })}
                          className="rounded-xs"
                        />
                        <span>New Drop Item</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          className="rounded-xs"
                        />
                        <span>Featured On Homepage</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isSoldOut}
                          onChange={(e) => setFormData({ ...formData, isSoldOut: e.target.checked })}
                          className="rounded-xs"
                        />
                        <span>Mark Sold Out</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border border-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-white text-black font-bold uppercase tracking-wider hover:bg-neutral-200 cursor-pointer"
                  >
                    {editingProduct ? 'Save Updates' : 'Publish Garment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
