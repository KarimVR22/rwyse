import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { RwyseLogo } from './RwyseLogo';
import {
  ShoppingBag,
  Bookmark,
  Search,
  Menu,
  X,
  Phone,
  Instagram,
  User,
  DoorClosed,
  Globe,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { DirectCallModal } from './DirectCallModal';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch?: () => void;
  onOpenStoreModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
  onOpenStoreModal,
}) => {
  const { cart, wishlist, setIsCartOpen, siteSettings } = useStore();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { label: t('nav.shop'), path: '/shop' },
    { label: t('nav.collections'), path: '/collections' },
    { label: t('nav.newDrops'), path: '/new-drops' },
    { label: t('nav.community'), path: '/community' },
    { label: t('nav.about'), path: '/about' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'ar' : 'fr');
  };

  const instagramLink = siteSettings.instagramUrl || 'https://www.instagram.com/rwy.se/';
  const rawPhone = siteSettings.adminPhone || '+216 29 110 567';

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-all relative"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Subtle Luxury Hairline Gradient Border Accent */}
        <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-orange-500/40 via-blue-600/35 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Brand Zone with Interactive 360° Rotating Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleLinkClick('/')}
              className="flex items-center text-start cursor-pointer focus-visible:outline-none"
              aria-label="RWYSE Home"
              title="RWYSE — Cliquez pour tourner à 360°"
            >
              <RwyseLogo
                className="h-7 sm:h-8 w-auto text-black"
                variant="light"
                interactiveSpin={true}
                autoSpin={siteSettings.logoAutoRotate ?? true}
              />
            </button>
            <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-[9px] font-mono uppercase tracking-widest text-neutral-500 rounded-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>ATELIER TUNIS</span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Clean luxury typography) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-[0.2em] font-medium text-neutral-600">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`relative py-1 cursor-pointer transition-colors duration-200 hover:text-black whitespace-nowrap ${
                    isActive ? 'text-black font-bold' : 'text-neutral-600'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-[2px] bg-black transition-all" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Multilingual Switcher: FR / AR */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-xs bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-900 text-[11px] font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors"
              title={language === 'fr' ? 'Changer en Arabe (العربية)' : 'Changer en Français'}
              aria-label="Changer de langue"
            >
              <Globe className="w-3.5 h-3.5 text-neutral-500" />
              <span className="font-bold">{language === 'fr' ? 'AR 🇹🇳' : 'FR 🇫🇷'}</span>
            </button>

            {/* Direct Call Button (Desktop Icon Trigger) */}
            <button
              type="button"
              onClick={() => setCallModalOpen(true)}
              className="hidden sm:flex p-2 text-neutral-700 hover:text-orange-600 transition-colors cursor-pointer rounded-xs"
              title={t('call.buttonLabel')}
              aria-label={t('call.buttonLabel')}
            >
              <Phone className="w-4 h-4" />
            </button>

            {/* Instagram Official Link */}
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex p-2 text-neutral-700 hover:text-orange-600 transition-colors cursor-pointer rounded-xs"
              title={t('instagram.button')}
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>

            {/* Search Trigger */}
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-2 text-neutral-700 hover:text-black transition-colors cursor-pointer rounded-xs"
                title={t('nav.search')}
                aria-label={t('nav.search')}
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Wishlist */}
            <button
              type="button"
              onClick={() => handleLinkClick('/wishlist')}
              className="relative p-2 text-neutral-700 hover:text-black transition-colors cursor-pointer rounded-xs"
              title={t('nav.wishlist')}
              aria-label={t('nav.wishlist')}
            >
              <Bookmark className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-black" />
              )}
            </button>

            {/* Account */}
            <button
              type="button"
              onClick={() => handleLinkClick('/account')}
              className={`p-2 transition-colors cursor-pointer rounded-xs ${
                currentPath === '/account' ? 'text-black' : 'text-neutral-700 hover:text-black'
              }`}
              title={t('nav.account')}
              aria-label={t('nav.account')}
            >
              <User className="w-4 h-4" />
            </button>

            {/* Shopping Bag Trigger with Tabular Numbers */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xs bg-black hover:bg-neutral-800 text-white text-xs tracking-wider uppercase font-medium transition-colors cursor-pointer shadow-sm"
              aria-label={t('nav.cart')}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-neutral-200" />
              <span className="tabular-nums font-bold text-white">{totalCartCount}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-700 hover:text-black transition-colors cursor-pointer rounded-xs"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Backdrop & Drawer Menu */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 top-18 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div
              className="lg:hidden fixed inset-x-0 top-18 bg-white border-b border-neutral-200 p-6 flex flex-col gap-5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-3 duration-200 max-h-[85vh] overflow-y-auto"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {/* Language switcher + Quick Search in Mobile */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-neutral-200">
                <button
                  onClick={toggleLanguage}
                  className="px-3 py-2 bg-neutral-100 border border-neutral-300 text-neutral-900 text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-neutral-600" />
                  <span>{language === 'fr' ? 'Passer en Arabe (العربية)' : 'Passer en Français (FR)'}</span>
                </button>

                <a
                  href={`tel:${rawPhone.replace(/\s+/g, '')}`}
                  className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t('call.buttonLabel')}</span>
                </a>
              </div>

              {/* Mobile Search Input */}
              {onOpenSearch && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSearch();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-neutral-100 border border-neutral-200 text-neutral-600 text-xs uppercase tracking-wider text-start cursor-pointer hover:border-neutral-400"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{t('nav.searchPlaceholder')}</span>
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">Ctrl+K</span>
                </button>
              )}

              {/* Nav Links */}
              <nav className="flex flex-col gap-1 text-xs font-medium tracking-[0.2em] uppercase text-neutral-800">
                {navLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => handleLinkClick(link.path)}
                    className={`text-start py-3 px-2 rounded-xs border-b border-neutral-100 flex items-center justify-between cursor-pointer ${
                      currentPath === link.path
                        ? 'text-black font-bold bg-neutral-100'
                        : 'text-neutral-700 hover:text-black'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="text-neutral-400 font-mono text-xs">
                      {isRTL ? '←' : '→'}
                    </span>
                  </button>
                ))}

                <button
                  onClick={() => handleLinkClick('/track')}
                  className={`text-start py-3 px-2 rounded-xs border-b border-neutral-100 flex items-center justify-between cursor-pointer ${
                    currentPath === '/track' ? 'text-black font-bold bg-neutral-100' : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  <span className="text-emerald-600 font-semibold">{t('nav.track')}</span>
                  <span className="text-[10px] font-mono text-emerald-600">Live</span>
                </button>

                <button
                  onClick={() => handleLinkClick('/account')}
                  className={`text-start py-3 px-2 rounded-xs border-b border-neutral-100 flex items-center justify-between cursor-pointer ${
                    currentPath === '/account' ? 'text-black font-bold bg-neutral-100' : 'text-neutral-700 hover:text-black'
                  }`}
                >
                  <span>{t('nav.account')}</span>
                  <span className="text-neutral-400 font-mono text-xs">
                    {isRTL ? '←' : '→'}
                  </span>
                </button>

                <a
                  href={instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-start py-3 px-2 rounded-xs text-neutral-700 hover:text-black flex items-center justify-between cursor-pointer border-b border-neutral-100"
                >
                  <span className="flex items-center gap-2 text-orange-600">
                    <Instagram className="w-4 h-4" />
                    <span>{t('instagram.button')}</span>
                  </span>
                  <span className="text-neutral-400 font-mono text-xs">↗</span>
                </a>

                {/* Mobile Admin Portal Shortcut */}
                <button
                  onClick={() => handleLinkClick('/admin')}
                  className="text-start py-3 px-2 rounded-xs text-neutral-500 hover:text-black flex items-center justify-between cursor-pointer text-xs font-mono"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <span>ESPACE ADMIN CMS</span>
                  </span>
                  <span className="text-[10px] uppercase text-neutral-400 font-bold">Gérer le site</span>
                </button>
              </nav>

              <div className="pt-2 border-t border-neutral-200 text-[10px] text-neutral-500 tracking-widest uppercase flex items-center justify-between font-mono">
                <span>RWYSE STUDIOS TN</span>
                <span>{language === 'ar' ? 'الدفع عند الاستلام' : 'Paiement à la livraison'}</span>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Direct Call Modal */}
      <DirectCallModal isOpen={callModalOpen} onClose={() => setCallModalOpen(false)} />
    </>
  );
};
