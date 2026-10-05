import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, ArrowRight } from 'lucide-react';

export const AnnouncementBar: React.FC<{ onNavigateToShop?: () => void }> = ({ onNavigateToShop }) => {
  const { siteSettings } = useStore();
  const [dismissed, setDismissed] = useState(false);

  if (!siteSettings.announcementActive || !siteSettings.announcementText || dismissed) {
    return null;
  }

  return (
    <aside aria-label="Announcement" className="h-9 bg-[#111115] border-b border-neutral-800 text-neutral-300 text-xs px-4 flex items-center justify-between z-50 select-none">
      <div className="flex-1 flex items-center justify-center space-x-3 overflow-hidden text-center">
        <span className="font-medium tracking-wider text-[11px] truncate uppercase">
          {siteSettings.announcementText}
        </span>
        {onNavigateToShop && (
          <button
            onClick={onNavigateToShop}
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-100 hover:text-white underline underline-offset-4 tracking-wider uppercase whitespace-nowrap cursor-pointer"
          >
            <span>Explore</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-neutral-400 hover:text-neutral-100 p-1 transition-colors cursor-pointer"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
