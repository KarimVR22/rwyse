/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { SizeGuideModal } from './components/common/SizeGuideModal';
import { SearchModal } from './components/common/SearchModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { NewDropsPage } from './pages/NewDropsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AccountPage } from './pages/AccountPage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { CommunityPage } from './pages/CommunityPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { toast } = useStore();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.hash ? window.location.hash.replace('#', '') : '/';
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');

  // Handle browser back/forward and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentPath(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderPlaced = (orderId: string) => {
    setConfirmedOrderId(orderId);
    navigate(`/order-confirmed?id=${orderId}`);
  };

  // Determine if in Admin domain
  const isAdmin = currentPath.startsWith('/admin');

  // Route matching
  const renderPage = () => {
    if (isAdmin) {
      return <AdminDashboard onExitAdmin={() => navigate('/')} />;
    }

    if (currentPath === '/' || currentPath === '') {
      return (
        <HomePage
          onNavigate={navigate}
          onNavigateToProduct={(slug) => navigate(`/product/${slug}`)}
        />
      );
    }

    if (currentPath === '/shop') {
      return <ShopPage onNavigateToProduct={(slug) => navigate(`/product/${slug}`)} />;
    }

    if (currentPath.startsWith('/product/')) {
      const slug = currentPath.replace('/product/', '').split('?')[0];
      return (
        <ProductDetailPage
          slug={slug}
          onNavigateToProduct={(newSlug) => navigate(`/product/${newSlug}`)}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath === '/collections') {
      return (
        <CollectionsPage
          onNavigateToProduct={(slug) => navigate(`/product/${slug}`)}
          onNavigateToShop={() => navigate('/shop')}
        />
      );
    }

    if (currentPath === '/new-drops') {
      return (
        <NewDropsPage
          onNavigateToProduct={(slug) => navigate(`/product/${slug}`)}
          onNavigateToShop={() => navigate('/shop')}
        />
      );
    }

    if (currentPath === '/cart') {
      return (
        <CartPage
          onNavigate={navigate}
          onNavigateToProduct={(slug) => navigate(`/product/${slug}`)}
        />
      );
    }

    if (currentPath === '/checkout') {
      return (
        <CheckoutPage
          onNavigate={navigate}
          onOrderPlaced={handleOrderPlaced}
        />
      );
    }

    if (currentPath.startsWith('/order-confirmed')) {
      const params = new URLSearchParams(currentPath.includes('?') ? currentPath.split('?')[1] : '');
      const targetId = params.get('id') || confirmedOrderId;
      return (
        <OrderConfirmationPage
          orderId={targetId}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath.startsWith('/track')) {
      const params = new URLSearchParams(currentPath.includes('?') ? currentPath.split('?')[1] : '');
      const orderParam = params.get('order') || '';
      return (
        <OrderTrackingPage
          initialOrderNumber={orderParam}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath === '/account') {
      return (
        <AccountPage
          onNavigate={navigate}
          onNavigateToProduct={(slug) => navigate(`/product/${slug}`)}
        />
      );
    }

    if (currentPath === '/wishlist') {
      return (
        <WishlistPage
          onNavigateToProduct={(slug) => navigate(`/product/${slug}`)}
          onNavigateToShop={() => navigate('/shop')}
        />
      );
    }

    if (currentPath === '/community') {
      return (
        <CommunityPage
          onNavigate={navigate}
          onNavigateToProduct={(slug) => navigate(`/product/${slug}`)}
        />
      );
    }

    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    return <NotFoundPage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-neutral-100 flex flex-col font-sans selection:bg-white selection:text-black">
      
      {/* Customer Header Surfaces (Hidden on Admin) */}
      {!isAdmin && (
        <>
          <AnnouncementBar onNavigateToShop={() => navigate('/shop')} />
          <Navbar
            currentPath={currentPath}
            onNavigate={navigate}
            onOpenSearch={() => setSearchOpen(true)}
          />
        </>
      )}

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        <motion.div
          key={currentPath.split('?')[0]}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          {renderPage()}
        </motion.div>
      </main>

      {/* Customer Footer (Hidden on Admin) */}
      {!isAdmin && <Footer onNavigate={navigate} />}

      {/* Global Modals & Drawers */}
      <CartDrawer onNavigate={navigate} />
      <QuickViewModal onNavigateToProduct={(slug) => navigate(`/product/${slug}`)} />
      <SizeGuideModal />
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigateToProduct={(slug) => navigate(`/product/${slug}`)}
        onNavigateToShop={() => navigate('/shop')}
      />

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141419] border border-neutral-700 text-white text-xs font-mono px-4 py-3 shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
