export type ProductCategory = 'Hoodies' | 'T-Shirts' | 'Pants' | 'Jackets' | 'Accessories';

export interface ProductColor {
  name: string;
  hex: string;
  images: string[];
  threeDModelUrl?: string;
  threeSixtyFrames?: string[];
}

export interface ProductSize {
  size: string;
  stock: number;
  lowStockThreshold?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  category: ProductCategory;
  collection: string;
  description: string;
  details: string[];
  fabric: string;
  fit: string;
  careInstructions: string;
  colors: ProductColor[];
  sizes: ProductSize[];
  sku: string;
  isFeatured: boolean;
  isNewDrop: boolean;
  isSoldOut: boolean;
  status?: 'published' | 'draft' | 'archived';
  tags?: string[];
  threeDModelUrl?: string;
  threeSixtyFrames?: string[];
  videoUrl?: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  coverImage: string;
  dropDate: string;
  active: boolean;
}

export interface CartItem {
  id: string; // unique item id: productId-color-size
  productId: string;
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  price: number;
}

export interface OrderTrackingStep {
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Shipped' | 'Delivered' | 'Cancelled';
  title: string;
  desc: string;
  date: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  notes?: string;
  items: {
    productId: string;
    name: string;
    price: number;
    color: string;
    size: string;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
  paymentMethod: 'cod' | 'card';
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingSteps: OrderTrackingStep[];
  createdAt: string;
}

export interface Promotion {
  id: string;
  code: string;
  name: string;
  discountType: 'percentage' | 'fixed';
  value: number; // percentage (e.g. 15 for 15%) or fixed (e.g. 20 TND)
  minOrder: number;
  active: boolean;
  maxUses: number;
  currentUses: number;
  expiresAt: string;
}

export interface Advertisement {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  placement: 'hero' | 'shop_banner' | 'popup' | 'announcement_bar';
  active: boolean;
  scheduleStart?: string;
  scheduleEnd?: string;
}

export interface DeliveryZone {
  id: string;
  region: string;
  fee: number;
  estimatedDays: string;
  active: boolean;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'stock' | 'cancel' | 'promo';
  timestamp: string;
  read: boolean;
  orderId?: string;
}

export interface SiteSettings {
  brandName: string;
  slogan: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  heroImage: string;
  isNewDropActive: boolean;
  isCommunityActive: boolean;
  isInstagramActive: boolean;
  announcementText: string;
  announcementActive: boolean;
  currency: string;
}

export interface CustomerProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  adminEmail: string;
}

