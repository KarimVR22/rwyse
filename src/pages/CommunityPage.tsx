import React, { useState } from 'react';
import { ArrowRight, Instagram, Users, Sparkles, MapPin, Calendar, Check } from 'lucide-react';
import { RwyseLogo } from '../components/common/RwyseLogo';

interface CommunityPageProps {
  onNavigate: (path: string) => void;
  onNavigateToProduct: (slug: string) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ onNavigate, onNavigateToProduct }) => {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setJoined(true);
    setEmail('');
  };

  const communityGalleries = [
    {
      author: '@karim_streetwear',
      city: 'Tunis',
      caption: '567 Royal Blue Box Hoodie worn oversized at Carthage amphitheater.',
      tag: '#RWYSE_COLLECTIVE',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    },
    {
      author: '@yassine.arch',
      city: 'La Marsa',
      caption: 'Curved balloon joggers stacking cleanly with raw leather boots.',
      tag: '#RWYSE_SILHOUETTE',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    },
    {
      author: '@selim_grind',
      city: 'Sousse',
      caption: 'Medina Raw Archive ringer tee in contrast navy.',
      tag: '#RISE_WITH_YOU',
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
    },
    {
      author: '@nour_vision',
      city: 'Tunis Lac 2',
      caption: 'Architectural mockneck heavy cotton drape in optic raw white.',
      tag: '#RWYSE_COMMUNITY',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-24 antialiased">
      {/* Hero Statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="border-b border-neutral-800 pb-12">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 mb-3">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span>COMMUNITY // COLLECTIVE DISCIPLINE</span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold uppercase tracking-tight text-white mb-6">
            RISE WITH YOU
          </h1>
          <p className="max-w-2xl text-neutral-400 text-sm sm:text-base font-light leading-relaxed">
            RWYSE n'est pas simplement un label vestimentaire. C'est un mouvement contemporain qui réunit créateurs, athlètes et esprits audacieux autour de coupes architecturales radicales et d'une rigueur absolue.
          </p>
        </div>

        {/* Community Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-b border-neutral-800">
          <div className="bg-[#101015] border border-neutral-800 p-8 space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              01 // THE MANIFESTO
            </div>
            <h3 className="text-xl font-bold uppercase text-white tracking-wider">
              Discipline & Élévation
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Chaque silhouette 500 GSM est façonnée pour vous accompagner dans votre quotidien le plus exigeant. Pas de compromis sur la matière, ni sur la structure.
            </p>
          </div>

          <div className="bg-[#101015] border border-neutral-800 p-8 space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              02 // EXCLUSIVE ACCESS
            </div>
            <h3 className="text-xl font-bold uppercase text-white tracking-wider">
              Drops Confidentiels
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Les membres du collectif reçoivent les annonces de drops numérotés 24 heures avant l'ouverture publique et peuvent réserver leurs pièces en avant-première.
            </p>
          </div>

          <div className="bg-[#101015] border border-neutral-800 p-8 space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
              03 // COURIER COD
            </div>
            <h3 className="text-xl font-bold uppercase text-white tracking-wider">
              Confiance Totale
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Expédition expresse à 8 DT partout en Tunisie avec inspection du colis et règlement en espèces à la livraison. Zéro friction, 100% de sérénité.
            </p>
          </div>
        </div>

        {/* Lookbook Collective UGC Feed */}
        <div className="pt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                STREET ARCHIVE // WORLDWIDE
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white">
                Styled by The Community
              </h2>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>@rwyse.tn · Tag #RWYSE</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityGalleries.map((item, idx) => (
              <div
                key={idx}
                className="group relative bg-[#111116] border border-neutral-800 overflow-hidden"
              >
                <div className="aspect-3/4 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.caption}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale contrast-110 group-hover:grayscale-0"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-white font-bold">{item.author}</span>
                    <span className="text-neutral-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.city}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2 font-light">
                    {item.caption}
                  </p>
                  <span className="text-[10px] font-mono text-blue-400 block">
                    {item.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join the Collective Club */}
        <div className="mt-20 bg-neutral-900/60 border border-neutral-800 p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <RwyseLogo className="h-6 w-auto text-white mx-auto mb-4" />
          <h3 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white mb-2">
            Rejoindre Le Collectif RWYSE
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mb-6 font-light">
            Inscrivez-vous pour accéder aux lookbooks secrets, aux invitations pour les pop-ups et aux réassorts prioritaires.
          </p>

          {joined ? (
            <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>Vous faites désormais partie du collectif RWYSE</span>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Entrez votre email personnel"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-black border border-neutral-800 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-white font-mono"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Rejoindre
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
