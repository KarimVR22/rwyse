import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { RwyseLogo } from './RwyseLogo';
import { ShoppingBag, Bookmark, Search, Menu, X, Shield, User } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenSearch }) => {
  const { cart, wishlist, setIsCartOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { label: 'Shop', path: '/shop' },
    { label: 'Collections', path: '/collections' },
    { label: 'New Drops', path: '/new-drops' },
    { label: 'Community', path: '/community' },
    { label: 'About RWYSE', path: '/about' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0b0df2] backdrop-blur-md border-b border-white/[0.07] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Zone 1: Single text/logo element */}
        <div className="flex items-center">
          <button
            onClick={() => handleLinkClick('/')}
            className="flex items-center text-left cursor-pointer group focus-visible:outline-none"
            aria-label="RWYSE Home"
          >
            <RwyseLogo className="h-6 sm:h-7 w-auto text-white group-hover:opacity-90 transition-opacity" />
          </button>
        </div>

        {/* Zone 2: 4-6 Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-neutral-400">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`relative py-1 cursor-pointer transition-colors duration-200 hover:text-white whitespace-nowrap ${
                  isActive ? 'text-white font-semibold' : 'text-neutral-400'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white transition-all" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Trigger */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="p-2 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Search items"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Wishlist */}
          <button
            onClick={() => handleLinkClick('/wishlist')}
            className="relative p-2 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Saved pieces"
          >
            <Bookmark className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white" />
            )}
          </button>

          {/* Account */}
          <button
            onClick={() => handleLinkClick('/account')}
            className={`p-2 transition-colors cursor-pointer ${
              currentPath === '/account' ? 'text-white' : 'text-neutral-300 hover:text-white'
            }`}
            aria-label="Customer Account"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Shopping Bag Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-white text-xs tracking-wider uppercase font-medium transition-colors cursor-pointer"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="tabular-nums font-semibold">{totalCartCount}</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-18 bg-[#0e0e12] border-b border-neutral-800 p-6 flex flex-col gap-6 shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4 text-sm font-medium tracking-[0.2em] uppercase text-neutral-300">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`text-left py-2 border-b border-neutral-800/60 ${
                  currentPath === link.path ? 'text-white font-bold' : 'text-neutral-400'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleLinkClick('/contact')}
              className="text-left py-2 border-b border-neutral-800/60 text-neutral-400"
            >
              Contact Studio
            </button>
          </nav>
          
          <div className="pt-2 text-xs text-neutral-500 tracking-widest uppercase flex items-center justify-between">
            <span>RWYSE Flagship</span>
            <span>Rise with you</span>
          </div>
        </div>
      )}
    </header>
  );
};
