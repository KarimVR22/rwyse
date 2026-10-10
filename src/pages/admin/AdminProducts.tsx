import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory } from '../../types';
import {
  Plus,
  Search,
  Edit3,
  Copy,
  Trash2,
  X,
  Check,
  Eye,
  RotateCcw,
  AlertTriangle,
  Cloud,
  RefreshCw,
  Upload,
  Download,
  FileText,
  Image as ImageIcon,
  Sparkles,
  CheckCircle,
  Camera,
} from 'lucide-react';
import { hoodieImg } from '../../data/initialData';
import { compressImageIfNeeded } from '../../utils/imageCompressor';
import { resolveProductImage } from '../../utils/imageResolver';

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
    importProducts,
  } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'info' | 'media3d' | 'stock'>('info');
  const [preview360Index, setPreview360Index] = useState(0);

  // Bulk Import state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importTab, setImportTab] = useState<'file' | 'json'>('file');
  const [importJsonText, setImportJsonText] = useState('');
  const [importedPreviewList, setImportedPreviewList] = useState<Omit<Product, 'id' | 'createdAt'>[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [isPublishingImport, setIsPublishingImport] = useState(false);
  const [isCompressingFormImage, setIsCompressingFormImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlManualInput, setShowUrlManualInput] = useState(false);

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
    additionalImages: [] as string[],
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

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    setIsCompressingFormImage(true);
    try {
      if (isGallery) {
        const compressedList: string[] = [];
        for (const file of files) {
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string) || '');
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
          });
          if (base64) {
            const compressed = await compressImageIfNeeded(base64, 1000, 1000, 0.75);
            compressedList.push(compressed);
          }
        }
        setFormData((prev) => ({
          ...prev,
          additionalImages: [...prev.additionalImages, ...compressedList],
        }));
      } else {
        const file = files[0];
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string) || '');
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        });
        if (base64) {
          const compressed = await compressImageIfNeeded(base64, 1000, 1000, 0.75);
          setFormData((prev) => ({
            ...prev,
            imageUrl: compressed,
          }));
        }
      }
    } catch (err) {
      console.warn('Image upload error:', err);
    } finally {
      setIsCompressingFormImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  };

  const downloadSampleJson = () => {
    const sample = [
      {
        name: "RWYSE Cyber Raw Minimalist Tee",
        price: 95,
        salePrice: 85,
        category: "T-Shirts",
        collection: "DROP 01: ORIGIN",
        sku: "RWY-TS-901",
        description: "Heavyweight 280 GSM cotton oversize tee with raw edges.",
        fabric: "100% Organic Cotton",
        fit: "Boxy Relaxed",
        imageUrl: hoodieImg,
        stockS: 20,
        stockM: 25,
        stockL: 20,
        stockXL: 10
      },
      {
        name: "RWYSE Tactical Utility Heavy Cargo",
        price: 185,
        category: "Pants",
        collection: "DROP 01: ORIGIN",
        sku: "RWY-PT-402",
        description: "Double knee reinforced technical cargos with magnetic snap pockets.",
        fabric: "Ripstop Cotton / Cordura",
        fit: "Tapered Streetwear",
        imageUrl: hoodieImg,
        stockS: 10,
        stockM: 15,
        stockL: 15,
        stockXL: 5
      }
    ];
    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rwyse_catalogue_modele.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSampleCsv = () => {
    const csvContent = `name,price,category,sku,imageUrl,stock
"RWYSE Heavy Mineral Boxy Hoodie",160,"Hoodies","RWY-HD-101","https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1200",20
"RWYSE Raw Minimalist Street T-Shirt",95,"T-Shirts","RWY-TS-202","https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200",25
"RWYSE Heavyweight Tactical Cargo Pants",185,"Pants","RWY-PA-303","https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1200",15`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rwyse_catalogue_modele.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseProductsContent = (content: string, fileName: string) => {
    try {
      setImportError(null);
      if (fileName.endsWith('.json') || content.trim().startsWith('[') || content.trim().startsWith('{')) {
        let parsed = JSON.parse(content);
        if (!Array.isArray(parsed)) {
          parsed = [parsed];
        }
        const valid: Omit<Product, 'id' | 'createdAt'>[] = parsed.map((item: any, idx: number) => {
          const cat = categories.includes(item.category) ? item.category : 'Hoodies';
          const sku = item.sku || `RWY-IMP-${Date.now().toString().slice(-4)}-${idx + 1}`;
          const price = Number(item.price) || 150;
          const name = item.name || `Pièce Importée #${idx + 1}`;
          const img = item.imageUrl || (item.colors?.[0]?.images?.[0]) || hoodieImg;
          const sizes = item.sizes || [
            { size: 'S', stock: Number(item.stockS ?? item.stock ?? 10) },
            { size: 'M', stock: Number(item.stockM ?? item.stock ?? 15) },
            { size: 'L', stock: Number(item.stockL ?? item.stock ?? 15) },
            { size: 'XL', stock: Number(item.stockXL ?? item.stock ?? 5) },
            { size: 'XXL', stock: Number(item.stockXXL ?? 2) },
          ];
          return {
            name,
            slug: item.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            price,
            salePrice: item.salePrice ? Number(item.salePrice) : undefined,
            category: cat,
            collection: item.collection || 'DROP 01: ORIGIN',
            description: item.description || 'Pièce exclusive issue de la collection RWYSE.',
            fabric: item.fabric || '100% Combed Organic Cotton (500 GSM)',
            fit: item.fit || 'Signature Streetwear Fit',
            careInstructions: item.careInstructions || 'Cold gentle wash. Line dry in shade.',
            sku,
            isFeatured: item.isFeatured ?? true,
            isNewDrop: item.isNewDrop ?? true,
            isSoldOut: item.isSoldOut ?? false,
            status: item.status || 'published',
            sizes,
            colors: item.colors || [
              {
                name: item.colorName || 'Onyx Mineral',
                hex: item.colorHex || '#111111',
                images: [img],
              },
            ],
            details: item.details || [
              'High-density 500 GSM loopback organic cotton',
              'Architectural boxy streetwear silhouette with drop shoulders',
              'Garment-dyed and enzyme washed for ultra-soft handfeel',
              'Engineered and produced in Tunisia',
            ],
          };
        });
        setImportedPreviewList(valid);
      } else {
        // CSV parser
        const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.length < 2) {
          throw new Error('Le fichier CSV doit contenir un en-tête et au moins une ligne de données.');
        }
        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/"/g, ''));
        const nameIdx = headers.indexOf('name') !== -1 ? headers.indexOf('name') : headers.indexOf('nom');
        const priceIdx = headers.indexOf('price') !== -1 ? headers.indexOf('price') : headers.indexOf('prix');
        const catIdx = headers.indexOf('category') !== -1 ? headers.indexOf('category') : headers.indexOf('categorie');
        const skuIdx = headers.indexOf('sku');
        const imgIdx = headers.indexOf('imageurl') !== -1 ? headers.indexOf('imageurl') : headers.indexOf('image');
        const stockIdx = headers.indexOf('stock');

        const valid: Omit<Product, 'id' | 'createdAt'>[] = [];
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
          const name = nameIdx !== -1 && row[nameIdx] ? row[nameIdx] : `Article Importé #${i}`;
          const price = priceIdx !== -1 && !isNaN(Number(row[priceIdx])) ? Number(row[priceIdx]) : 150;
          const cat = (catIdx !== -1 && categories.includes(row[catIdx] as any)) ? (row[catIdx] as ProductCategory) : 'Hoodies';
          const sku = skuIdx !== -1 && row[skuIdx] ? row[skuIdx] : `RWY-CSV-${i}`;
          const img = imgIdx !== -1 && row[imgIdx] ? row[imgIdx] : hoodieImg;
          const stock = stockIdx !== -1 && !isNaN(Number(row[stockIdx])) ? Number(row[stockIdx]) : 12;

          valid.push({
            name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            price,
            category: cat,
            collection: 'DROP 01: ORIGIN',
            description: 'Produit importé via fichier CSV.',
            fabric: '100% Organic Cotton',
            fit: 'Boxy Fit',
            careInstructions: 'Machine wash cold.',
            sku,
            isFeatured: true,
            isNewDrop: true,
            isSoldOut: false,
            status: 'published',
            sizes: [
              { size: 'S', stock },
              { size: 'M', stock },
              { size: 'L', stock },
              { size: 'XL', stock: Math.max(2, Math.floor(stock / 2)) },
              { size: 'XXL', stock: Math.max(1, Math.floor(stock / 4)) },
            ],
            colors: [
              {
                name: 'Noir',
                hex: '#111111',
                images: [img],
              },
            ],
            details: [
              'High-density premium streetwear silhouette',
              'Engineered and produced in Tunisia',
            ],
          });
        }
        setImportedPreviewList(valid);
      }
    } catch (err: any) {
      setImportError(err?.message || 'Erreur lors du traitement du fichier.');
    }
  };

  const handleBulkFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      parseProductsContent(text, file.name);
    };
    reader.readAsText(file);
  };

  const handleConfirmImportAndPublish = async () => {
    if (importedPreviewList.length === 0) return;
    setIsPublishingImport(true);
    try {
      await importProducts(importedPreviewList);
      setIsImportModalOpen(false);
      setImportedPreviewList([]);
      setImportJsonText('');
    } finally {
      setIsPublishingImport(false);
    }
  };

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
      additionalImages: [],
      threeDModelUrl: '',
      threeSixtyFramesInput: '',
      stockS: 15,
      stockM: 20,
      stockL: 18,
      stockXL: 8,
      stockXXL: 4,
    });
    setEditingProduct(null);
    setShowUrlManualInput(false);
    setActiveModalTab('info');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    const sStock = p.sizes.find((s) => s.size === 'S')?.stock ?? 0;
    const mStock = p.sizes.find((s) => s.size === 'M')?.stock ?? 0;
    const lStock = p.sizes.find((s) => s.size === 'L')?.stock ?? 0;
    const xlStock = p.sizes.find((s) => s.size === 'XL')?.stock ?? 0;
    const xxlStock = p.sizes.find((s) => s.size === 'XXL')?.stock ?? 0;

    const mainImg = resolveProductImage(p.colors[0]?.images[0]) || hoodieImg;
    const extraImgs = (p.colors[0]?.images.slice(1) || []).map((img) => resolveProductImage(img));

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
      imageUrl: mainImg,
      additionalImages: extraImgs,
      threeDModelUrl: p.threeDModelUrl || '',
      threeSixtyFramesInput: p.threeSixtyFrames?.join('\n') || '',
      stockS: sStock,
      stockM: mStock,
      stockL: lStock,
      stockXL: xlStock,
      stockXXL: xxlStock,
    });
    setEditingProduct(p);
    setShowUrlManualInput(false);
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

    const allImages = [formData.imageUrl, ...formData.additionalImages].filter(Boolean);
    const finalImages = allImages.length > 0 ? allImages : [hoodieImg];

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
            images: finalImages,
            threeDModelUrl: formData.threeDModelUrl.trim() || undefined,
            threeSixtyFrames: frames.length > 0 ? frames : undefined,
          },
        ],
      });
      logAuditAction('Modification Produit', `Produit ${formData.name} mis à jour et synchronisé (SKU: ${formData.sku})`);
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
            images: finalImages,
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
      logAuditAction('Création Produit', `Nouveau produit ${formData.name} publié en direct (SKU: ${formData.sku})`);
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

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setImportedPreviewList([]);
              setImportError(null);
              setImportJsonText('');
              setIsImportModalOpen(true);
            }}
            title="Importer des pièces via CSV ou JSON et les publier en 1 clic"
            className="px-4 py-2.5 bg-neutral-900 border border-neutral-700 hover:border-cyan-500 text-white text-xs font-semibold uppercase tracking-wider hover:text-cyan-300 transition-colors flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Importer Catalogue (CSV / JSON)</span>
          </button>

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
                      <img
                        src={resolveProductImage(prod.colors[0]?.images[0])}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = hoodieImg;
                        }}
                      />
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

                    <div>
                      <label className="text-neutral-400 uppercase tracking-wider block mb-1">Collection</label>
                      <input
                        type="text"
                        value={formData.collection}
                        onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>

                    {/* Main Image Upload & Import Area */}
                    <div className="p-4 bg-neutral-900/70 border border-neutral-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-mono uppercase tracking-wider text-white font-bold block">
                              Photo Principale du Vêtement
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              Importez directement depuis votre appareil (smartphone, tablette ou PC)
                            </span>
                          </div>
                        </div>
                        {isCompressingFormImage ? (
                          <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1.5 bg-amber-950/40 px-2 py-1 border border-amber-800/60">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Optimisation en cours...</span>
                          </span>
                        ) : formData.imageUrl ? (
                          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 border border-emerald-800/60">
                            <CheckCircle className="w-3 h-3" />
                            <span>Photo Prête & Visible</span>
                          </span>
                        ) : null}
                      </div>

                      {/* Hidden file inputs */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, false)}
                        className="hidden"
                      />
                      <input
                        type="file"
                        ref={cameraInputRef}
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handleImageFileUpload(e, false)}
                        className="hidden"
                      />

                      {/* Main Photo Container */}
                      {formData.imageUrl ? (
                        <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start bg-neutral-950 p-4 border border-neutral-800">
                          {/* Visual Image Preview */}
                          <div className="w-36 h-44 bg-neutral-900 border border-neutral-700 shrink-0 relative overflow-hidden group shadow-xl">
                            <img
                              src={resolveProductImage(formData.imageUrl)}
                              alt="Aperçu vêtement"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = hoodieImg;
                              }}
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-1.5 bg-white text-black text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-200 cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                              >
                                <Upload className="w-3 h-3" />
                                <span>Remplacer</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                className="w-full py-1.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-red-700 cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Supprimer</span>
                              </button>
                            </div>
                          </div>

                          {/* Actions and details */}
                          <div className="flex-1 space-y-3 w-full">
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-white block">
                                Image sélectionnée
                              </span>
                              <p className="text-[11px] text-neutral-400 leading-relaxed">
                                La photo est automatiquement compressée et synchronisée en direct pour tous les clients externes.
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Changer / Importer une autre photo</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => cameraInputRef.current?.click()}
                                className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer border border-neutral-700"
                              >
                                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Prendre photo (Caméra)</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                className="px-3 py-2 bg-neutral-900 hover:bg-red-950/60 text-neutral-400 hover:text-red-400 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer border border-neutral-800"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Retirer</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Empty State: Drop / Click Box to Import */
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="p-8 border-2 border-dashed border-neutral-700 hover:border-white bg-neutral-950/80 text-center cursor-pointer transition-all hover:bg-neutral-900/50 group"
                        >
                          <div className="w-12 h-12 mx-auto mb-3 bg-neutral-900 border border-neutral-700 group-hover:border-white rounded-full flex items-center justify-center text-white transition-colors">
                            <Upload className="w-6 h-6" />
                          </div>
                          <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-1">
                            Cliquez ici pour importer la photo du vêtement
                          </h4>
                          <p className="text-xs text-neutral-400 max-w-md mx-auto mb-4">
                            Sélectionnez directement une photo depuis vos dossiers (PC) ou votre galerie photo (Smartphone / Tablette).
                          </p>
                          <div className="inline-flex items-center gap-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                              }}
                              className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer shadow-md"
                            >
                              Choisir un fichier
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                cameraInputRef.current?.click();
                              }}
                              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border border-neutral-700 flex items-center gap-1.5"
                            >
                              <Camera className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Caméra mobile</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Additional Gallery Photos (Lookbook, Angles) */}
                      <div className="pt-3 border-t border-neutral-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-200 font-bold flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Photos Additionnelles (Angles, Lookbook, Détails)</span>
                            </span>
                            <span className="text-[10px] text-neutral-400 block">
                              Importez plusieurs photos à la fois pour enrichir la fiche produit
                            </span>
                          </div>
                          <input
                            type="file"
                            ref={galleryInputRef}
                            accept="image/*"
                            multiple
                            onChange={(e) => handleImageFileUpload(e, true)}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => galleryInputRef.current?.click()}
                            className="px-3 py-1.5 bg-neutral-800 hover:bg-white hover:text-black text-white text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors border border-neutral-700"
                          >
                            <Plus className="w-3 h-3 text-cyan-400" />
                            <span>Importer d'autres photos</span>
                          </button>
                        </div>

                        {formData.additionalImages.length > 0 ? (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {formData.additionalImages.map((img, idx) => (
                              <div key={idx} className="relative w-18 h-24 bg-neutral-950 border border-neutral-800 group overflow-hidden shadow-sm">
                                <img
                                  src={resolveProductImage(img)}
                                  alt={`Gallery ${idx}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = hoodieImg;
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAdditionalImage(idx)}
                                  className="absolute top-0.5 right-0.5 bg-black/80 text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
                                  title="Supprimer cette photo"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] font-mono text-neutral-500">
                            Aucune photo secondaire. Cliquez sur "Importer d'autres photos" pour en ajouter.
                          </p>
                        )}
                      </div>

                      {/* Optional Collapsed Web URL Link */}
                      <div className="pt-2 border-t border-neutral-800/60">
                        {!showUrlManualInput ? (
                          <button
                            type="button"
                            onClick={() => setShowUrlManualInput(true)}
                            className="text-[10px] font-mono text-neutral-500 hover:text-neutral-300 underline cursor-pointer"
                          >
                            Option avancée : coller une URL web externe
                          </button>
                        ) : (
                          <div className="space-y-1 bg-black/40 p-2.5 border border-neutral-800">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-neutral-400">
                                Lien web direct (HTTPS) :
                              </span>
                              <button
                                type="button"
                                onClick={() => setShowUrlManualInput(false)}
                                className="text-[10px] text-neutral-500 hover:text-white cursor-pointer"
                              >
                                Fermer
                              </button>
                            </div>
                            <input
                              type="text"
                              value={formData.imageUrl}
                              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                              placeholder="https://..."
                              className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 text-white font-mono text-xs focus:border-white focus:outline-none"
                            />
                          </div>
                        )}
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

      {/* Bulk Catalog Import Modal (CSV / JSON) */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={() => !isPublishingImport && setIsImportModalOpen(false)} />
          <div className="min-h-full flex items-center justify-center p-3 sm:p-6">
            <div className="relative w-full max-w-3xl bg-[#111116] border border-neutral-800 text-neutral-100 shadow-2xl p-6 sm:p-8 z-10 space-y-6 animate-in fade-in zoom-in-95 duration-150">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-400">
                      IMPORTATEUR DE CATALOGUE // MULTI-PIÈCES
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-emerald-950/80 border border-emerald-700 text-emerald-400">
                      Publication Cloud Live
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-white">
                    Importer & Publier des Produits
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Importez plusieurs vêtements à la fois via un fichier CSV ou JSON. Ils seront immédiatement enregistrés et visibles pour les clients en direct.
                  </p>
                </div>
                <button
                  onClick={() => !isPublishingImport && setIsImportModalOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white cursor-pointer hover:bg-neutral-800 rounded-xs"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sample Templates Download Helpers */}
              <div className="p-3 bg-neutral-900/80 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-neutral-300">
                  <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Téléchargez un modèle pour remplir vos pièces au bon format :</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={downloadSampleCsv}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-mono uppercase flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Modèle CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={downloadSampleJson}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-mono uppercase flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Modèle JSON</span>
                  </button>
                </div>
              </div>

              {/* Tabs: File Upload vs Raw JSON */}
              <div className="flex border-b border-neutral-800 text-xs font-mono uppercase">
                <button
                  type="button"
                  onClick={() => setImportTab('file')}
                  className={`pb-2 px-3 border-b-2 font-bold cursor-pointer transition-colors ${
                    importTab === 'file' ? 'border-white text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Téléverser un Fichier (.csv ou .json)
                </button>
                <button
                  type="button"
                  onClick={() => setImportTab('json')}
                  className={`pb-2 px-3 border-b-2 font-bold cursor-pointer transition-colors ${
                    importTab === 'json' ? 'border-white text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Coller du Code JSON
                </button>
              </div>

              {/* Tab 1: File Upload */}
              {importTab === 'file' && (
                <div className="space-y-3">
                  <input
                    type="file"
                    ref={bulkFileInputRef}
                    accept=".csv,.json,text/csv,application/json"
                    onChange={handleBulkFileSelected}
                    className="hidden"
                  />
                  <div
                    onClick={() => bulkFileInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-700 hover:border-cyan-400 p-8 text-center bg-neutral-900/40 hover:bg-neutral-900/70 cursor-pointer transition-all space-y-3 group"
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-neutral-800 group-hover:bg-cyan-950/60 border border-neutral-700 group-hover:border-cyan-600 flex items-center justify-center text-neutral-400 group-hover:text-cyan-400 transition-colors">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Cliquez pour sélectionner un fichier CSV ou JSON
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">
                        Compatible avec les exports Excel / CSV et formats JSON
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Raw JSON Paste */}
              {importTab === 'json' && (
                <div className="space-y-3">
                  <textarea
                    rows={6}
                    placeholder={`[
  {
    "name": "RWYSE Heavy Mineral Boxy Hoodie",
    "price": 160,
    "category": "Hoodies",
    "sku": "RWY-HD-101",
    "imageUrl": "https://..."
  }
]`}
                    value={importJsonText}
                    onChange={(e) => {
                      setImportJsonText(e.target.value);
                      if (e.target.value.trim()) {
                        parseProductsContent(e.target.value, 'paste.json');
                      } else {
                        setImportedPreviewList([]);
                      }
                    }}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              {/* Error Message */}
              {importError && (
                <div className="p-3 bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {/* Parsed Preview Table */}
              {importedPreviewList.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono uppercase text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>{importedPreviewList.length} vêtement(s) détecté(s) avec succès</span>
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      Prêt pour publication immédiate
                    </span>
                  </div>

                  <div className="border border-neutral-800 bg-neutral-950 max-h-56 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] font-mono uppercase text-neutral-400 bg-neutral-900 border-b border-neutral-800 sticky top-0">
                        <tr>
                          <th className="py-2 px-3">Pièce</th>
                          <th className="py-2 px-3">SKU</th>
                          <th className="py-2 px-3">Catégorie</th>
                          <th className="py-2 px-3">Prix</th>
                          <th className="py-2 px-3">Stock Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60 font-mono text-[11px]">
                        {importedPreviewList.map((p, i) => {
                          const totalStock = (p.sizes || []).reduce((s, sz) => s + sz.stock, 0);
                          const img = p.colors?.[0]?.images?.[0] || hoodieImg;
                          return (
                            <tr key={i} className="hover:bg-neutral-900/30">
                              <td className="py-2 px-3 flex items-center gap-2">
                                <img src={img} alt={p.name} className="w-7 h-8 object-cover bg-neutral-900 border border-neutral-800" />
                                <span className="font-semibold text-white truncate max-w-[200px]">{p.name}</span>
                              </td>
                              <td className="py-2 px-3 text-neutral-400">{p.sku}</td>
                              <td className="py-2 px-3 text-cyan-400">{p.category}</td>
                              <td className="py-2 px-3 text-emerald-400 font-bold">{p.price} {siteSettings.currency}</td>
                              <td className="py-2 px-3 text-neutral-300">{totalStock} unités</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  disabled={isPublishingImport}
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 cursor-pointer disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={isPublishingImport || importedPreviewList.length === 0}
                  onClick={handleConfirmImportAndPublish}
                  className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors cursor-pointer flex items-center gap-2 shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isPublishingImport ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      <span>Publication sur le Cloud Firestore...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Importer & Publier ({importedPreviewList.length} pièces)</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
