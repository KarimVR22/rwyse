import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Sliders,
  Save,
  Check,
  Sparkles,
  Flame,
  Image as ImageIcon,
  RotateCw,
  Eye,
  Type,
  Megaphone,
  BookOpen,
  Instagram,
  Store,
  Upload,
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

export const AdminHomepage: React.FC = () => {
  const { siteSettings, updateSiteSettings, showToast, logAuditAction } = useStore();

  const [activeTab, setActiveTab] = useState<
    'hero' | 'ticker' | 'spotlight' | 'lookbook' | 'manifesto' | 'community' | 'fx' | 'store'
  >('hero');

  // Hero Fields
  const [heroTitle, setHeroTitle] = useState(siteSettings.heroTitle || 'RISE & GRIND.');
  const [heroSubtitle, setHeroSubtitle] = useState(siteSettings.heroSubtitle || '');
  const [heroBadgeText, setHeroBadgeText] = useState(siteSettings.heroBadgeText || 'DROP 01 // RISE & GRIND IS LIVE');
  const [heroCtaText, setHeroCtaText] = useState(siteSettings.heroCtaText || 'SHOP 567 BLUE HOODIE');
  const [heroCtaLink, setHeroCtaLink] = useState(siteSettings.heroCtaLink || '/product/rwyse-567-royal-blue-oversized-box-hoodie');
  const [heroSecondaryCtaText, setHeroSecondaryCtaText] = useState(siteSettings.heroSecondaryCtaText || 'EXPLORE ALL PIECES');
  const [heroSecondaryCtaLink, setHeroSecondaryCtaLink] = useState(siteSettings.heroSecondaryCtaLink || '/shop');
  const [heroOriginTag, setHeroOriginTag] = useState(siteSettings.heroOriginTag || 'ORIGIN // TUNISIA');
  const [heroFabricTag, setHeroFabricTag] = useState(siteSettings.heroFabricTag || '500 GSM CUSTOM COMBED TERRY');
  const [heroCodTag, setHeroCodTag] = useState(siteSettings.heroCodTag || 'PAIEMENT À LA LIVRAISON (COD)');
  const [heroImage, setHeroImage] = useState(siteSettings.heroImage || modelBlueImg);

  // Announcement & Infoline
  const [announcementText, setAnnouncementText] = useState(siteSettings.announcementText || '');
  const [announcementActive, setAnnouncementActive] = useState(siteSettings.announcementActive ?? true);
  const [infolineText, setInfolineText] = useState(siteSettings.infolineText || '');
  const [infolineActive, setInfolineActive] = useState(siteSettings.infolineActive ?? true);
  const [infolineSpeed, setInfolineSpeed] = useState<'slow' | 'normal' | 'fast'>(siteSettings.infolineSpeed || 'normal');
  const [marqueeText, setMarqueeText] = useState(
    siteSettings.marqueeText ||
      'RWYSE / RISE WITH YOU / 567 ROYAL BLUE HOODIE / CURVED BALLOON SWEATPANTS / CONTRAST RINGER TEES / 500 GSM HEAVYWEIGHT COTTON / CASH ON DELIVERY IN TUNISIA / WE RISE TOGETHER'
  );

  // Spotlight Section
  const [isNewDropActive, setIsNewDropActive] = useState(siteSettings.isNewDropActive ?? true);
  const [spotlightBadge, setSpotlightBadge] = useState(siteSettings.spotlightBadge || 'DROP 01 EXCLUSIVE SPOTLIGHT');
  const [spotlightTitle, setSpotlightTitle] = useState(siteSettings.spotlightTitle || 'THE 567 ROYAL BLUE & BALLOON FIT');
  const [spotlightSubtitle, setSpotlightSubtitle] = useState(siteSettings.spotlightSubtitle || '');
  const [spotlightCtaText, setSpotlightCtaText] = useState(siteSettings.spotlightCtaText || 'ORDER 567 BLUE HOODIE');
  const [spotlightCountdownHours, setSpotlightCountdownHours] = useState(siteSettings.spotlightCountdownHours || 14);
  const [spotlightImage1, setSpotlightImage1] = useState(siteSettings.spotlightImage1 || blueHoodieImg);
  const [spotlightImage2, setSpotlightImage2] = useState(siteSettings.spotlightImage2 || modelBlueImg);

  // Catalog Section
  const [catalogBadge, setCatalogBadge] = useState(siteSettings.catalogBadge || 'FLAGSHIP DROP // FOUNDATION');
  const [catalogTitle, setCatalogTitle] = useState(siteSettings.catalogTitle || 'Curated Silhouettes');

  // Lookbook
  const [lookbookBadge, setLookbookBadge] = useState(siteSettings.lookbookBadge || 'CAMPAIGN ARCHIVE // TUNIS MEDINA & STUDIO');
  const [lookbookTitle, setLookbookTitle] = useState(siteSettings.lookbookTitle || 'Authentic RWYSE Lookbook');
  const [lookbookImage1, setLookbookImage1] = useState(siteSettings.lookbookImage1 || modelBlueImg);
  const [lookbookImage2, setLookbookImage2] = useState(siteSettings.lookbookImage2 || balloonPantImg);
  const [lookbookImage3, setLookbookImage3] = useState(siteSettings.lookbookImage3 || ringerTeeImg);
  const [lookbookImage4, setLookbookImage4] = useState(siteSettings.lookbookImage4 || heroImg);

  // Brand Manifesto
  const [isCommunityActive, setIsCommunityActive] = useState(siteSettings.isCommunityActive ?? true);
  const [manifestoBadge, setManifestoBadge] = useState(siteSettings.manifestoBadge || 'THE RWYSE FOUNDATION');
  const [manifestoTitle, setManifestoTitle] = useState(
    siteSettings.manifestoTitle || '"RISE WITH YOU" — BORN FOR AMBITION & BROTHERHOOD.'
  );
  const [manifestoParagraph1, setManifestoParagraph1] = useState(
    siteSettings.manifestoParagraph1 ||
      'From the gym to the city streets, RWYSE represents radical discipline. We craft heavy 500 GSM loopback cotton garments engineered to accompany your daily grind.'
  );
  const [manifestoParagraph2, setManifestoParagraph2] = useState(
    siteSettings.manifestoParagraph2 ||
      'When you wear the Royal Blue 567 hoodie or the balloon sweatpants, you wear an architectural statement. We do not design disposable garments; we craft permanent silhouettes.'
  );
  const [manifestoButtonText, setManifestoButtonText] = useState(siteSettings.manifestoButtonText || 'Read Brand Manifesto');
  const [communityImage1, setCommunityImage1] = useState(siteSettings.communityImage1 || blueHoodieImg);
  const [communityImage2, setCommunityImage2] = useState(siteSettings.communityImage2 || ringerTeeImg);

  // Instagram
  const [isInstagramActive, setIsInstagramActive] = useState(siteSettings.isInstagramActive ?? true);
  const [instagramSectionTitle, setInstagramSectionTitle] = useState(siteSettings.instagramSectionTitle || 'OFFICIAL COMMUNITY @RWY.SE');
  const [instagramFollowText, setInstagramFollowText] = useState(siteSettings.instagramFollowText || 'Follow @RWY.SE on Instagram');
  const [instagramUrl, setInstagramUrl] = useState(siteSettings.instagramUrl || 'https://www.instagram.com/rwy.se/');

  // Visual FX & Logo
  const [logoAutoRotate, setLogoAutoRotate] = useState(siteSettings.logoAutoRotate ?? true);
  const [bgPatternActive, setBgPatternActive] = useState(siteSettings.bgPatternActive ?? true);

  // Store tab
  const [storeTabActive, setStoreTabActive] = useState(siteSettings.storeTabActive ?? true);
  const [storeOpeningMessage, setStoreOpeningMessage] = useState(
    siteSettings.storeOpeningMessage || 'Notre Flagship Store physique arrive bientôt'
  );
  const [storeOpeningSubtitle, setStoreOpeningSubtitle] = useState(
    siteSettings.storeOpeningSubtitle ||
      'Boutique concept exclusive en cours d’aménagement aux Berges du Lac 2, Tunis. Restez connectés pour découvrir notre inauguration.'
  );
  const [storeOpeningDate, setStoreOpeningDate] = useState(siteSettings.storeOpeningDate || 'Ouverture Prochainement');

  useEffect(() => {
    if (siteSettings.heroTitle) setHeroTitle(siteSettings.heroTitle);
    if (siteSettings.heroSubtitle) setHeroSubtitle(siteSettings.heroSubtitle);
    if (siteSettings.heroBadgeText) setHeroBadgeText(siteSettings.heroBadgeText);
    if (siteSettings.heroCtaText) setHeroCtaText(siteSettings.heroCtaText);
    if (siteSettings.heroCtaLink) setHeroCtaLink(siteSettings.heroCtaLink);
    if (siteSettings.heroSecondaryCtaText) setHeroSecondaryCtaText(siteSettings.heroSecondaryCtaText);
    if (siteSettings.heroSecondaryCtaLink) setHeroSecondaryCtaLink(siteSettings.heroSecondaryCtaLink);
    if (siteSettings.heroOriginTag) setHeroOriginTag(siteSettings.heroOriginTag);
    if (siteSettings.heroFabricTag) setHeroFabricTag(siteSettings.heroFabricTag);
    if (siteSettings.heroCodTag) setHeroCodTag(siteSettings.heroCodTag);
    if (siteSettings.heroImage) setHeroImage(siteSettings.heroImage);
    if (siteSettings.announcementText !== undefined) setAnnouncementText(siteSettings.announcementText);
    if (siteSettings.announcementActive !== undefined) setAnnouncementActive(siteSettings.announcementActive);
    if (siteSettings.infolineText !== undefined) setInfolineText(siteSettings.infolineText);
    if (siteSettings.infolineActive !== undefined) setInfolineActive(siteSettings.infolineActive);
    if (siteSettings.infolineSpeed !== undefined) setInfolineSpeed(siteSettings.infolineSpeed);
    if (siteSettings.marqueeText !== undefined) setMarqueeText(siteSettings.marqueeText);
    if (siteSettings.isNewDropActive !== undefined) setIsNewDropActive(siteSettings.isNewDropActive);
    if (siteSettings.spotlightBadge) setSpotlightBadge(siteSettings.spotlightBadge);
    if (siteSettings.spotlightTitle) setSpotlightTitle(siteSettings.spotlightTitle);
    if (siteSettings.spotlightSubtitle) setSpotlightSubtitle(siteSettings.spotlightSubtitle);
    if (siteSettings.spotlightCtaText) setSpotlightCtaText(siteSettings.spotlightCtaText);
    if (siteSettings.spotlightCountdownHours !== undefined) setSpotlightCountdownHours(siteSettings.spotlightCountdownHours);
    if (siteSettings.spotlightImage1) setSpotlightImage1(siteSettings.spotlightImage1);
    if (siteSettings.spotlightImage2) setSpotlightImage2(siteSettings.spotlightImage2);
    if (siteSettings.catalogBadge) setCatalogBadge(siteSettings.catalogBadge);
    if (siteSettings.catalogTitle) setCatalogTitle(siteSettings.catalogTitle);
    if (siteSettings.lookbookBadge) setLookbookBadge(siteSettings.lookbookBadge);
    if (siteSettings.lookbookTitle) setLookbookTitle(siteSettings.lookbookTitle);
    if (siteSettings.lookbookImage1) setLookbookImage1(siteSettings.lookbookImage1);
    if (siteSettings.lookbookImage2) setLookbookImage2(siteSettings.lookbookImage2);
    if (siteSettings.lookbookImage3) setLookbookImage3(siteSettings.lookbookImage3);
    if (siteSettings.lookbookImage4) setLookbookImage4(siteSettings.lookbookImage4);
    if (siteSettings.isCommunityActive !== undefined) setIsCommunityActive(siteSettings.isCommunityActive);
    if (siteSettings.manifestoBadge) setManifestoBadge(siteSettings.manifestoBadge);
    if (siteSettings.manifestoTitle) setManifestoTitle(siteSettings.manifestoTitle);
    if (siteSettings.manifestoParagraph1) setManifestoParagraph1(siteSettings.manifestoParagraph1);
    if (siteSettings.manifestoParagraph2) setManifestoParagraph2(siteSettings.manifestoParagraph2);
    if (siteSettings.manifestoButtonText) setManifestoButtonText(siteSettings.manifestoButtonText);
    if (siteSettings.communityImage1) setCommunityImage1(siteSettings.communityImage1);
    if (siteSettings.communityImage2) setCommunityImage2(siteSettings.communityImage2);
    if (siteSettings.isInstagramActive !== undefined) setIsInstagramActive(siteSettings.isInstagramActive);
    if (siteSettings.instagramSectionTitle) setInstagramSectionTitle(siteSettings.instagramSectionTitle);
    if (siteSettings.instagramFollowText) setInstagramFollowText(siteSettings.instagramFollowText);
    if (siteSettings.instagramUrl) setInstagramUrl(siteSettings.instagramUrl);
    if (siteSettings.logoAutoRotate !== undefined) setLogoAutoRotate(siteSettings.logoAutoRotate);
    if (siteSettings.bgPatternActive !== undefined) setBgPatternActive(siteSettings.bgPatternActive);
    if (siteSettings.storeTabActive !== undefined) setStoreTabActive(siteSettings.storeTabActive);
    if (siteSettings.storeOpeningMessage) setStoreOpeningMessage(siteSettings.storeOpeningMessage);
    if (siteSettings.storeOpeningSubtitle) setStoreOpeningSubtitle(siteSettings.storeOpeningSubtitle);
    if (siteSettings.storeOpeningDate) setStoreOpeningDate(siteSettings.storeOpeningDate);
  }, [siteSettings]);

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSiteSettings({
      heroTitle,
      heroSubtitle,
      heroBadgeText,
      heroCtaText,
      heroCtaLink,
      heroSecondaryCtaText,
      heroSecondaryCtaLink,
      heroOriginTag,
      heroFabricTag,
      heroCodTag,
      heroImage,
      announcementText,
      announcementActive,
      infolineText,
      infolineActive,
      infolineSpeed,
      marqueeText,
      isNewDropActive,
      spotlightBadge,
      spotlightTitle,
      spotlightSubtitle,
      spotlightCtaText,
      spotlightCountdownHours,
      spotlightImage1,
      spotlightImage2,
      catalogBadge,
      catalogTitle,
      lookbookBadge,
      lookbookTitle,
      lookbookImage1,
      lookbookImage2,
      lookbookImage3,
      lookbookImage4,
      isCommunityActive,
      manifestoBadge,
      manifestoTitle,
      manifestoParagraph1,
      manifestoParagraph2,
      manifestoButtonText,
      communityImage1,
      communityImage2,
      isInstagramActive,
      instagramSectionTitle,
      instagramFollowText,
      instagramUrl,
      logoAutoRotate,
      bgPatternActive,
      storeTabActive,
      storeOpeningMessage,
      storeOpeningSubtitle,
      storeOpeningDate,
    });
    showToast('Toutes les modifications du site client ont été enregistrées avec succès !');
    logAuditAction('CMS Global Update', 'Mise à jour complète des textes, images et réglages d’affichage client');
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
    name: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setter(reader.result as string);
      showToast(`Image pour "${name}" chargée avec succès !`);
    };
    reader.readAsDataURL(file);
  };

  const imagePresets = [
    { label: '567 Royal Blue Editorial Drape', src: modelBlueImg },
    { label: '567 Royal Blue Studio Apex', src: blueHoodieImg },
    { label: 'Concrete Brutalist Campaign', src: heroImg },
    { label: 'Curved Balloon Sweatpants', src: balloonPantImg },
    { label: 'Medina Raw Contrast Ringer', src: ringerTeeImg },
    { label: 'Editorial Lookbook Walk', src: editorialImg },
    { label: 'Raw Heavyweight Longsleeve', src: longsleeveImg },
    { label: 'White Architecture Mockneck', src: whiteLsImg },
    { label: 'Discipline Athletic Muscle Tank', src: tankImg },
    { label: 'Studio Heavyweight Black Hoodie', src: hoodieImg },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-orange-400 block mb-1">
            RWYSE STUDIOS // SOVEREIGN MASTER CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight">
            Gestion Intégrale de l'Affichage Client
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-light">
            Gérez chaque mot, chaque phrase, chaque image, bannière, slogan et effet visuel affiché aux clients.
          </p>
        </div>

        <button
          onClick={() => handleSaveAll()}
          className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-lg rounded-xs"
        >
          <Save className="w-4 h-4" />
          <span>Enregistrer Tout</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-neutral-800">
        {[
          { id: 'hero', label: '1. Hero & Accueil', icon: <Type className="w-3.5 h-3.5" /> },
          { id: 'ticker', label: '2. Bandeaux & Défilements', icon: <Megaphone className="w-3.5 h-3.5" /> },
          { id: 'spotlight', label: '3. Drop 567 Spotlight', icon: <Flame className="w-3.5 h-3.5 text-orange-500" /> },
          { id: 'lookbook', label: '4. Lookbook & Photos', icon: <ImageIcon className="w-3.5 h-3.5" /> },
          { id: 'manifesto', label: '5. Philosophie & Textes', icon: <BookOpen className="w-3.5 h-3.5" /> },
          { id: 'community', label: '6. Instagram & Réseaux', icon: <Instagram className="w-3.5 h-3.5" /> },
          { id: 'fx', label: '7. Logo 3D & Motifs Fond', icon: <RotateCw className="w-3.5 h-3.5 text-blue-400" /> },
          { id: 'store', label: '8. Boutique Physique', icon: <Store className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 text-xs uppercase font-mono tracking-wider flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors border-b-2 -mb-[2px] ${
              activeTab === tab.id
                ? 'border-orange-500 text-white bg-neutral-900/80 font-bold'
                : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900/40'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* TAB 1: HERO */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="p-6 bg-[#111116] border border-neutral-800 space-y-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white border-b border-neutral-800 pb-3 flex items-center gap-2">
                <Type className="w-4 h-4 text-orange-500" />
                <span>Textes & Accroches de la Section Hero</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1.5 font-medium">
                    Badge Supérieur Hero
                  </label>
                  <input
                    type="text"
                    value={heroBadgeText}
                    onChange={(e) => setHeroBadgeText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white font-mono uppercase focus:outline-none focus:border-neutral-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1.5 font-medium">
                    Titre Principal (Headline) *
                  </label>
                  <input
                    type="text"
                    required
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white font-display font-bold uppercase focus:outline-none focus:border-neutral-500 text-sm"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="text-neutral-400 uppercase tracking-wider block mb-1.5 font-medium">
                  Sous-titre / Paragraphe de Présentation Hero
                </label>
                <textarea
                  rows={2}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1.5 font-medium">
                    Bouton CTA 1 (Texte)
                  </label>
                  <input
                    type="text"
                    value={heroCtaText}
                    onChange={(e) => setHeroCtaText(e.target.value)}
                    className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 text-white uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1.5 font-medium">
                    Bouton CTA 1 (Lien de destination)
                  </label>
                  <input
                    type="text"
                    value={heroCtaLink}
                    onChange={(e) => setHeroCtaLink(e.target.value)}
                    className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1.5 font-medium">
                    Bouton CTA 2 (Texte Secondaire)
                  </label>
                  <input
                    type="text"
                    value={heroSecondaryCtaText}
                    onChange={(e) => setHeroSecondaryCtaText(e.target.value)}
                    className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 text-white uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1.5 font-medium">
                    Bouton CTA 2 (Lien Secondaire)
                  </label>
                  <input
                    type="text"
                    value={heroSecondaryCtaLink}
                    onChange={(e) => setHeroSecondaryCtaLink(e.target.value)}
                    className="w-full px-3.5 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono"
                  />
                </div>
              </div>

              {/* Micro Tags in Hero Bottom Right */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-neutral-800/80">
                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1 text-[11px]">
                    Tag Origine
                  </label>
                  <input
                    type="text"
                    value={heroOriginTag}
                    onChange={(e) => setHeroOriginTag(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1 text-[11px]">
                    Tag Matière / Fabric
                  </label>
                  <input
                    type="text"
                    value={heroFabricTag}
                    onChange={(e) => setHeroFabricTag(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1 text-[11px]">
                    Tag Paiement COD
                  </label>
                  <input
                    type="text"
                    value={heroCodTag}
                    onChange={(e) => setHeroCodTag(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Hero Image Management */}
            <div className="p-6 bg-[#111116] border border-neutral-800 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white border-b border-neutral-800 pb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Image d’Arrière-Plan Hero</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="aspect-[16/9] bg-neutral-950 border border-neutral-800 overflow-hidden relative group">
                  <img src={heroImage} alt="Hero preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-[10px] font-mono text-white">
                    Image Active
                  </span>
                </div>

                <div className="md:col-span-2 space-y-3 text-xs">
                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider block mb-1">
                      Téléverser une nouvelle photo depuis l'ordinateur
                    </label>
                    <label className="py-2.5 px-4 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors rounded-xs">
                      <Upload className="w-4 h-4" />
                      <span>Choisir un fichier image (JPG, PNG, WEBP)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setHeroImage, 'Photo Hero')}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider block mb-1">
                      Ou coller l'URL directe d'une image
                    </label>
                    <input
                      type="text"
                      value={heroImage}
                      onChange={(e) => setHeroImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs focus:outline-none focus:border-neutral-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-2">
                  Ou choisir parmi les photos de campagne officielles :
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {imagePresets.slice(0, 5).map((opt) => (
                    <div
                      key={opt.label}
                      onClick={() => setHeroImage(opt.src)}
                      className={`cursor-pointer border p-1.5 bg-neutral-900 transition-all ${
                        heroImage === opt.src ? 'border-orange-500 ring-1 ring-orange-500' : 'border-neutral-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-video overflow-hidden mb-1">
                        <img src={opt.src} alt={opt.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="text-[9px] font-mono text-white truncate block">{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TICKERS */}
        {activeTab === 'ticker' && (
          <div className="p-6 bg-[#111116] border border-neutral-800 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white border-b border-neutral-800 pb-3 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-orange-500" />
              <span>Bandeaux Défilants & Annonces</span>
            </h2>

            {/* Infoline Top Header */}
            <div className="space-y-3 pb-5 border-b border-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Bandeau Défilant Supérieur (Infoline Bar)
                  </h3>
                  <span className="text-[11px] text-neutral-400">
                    Bandeau tout en haut du site (au-dessus du menu).
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs uppercase text-neutral-300">
                  <input
                    type="checkbox"
                    checked={infolineActive}
                    onChange={(e) => setInfolineActive(e.target.checked)}
                    className="w-4 h-4 rounded-xs"
                  />
                  <span>Actif</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1">Texte Infoline</label>
                  <input
                    type="text"
                    value={infolineText}
                    onChange={(e) => setInfolineText(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs focus:outline-none focus:border-neutral-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1">Vitesse Défilement</label>
                  <select
                    value={infolineSpeed}
                    onChange={(e) => setInfolineSpeed(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs"
                  >
                    <option value="slow">Lente (Slow)</option>
                    <option value="normal">Normale (Standard)</option>
                    <option value="fast">Rapide (Fast)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Middle Section Marquee */}
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Ruban Ticker Infini (Sous le Hero)
                </h3>
                <span className="text-[11px] text-neutral-400">
                  Texte défilant en continu séparé par des slashes (/).
                </span>
              </div>
              <textarea
                rows={3}
                value={marqueeText}
                onChange={(e) => setMarqueeText(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs uppercase tracking-wider focus:outline-none focus:border-neutral-500"
              />
            </div>
          </div>
        )}

        {/* TAB 3: SPOTLIGHT */}
        {activeTab === 'spotlight' && (
          <div className="p-6 bg-[#111116] border border-neutral-800 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Section Spotlight (Drop 01 - Hoodie 567 Royal Blue)</span>
              </h2>
              <label className="flex items-center gap-2 cursor-pointer text-xs uppercase text-neutral-300">
                <input
                  type="checkbox"
                  checked={isNewDropActive}
                  onChange={(e) => setIsNewDropActive(e.target.checked)}
                  className="w-4 h-4 rounded-xs"
                />
                <span>Section Visible</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">Badge Spotlight</label>
                <input
                  type="text"
                  value={spotlightBadge}
                  onChange={(e) => setSpotlightBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs uppercase"
                />
              </div>

              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">Titre Spotlight</label>
                <input
                  type="text"
                  value={spotlightTitle}
                  onChange={(e) => setSpotlightTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-display font-bold uppercase text-xs"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="text-neutral-400 uppercase tracking-wider block mb-1">
                Description / Paragraphe Spotlight
              </label>
              <textarea
                rows={2}
                value={spotlightSubtitle}
                onChange={(e) => setSpotlightSubtitle(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">Texte Bouton CTA</label>
                <input
                  type="text"
                  value={spotlightCtaText}
                  onChange={(e) => setSpotlightCtaText(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs uppercase"
                />
              </div>
              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">
                  Compte à Rebours Restock (Heures)
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={spotlightCountdownHours}
                  onChange={(e) => setSpotlightCountdownHours(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs"
                />
              </div>
            </div>

            {/* Spotlight Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-neutral-800">
              <div className="space-y-2">
                <span className="text-xs text-neutral-300 font-bold uppercase block">Photo 1 (Studio Apex)</span>
                <div className="aspect-[3/4] max-h-48 bg-neutral-950 border border-neutral-800 overflow-hidden relative">
                  <img src={spotlightImage1} alt="Spotlight 1" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <label className="py-2 px-3 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Changer Photo 1</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, setSpotlightImage1, 'Spotlight Photo 1')}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-neutral-300 font-bold uppercase block">Photo 2 (Editorial Drape)</span>
                <div className="aspect-[3/4] max-h-48 bg-neutral-950 border border-neutral-800 overflow-hidden relative">
                  <img src={spotlightImage2} alt="Spotlight 2" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <label className="py-2 px-3 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Changer Photo 2</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, setSpotlightImage2, 'Spotlight Photo 2')}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LOOKBOOK */}
        {activeTab === 'lookbook' && (
          <div className="p-6 bg-[#111116] border border-neutral-800 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white border-b border-neutral-800 pb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <span>Section Lookbook de Campagne (Photos & Titres)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">Badge Lookbook</label>
                <input
                  type="text"
                  value={lookbookBadge}
                  onChange={(e) => setLookbookBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs uppercase"
                />
              </div>

              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">Titre de la Galerie</label>
                <input
                  type="text"
                  value={lookbookTitle}
                  onChange={(e) => setLookbookTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-display font-bold uppercase text-xs"
                />
              </div>
            </div>

            {/* 4 Lookbook Photos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {[
                { title: 'Look 1 (Royal Blue)', img: lookbookImage1, setter: setLookbookImage1 },
                { title: 'Look 2 (Balloon Pant)', img: lookbookImage2, setter: setLookbookImage2 },
                { title: 'Look 3 (Ringer Medina)', img: lookbookImage3, setter: setLookbookImage3 },
                { title: 'Look 4 (Concrete Street)', img: lookbookImage4, setter: setLookbookImage4 },
              ].map((look, i) => (
                <div key={i} className="space-y-2">
                  <span className="text-[11px] font-mono text-neutral-300 block truncate">{look.title}</span>
                  <div className="aspect-[3/4] bg-neutral-950 border border-neutral-800 overflow-hidden relative">
                    <img src={look.img} alt={look.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <label className="py-1.5 px-2 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer">
                    <Upload className="w-3 h-3" />
                    <span>Remplacer</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, look.setter, look.title)}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MANIFESTO */}
        {activeTab === 'manifesto' && (
          <div className="p-6 bg-[#111116] border border-neutral-800 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-500" />
                <span>Manifeste & Philosophie de la Marque</span>
              </h2>
              <label className="flex items-center gap-2 cursor-pointer text-xs uppercase text-neutral-300">
                <input
                  type="checkbox"
                  checked={isCommunityActive}
                  onChange={(e) => setIsCommunityActive(e.target.checked)}
                  className="w-4 h-4 rounded-xs"
                />
                <span>Section Visible</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">Badge Manifeste</label>
                <input
                  type="text"
                  value={manifestoBadge}
                  onChange={(e) => setManifestoBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs uppercase"
                />
              </div>
              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">Texte Bouton Manifeste</label>
                <input
                  type="text"
                  value={manifestoButtonText}
                  onChange={(e) => setManifestoButtonText(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="text-neutral-400 uppercase tracking-wider block mb-1">Titre du Manifeste *</label>
              <input
                type="text"
                value={manifestoTitle}
                onChange={(e) => setManifestoTitle(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-display font-bold uppercase text-xs"
              />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">Paragraphe 1</label>
                <textarea
                  rows={2}
                  value={manifestoParagraph1}
                  onChange={(e) => setManifestoParagraph1(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">Paragraphe 2</label>
                <textarea
                  rows={2}
                  value={manifestoParagraph2}
                  onChange={(e) => setManifestoParagraph2(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-neutral-800">
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-neutral-300 block">Photo Manifeste Gauche</span>
                <div className="aspect-[3/4] max-h-40 bg-neutral-950 border border-neutral-800 overflow-hidden relative">
                  <img src={communityImage1} alt="Community 1" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <label className="py-1.5 px-3 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer">
                  <Upload className="w-3 h-3" />
                  <span>Remplacer</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, setCommunityImage1, 'Photo Manifeste 1')}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono text-neutral-300 block">Photo Manifeste Droite</span>
                <div className="aspect-[3/4] max-h-40 bg-neutral-950 border border-neutral-800 overflow-hidden relative">
                  <img src={communityImage2} alt="Community 2" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <label className="py-1.5 px-3 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer">
                  <Upload className="w-3 h-3" />
                  <span>Remplacer</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, setCommunityImage2, 'Photo Manifeste 2')}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: INSTAGRAM */}
        {activeTab === 'community' && (
          <div className="p-6 bg-[#111116] border border-neutral-800 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
                <Instagram className="w-4 h-4 text-orange-500" />
                <span>Réseaux Sociaux & Instagram (@rwy.se)</span>
              </h2>
              <label className="flex items-center gap-2 cursor-pointer text-xs uppercase text-neutral-300">
                <input
                  type="checkbox"
                  checked={isInstagramActive}
                  onChange={(e) => setIsInstagramActive(e.target.checked)}
                  className="w-4 h-4 rounded-xs"
                />
                <span>Section Visible</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">
                  Lien Officiel Instagram
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">
                  Titre de la Section Instagram
                </label>
                <input
                  type="text"
                  value={instagramSectionTitle}
                  onChange={(e) => setInstagramSectionTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-display font-bold uppercase text-xs"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="text-neutral-400 uppercase tracking-wider block mb-1">Texte du Bouton Suivre</label>
              <input
                type="text"
                value={instagramFollowText}
                onChange={(e) => setInstagramFollowText(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs uppercase"
              />
            </div>
          </div>
        )}

        {/* TAB 7: FX & LOGO 3D */}
        {activeTab === 'fx' && (
          <div className="p-6 bg-[#111116] border border-neutral-800 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white border-b border-neutral-800 pb-3 flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-blue-400" />
              <span>Effets Visuels, Rotation Autonome du Logo & Motifs de Fond</span>
            </h2>

            <div className="space-y-4 text-xs">
              <label className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-white block">
                    Rotation 3D Autonome du Logo RWYSE (Sans curseur souris)
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Le logo pivote seul en continu à 360° dans le menu et les bannières avec une perspective 3D luxueuse.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={logoAutoRotate}
                  onChange={(e) => setLogoAutoRotate(e.target.checked)}
                  className="w-4 h-4 rounded-xs"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-white block">
                    Petits Motifs & Filigranes dans l’Arrière-Plan Blanc
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Active les micro-motifs streetwear : étoiles géométriques, codes-barres, coordonnées GPS (+ 36°48'N), grille architecturale et halos ambrés.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={bgPatternActive}
                  onChange={(e) => setBgPatternActive(e.target.checked)}
                  className="w-4 h-4 rounded-xs"
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 8: STORE TAB */}
        {activeTab === 'store' && (
          <div className="p-6 bg-[#111116] border border-neutral-800 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-orange-500" />
                <span>Boutique Physique & Volet Dépliant</span>
              </h2>
              <label className="flex items-center gap-2 cursor-pointer text-xs uppercase text-neutral-300">
                <input
                  type="checkbox"
                  checked={storeTabActive}
                  onChange={(e) => setStoreTabActive(e.target.checked)}
                  className="w-4 h-4 rounded-xs"
                />
                <span>Onglet Visible sur le côté</span>
              </label>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">
                  Message Principal (Titre)
                </label>
                <input
                  type="text"
                  value={storeOpeningMessage}
                  onChange={(e) => setStoreOpeningMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">
                  Description / Adresse Concept Store
                </label>
                <textarea
                  rows={2}
                  value={storeOpeningSubtitle}
                  onChange={(e) => setStoreOpeningSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1">
                  Date ou Statut d'Ouverture
                </label>
                <input
                  type="text"
                  value={storeOpeningDate}
                  onChange={(e) => setStoreOpeningDate(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono text-xs uppercase"
                />
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-8 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-[0.25em] hover:bg-neutral-200 transition-colors cursor-pointer shadow-xl rounded-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer Toutes les Modifications Client</span>
          </button>
        </div>
      </form>
    </div>
  );
};
