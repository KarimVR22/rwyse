import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Advertisement } from '../../types';
import { Plus, Megaphone, Trash2, Edit3, X, Check } from 'lucide-react';
import { heroImg, editorialImg, hoodieImg } from '../../data/initialData';

export const AdminAdvertisements: React.FC = () => {
  const { advertisements, addAdvertisement, updateAdvertisement, deleteAdvertisement } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('SHOP NOW');
  const [ctaLink, setCtaLink] = useState('/shop');
  const [image, setImage] = useState(heroImg);
  const [placement, setPlacement] = useState<Advertisement['placement']>('hero');
  const [active, setActive] = useState(true);

  const handleOpenAdd = () => {
    setTitle('AUTUMN STREETWEAR DROP');
    setSubtitle('Limited run architectural heavyweight layers.');
    setCtaText('SHOP NOW');
    setCtaLink('/new-drops');
    setImage(heroImg);
    setPlacement('hero');
    setActive(true);
    setEditingAd(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ad: Advertisement) => {
    setTitle(ad.title);
    setSubtitle(ad.subtitle);
    setCtaText(ad.ctaText);
    setCtaLink(ad.ctaLink);
    setImage(ad.image);
    setPlacement(ad.placement);
    setActive(ad.active);
    setEditingAd(ad);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingAd) {
      updateAdvertisement({
        ...editingAd,
        title,
        subtitle,
        ctaText,
        ctaLink,
        image,
        placement,
        active,
      });
    } else {
      addAdvertisement({
        title,
        subtitle,
        ctaText,
        ctaLink,
        image,
        placement,
        active,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400 block mb-1">
            CAMPAIGN PLACEMENTS // PROMOTIONAL SURFACES
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-white tracking-tight">
            Banner & Advertisement Control
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-light">
            Deploy and schedule promotional banners across the Homepage hero, Shop catalog, product pages, or announcement bars.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Create Advertisement</span>
        </button>
      </div>

      {/* Ads Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advertisements.map((ad) => (
          <div
            key={ad.id}
            className="bg-[#111116] border border-neutral-800 overflow-hidden flex flex-col justify-between"
          >
            {/* Visual Preview */}
            <div className="relative aspect-video bg-neutral-900 border-b border-neutral-800 overflow-hidden">
              <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute top-3 left-3 bg-black/85 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-white border border-white/20">
                {ad.placement.replace('_', ' ')}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase text-white tracking-wide">
                  {ad.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {ad.subtitle}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs font-mono text-neutral-300">
                  <span className="text-neutral-500 uppercase">CTA:</span>
                  <span className="font-semibold text-white">"{ad.ctaText}" → {ad.ctaLink}</span>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <button
                  onClick={() => updateAdvertisement({ ...ad, active: !ad.active })}
                  className={`px-3 py-1 text-[11px] font-mono uppercase tracking-wider border cursor-pointer ${
                    ad.active
                      ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                      : 'bg-neutral-900 border-neutral-700 text-neutral-500'
                  }`}
                >
                  {ad.active ? 'Active' : 'Disabled'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(ad)}
                    className="p-1.5 text-neutral-400 hover:text-white cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteAdvertisement(ad.id)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
            <div className="relative w-full max-w-lg bg-[#111116] border border-neutral-800 text-neutral-100 shadow-2xl p-6 sm:p-8 z-10 space-y-6">
              
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                  {editingAd ? 'Edit Banner Placement' : 'Create Banner Campaign'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1">Banner Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-neutral-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1">Subtitle / Copy</label>
                  <textarea
                    rows={2}
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-neutral-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider block mb-1">Button Text</label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 uppercase tracking-wider block mb-1">Target Route</label>
                    <input
                      type="text"
                      value={ctaLink}
                      onChange={(e) => setCtaLink(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 uppercase tracking-wider block mb-1">Placement Target</label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white uppercase focus:outline-none"
                  >
                    <option value="hero">Homepage Hero Banner</option>
                    <option value="shop_banner">Catalog Top Banner</option>
                    <option value="popup">Entry Promo Modal</option>
                    <option value="announcement_bar">Announcement Bar</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="adActive"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="rounded-xs"
                  />
                  <label htmlFor="adActive" className="text-xs uppercase text-neutral-300 cursor-pointer">
                    Active / Live on Storefront
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-white text-black font-bold uppercase tracking-wider hover:bg-neutral-200 cursor-pointer"
                  >
                    Save Banner
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
