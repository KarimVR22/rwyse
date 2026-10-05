import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { RwyseLogo } from '../components/common/RwyseLogo';
import {
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  Instagram,
  ChevronRight,
  ShieldCheck,
  Eye,
  Check,
} from 'lucide-react';
import {
  heroImg,
  editorialImg,
  hoodieImg,
  blueHoodieImg,
  balloonPantImg,
  ringerTeeImg,
  modelBlueImg,
} from '../data/initialData';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onNavigateToProduct: (slug: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onNavigateToProduct }) => {
  const { products, siteSettings } = useStore();

  // Active Drop Timer (Countdown to VIP Restock)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });
  const [activeLookbookFilter, setActiveLookbookFilter] = useState<'all' | 'hoodie' | 'street' | 'community'>('all');
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);

  // Lookbook Gallery matching the user's authentic RWYSE images & culture
  const lookbookItems = [
    {
      id: 'look-1',
      title: 'RWYSE 567 Royal Blue Hoodie',
      tag: 'hoodie',
      subtitle: 'White 3D Apex Hood & Sleeve Calligraphy Embroidery',
      image: modelBlueImg,
      badge: 'DROP 01 HERO',
    },
    {
      id: 'look-2',
      title: 'Curved Balloon Baggy Sweatpants',
      tag: 'street',
      subtitle: 'Heavyweight loopback barrel stack silhouette',
      image: balloonPantImg,
      badge: 'VIRAL SILHOUETTE',
    },
    {
      id: 'look-3',
      title: 'Medina Raw Contrast Ringer Tee',
      tag: 'street',
      subtitle: 'Retro ribbed collar and sleeve cuffs',
      image: ringerTeeImg,
      badge: 'SUMMER ARCHIVE',
    },
    {
      id: 'look-4',
      title: 'Community Brotherhood & Athletes',
      tag: 'community',
      subtitle: 'Disciplined athletes united under "Rise with you"',
      image: heroImg,
      badge: 'COMMUNITY DIRECTIVE',
    },
  ];

  const filteredLooks = activeLookbookFilter === 'all'
    ? lookbookItems
    : lookbookItems.filter((item) => item.tag === activeLookbookFilter);

  return (
    <div className="w-full bg-[#0b0b0d] text-white overflow-hidden selection:bg-white selection:text-black">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative h-[92vh] sm:h-[96vh] w-full flex items-end pb-14 sm:pb-24 overflow-hidden border-b border-white/[0.08]">
        {/* Background Image with dramatic multilayered scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={modelBlueImg || heroImg}
            alt="RWYSE Rise & Grind Campaign"
            className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.1] scale-100 transition-transform duration-1000 ease-out"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-black/75" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            
            {/* Top Brand Subtitle */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 mb-4 rounded-xs">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-neutral-200">
                DROP 01 // RISE & GRIND IS LIVE
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold uppercase tracking-tight text-white leading-[1.02]">
              RISE & GRIND.
            </h1>

            {/* Slogan Prose */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base text-neutral-300 max-w-xl leading-relaxed font-light">
              The iconic Royal Blue 567 Oversized Hoodie and Heavyweight Balloon Sweatpants are now live. Engineered with 500 GSM loopback organic cotton.
            </p>

            {/* CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('/product/rwyse-567-royal-blue-oversized-box-hoodie')}
                className="px-8 py-4 bg-white text-black text-xs font-bold uppercase tracking-[0.25em] hover:bg-neutral-200 transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-2xl group"
              >
                <span>SHOP 567 BLUE HOODIE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('/shop')}
                className="px-7 py-4 bg-black/50 hover:bg-white/10 text-white border border-white/30 hover:border-white text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur-md transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <span>EXPLORE ALL PIECES</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Quick Drop Stats at Bottom Right */}
          <div className="hidden md:flex absolute bottom-14 right-8 lg:right-12 flex-col items-end text-right">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400">
              ORIGIN // TUNISIA
            </span>
            <span className="text-xs font-mono text-white mt-1">
              500 GSM CUSTOM COMBED TERRY
            </span>
            <span className="text-[11px] font-mono text-emerald-400 mt-0.5">
              CASH ON DELIVERY NATIONWIDE
            </span>
          </div>

        </div>
      </section>

      {/* 2. INFINITE DUAL-LAYER MARQUEE */}
      <div className="border-b border-neutral-800 bg-[#0e0e12] py-3.5 overflow-hidden select-none">
        <div className="flex gap-10 whitespace-nowrap text-xs font-bold tracking-[0.35em] uppercase text-neutral-400">
          <span className="text-white">RWYSE</span>
          <span className="text-neutral-600">/</span>
          <span>RISE WITH YOU</span>
          <span className="text-neutral-600">/</span>
          <span className="text-blue-400">567 ROYAL BLUE HOODIE</span>
          <span className="text-neutral-600">/</span>
          <span>CURVED BALLOON SWEATPANTS</span>
          <span className="text-neutral-600">/</span>
          <span>CONTRAST RINGER TEES</span>
          <span className="text-neutral-600">/</span>
          <span>500 GSM HEAVYWEIGHT COTTON</span>
          <span className="text-neutral-600">/</span>
          <span>CASH ON DELIVERY IN TUNISIA</span>
          <span className="text-neutral-600">/</span>
          <span className="text-white">WE RISE TOGETHER</span>
        </div>
      </div>

      {/* 3. HERO CAMPAIGN SPOTLIGHT BANNER ("RISE & GRIND") */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#111117] to-[#151520] border border-neutral-800 p-8 sm:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-widest">
                <Flame className="w-4 h-4 fill-current text-blue-500" />
                <span>DROP 01 EXCLUSIVE SPOTLIGHT</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-display font-extrabold uppercase text-white tracking-tight leading-none">
                THE 567 ROYAL BLUE & BALLOON FIT
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl font-light">
                Directly inspired by the official RWYSE campaign. Featuring high-density white 3D embroidery on the apex of the hood, artistic sleeve script, and matched with extreme barrel balloon sweatpants.
              </p>

              {/* Countdown Ticker */}
              <div className="pt-2 flex items-center gap-4">
                <span className="text-xs font-mono uppercase text-neutral-400">Restock Drop Allocation:</span>
                <div className="flex items-center gap-2 font-mono text-xs text-white">
                  <span className="px-2.5 py-1 bg-black/80 border border-neutral-700 font-bold">{timeLeft.hours}h</span>
                  <span>:</span>
                  <span className="px-2.5 py-1 bg-black/80 border border-neutral-700 font-bold">{timeLeft.minutes}m</span>
                  <span>:</span>
                  <span className="px-2.5 py-1 bg-black/80 border border-neutral-700 font-bold">{timeLeft.seconds}s</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigateToProduct('rwyse-567-royal-blue-oversized-box-hoodie')}
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-[0.25em] transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>ORDER 567 BLUE HOODIE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('/shop')}
                  className="px-6 py-3.5 bg-transparent border border-neutral-700 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300 hover:text-white hover:border-white transition-colors cursor-pointer"
                >
                  DISCOVER THE PIECE
                </button>
              </div>
            </div>

            {/* Split Product Visuals Right */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
              <div
                onClick={() => onNavigateToProduct('rwyse-567-royal-blue-oversized-box-hoodie')}
                className="aspect-[3/4] bg-neutral-900 border border-neutral-800 overflow-hidden cursor-pointer group relative"
              >
                <img
                  src={blueHoodieImg}
                  alt="RWYSE 567 Blue Hoodie Studio"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3">
                  <span className="text-[10px] font-mono uppercase text-blue-300 block">STUDIO APEX 567</span>
                  <span className="text-xs font-bold font-mono text-white">175 {siteSettings.currency}</span>
                </div>
              </div>

              <div
                onClick={() => onNavigateToProduct('rwyse-567-royal-blue-oversized-box-hoodie')}
                className="aspect-[3/4] bg-neutral-900 border border-neutral-800 overflow-hidden cursor-pointer group relative"
              >
                <img
                  src={modelBlueImg}
                  alt="RWYSE 567 Blue Hoodie Editorial Drape"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3">
                  <span className="text-[10px] font-mono uppercase text-blue-300 block">EDITORIAL DRAPE</span>
                  <span className="text-xs font-bold font-mono text-white">175 {siteSettings.currency}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FEATURED CATALOG PIECES */}
      <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-neutral-800/80 pb-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-2">
              FLAGSHIP DROP // FOUNDATION
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold uppercase text-white tracking-tight">
              Curated Silhouettes
            </h2>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => onNavigate('/shop')}
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigateToProduct={onNavigateToProduct}
            />
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE EDITORIAL LOOKBOOK */}
      <section className="py-16 sm:py-24 bg-[#0e0e12] border-y border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
                CAMPAIGN ARCHIVE // TUNIS MEDINA & STUDIO
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-extrabold uppercase text-white tracking-tight">
                Authentic RWYSE Lookbook
              </h2>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-sm overflow-x-auto">
              {(['all', 'hoodie', 'street', 'community'] as const).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveLookbookFilter(tag)}
                  className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                    activeLookbookFilter === tag
                      ? 'bg-white text-black'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tag === 'all'
                    ? 'All Shots'
                    : tag === 'hoodie'
                    ? '567 Blue Drop'
                    : tag === 'street'
                    ? 'Streetwear'
                    : 'Brotherhood'}
                </button>
              ))}
            </div>
          </div>

          {/* Lookbook Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredLooks.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhotoModal(item.image)}
                className="group relative aspect-[3/4] bg-neutral-900 border border-neutral-800 overflow-hidden cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-5 flex flex-col justify-between opacity-90 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-white bg-black/80 px-2 py-0.5 border border-white/20 self-start">
                    {item.badge}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold uppercase text-white tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-neutral-300 mt-1 line-clamp-2">
                      {item.subtitle}
                    </p>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-2 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Tap to expand
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. BRAND PHILOSOPHY / COMMUNITY ETHOS */}
      <section className="py-20 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block">
              THE RWYSE FOUNDATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold uppercase text-white tracking-tight leading-[1.08]">
              "RISE WITH YOU" — BORN FOR AMBITION & BROTHERHOOD.
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
              <p>
                From the gym to the city streets, RWYSE represents radical discipline. We craft heavy 500 GSM loopback cotton garments engineered to accompany your daily grind.
              </p>
              <p>
                When you wear the Royal Blue 567 hoodie or the balloon sweatpants, you wear an architectural statement. We do not design disposable garments; we craft permanent silhouettes.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-6">
              <button
                onClick={() => onNavigate('/about')}
                className="px-6 py-3.5 border border-neutral-700 hover:border-white text-xs font-bold uppercase tracking-[0.25em] text-white transition-colors cursor-pointer"
              >
                Read Brand Manifesto
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] bg-neutral-900 border border-neutral-800 overflow-hidden">
              <img
                src={blueHoodieImg}
                alt="RWYSE 567 Hood Embroidery"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="aspect-[3/4] bg-neutral-900 border border-neutral-800 overflow-hidden mt-8">
              <img
                src={ringerTeeImg}
                alt="RWYSE Medina Street Ringer"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 7. INSTAGRAM SHOWCASE (@RWY.SE) */}
      <section className="py-16 sm:py-20 border-t border-neutral-800/80 bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-neutral-400" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-white">
                OFFICIAL COMMUNITY @RWY.SE
              </span>
            </div>
            <a
              href="https://instagram.com/rwy.se"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-400 hover:text-white uppercase tracking-wider underline cursor-pointer"
            >
              Follow @RWY.SE on Instagram
            </a>
          </div>

          {/* Social Photos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { img: modelBlueImg, caption: 'Drop 01: Rise & Grind. 567 Royal Blue live now.', likes: '2.4k' },
              { img: balloonPantImg, caption: 'Heavy curved balloon joggers. Stacks on sneakers.', likes: '3.1k' },
              { img: ringerTeeImg, caption: 'Medina archive contrast ringer tee.', likes: '1.8k' },
              { img: blueHoodieImg, caption: 'Artistic sleeve calligraphy and puff apex embroidery.', likes: '4.2k' },
            ].map((post, idx) => (
              <a
                key={idx}
                href="https://instagram.com/rwy.se"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square bg-neutral-900 border border-neutral-800 overflow-hidden block"
              >
                <img
                  src={post.img}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-neutral-300 uppercase tracking-widest">
                    @RWY.SE
                  </span>
                  <p className="text-xs text-neutral-200 line-clamp-2">
                    {post.caption}
                  </p>
                  <span className="text-[10px] font-mono text-white">
                    ❤ {post.likes}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Photo Preview Modal */}
      {selectedPhotoModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedPhotoModal(null)}
          />
          <div className="relative z-10 max-w-2xl max-h-[90vh] bg-black border border-neutral-800 overflow-hidden">
            <img
              src={selectedPhotoModal}
              alt="RWYSE Lookbook Detail"
              className="w-full h-auto max-h-[85vh] object-contain"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setSelectedPhotoModal(null)}
              className="absolute top-4 right-4 bg-black/80 text-white p-2 rounded-full cursor-pointer hover:bg-white hover:text-black transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
