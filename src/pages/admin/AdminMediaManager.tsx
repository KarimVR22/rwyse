import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Upload,
  Image as ImageIcon,
  Check,
  Save,
  Link,
  Sparkles,
  Eye,
  Trash2,
  Copy,
  RefreshCw,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import {
  heroImg,
  editorialImg,
  hoodieImg,
  blueHoodieImg,
  balloonPantImg,
  ringerTeeImg,
  modelBlueImg,
  longsleeveImg,
  whiteLsImg,
  tankImg,
} from '../../data/initialData';

export const AdminMediaManager: React.FC = () => {
  const { siteSettings, updateSiteSettings, showToast, logAuditAction } = useStore();

  const [heroImage, setHeroImage] = useState(siteSettings.heroImage || modelBlueImg);
  const [spotlightImage1, setSpotlightImage1] = useState(siteSettings.spotlightImage1 || blueHoodieImg);
  const [spotlightImage2, setSpotlightImage2] = useState(siteSettings.spotlightImage2 || modelBlueImg);
  const [communityImage1, setCommunityImage1] = useState(siteSettings.communityImage1 || blueHoodieImg);
  const [communityImage2, setCommunityImage2] = useState(siteSettings.communityImage2 || ringerTeeImg);
  const [lookbookImage1, setLookbookImage1] = useState(siteSettings.lookbookImage1 || modelBlueImg);
  const [lookbookImage2, setLookbookImage2] = useState(siteSettings.lookbookImage2 || balloonPantImg);
  const [lookbookImage3, setLookbookImage3] = useState(siteSettings.lookbookImage3 || ringerTeeImg);
  const [lookbookImage4, setLookbookImage4] = useState(siteSettings.lookbookImage4 || heroImg);
  const [editorialImage, setEditorialImage] = useState(siteSettings.editorialImage || editorialImg);

  const [activeTab, setActiveTab] = useState<'hero' | 'spotlight' | 'lookbook' | 'community' | 'editorial' | 'library'>('hero');

  // Custom uploaded images in media library
  const [uploadedLibrary, setUploadedLibrary] = useState<string[]>(() => {
    const saved = localStorage.getItem('rwyse_media_library');
    return saved ? JSON.parse(saved) : [];
  });

  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const spotlight1FileInputRef = useRef<HTMLInputElement>(null);
  const spotlight2FileInputRef = useRef<HTMLInputElement>(null);
  const comm1FileInputRef = useRef<HTMLInputElement>(null);
  const comm2FileInputRef = useRef<HTMLInputElement>(null);
  const look1FileInputRef = useRef<HTMLInputElement>(null);
  const look2FileInputRef = useRef<HTMLInputElement>(null);
  const look3FileInputRef = useRef<HTMLInputElement>(null);
  const look4FileInputRef = useRef<HTMLInputElement>(null);
  const editorialFileInputRef = useRef<HTMLInputElement>(null);
  const generalFileInputRef = useRef<HTMLInputElement>(null);

  const officialPresets = [
    { label: 'Royal Blue 567 Editorial Drape', src: modelBlueImg, category: 'Hero & Lookbook' },
    { label: 'Royal Blue 567 Studio Apex', src: blueHoodieImg, category: 'Product & Spotlight' },
    { label: 'Concrete Brutalist Campaign', src: heroImg, category: 'Hero & Editorial' },
    { label: 'Editorial Lookbook Runway', src: editorialImg, category: 'Lookbook' },
    { label: 'Curved Balloon Sweatpants', src: balloonPantImg, category: 'Lookbook' },
    { label: 'Medina Raw Contrast Ringer', src: ringerTeeImg, category: 'Lookbook' },
    { label: 'Studio Heavyweight Black Hoodie', src: hoodieImg, category: 'Studio' },
    { label: 'Raw Heavyweight Longsleeve', src: longsleeveImg, category: 'Lookbook' },
    { label: 'White Architecture Longsleeve', src: whiteLsImg, category: 'Lookbook' },
    { label: 'Athletic Compression Tank', src: tankImg, category: 'Community' },
  ];

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetSetter: (url: string) => void,
    sectionName: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Erreur: Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP).');
      return;
    }

    // Convert file to base64 Data URL for instant rendering & persistence
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      targetSetter(result);

      // Also add to media library
      const updatedLib = [result, ...uploadedLibrary.filter((u) => u !== result)];
      setUploadedLibrary(updatedLib);
      localStorage.setItem('rwyse_media_library', JSON.stringify(updatedLib));

      showToast(`Image importée avec succès pour ${sectionName} !`);
      logAuditAction('Import Image', `Image importée pour ${sectionName} (${file.name})`);
    };
    reader.readAsDataURL(file);
  };

  const handleGeneralUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setUploadedLibrary((prev) => {
          const updated = [result, ...prev.filter((u) => u !== result)];
          localStorage.setItem('rwyse_media_library', JSON.stringify(updated));
          return updated;
        });
        showToast(`Image "${file.name}" ajoutée à la médiathèque !`);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveAllImages = () => {
    updateSiteSettings({
      heroImage,
      spotlightImage1,
      spotlightImage2,
      communityImage1,
      communityImage2,
      lookbookImage1,
      lookbookImage2,
      lookbookImage3,
      lookbookImage4,
      editorialImage,
    });
    showToast('Toutes les images d\'accueil et lookbook ont été mises à jour en direct !');
    logAuditAction('Mise à jour Médias', 'Nouvelles images enregistrées pour la page d\'accueil et lookbook');
  };

  const handleRemoveFromLibrary = (url: string) => {
    const updated = uploadedLibrary.filter((u) => u !== url);
    setUploadedLibrary(updated);
    localStorage.setItem('rwyse_media_library', JSON.stringify(updated));
    showToast('Image retirée de la médiathèque.');
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
            STUDIO DIGITAL // GESTION MULTIMÉDIA DE TOUT LE SITE
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight flex items-center gap-3">
            <span>Médiathèque & Gestion des Images</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-neutral-800 text-neutral-300 border border-neutral-700">
              CMS Visuel
            </span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-light">
            Gérez toutes les images d'accueil, bannières, looks, et téléversez des photos depuis votre ordinateur ou collez des URLs pour actualiser la boutique instantanément.
          </p>
        </div>

        <button
          onClick={handleSaveAllImages}
          className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>Appliquer sur le Site</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#111116] border border-neutral-800 p-1.5 overflow-x-auto">
        {[
          { id: 'hero', label: '1. Image Hero (Accueil)' },
          { id: 'spotlight', label: '2. Bannières Spotlight 567' },
          { id: 'lookbook', label: '3. Galerie Lookbook (4 Looks)' },
          { id: 'community', label: '4. Ethos & Philosophie' },
          { id: 'editorial', label: '5. Bannière Éditoriale' },
          { id: 'library', label: `6. Médiathèque (${uploadedLibrary.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: HERO IMAGE */}
      {activeTab === 'hero' && (
        <div className="p-6 bg-[#111116] border border-neutral-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                Image d'Arrière-Plan Hero (Grand Écran Accueil)
              </h2>
              <p className="text-[11px] text-neutral-400">
                La première photo cinématographique vue par les visiteurs en arrivant sur la boutique.
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase">Haute Définition Recommandée</span>
          </div>

          {/* Current Live Preview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 aspect-[16/9] bg-neutral-950 border border-neutral-800 overflow-hidden relative group">
              <img
                src={heroImage}
                alt="Aperçu Hero"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-widest">
                  ● Image Actuelle en Ligne
                </span>
                <span className="text-xs font-bold uppercase text-white truncate">{siteSettings.heroTitle}</span>
              </div>
            </div>

            <div className="md:col-span-5 space-y-4 text-xs">
              <div>
                <label className="text-neutral-300 uppercase tracking-wider block mb-1.5 font-medium">
                  Téléverser une Photo depuis votre ordinateur
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={heroFileInputRef}
                  onChange={(e) => handleFileUpload(e, setHeroImage, 'Hero Accueil')}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => heroFileInputRef.current?.click()}
                  className="w-full py-3 px-4 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Choisir un Fichier (JPG / PNG)</span>
                </button>
              </div>

              <div>
                <label className="text-neutral-300 uppercase tracking-wider block mb-1.5 font-medium">
                  Ou coller une URL d'image web
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs focus:outline-none focus:border-neutral-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveAllImages}
                  className="w-full py-2.5 bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Valider cette image pour le Hero
                </button>
              </div>
            </div>
          </div>

          {/* Quick Select Presets */}
          <div className="pt-4 border-t border-neutral-800">
            <span className="text-[11px] font-mono uppercase text-neutral-400 block mb-3">
              Ou choisir parmi les photos de campagne officielles RWYSE :
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {officialPresets.map((opt) => (
                <div
                  key={opt.label}
                  onClick={() => {
                    setHeroImage(opt.src);
                    showToast(`Image sélectionnée: ${opt.label}`);
                  }}
                  className={`cursor-pointer border p-2 bg-neutral-900 transition-all ${
                    heroImage === opt.src
                      ? 'border-white ring-1 ring-white'
                      : 'border-neutral-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="aspect-[4/3] bg-neutral-950 overflow-hidden mb-1.5">
                    <img
                      src={opt.src}
                      alt={opt.label}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white uppercase tracking-wider block truncate">
                    {opt.label}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-500 block">{opt.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SPOTLIGHT BANNER IMAGES */}
      {activeTab === 'spotlight' && (
        <div className="p-6 bg-[#111116] border border-neutral-800 space-y-6">
          <div className="border-b border-neutral-800 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Bannières de Campagne Drop 01 ("Rise & Grind Spotlight")
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Cette section présente les 2 photos jumelles sous le compte à rebours de restockage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Spotlight Image 1 */}
            <div className="p-4 bg-neutral-900/50 border border-neutral-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-white block">
                Photo 1 : Packshot Studio (Gauche)
              </span>
              <div className="aspect-[3/4] bg-neutral-950 border border-neutral-800 overflow-hidden">
                <img
                  src={spotlightImage1}
                  alt="Spotlight 1"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <input
                type="file"
                accept="image/*"
                ref={spotlight1FileInputRef}
                onChange={(e) => handleFileUpload(e, setSpotlightImage1, 'Spotlight Packshot')}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => spotlight1FileInputRef.current?.click()}
                className="w-full py-2.5 px-3 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span>Téléverser depuis le PC</span>
              </button>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                  Ou URL d'image :
                </label>
                <input
                  type="text"
                  value={spotlightImage1}
                  onChange={(e) => setSpotlightImage1(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 text-white font-mono text-xs"
                />
              </div>
            </div>

            {/* Spotlight Image 2 */}
            <div className="p-4 bg-neutral-900/50 border border-neutral-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-white block">
                Photo 2 : Porté Éditorial Lookbook (Droite)
              </span>
              <div className="aspect-[3/4] bg-neutral-950 border border-neutral-800 overflow-hidden">
                <img
                  src={spotlightImage2}
                  alt="Spotlight 2"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <input
                type="file"
                accept="image/*"
                ref={spotlight2FileInputRef}
                onChange={(e) => handleFileUpload(e, setSpotlightImage2, 'Spotlight Éditorial')}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => spotlight2FileInputRef.current?.click()}
                className="w-full py-2.5 px-3 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span>Téléverser depuis le PC</span>
              </button>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                  Ou URL d'image :
                </label>
                <input
                  type="text"
                  value={spotlightImage2}
                  onChange={(e) => setSpotlightImage2(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveAllImages}
              className="px-6 py-2.5 bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Enregistrer les Bannières Spotlight
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: COMMUNITY & PHILOSOPHY IMAGES */}
      {activeTab === 'community' && (
        <div className="p-6 bg-[#111116] border border-neutral-800 space-y-6">
          <div className="border-b border-neutral-800 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Visuels "The RWYSE Foundation & Community Ethos"
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Ces photos illustrent la section manifeste de la marque ("Rise with you").
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-neutral-900/50 border border-neutral-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-white block">
                Visuel Ethos 1 (Détail Broderie)
              </span>
              <div className="aspect-[3/4] bg-neutral-950 border border-neutral-800 overflow-hidden">
                <img
                  src={communityImage1}
                  alt="Community 1"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <input
                type="file"
                accept="image/*"
                ref={comm1FileInputRef}
                onChange={(e) => handleFileUpload(e, setCommunityImage1, 'Ethos 1')}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => comm1FileInputRef.current?.click()}
                className="w-full py-2.5 px-3 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Téléverser depuis le PC</span>
              </button>

              <input
                type="text"
                value={communityImage1}
                onChange={(e) => setCommunityImage1(e.target.value)}
                className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 text-white font-mono text-xs"
              />
            </div>

            <div className="p-4 bg-neutral-900/50 border border-neutral-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-white block">
                Visuel Ethos 2 (Athlète & Streetwear)
              </span>
              <div className="aspect-[3/4] bg-neutral-950 border border-neutral-800 overflow-hidden">
                <img
                  src={communityImage2}
                  alt="Community 2"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <input
                type="file"
                accept="image/*"
                ref={comm2FileInputRef}
                onChange={(e) => handleFileUpload(e, setCommunityImage2, 'Ethos 2')}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => comm2FileInputRef.current?.click()}
                className="w-full py-2.5 px-3 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Téléverser depuis le PC</span>
              </button>

              <input
                type="text"
                value={communityImage2}
                onChange={(e) => setCommunityImage2(e.target.value)}
                className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 text-white font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveAllImages}
              className="px-6 py-2.5 bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Enregistrer les Visuels Ethos
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: LOOKBOOK GALLERY (4 LOOKS) */}
      {activeTab === 'lookbook' && (
        <div className="p-6 bg-[#111116] border border-neutral-800 space-y-6">
          <div className="border-b border-neutral-800 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Galerie Lookbook de la Page d'Accueil (4 Looks Authentiques)
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Personnalisez les 4 photos éditoriales exposées dans la section "Authentic RWYSE Lookbook" de l'accueil.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Look 1 */}
            <div className="p-4 bg-neutral-900/50 border border-neutral-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white block truncate">
                Look 1: 567 Blue Hoodie
              </span>
              <div className="aspect-[3/4] bg-neutral-950 border border-neutral-800 overflow-hidden">
                <img
                  src={lookbookImage1}
                  alt="Look 1"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                ref={look1FileInputRef}
                onChange={(e) => handleFileUpload(e, setLookbookImage1, 'Look 1')}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => look1FileInputRef.current?.click()}
                className="w-full py-2 px-2 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Upload className="w-3 h-3 text-cyan-400" />
                <span>Upload PC</span>
              </button>
              <input
                type="text"
                value={lookbookImage1}
                onChange={(e) => setLookbookImage1(e.target.value)}
                placeholder="URL image..."
                className="w-full px-2 py-1.5 bg-neutral-950 border border-neutral-800 text-white font-mono text-[11px]"
              />
            </div>

            {/* Look 2 */}
            <div className="p-4 bg-neutral-900/50 border border-neutral-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white block truncate">
                Look 2: Balloon Pants
              </span>
              <div className="aspect-[3/4] bg-neutral-950 border border-neutral-800 overflow-hidden">
                <img
                  src={lookbookImage2}
                  alt="Look 2"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                ref={look2FileInputRef}
                onChange={(e) => handleFileUpload(e, setLookbookImage2, 'Look 2')}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => look2FileInputRef.current?.click()}
                className="w-full py-2 px-2 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Upload className="w-3 h-3 text-cyan-400" />
                <span>Upload PC</span>
              </button>
              <input
                type="text"
                value={lookbookImage2}
                onChange={(e) => setLookbookImage2(e.target.value)}
                placeholder="URL image..."
                className="w-full px-2 py-1.5 bg-neutral-950 border border-neutral-800 text-white font-mono text-[11px]"
              />
            </div>

            {/* Look 3 */}
            <div className="p-4 bg-neutral-900/50 border border-neutral-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white block truncate">
                Look 3: Medina Ringer Tee
              </span>
              <div className="aspect-[3/4] bg-neutral-950 border border-neutral-800 overflow-hidden">
                <img
                  src={lookbookImage3}
                  alt="Look 3"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                ref={look3FileInputRef}
                onChange={(e) => handleFileUpload(e, setLookbookImage3, 'Look 3')}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => look3FileInputRef.current?.click()}
                className="w-full py-2 px-2 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Upload className="w-3 h-3 text-cyan-400" />
                <span>Upload PC</span>
              </button>
              <input
                type="text"
                value={lookbookImage3}
                onChange={(e) => setLookbookImage3(e.target.value)}
                placeholder="URL image..."
                className="w-full px-2 py-1.5 bg-neutral-950 border border-neutral-800 text-white font-mono text-[11px]"
              />
            </div>

            {/* Look 4 */}
            <div className="p-4 bg-neutral-900/50 border border-neutral-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white block truncate">
                Look 4: Community Ethos
              </span>
              <div className="aspect-[3/4] bg-neutral-950 border border-neutral-800 overflow-hidden">
                <img
                  src={lookbookImage4}
                  alt="Look 4"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                ref={look4FileInputRef}
                onChange={(e) => handleFileUpload(e, setLookbookImage4, 'Look 4')}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => look4FileInputRef.current?.click()}
                className="w-full py-2 px-2 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Upload className="w-3 h-3 text-cyan-400" />
                <span>Upload PC</span>
              </button>
              <input
                type="text"
                value={lookbookImage4}
                onChange={(e) => setLookbookImage4(e.target.value)}
                placeholder="URL image..."
                className="w-full px-2 py-1.5 bg-neutral-950 border border-neutral-800 text-white font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveAllImages}
              className="px-6 py-2.5 bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-neutral-200 transition-colors cursor-pointer shadow-lg"
            >
              Enregistrer les 4 Photos Lookbook
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: EDITORIAL DROP BANNER */}
      {activeTab === 'editorial' && (
        <div className="p-6 bg-[#111116] border border-neutral-800 space-y-6">
          <div className="border-b border-neutral-800 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Bannière de Campagne Éditoriale & Archive
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Photo panoramique utilisée pour les bannières éditoriales et présentations de capsules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 aspect-[21/9] bg-neutral-950 border border-neutral-800 overflow-hidden relative">
              <img
                src={editorialImage}
                alt="Editorial Drop"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="md:col-span-4 space-y-3">
              <input
                type="file"
                accept="image/*"
                ref={editorialFileInputRef}
                onChange={(e) => handleFileUpload(e, setEditorialImage, 'Bannière Éditoriale')}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => editorialFileInputRef.current?.click()}
                className="w-full py-3 px-4 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Téléverser depuis le PC</span>
              </button>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                  Ou URL d'image web :
                </label>
                <input
                  type="text"
                  value={editorialImage}
                  onChange={(e) => setEditorialImage(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 text-white font-mono text-xs"
                />
              </div>

              <button
                onClick={handleSaveAllImages}
                className="w-full py-2.5 bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Appliquer la Bannière
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PERSONAL MEDIA LIBRARY */}
      {activeTab === 'library' && (
        <div className="p-6 bg-[#111116] border border-neutral-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                Médiathèque Personnelle de Téléversements
              </h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Importez vos fichiers locaux en masse. Utilisez-les ensuite en un clic pour le Hero ou vos fiches produits.
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              ref={generalFileInputRef}
              onChange={handleGeneralUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => generalFileInputRef.current?.click()}
              className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Upload className="w-4 h-4" />
              <span>Importer des Fichiers</span>
            </button>
          </div>

          {uploadedLibrary.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-neutral-800 space-y-3">
              <ImageIcon className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-400">
                Aucun fichier n'a encore été importé dans votre médiathèque personnelle.
              </p>
              <button
                type="button"
                onClick={() => generalFileInputRef.current?.click()}
                className="px-4 py-2 bg-neutral-900 border border-neutral-700 text-white text-xs font-mono uppercase tracking-wider hover:border-white transition-colors cursor-pointer"
              >
                Téléverser vos premières photos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {uploadedLibrary.map((imgUrl, index) => (
                <div
                  key={index}
                  className="bg-neutral-900 border border-neutral-800 p-2 space-y-2 group relative"
                >
                  <div className="aspect-[4/3] bg-neutral-950 overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-1">
                      <select
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!val) return;
                          if (val === 'hero') setHeroImage(imgUrl);
                          else if (val === 'spotlight1') setSpotlightImage1(imgUrl);
                          else if (val === 'spotlight2') setSpotlightImage2(imgUrl);
                          else if (val === 'look1') setLookbookImage1(imgUrl);
                          else if (val === 'look2') setLookbookImage2(imgUrl);
                          else if (val === 'look3') setLookbookImage3(imgUrl);
                          else if (val === 'look4') setLookbookImage4(imgUrl);
                          else if (val === 'comm1') setCommunityImage1(imgUrl);
                          else if (val === 'comm2') setCommunityImage2(imgUrl);
                          else if (val === 'editorial') setEditorialImage(imgUrl);
                          showToast(`Image assignée à ${e.target.options[e.target.selectedIndex].text} ! N'oubliez pas de cliquer sur "Appliquer".`);
                          e.target.value = '';
                        }}
                        defaultValue=""
                        className="flex-1 bg-neutral-800 text-neutral-200 text-[10px] font-mono py-1 px-1.5 border border-neutral-700 cursor-pointer focus:outline-none"
                      >
                        <option value="" disabled>Assigner à un emplacement...</option>
                        <option value="hero">★ Hero Background</option>
                        <option value="spotlight1">Spotlight 1 (Packshot)</option>
                        <option value="spotlight2">Spotlight 2 (Porté)</option>
                        <option value="look1">Lookbook 1 (567 Hoodie)</option>
                        <option value="look2">Lookbook 2 (Balloon Pant)</option>
                        <option value="look3">Lookbook 3 (Ringer Tee)</option>
                        <option value="look4">Lookbook 4 (Community)</option>
                        <option value="comm1">Ethos 1 (Détail)</option>
                        <option value="comm2">Ethos 2 (Athlète)</option>
                        <option value="editorial">Bannière Éditoriale</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(imgUrl);
                          showToast('Lien ou donnée de l\'image copiée dans le presse-papier !');
                        }}
                        className="text-[10px] font-mono uppercase px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer flex items-center gap-1"
                        title="Copier URL / Base64"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copier</span>
                      </button>

                      <button
                        onClick={() => handleRemoveFromLibrary(imgUrl)}
                        className="p-1 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Supprimer de la médiathèque"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
