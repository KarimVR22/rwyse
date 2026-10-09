import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Sliders, Save, Check } from 'lucide-react';
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
  const { siteSettings, updateSiteSettings } = useStore();

  const [heroTitle, setHeroTitle] = useState(siteSettings.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(siteSettings.heroSubtitle);
  const [heroCtaText, setHeroCtaText] = useState(siteSettings.heroCtaText);
  const [heroCtaLink, setHeroCtaLink] = useState(siteSettings.heroCtaLink);
  const [heroSecondaryCtaText, setHeroSecondaryCtaText] = useState(siteSettings.heroSecondaryCtaText);
  const [heroSecondaryCtaLink, setHeroSecondaryCtaLink] = useState(siteSettings.heroSecondaryCtaLink);
  const [heroImage, setHeroImage] = useState(siteSettings.heroImage);

  const [isNewDropActive, setIsNewDropActive] = useState(siteSettings.isNewDropActive);
  const [isCommunityActive, setIsCommunityActive] = useState(siteSettings.isCommunityActive);
  const [isInstagramActive, setIsInstagramActive] = useState(siteSettings.isInstagramActive);

  const [announcementText, setAnnouncementText] = useState(siteSettings.announcementText);
  const [announcementActive, setAnnouncementActive] = useState(siteSettings.announcementActive);

  React.useEffect(() => {
    setHeroTitle(siteSettings.heroTitle);
    setHeroSubtitle(siteSettings.heroSubtitle);
    setHeroCtaText(siteSettings.heroCtaText);
    setHeroCtaLink(siteSettings.heroCtaLink);
    setHeroSecondaryCtaText(siteSettings.heroSecondaryCtaText);
    setHeroSecondaryCtaLink(siteSettings.heroSecondaryCtaLink);
    setHeroImage(siteSettings.heroImage);
    setIsNewDropActive(siteSettings.isNewDropActive);
    setIsCommunityActive(siteSettings.isCommunityActive);
    setIsInstagramActive(siteSettings.isInstagramActive);
    setAnnouncementText(siteSettings.announcementText);
    setAnnouncementActive(siteSettings.announcementActive);
  }, [siteSettings]);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      heroTitle,
      heroSubtitle,
      heroCtaText,
      heroCtaLink,
      heroSecondaryCtaText,
      heroSecondaryCtaLink,
      heroImage,
      isNewDropActive,
      isCommunityActive,
      isInstagramActive,
      announcementText,
      announcementActive,
    });
  };

  const imageOptions = [
    { label: 'Royal Blue 567 Editorial Drape', src: modelBlueImg },
    { label: 'Royal Blue 567 Studio Apex', src: blueHoodieImg },
    { label: 'Brutalist Concrete Campaign', src: heroImg },
    { label: 'Editorial Lookbook Walk', src: editorialImg },
    { label: 'Heavyweight Studio Focus', src: hoodieImg },
    { label: 'Curved Balloon Sweatpants', src: balloonPantImg },
    { label: 'Medina Raw Contrast Ringer', src: ringerTeeImg },
    { label: 'Raw Heavyweight Longsleeve', src: longsleeveImg },
    { label: 'White Architecture Longsleeve', src: whiteLsImg },
    { label: 'Athletic Compression Tank', src: tankImg },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
            FLAGSHIP ORCHESTRATION // NO-CODE CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight">
            Homepage & Brand Controls
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-light">
            Directly configure hero typography, campaign backdrops, and toggle homepage sections on and off.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        
        {/* 1. Announcement Bar Control */}
        <div className="p-6 bg-[#111116] border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Announcement Marquee Bar
            </h2>
            <label className="flex items-center gap-2 cursor-pointer text-xs uppercase text-neutral-300">
              <input
                type="checkbox"
                checked={announcementActive}
                onChange={(e) => setAnnouncementActive(e.target.checked)}
                className="rounded-xs"
              />
              <span>Bar Visible</span>
            </label>
          </div>

          <div>
            <label className="text-xs text-neutral-400 uppercase tracking-wider block mb-1.5">
              Marquee Announcement Text
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-xs text-white uppercase tracking-wider font-mono focus:outline-none focus:border-neutral-500"
            />
          </div>
        </div>

        {/* 2. Hero Section Content */}
        <div className="p-6 bg-[#111116] border border-neutral-800 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white border-b border-neutral-800 pb-3">
            Cinematic Hero Configuration
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-neutral-400 uppercase tracking-wider block mb-1.5">
                Main Hero Headline *
              </label>
              <input
                type="text"
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white font-display font-bold uppercase tracking-wider focus:outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label className="text-neutral-400 uppercase tracking-wider block mb-1.5">
                Hero Subtitle / Brand Statement
              </label>
              <textarea
                rows={2}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-neutral-500 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1.5">Primary CTA Label</label>
                <input
                  type="text"
                  value={heroCtaText}
                  onChange={(e) => setHeroCtaText(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white uppercase font-mono"
                />
              </div>
              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1.5">Primary Destination</label>
                <input
                  type="text"
                  value={heroCtaLink}
                  onChange={(e) => setHeroCtaLink(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1.5">Secondary CTA Label</label>
                <input
                  type="text"
                  value={heroSecondaryCtaText}
                  onChange={(e) => setHeroSecondaryCtaText(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white uppercase font-mono"
                />
              </div>
              <div>
                <label className="text-neutral-400 uppercase tracking-wider block mb-1.5">Secondary Destination</label>
                <input
                  type="text"
                  value={heroSecondaryCtaLink}
                  onChange={(e) => setHeroSecondaryCtaLink(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono"
                />
              </div>
            </div>

            {/* Hero Image Selection & Direct File Upload */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-neutral-400 uppercase tracking-wider block text-xs">
                  Active Hero Backdrop Photo
                </label>
                <span className="text-[10px] font-mono text-emerald-400">JPG, PNG, WEBP</span>
              </div>

              {/* Live Preview */}
              <div className="aspect-[16/9] max-h-48 bg-neutral-950 border border-neutral-800 overflow-hidden relative">
                <img
                  src={heroImage}
                  alt="Aperçu Hero"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 border border-white/20 text-[10px] font-mono text-white">
                  Aperçu en Direct
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-neutral-400 uppercase tracking-wider block mb-1">
                    Téléverser depuis votre ordinateur
                  </label>
                  <label className="w-full py-2 px-3 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <span>Choisir un fichier</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setHeroImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-400 uppercase tracking-wider block mb-1">
                    Ou coller l'URL de l'image
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

              <span className="text-[10px] font-mono uppercase text-neutral-500 block pt-1">
                Ou sélectionner parmi les photos de campagne :
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {imageOptions.map((opt) => (
                  <div
                    key={opt.label}
                    onClick={() => setHeroImage(opt.src)}
                    className={`cursor-pointer border p-2 bg-neutral-900 transition-all ${
                      heroImage === opt.src ? 'border-white ring-1 ring-white' : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="aspect-video bg-neutral-950 overflow-hidden mb-2">
                      <img src={opt.src} alt={opt.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[10px] font-mono text-white uppercase tracking-wider block truncate">
                      {opt.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 3. Section Visibility Toggles */}
        <div className="p-6 bg-[#111116] border border-neutral-800 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white border-b border-neutral-800 pb-3">
            Section Activation Toggles
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-neutral-900/60 border border-neutral-800 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white uppercase tracking-wider block">
                  New Drop Showcase Section
                </span>
                <span className="text-[11px] text-neutral-400">
                  Activates the Drop 01 editorial spotlight section on the homepage and catalog.
                </span>
              </div>
              <input
                type="checkbox"
                checked={isNewDropActive}
                onChange={(e) => setIsNewDropActive(e.target.checked)}
                className="w-4 h-4 rounded-xs"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-neutral-900/60 border border-neutral-800 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white uppercase tracking-wider block">
                  Community Directive ("WE RISE TOGETHER")
                </span>
                <span className="text-[11px] text-neutral-400">
                  Displays brand slogan and community invitation banner on the homepage.
                </span>
              </div>
              <input
                type="checkbox"
                checked={isCommunityActive}
                onChange={(e) => setIsCommunityActive(e.target.checked)}
                className="w-4 h-4 rounded-xs"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-neutral-900/60 border border-neutral-800 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white uppercase tracking-wider block">
                  Instagram Social Grid (@RWY.SE)
                </span>
                <span className="text-[11px] text-neutral-400">
                  Renders the official RWYSE lookbook Instagram feed.
                </span>
              </div>
              <input
                type="checkbox"
                checked={isInstagramActive}
                onChange={(e) => setIsInstagramActive(e.target.checked)}
                className="w-4 h-4 rounded-xs"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-[0.25em] hover:bg-neutral-200 transition-colors cursor-pointer shadow-xl"
          >
            Apply Homepage Updates
          </button>
        </div>

      </form>

    </div>
  );
};
