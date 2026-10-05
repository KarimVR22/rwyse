import React, { useState } from 'react';
import { RwyseLogo } from './RwyseLogo';
import { ArrowRight, Instagram, Check, Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="w-full bg-[#08080a] border-t border-neutral-800/80 text-neutral-400 select-none">
      
      {/* Top Banner / Community Statement */}
      <div className="border-b border-neutral-800/60 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">
              COMMUNITY DIRECTIVE
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight mt-1">
              WE RISE TOGETHER.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl leading-relaxed">
              RWYSE was founded on the belief that modern apparel should empower ambition, discipline, and unity. Every garment is an architectural statement designed to accompany your ascension.
            </p>
          </div>

          {/* VIP Newsletter */}
          <div className="lg:col-span-5">
            <div className="bg-neutral-900/60 border border-neutral-800 p-5">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-neutral-300 block mb-1">
                JOIN THE INNER CIRCLE
              </span>
              <p className="text-xs text-neutral-400 mb-3">
                Be the first to access limited capsule drops and private community releases.
              </p>
              
              {subscribed ? (
                <div className="flex items-center gap-2 p-3 bg-neutral-900 border border-neutral-700 text-emerald-400 text-xs font-mono">
                  <Check className="w-4 h-4" />
                  <span>Welcome to the circle. Check your inbox soon.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="ENTER YOUR EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 font-mono tracking-wider"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & Logo */}
          <div className="col-span-2">
            <button
              onClick={() => onNavigate('/')}
              className="text-left cursor-pointer focus-visible:outline-none"
              aria-label="RWYSE Home"
            >
              <RwyseLogo className="h-8 w-auto text-white hover:opacity-90 transition-opacity" withSlogan />
            </button>
            <p className="text-xs text-neutral-400 mt-4 max-w-sm leading-relaxed">
              Contemporary streetwear brand with high-density architectural silhouettes. Crafted with heavy loop terry and bespoke construction.
            </p>
            
            {/* Instagram Link */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://instagram.com/rwy.se"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-neutral-300 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4 text-neutral-400" />
                <span>FOLLOW @RWY.SE</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 tracking-wider uppercase">
              <li>
                <button onClick={() => onNavigate('/shop')} className="hover:text-white transition-colors cursor-pointer">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/collections')} className="hover:text-white transition-colors cursor-pointer">
                  Collections
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/new-drops')} className="hover:text-white transition-colors cursor-pointer">
                  New Drops
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/wishlist')} className="hover:text-white transition-colors cursor-pointer">
                  Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Brand & Studio */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-white mb-4">
              RWYSE Studio
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 tracking-wider uppercase">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors cursor-pointer">
                  Brand Manifesto
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contact & Showroom
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/track')} className="hover:text-white transition-colors cursor-pointer">
                  Order Tracking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/account')} className="hover:text-white transition-colors cursor-pointer">
                  Customer Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Concierge & Policies */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-white mb-4">
              Assistance
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 tracking-wider">
              <li>
                <span className="text-neutral-500 uppercase tracking-wider block text-[10px]">Concierge Line</span>
                <span className="text-neutral-300 font-mono text-xs">+216 71 890 120</span>
              </li>
              <li>
                <span className="text-neutral-500 uppercase tracking-wider block text-[10px]">Payment</span>
                <span className="text-neutral-300">Cash on Delivery (COD)</span>
              </li>
              <li>
                <span className="text-neutral-500 uppercase tracking-wider block text-[10px]">Dispatch</span>
                <span className="text-neutral-300">Nationwide Express Transit</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Country */}
        <div className="mt-16 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} RWYSE STUDIOS. ALL RIGHTS RESERVED.</span>
            <button
              onClick={() => onNavigate('/admin')}
              className="text-neutral-800 hover:text-neutral-500 transition-colors p-1"
              title="Portail Privé"
              aria-label="Portail Privé"
            >
              <Shield className="w-2.5 h-2.5" />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <span>TUNISIA · NATIONWIDE COURIER (8 DT) · CASH ON DELIVERY</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
