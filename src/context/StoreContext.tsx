import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
import {
  db,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  collection,
  onSnapshot,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import { compressImageIfNeeded, sanitizeForFirestore } from '../utils/imageCompressor';

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
  isCloudSynced: boolean;
  isRefreshingOrders: boolean;
  isSyncingCatalog: boolean;

  // Storefront actions
  addToCart: (product: Product, color: string, size: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'trackingSteps'>) => Promise<Order>;
  deleteOrder: (orderId: string) => Promise<void>;
  refreshOrdersFromCloud: () => Promise<void>;
  trackOrderByNumber: (query: string) => Order | undefined;
  setIsCartOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setIsSizeGuideOpen: (open: boolean) => void;
  showToast: (message: string) => void;

  // Order & Customer management
  adminSelectedOrderId: string | null;
  setAdminSelectedOrderId: (orderId: string | null) => void;
  deleteCustomer: (customerKey: string, deleteOrders?: boolean) => Promise<void>;

  // Admin actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => Product | undefined;
  updateProductPrice: (id: string, price: number, salePrice?: number) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
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
  syncAllProductsToCloud: () => Promise<void>;
  importProducts: (newProducts: Omit<Product, 'id' | 'createdAt'>[]) => Promise<Product[]>;
  clearAllDemoOrders: () => Promise<void>;
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

  const [deletedProductIds, setDeletedProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rwyse_deleted_product_ids_v6');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deletedOrderIds, setDeletedOrderIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rwyse_deleted_order_ids_v6');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deletedCustomerKeys, setDeletedCustomerKeys] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rwyse_deleted_customer_keys_v6');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isSyncingCatalog, setIsSyncingCatalog] = useState<boolean>(false);
  const [adminSelectedOrderId, setAdminSelectedOrderId] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const savedDeleted = localStorage.getItem('rwyse_deleted_order_ids_v6');
      const deletedSet = new Set<string>(savedDeleted ? JSON.parse(savedDeleted) : []);
      const savedDeletedCust = localStorage.getItem('rwyse_deleted_customer_keys_v6');
      const deletedCustList: string[] = savedDeletedCust ? JSON.parse(savedDeletedCust) : [];
      const deletedCustSet = new Set(deletedCustList.map((k) => k.replace(/\s+/g, '').toLowerCase()));

      const saved = localStorage.getItem('rwyse_orders_v6');
      let currentOrders: Order[] = saved ? JSON.parse(saved) : [];

      // Filter out any explicitly deleted orders or customers
      return currentOrders.filter((o) => {
        if (deletedSet.has(o.id)) return false;
        const phoneKey = (o.customerPhone || '').replace(/\s+/g, '').toLowerCase();
        const emailKey = (o.customerEmail || '').trim().toLowerCase();
        const nameKey = (o.customerName || '').trim().toLowerCase();
        if (deletedCustSet.has(phoneKey) || deletedCustSet.has(emailKey) || deletedCustSet.has(nameKey)) return false;
        return true;
      });
    } catch {
      return [];
    }
  });

  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const [isRefreshingOrders, setIsRefreshingOrders] = useState<boolean>(false);

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
    try {
      const saved = localStorage.getItem('rwyse_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
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

  // Audio notification chime using Web Audio API (cross-browser, zero external files)
  const playOrderChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {}
  };

  const isInitialOrdersSnapshot = useRef(true);
  const knownOrderIds = useRef<Set<string>>(new Set());

  // Real-time Firestore sync for Orders (Receives orders from ALL external devices instantly)
  useEffect(() => {
    const ordersCol = collection(db, 'orders');
    const unsubscribe = onSnapshot(
      ordersCol,
      (snapshot) => {
        const savedDeleted = localStorage.getItem('rwyse_deleted_order_ids_v6');
        const deletedSet = new Set<string>(savedDeleted ? JSON.parse(savedDeleted) : []);
        const savedDeletedCust = localStorage.getItem('rwyse_deleted_customer_keys_v6');
        const deletedCustList: string[] = savedDeletedCust ? JSON.parse(savedDeletedCust) : [];
        const deletedCustSet = new Set(deletedCustList.map((k) => k.replace(/\s+/g, '').toLowerCase()));

        const loaded: Order[] = [];
        const newlyArrivedOrders: Order[] = [];

        if (!snapshot.empty) {
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Order;
            if (data && data.orderNumber) {
              const ordId = data.id || docSnap.id;
              const phoneKey = (data.customerPhone || '').replace(/\s+/g, '').toLowerCase();
              const emailKey = (data.customerEmail || '').trim().toLowerCase();
              const nameKey = (data.customerName || '').trim().toLowerCase();
              if (!deletedSet.has(ordId) && !deletedCustSet.has(phoneKey) && !deletedCustSet.has(emailKey) && !deletedCustSet.has(nameKey)) {
                const completeOrder: Order = {
                  ...data,
                  id: ordId,
                };
                loaded.push(completeOrder);

                if (!isInitialOrdersSnapshot.current && !knownOrderIds.current.has(ordId)) {
                  newlyArrivedOrders.push(completeOrder);
                }
              }
            }
          });

          // Sort by creation date descending
          loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        // Update known IDs set
        loaded.forEach((o) => knownOrderIds.current.add(o.id));

        // If new real orders arrived from external devices, ring chime and notify admin!
        if (!isInitialOrdersSnapshot.current && newlyArrivedOrders.length > 0) {
          playOrderChime();
          newlyArrivedOrders.forEach((newOrd) => {
            const notif: AdminNotification = {
              id: `notif-${Date.now()}-${Math.random().toString().slice(2, 6)}`,
              title: '🔥 Nouvelle Commande Client Réelle !',
              message: `Commande #${newOrd.orderNumber} reçue de ${newOrd.customerName} (${newOrd.total} ${siteSettings.currency}) - ${newOrd.region}`,
              type: 'order',
              timestamp: 'À l\'instant',
              read: false,
              orderId: newOrd.id,
            };
            setNotifications((prev) => [notif, ...prev]);
            showToast(`🔥 NOUVELLE COMMANDE REÇUE : #${newOrd.orderNumber} (${newOrd.customerName})`);
          });
        }

        isInitialOrdersSnapshot.current = false;
        setOrders(loaded);
        localStorage.setItem('rwyse_orders_v6', JSON.stringify(loaded));
        setIsCloudSynced(true);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'orders');
        setIsCloudSynced(false);
      }
    );

    return () => unsubscribe();
  }, [siteSettings.currency]);

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

  // Real-time Firestore sync for Products (Instant live synchronization across ALL clients)
  useEffect(() => {
    const productsCol = collection(db, 'products');
    const unsubscribe = onSnapshot(
      productsCol,
      (snapshot) => {
        const savedDeleted = localStorage.getItem('rwyse_deleted_product_ids_v6');
        const deletedSet = new Set<string>(savedDeleted ? JSON.parse(savedDeleted) : []);

        if (!snapshot.empty) {
          const loaded: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Product;
            if (data && data.name) {
              const pId = data.id || docSnap.id;
              if (!deletedSet.has(pId)) {
                loaded.push({
                  ...data,
                  id: pId,
                });
              }
            }
          });

          if (loaded.length > 0) {
            setProducts(loaded);
            localStorage.setItem('rwyse_products_v6', JSON.stringify(loaded));
            setIsCloudSynced(true);
          }
        } else {
          // If Firestore 'products' collection is completely empty, seed it with catalog so all external clients get it
          const seedProducts = async () => {
            try {
              const saved = localStorage.getItem('rwyse_products_v6');
              const toSeed: Product[] = saved ? JSON.parse(saved) : initialProducts;
              for (const p of toSeed) {
                if (!deletedSet.has(p.id)) {
                  const cleanP = sanitizeForFirestore(p);
                  await setDoc(doc(db, 'products', p.id), cleanP);
                }
              }
              setIsCloudSynced(true);
            } catch (err) {
              console.warn('Seeding products note:', err);
            }
          };
          seedProducts();
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'products');
        setIsCloudSynced(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for Delivery Zones
  useEffect(() => {
    const zonesCol = collection(db, 'deliveryZones');
    const unsubscribe = onSnapshot(
      zonesCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: DeliveryZone[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as DeliveryZone;
            if (data && data.region) {
              loaded.push({ ...data, id: data.id || docSnap.id });
            }
          });
          setDeliveryZones(loaded);
          localStorage.setItem('rwyse_delivery_zones_v6', JSON.stringify(loaded));
        } else {
          for (const zone of initialDeliveryZones) {
            setDoc(doc(db, 'deliveryZones', zone.id), zone).catch(() => {});
          }
        }
      },
      (error) => console.warn('Delivery zones listener note:', error)
    );

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for Promotions
  useEffect(() => {
    const promoCol = collection(db, 'promotions');
    const unsubscribe = onSnapshot(
      promoCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Promotion[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Promotion;
            if (data && data.code) {
              loaded.push({ ...data, id: data.id || docSnap.id });
            }
          });
          setPromotions(loaded);
          localStorage.setItem('rwyse_promotions_v6', JSON.stringify(loaded));
        } else {
          for (const promo of initialPromotions) {
            setDoc(doc(db, 'promotions', promo.id), promo).catch(() => {});
          }
        }
      },
      (error) => console.warn('Promotions listener note:', error)
    );

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for Advertisements
  useEffect(() => {
    const adsCol = collection(db, 'advertisements');
    const unsubscribe = onSnapshot(
      adsCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Advertisement[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Advertisement;
            if (data && data.title) {
              loaded.push({ ...data, id: data.id || docSnap.id });
            }
          });
          setAdvertisements(loaded);
          localStorage.setItem('rwyse_advertisements_v6', JSON.stringify(loaded));
        } else {
          for (const ad of initialAdvertisements) {
            setDoc(doc(db, 'advertisements', ad.id), ad).catch(() => {});
          }
        }
      },
      (error) => console.warn('Advertisements listener note:', error)
    );

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for Site Settings (Hero, Spotlights, Lookbook & CMS Images)
  useEffect(() => {
    const settingsDoc = doc(db, 'settings', 'global');
    const unsubscribe = onSnapshot(
      settingsDoc,
      (docSnap) => {
        if (docSnap.exists()) {
          const remoteSettings = docSnap.data() as Partial<SiteSettings>;
          if (remoteSettings && Object.keys(remoteSettings).length > 0) {
            setSiteSettings((prev) => ({ ...prev, ...remoteSettings }));
            localStorage.setItem('rwyse_settings_v6', JSON.stringify({ ...initialSiteSettings, ...remoteSettings }));
          }
        } else {
          setDoc(doc(db, 'settings', 'global'), initialSiteSettings).catch(() => {});
        }
      },
      (error) => {
        console.warn('Real-time settings listener note:', error);
      }
    );

    return () => unsubscribe();
  }, []);

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
  const createOrder = async (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'trackingSteps'>
  ): Promise<Order> => {
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

    // Immediate local update so user UI is updated immediately
    setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);

    // Firestore persistent sync
    try {
      const cleanOrder = sanitizeForFirestore(newOrder);
      await setDoc(doc(db, 'orders', cleanOrder.id), cleanOrder);
      console.log('Order successfully persisted to Firestore:', cleanOrder.id, cleanOrder.orderNumber);
    } catch (err) {
      console.error('Firestore createOrder error:', err);
      handleFirestoreError(err, OperationType.CREATE, `orders/${newOrder.id}`);
    }

    logAuditAction(
      'Nouvelle Commande',
      `Commande ${orderNumber} enregistrée pour ${orderData.customerName} (${orderData.total} ${siteSettings.currency}) via Cash on Delivery`,
      orderData.customerEmail || 'client@rwyse.tn'
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

  // Admin Product Actions (Fully Synchronized Live with Firestore for All Devices)
  const addProduct = (productInput: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newId = `rwy-${Date.now().toString().slice(-4)}`;
    const newProduct: Product = {
      ...productInput,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    // Instant local state update
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Produit "${newProduct.name}" ajouté et synchronisé en direct !`);

    // Async persistent sync to Firestore
    (async () => {
      try {
        const sanitizedColors = await Promise.all(
          (newProduct.colors || []).map(async (c) => {
            const compressedImages = await Promise.all(
              (c.images || []).map((img) => compressImageIfNeeded(img))
            );
            return {
              ...c,
              images: compressedImages,
            };
          })
        );
        const toSave: Product = sanitizeForFirestore({
          ...newProduct,
          colors: sanitizedColors,
        });
        await setDoc(doc(db, 'products', toSave.id), toSave);
        console.log('Product persisted to Firestore:', toSave.id);
      } catch (err) {
        console.error('Firestore addProduct error:', err);
        handleFirestoreError(err, OperationType.CREATE, `products/${newProduct.id}`);
      }
    })();

    return newProduct;
  };

  const updateProduct = async (updated: Product) => {
    // 1. Instant optimistic update
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Produit "${updated.name}" mis à jour en direct pour tous les clients !`);

    // 2. Persist to Firestore with compressed images
    try {
      const sanitizedColors = await Promise.all(
        (updated.colors || []).map(async (c) => {
          const compressedImages = await Promise.all(
            (c.images || []).map((img) => compressImageIfNeeded(img))
          );
          return {
            ...c,
            images: compressedImages,
          };
        })
      );
      const toSave: Product = sanitizeForFirestore({
        ...updated,
        colors: sanitizedColors,
      });
      await setDoc(doc(db, 'products', toSave.id), toSave);
      console.log('Product update persisted to Firestore:', toSave.id);
    } catch (err) {
      console.error('Firestore updateProduct error:', err);
      handleFirestoreError(err, OperationType.UPDATE, `products/${updated.id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    // 1. Mark as deleted persistently
    setDeletedProductIds((prev) => {
      const updated = Array.from(new Set([...prev, id]));
      localStorage.setItem('rwyse_deleted_product_ids_v6', JSON.stringify(updated));
      return updated;
    });

    // 2. Instant local removal
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Produit retiré du catalogue en direct.');

    // 3. Delete from Firestore
    try {
      await deleteDoc(doc(db, 'products', id));
      console.log('Product deleted from Firestore:', id);
    } catch (err) {
      console.warn('Firestore deleteProduct error:', err);
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
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
    showToast(`Dupliqué : "${target.name}". Synchronisé.`);

    (async () => {
      try {
        await setDoc(doc(db, 'products', duplicated.id), duplicated);
      } catch (e) {
        console.warn('Duplicate product firestore error:', e);
      }
    })();

    return duplicated;
  };

  const updateProductPrice = async (id: string, price: number, salePrice?: number) => {
    let updatedObj: Product | undefined;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const upd = { ...p, price, salePrice };
          updatedObj = upd;
          return upd;
        }
        return p;
      })
    );
    showToast('Prix mis à jour en direct pour tous les clients !');

    if (updatedObj) {
      try {
        await setDoc(doc(db, 'products', id), updatedObj, { merge: true });
      } catch (err) {
        console.warn('Update price firestore note:', err);
      }
    }
  };

  const updateInventoryStock = async (productId: string, sizeName: string, newStock: number) => {
    let updatedObj: Product | undefined;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedSizes = p.sizes.map((s) =>
          s.size === sizeName ? { ...s, stock: Math.max(0, newStock) } : s
        );
        const totalStock = updatedSizes.reduce((sum, s) => sum + s.stock, 0);
        const upd = {
          ...p,
          sizes: updatedSizes,
          isSoldOut: totalStock === 0,
        };
        updatedObj = upd;
        return upd;
      })
    );
    showToast('Stock inventaire mis à jour en direct.');

    if (updatedObj) {
      try {
        await setDoc(doc(db, 'products', productId), updatedObj, { merge: true });
      } catch (err) {
        console.warn('Update stock firestore note:', err);
      }
    }
  };

  // Full manual push of all catalog products to Firestore cloud
  const syncAllProductsToCloud = async () => {
    setIsSyncingCatalog(true);
    try {
      for (const prod of products) {
        const sanitizedColors = await Promise.all(
          (prod.colors || []).map(async (c) => {
            const compressedImages = await Promise.all(
              (c.images || []).map((img) => compressImageIfNeeded(img))
            );
            return {
              ...c,
              images: compressedImages,
            };
          })
        );
        const toSave: Product = sanitizeForFirestore({
          ...prod,
          colors: sanitizedColors,
        });
        await setDoc(doc(db, 'products', toSave.id), toSave);
      }
      setIsCloudSynced(true);
      showToast(`Catalogue entier (${products.length} articles) synchronisé avec succès sur le Cloud Firestore !`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'products');
      showToast('Erreur de synchronisation Cloud.');
    } finally {
      setIsSyncingCatalog(false);
    }
  };

  // Bulk import products and publish directly to Firestore
  const importProducts = async (newItems: Omit<Product, 'id' | 'createdAt'>[]): Promise<Product[]> => {
    setIsSyncingCatalog(true);
    const createdList: Product[] = [];
    try {
      for (const item of newItems) {
        const newId = `rwy-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 900 + 100)}`;
        const sanitizedColors = await Promise.all(
          (item.colors || []).map(async (c) => {
            const compressedImages = await Promise.all(
              (c.images || []).map((img) => compressImageIfNeeded(img))
            );
            return {
              ...c,
              images: compressedImages,
            };
          })
        );
        const newProd: Product = sanitizeForFirestore({
          ...item,
          id: newId,
          colors: sanitizedColors,
          createdAt: new Date().toISOString(),
        });
        createdList.push(newProd);
        await setDoc(doc(db, 'products', newProd.id), newProd);
      }

      setProducts((prev) => [...createdList, ...prev]);
      logAuditAction('Import Catalogue', `${createdList.length} produit(s) importé(s) et publié(s) sur le Cloud.`);
      showToast(`${createdList.length} produit(s) importé(s) et publié(s) avec succès !`);
      return createdList;
    } catch (err) {
      console.error('Import products error:', err);
      handleFirestoreError(err, OperationType.WRITE, 'products');
      showToast('Erreur lors de l\'importation des produits.');
      return createdList;
    } finally {
      setIsSyncingCatalog(false);
    }
  };

  // Admin Order Actions
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const statusSequence: Order['status'][] = [
      'Pending',
      'Confirmed',
      'Preparing',
      'Shipped',
      'Delivered',
    ];

    const targetIndex = statusSequence.indexOf(newStatus);
    let updatedOrderObj: Order | undefined;

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

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

        const updated = {
          ...order,
          status: newStatus,
          trackingSteps: updatedSteps,
        };
        updatedOrderObj = updated;
        return updated;
      })
    );

    // Sync status change directly to Firestore
    try {
      if (updatedOrderObj) {
        await updateDoc(doc(db, 'orders', orderId), {
          status: newStatus,
          trackingSteps: updatedOrderObj.trackingSteps,
        });
      }
    } catch (err) {
      if (updatedOrderObj) {
        try {
          await setDoc(doc(db, 'orders', orderId), updatedOrderObj);
        } catch (innerErr) {
          handleFirestoreError(innerErr, OperationType.UPDATE, `orders/${orderId}`);
        }
      }
    }

    const notif: AdminNotification = {
      id: `notif-${Date.now()}`,
      title: 'Statut de Commande Mis à Jour',
      message: `La commande ${orderId} est maintenant "${newStatus}".`,
      type: newStatus === 'Cancelled' ? 'cancel' : 'order',
      timestamp: 'À l\'instant',
      read: false,
      orderId,
    };
    setNotifications((prev) => [notif, ...prev]);
    showToast(`Statut mis à jour : "${newStatus}".`);
  };

  const deleteOrder = async (orderId: string) => {
    // 1. Mark as deleted persistently
    setDeletedOrderIds((prev) => {
      const updated = Array.from(new Set([...prev, orderId]));
      localStorage.setItem('rwyse_deleted_order_ids_v6', JSON.stringify(updated));
      return updated;
    });

    // 2. Remove from active order state
    setOrders((prev) => {
      const updated = prev.filter((o) => o.id !== orderId);
      localStorage.setItem('rwyse_orders_v6', JSON.stringify(updated));
      return updated;
    });

    // 3. Clear selected order if active
    if (adminSelectedOrderId === orderId) {
      setAdminSelectedOrderId(null);
    }

    // 4. Clean up any related notifications
    setNotifications((prev) => prev.filter((n) => n.orderId !== orderId));

    // 5. Delete from Firestore asynchronously
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      logAuditAction('Suppression Commande', `Commande ID ${orderId} supprimée de Firestore avec succès.`);
      showToast('Commande supprimée définitivement.');
    } catch (err) {
      console.warn('Firestore order deletion note:', err);
      logAuditAction('Suppression Commande (Local)', `Commande ID ${orderId} retirée.`);
      showToast('Commande supprimée avec succès.');
    }
  };

  const deleteCustomer = async (customerKey: string, deleteOrders = true) => {
    const rawKey = customerKey.trim();
    const normalizedKey = rawKey.toLowerCase();
    const cleanPhoneKey = rawKey.replace(/\s+/g, '').toLowerCase();

    // Find all orders associated with this customer
    const matchingOrders = orders.filter((o) => {
      const p = (o.customerPhone || '').replace(/\s+/g, '').toLowerCase();
      const e = (o.customerEmail || '').trim().toLowerCase();
      const n = (o.customerName || '').trim().toLowerCase();
      return p === cleanPhoneKey || e === normalizedKey || n === normalizedKey;
    });

    const customerDisplayName = matchingOrders[0]?.customerName || rawKey;
    const matchingOrderIds = matchingOrders.map((o) => o.id);

    // Save to deleted customer keys list
    setDeletedCustomerKeys((prev) => {
      const updated = Array.from(new Set([...prev, cleanPhoneKey, normalizedKey]));
      localStorage.setItem('rwyse_deleted_customer_keys_v6', JSON.stringify(updated));
      return updated;
    });

    if (deleteOrders && matchingOrderIds.length > 0) {
      // Mark matching orders as deleted
      setDeletedOrderIds((prev) => {
        const updated = Array.from(new Set([...prev, ...matchingOrderIds]));
        localStorage.setItem('rwyse_deleted_order_ids_v6', JSON.stringify(updated));
        return updated;
      });

      // Remove from active state
      setOrders((prev) => {
        const updated = prev.filter((o) => !matchingOrderIds.includes(o.id));
        localStorage.setItem('rwyse_orders_v6', JSON.stringify(updated));
        return updated;
      });

      // Clean up notifications
      setNotifications((prev) => prev.filter((n) => !n.orderId || !matchingOrderIds.includes(n.orderId)));

      // Delete from Firestore
      for (const ordId of matchingOrderIds) {
        try {
          await deleteDoc(doc(db, 'orders', ordId));
        } catch (e) {
          console.warn('Note deleting order from Firestore:', ordId, e);
        }
      }
    }

    logAuditAction(
      'Suppression Client',
      `Fiche client "${customerDisplayName}" (${rawKey}) et ${matchingOrderIds.length} commande(s) associée(s) supprimée(s).`
    );
    showToast(`Client "${customerDisplayName}" supprimé avec succès.`);
  };

  const refreshOrdersFromCloud = async () => {
    setIsRefreshingOrders(true);
    try {
      const snap = await getDocs(collection(db, 'orders'));
      const savedDeleted = localStorage.getItem('rwyse_deleted_order_ids_v6');
      const deletedSet = new Set<string>(savedDeleted ? JSON.parse(savedDeleted) : []);
      const savedDeletedCust = localStorage.getItem('rwyse_deleted_customer_keys_v6');
      const deletedCustList: string[] = savedDeletedCust ? JSON.parse(savedDeletedCust) : [];
      const deletedCustSet = new Set(deletedCustList.map((k) => k.replace(/\s+/g, '').toLowerCase()));

      const loaded: Order[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data() as Order;
        if (data && data.orderNumber) {
          const ordId = data.id || docSnap.id;
          const phoneKey = (data.customerPhone || '').replace(/\s+/g, '').toLowerCase();
          const emailKey = (data.customerEmail || '').trim().toLowerCase();
          const nameKey = (data.customerName || '').trim().toLowerCase();
          if (!deletedSet.has(ordId) && !deletedCustSet.has(phoneKey) && !deletedCustSet.has(emailKey) && !deletedCustSet.has(nameKey)) {
            loaded.push({
              ...data,
              id: ordId,
            });
          }
        }
      });
      loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(loaded);
      localStorage.setItem('rwyse_orders_v6', JSON.stringify(loaded));
      setIsCloudSynced(true);
      showToast(`Synchronisation réussie (${loaded.length} commandes réelles récupérées depuis le Cloud).`);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'orders');
      showToast('Erreur lors de la synchronisation Firestore.');
    } finally {
      setIsRefreshingOrders(false);
    }
  };

  // Delete all demo/test orders so the store ONLY has genuine client orders
  const clearAllDemoOrders = async () => {
    try {
      const orderIds = orders.map((o) => o.id);
      // Mark all current order IDs as deleted
      setDeletedOrderIds((prev) => {
        const updated = Array.from(new Set([...prev, ...orderIds, 'ord-101', 'ord-102']));
        localStorage.setItem('rwyse_deleted_order_ids_v6', JSON.stringify(updated));
        return updated;
      });
      // Mark demo customers as deleted
      setDeletedCustomerKeys((prev) => {
        const updated = Array.from(new Set([...prev, 'sarra.mansour@example.tn', '+216 52 341 890', 'yassine.trabelsi@example.tn', '+216 98 765 432']));
        localStorage.setItem('rwyse_deleted_customer_keys_v6', JSON.stringify(updated));
        return updated;
      });

      // Clear in-memory & local state
      setOrders([]);
      localStorage.setItem('rwyse_orders_v6', JSON.stringify([]));
      setNotifications([]);
      localStorage.setItem('rwyse_notifications', JSON.stringify([]));
      setAdminSelectedOrderId(null);

      // Delete from Firestore
      for (const id of orderIds) {
        try {
          await deleteDoc(doc(db, 'orders', id));
        } catch (e) {
          console.warn('Note deleting order from Firestore:', id, e);
        }
      }

      logAuditAction('Nettoyage Commandes', 'Toutes les commandes de test ont été effacées. Seules les commandes de vrais clients seront enregistrées.');
      showToast('Commandes de test effacées avec succès. En attente de commandes réelles.');
    } catch (err) {
      console.warn('Error clearing demo orders:', err);
    }
  };

  // Delivery Zones
  const updateDeliveryZone = async (zone: DeliveryZone) => {
    setDeliveryZones((prev) =>
      prev.map((z) => (z.id === zone.id ? zone : z))
    );
    showToast(`Zone de livraison "${zone.region}" mise à jour en direct.`);
    try {
      await setDoc(doc(db, 'deliveryZones', zone.id), zone, { merge: true });
    } catch (e) {
      console.warn('Delivery zone firestore error:', e);
    }
  };

  // Promotions CRUD
  const addPromotion = async (promoInput: Omit<Promotion, 'id' | 'currentUses'>) => {
    const newPromo: Promotion = {
      ...promoInput,
      id: `promo-${Date.now()}`,
      currentUses: 0,
    };
    setPromotions((prev) => [newPromo, ...prev]);
    showToast(`Code promo "${newPromo.code}" créé et synchronisé.`);
    try {
      await setDoc(doc(db, 'promotions', newPromo.id), newPromo);
    } catch (e) {
      console.warn('Add promo firestore error:', e);
    }
  };

  const updatePromotion = async (updated: Promotion) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    showToast(`Code promo "${updated.code}" mis à jour en direct.`);
    try {
      await setDoc(doc(db, 'promotions', updated.id), updated, { merge: true });
    } catch (e) {
      console.warn('Update promo firestore error:', e);
    }
  };

  const deletePromotion = async (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    showToast('Code promo supprimé.');
    try {
      await deleteDoc(doc(db, 'promotions', id));
    } catch (e) {
      console.warn('Delete promo firestore error:', e);
    }
  };

  // Advertisements CRUD
  const addAdvertisement = async (adInput: Omit<Advertisement, 'id'>) => {
    const newAd: Advertisement = {
      ...adInput,
      id: `ad-${Date.now()}`,
    };
    setAdvertisements((prev) => [newAd, ...prev]);
    showToast('Campagne publicitaire créée.');
    try {
      const compressedImage = await compressImageIfNeeded(newAd.image);
      const toSave = { ...newAd, image: compressedImage };
      await setDoc(doc(db, 'advertisements', toSave.id), toSave);
    } catch (e) {
      console.warn('Add ad firestore error:', e);
    }
  };

  const updateAdvertisement = async (updated: Advertisement) => {
    setAdvertisements((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
    showToast('Campagne publicitaire mise à jour.');
    try {
      const compressedImage = await compressImageIfNeeded(updated.image);
      const toSave = { ...updated, image: compressedImage };
      await setDoc(doc(db, 'advertisements', toSave.id), toSave, { merge: true });
    } catch (e) {
      console.warn('Update ad firestore error:', e);
    }
  };

  const deleteAdvertisement = async (id: string) => {
    setAdvertisements((prev) => prev.filter((a) => a.id !== id));
    showToast('Campagne publicitaire supprimée.');
    try {
      await deleteDoc(doc(db, 'advertisements', id));
    } catch (e) {
      console.warn('Delete ad firestore error:', e);
    }
  };

  // Site Settings (Hero, Spotlights, Lookbook & CMS Images)
  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    const updated = { ...siteSettings, ...settings };
    setSiteSettings(updated);
    localStorage.setItem('rwyse_settings_v6', JSON.stringify(updated));
    showToast('Paramètres et images enregistrés en direct pour tous les clients !');

    try {
      const sanitized: Record<string, any> = { ...updated };
      for (const key of Object.keys(sanitized)) {
        const val = sanitized[key];
        if (typeof val === 'string' && val.startsWith('data:image/')) {
          sanitized[key] = await compressImageIfNeeded(val);
        }
      }
      const toSave = sanitizeForFirestore(sanitized);
      await setDoc(doc(db, 'settings', 'global'), toSave);
      console.log('Site settings synced to Firestore settings/global');
    } catch (err) {
      console.warn('Could not save settings to Firestore:', err);
      handleFirestoreError(err, OperationType.WRITE, 'settings/global');
    }
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
        deleteOrder,
        deleteCustomer,
        adminSelectedOrderId,
        setAdminSelectedOrderId,
        refreshOrdersFromCloud,
        isCloudSynced,
        isRefreshingOrders,
        syncAllProductsToCloud,
        isSyncingCatalog,
        importProducts,
        clearAllDemoOrders,
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
