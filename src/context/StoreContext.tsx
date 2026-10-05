import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Collection,
  CartItem,
  Order,
  Promotion,
  Advertisement,
  DeliveryZone,
  SiteSettings,
  AdminNotification,
  AuditLog,
} from '../types';
import {
  initialProducts,
  initialCollections,
  initialPromotions,
  initialDeliveryZones,
  initialAdvertisements,
  initialOrders,
  initialSiteSettings,
} from '../data/initialData';
import { db, doc, setDoc, deleteDoc } from '../firebase';

interface StoreContextType {
  products: Product[];
  collections: Collection[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  promotions: Promotion[];
  appliedPromo: Promotion | null;
  deliveryZones: DeliveryZone[];
  advertisements: Advertisement[];
  siteSettings: SiteSettings;
  notifications: AdminNotification[];
  auditLogs: AuditLog[];
  isCartOpen: boolean;
  quickViewProduct: Product | null;
  isSizeGuideOpen: boolean;
  toast: string | null;

  // Storefront actions
  addToCart: (product: Product, color: string, size: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'trackingSteps'>) => Order;
  trackOrderByNumber: (query: string) => Order | undefined;
  setIsCartOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setIsSizeGuideOpen: (open: boolean) => void;
  showToast: (message: string) => void;

  // Admin actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => Product | undefined;
  updateProductPrice: (id: string, price: number, salePrice?: number) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateDeliveryZone: (zone: DeliveryZone) => void;
  addPromotion: (promo: Omit<Promotion, 'id' | 'currentUses'>) => void;
  updatePromotion: (promo: Promotion) => void;
  deletePromotion: (id: string) => void;
  addAdvertisement: (ad: Omit<Advertisement, 'id'>) => void;
  updateAdvertisement: (ad: Advertisement) => void;
  deleteAdvertisement: (id: string) => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  updateInventoryStock: (productId: string, size: string, newStock: number) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  logAuditAction: (action: string, details: string, adminEmail?: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('rwyse_products_v6');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [collections, setCollections] = useState<Collection[]>(() => {
    const saved = localStorage.getItem('rwyse_collections_v6');
    return saved ? JSON.parse(saved) : initialCollections;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('rwyse_cart_v6');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('rwyse_wishlist_v6');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('rwyse_orders_v6');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const saved = localStorage.getItem('rwyse_promotions_v6');
    return saved ? JSON.parse(saved) : initialPromotions;
  });

  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);

  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(() => {
    const saved = localStorage.getItem('rwyse_delivery_zones_v6');
    return saved ? JSON.parse(saved) : initialDeliveryZones;
  });

  const [advertisements, setAdvertisements] = useState<Advertisement[]>(() => {
    const saved = localStorage.getItem('rwyse_advertisements_v6');
    return saved ? JSON.parse(saved) : initialAdvertisements;
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('rwyse_settings_v6');
    return saved ? JSON.parse(saved) : initialSiteSettings;
  });

  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    const saved = localStorage.getItem('rwyse_notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'notif-1',
        title: 'New Order Received',
        message: 'Order RWY-84921 placed by Sarra Mansour for 172 TND (COD)',
        type: 'order',
        timestamp: '10 mins ago',
        read: false,
        orderId: 'ord-102',
      },
      {
        id: 'notif-2',
        title: 'Low Stock Alert',
        message: 'RWYSE Club French Terry Sweatpant (Size L) has only 1 unit remaining.',
        type: 'stock',
        timestamp: '1 hour ago',
        read: false,
      }
    ];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('rwyse_audit_logs');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'log-init',
            action: 'System Initialization',
            details: 'RWYSE flagship e-commerce instance initialized in production mode',
            timestamp: new Date().toISOString(),
            adminEmail: 'system@rwyse.tn',
          },
        ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const logAuditAction = (action: string, details: string, adminEmail = 'admin@rwyse.tn') => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      details,
      timestamp: new Date().toISOString(),
      adminEmail,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Persist to Firestore asynchronously
    try {
      setDoc(doc(db, 'auditLogs', newLog.id), newLog).catch(() => {});
    } catch {}
  };

  useEffect(() => {
    localStorage.setItem('rwyse_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('rwyse_products_v6', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('rwyse_cart_v6', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('rwyse_wishlist_v6', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('rwyse_orders_v6', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('rwyse_promotions_v6', JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem('rwyse_delivery_zones_v6', JSON.stringify(deliveryZones));
  }, [deliveryZones]);

  useEffect(() => {
    localStorage.setItem('rwyse_advertisements_v6', JSON.stringify(advertisements));
  }, [advertisements]);

  useEffect(() => {
    localStorage.setItem('rwyse_settings_v6', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('rwyse_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Cart operations
  const addToCart = (product: Product, color: string, size: string, quantity = 1) => {
    const itemId = `${product.id}-${color}-${size}`;
    const priceToUse = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          product,
          selectedColor: color,
          selectedSize: size,
          quantity,
          price: priceToUse,
        },
      ];
    });

    showToast(`Added ${product.name} (${size} / ${color}) to bag.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed item from your saved pieces.');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved piece to your wishlist.');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Promotions
  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    const promo = promotions.find((p) => p.code.toUpperCase() === clean);

    if (!promo) {
      return { success: false, message: 'Invalid promotional code.' };
    }
    if (!promo.active) {
      return { success: false, message: 'This promotion is no longer active.' };
    }
    if (promo.currentUses >= promo.maxUses) {
      return { success: false, message: 'This promo code has reached its maximum usage limit.' };
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (subtotal < promo.minOrder) {
      return {
        success: false,
        message: `Order must be at least ${promo.minOrder} ${siteSettings.currency} to apply ${promo.code}.`,
      };
    }

    setAppliedPromo(promo);
    showToast(`Promotion ${promo.code} applied successfully!`);
    return { success: true, message: `Code ${promo.code} applied!` };
  };

  const removePromo = () => {
    setAppliedPromo(null);
    showToast('Promotion code removed.');
  };

  // Create Order
  const createOrder = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'trackingSteps'>
  ): Order => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `RWY-${randomNum}`;
    const now = new Date().toISOString();
    const orderId = `ord-${Date.now()}`;

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      orderNumber,
      createdAt: now,
      status: 'Pending',
      trackingSteps: [
        {
          status: 'Pending',
          title: 'Order Placed',
          desc: 'Order received and registered with RWYSE concierge',
          date: new Date().toLocaleString(),
          completed: true,
        },
        {
          status: 'Confirmed',
          title: 'Order Confirmation',
          desc: 'Concierge phone verification and packing authorization',
          date: 'Pending verification',
          completed: false,
        },
        {
          status: 'Preparing',
          title: 'Crafted & Boxed',
          desc: 'Garments inspected and sealed in matte black RWYSE bag',
          date: 'Pending',
          completed: false,
        },
        {
          status: 'Shipped',
          title: 'Dispatched for Delivery',
          desc: 'In transit with express logistics partner',
          date: 'Pending handover',
          completed: false,
        },
        {
          status: 'Delivered',
          title: 'Delivered to Recipient',
          desc: 'Cash collected upon delivery',
          date: 'Pending',
          completed: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Firestore async sync
    try {
      setDoc(doc(db, 'orders', newOrder.id), newOrder).catch(() => {});
    } catch {}

    logAuditAction(
      'Nouvelle Commande',
      `Commande ${orderNumber} enregistrée pour ${orderData.customerName} (${orderData.total} ${siteSettings.currency}) via Cash on Delivery`,
      'client@rwyse.tn'
    );

    // Deduct stock
    setProducts((prev) =>
      prev.map((prod) => {
        const matchingOrdered = orderData.items.filter((item) => item.productId === prod.id);
        if (matchingOrdered.length === 0) return prod;

        const updatedSizes = prod.sizes.map((s) => {
          const match = matchingOrdered.find((item) => item.size === s.size);
          if (match) {
            return { ...s, stock: Math.max(0, s.stock - match.quantity) };
          }
          return s;
        });

        const totalStock = updatedSizes.reduce((sum, s) => sum + s.stock, 0);
        return {
          ...prod,
          sizes: updatedSizes,
          isSoldOut: totalStock === 0,
        };
      })
    );

    // Increment promo uses if applied
    if (appliedPromo) {
      setPromotions((prev) =>
        prev.map((p) =>
          p.id === appliedPromo.id ? { ...p, currentUses: p.currentUses + 1 } : p
        )
      );
    }

    // Push Admin Notification
    const newNotif: AdminNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Order Received',
      message: `Order ${orderNumber} placed by ${orderData.customerName} for ${orderData.total} ${siteSettings.currency} (${orderData.region})`,
      type: 'order',
      timestamp: 'Just now',
      read: false,
      orderId: newOrder.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    clearCart();
    setAppliedPromo(null);

    return newOrder;
  };

  const trackOrderByNumber = (query: string): Order | undefined => {
    const q = query.trim().toLowerCase();
    return orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === q ||
        o.customerPhone.replace(/\s+/g, '') === q.replace(/\s+/g, '') ||
        o.customerEmail.toLowerCase() === q
    );
  };

  // Admin Product Actions
  const addProduct = (productInput: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newId = `rwy-${Date.now().toString().slice(-4)}`;
    const newProduct: Product = {
      ...productInput,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added product "${newProduct.name}" to catalog.`);
    return newProduct;
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Updated product "${updated.name}".`);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog.');
  };

  const duplicateProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return undefined;

    const duplicated: Product = {
      ...target,
      id: `rwy-${Date.now().toString().slice(-4)}`,
      name: `${target.name} (Copy)`,
      slug: `${target.slug}-copy-${Date.now().toString().slice(-3)}`,
      sku: `${target.sku}-CP`,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [duplicated, ...prev]);
    showToast(`Duplicated product "${target.name}".`);
    return duplicated;
  };

  const updateProductPrice = (id: string, price: number, salePrice?: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price, salePrice } : p))
    );
    showToast('Price updated successfully.');
  };

  const updateInventoryStock = (productId: string, sizeName: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedSizes = p.sizes.map((s) =>
          s.size === sizeName ? { ...s, stock: Math.max(0, newStock) } : s
        );
        const totalStock = updatedSizes.reduce((sum, s) => sum + s.stock, 0);
        return {
          ...p,
          sizes: updatedSizes,
          isSoldOut: totalStock === 0,
        };
      })
    );
    showToast('Inventory stock updated.');
  };

  // Admin Order Actions
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const statusSequence: Order['status'][] = [
          'Pending',
          'Confirmed',
          'Preparing',
          'Shipped',
          'Delivered',
        ];

        const targetIndex = statusSequence.indexOf(newStatus);

        const updatedSteps = order.trackingSteps.map((step) => {
          if (newStatus === 'Cancelled') {
            return step.status === 'Cancelled'
              ? { ...step, completed: true, date: new Date().toLocaleString() }
              : step;
          }
          const stepIndex = statusSequence.indexOf(step.status);
          const isDone = stepIndex <= targetIndex;
          return {
            ...step,
            completed: isDone,
            date: isDone && step.date.includes('Pending') ? new Date().toLocaleString() : step.date,
          };
        });

        return {
          ...order,
          status: newStatus,
          trackingSteps: updatedSteps,
        };
      })
    );

    const notif: AdminNotification = {
      id: `notif-${Date.now()}`,
      title: 'Order Status Changed',
      message: `Order status for ${orderId} updated to "${newStatus}".`,
      type: newStatus === 'Cancelled' ? 'cancel' : 'order',
      timestamp: 'Just now',
      read: false,
      orderId,
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Order status updated to "${newStatus}".`);
  };

  // Delivery Zones
  const updateDeliveryZone = (zone: DeliveryZone) => {
    setDeliveryZones((prev) =>
      prev.map((z) => (z.id === zone.id ? zone : z))
    );
    showToast(`Delivery zone "${zone.region}" updated.`);
  };

  // Promotions CRUD
  const addPromotion = (promoInput: Omit<Promotion, 'id' | 'currentUses'>) => {
    const newPromo: Promotion = {
      ...promoInput,
      id: `promo-${Date.now()}`,
      currentUses: 0,
    };
    setPromotions((prev) => [newPromo, ...prev]);
    showToast(`Created promotion code "${newPromo.code}".`);
  };

  const updatePromotion = (updated: Promotion) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    showToast(`Promotion "${updated.code}" updated.`);
  };

  const deletePromotion = (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    showToast('Promotion code deleted.');
  };

  // Advertisements CRUD
  const addAdvertisement = (adInput: Omit<Advertisement, 'id'>) => {
    const newAd: Advertisement = {
      ...adInput,
      id: `ad-${Date.now()}`,
    };
    setAdvertisements((prev) => [newAd, ...prev]);
    showToast('Advertisement created.');
  };

  const updateAdvertisement = (updated: Advertisement) => {
    setAdvertisements((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
    showToast('Advertisement updated.');
  };

  const deleteAdvertisement = (id: string) => {
    setAdvertisements((prev) => prev.filter((a) => a.id !== id));
    showToast('Advertisement deleted.');
  };

  // Site Settings
  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...settings }));
    showToast('Store settings saved.');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('All notifications cleared.');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        collections,
        cart,
        wishlist,
        orders,
        promotions,
        appliedPromo,
        deliveryZones,
        advertisements,
        siteSettings,
        notifications,
        isCartOpen,
        quickViewProduct,
        isSizeGuideOpen,
        toast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyPromo,
        removePromo,
        createOrder,
        trackOrderByNumber,
        setIsCartOpen,
        setQuickViewProduct,
        setIsSizeGuideOpen,
        showToast,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        updateProductPrice,
        updateOrderStatus,
        updateDeliveryZone,
        addPromotion,
        updatePromotion,
        deletePromotion,
        addAdvertisement,
        updateAdvertisement,
        deleteAdvertisement,
        updateSiteSettings,
        updateInventoryStock,
        markNotificationRead,
        clearNotifications,
        auditLogs,
        logAuditAction,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
