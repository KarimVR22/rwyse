import { Product, Collection, Promotion, Advertisement, DeliveryZone, SiteSettings, Order } from '../types';

import heroImg from '../assets/images/rw_hero_campaign_1790976008301.jpg';
import hoodieImg from '../assets/images/rw_product_hoodie_1790976018072.jpg';
import cargoImg from '../assets/images/rw_product_cargo_1790976029076.jpg';
import teeImg from '../assets/images/rw_product_tee_1790976038961.jpg';
import editorialImg from '../assets/images/rw_editorial_drop_1790976052495.jpg';

// Newly added real RWYSE flagship product photos
import blueHoodieImg from '../assets/images/rw_blue_567_hoodie_1790977137171.jpg';
import balloonPantImg from '../assets/images/rw_black_balloon_pant_1790977147304.jpg';
import ringerTeeImg from '../assets/images/rw_contrast_ringer_tee_1790977157133.jpg';
import modelBlueImg from '../assets/images/rw_model_lookbook_blue_1790977167052.jpg';
import longsleeveImg from '../assets/images/rw_product_longsleeve_1790978150728.jpg';
import whiteLsImg from '../assets/images/rw_product_white_ls_1790978161780.jpg';
import tankImg from '../assets/images/rw_product_tank_1790978172428.jpg';

export {
  heroImg,
  hoodieImg,
  cargoImg,
  teeImg,
  editorialImg,
  blueHoodieImg,
  balloonPantImg,
  ringerTeeImg,
  modelBlueImg,
  longsleeveImg,
  whiteLsImg,
  tankImg,
};

export const initialSiteSettings: SiteSettings = {
  brandName: 'RWYSE',
  slogan: 'Rise with you',
  heroTitle: 'RISE & GRIND',
  heroSubtitle: 'Contemporary architectural streetwear. 500 GSM heavyweight silhouettes engineered for elevation and community discipline.',
  heroCtaText: 'SHOP THE COLLECTION',
  heroCtaLink: '/shop',
  heroSecondaryCtaText: 'DISCOVER LOOKBOOK',
  heroSecondaryCtaLink: '/new-drops',
  heroImage: modelBlueImg,
  spotlightTitle: 'THE 567 ROYAL BLUE & BALLOON FIT',
  spotlightSubtitle: 'Directly inspired by the official RWYSE campaign. Featuring high-density white 3D embroidery on the apex of the hood, artistic sleeve script, and matched with extreme barrel balloon sweatpants.',
  spotlightImage1: blueHoodieImg,
  spotlightImage2: modelBlueImg,
  editorialImage: editorialImg,
  communityImage1: blueHoodieImg,
  communityImage2: ringerTeeImg,
  lookbookImage1: modelBlueImg,
  lookbookImage2: balloonPantImg,
  lookbookImage3: ringerTeeImg,
  lookbookImage4: heroImg,
  isNewDropActive: true,
  isCommunityActive: true,
  isInstagramActive: true,
  announcementText: 'RWYSE DROP 01 LIVE · LIVRAISON 8 DT PARTOUT EN TUNISIE · PAIEMENT SEUL À LA LIVRAISON (CASH ON DELIVERY)',
  announcementActive: true,
  currency: 'TND',
};

export const initialCollections: Collection[] = [
  {
    id: 'col-1',
    name: 'DROP 01: RISE & GRIND',
    slug: 'drop-01-rise-and-grind',
    subtitle: 'The foundational architectural silhouettes',
    description: 'Constructed from bespoke 500 GSM loopback French terry and custom milled heavyweight jersey. Featuring the iconic 567 Royal Blue hoodie, curved balloon pants, and contrast ringer tees. Designed in Tunisia.',
    coverImage: modelBlueImg,
    dropDate: '2026-10-01',
    active: true,
  },
  {
    id: 'col-2',
    name: 'MEDINA RAW ARCHIVE',
    slug: 'medina-raw-archive',
    subtitle: 'Streetwear essentials inspired by authentic urban culture',
    description: 'Contrast ringer tees and heavyweight long sleeves pre-shrunk for an enduring vintage handfeel.',
    coverImage: ringerTeeImg,
    dropDate: '2026-08-20',
    active: true,
  },
  {
    id: 'col-3',
    name: 'DISCIPLINE & COMMUNITY',
    slug: 'discipline-and-community',
    subtitle: 'Engineered performance tops for the RWYSE community',
    description: 'Lightweight stretch compression tops and sleeveless tanks tested for physical elevation.',
    coverImage: tankImg,
    dropDate: '2026-09-10',
    active: true,
  },
];

export const initialProducts: Product[] = [
  {
    id: 'rwy-00',
    name: 'RWYSE "567" Royal Blue Oversized Box Hoodie',
    slug: 'rwyse-567-royal-blue-oversized-box-hoodie',
    price: 195,
    salePrice: 175,
    category: 'Hoodies',
    collection: 'DROP 01: RISE & GRIND',
    description: 'The defining hero piece of RWYSE. Sculpted from 500 GSM ultra-heavyweight combed organic cotton in vibrant cobalt royal blue. Features high-density 3D white embroidered "567" on the hood apex, signature white script "Rwyse" at the collar, and full artistic calligraphic script flowing down the left sleeve.',
    details: [
      '500 GSM ultra-heavyweight combed organic cotton terry',
      'High-density 3D puff embroidered "567" on apex of hood',
      'Artistic white calligraphic "Rwyse" embroidery down left forearm',
      'Cursive "Rwyse" micro-embroidery at collar center',
      'Double-layer rigid ergonomic hood engineered to stand upright without cords',
      'Signature architectural boxy silhouette with relaxed dropped shoulders',
      'Pre-shrunk custom loopback knit crafted in Tunisia'
    ],
    fabric: '100% Combed Organic Loopback Cotton (500 GSM)',
    fit: 'Signature oversized boxy street cut. True to size for intended drape.',
    careInstructions: 'Machine wash cold inside out. Hang dry only to preserve 3D embroidery.',
    colors: [
      {
        name: 'Royal Cobalt Blue',
        hex: '#1e40af',
        images: [blueHoodieImg, modelBlueImg, hoodieImg]
      },
      {
        name: 'Onyx Black',
        hex: '#111111',
        images: [hoodieImg, modelBlueImg]
      }
    ],
    sizes: [
      { size: 'S', stock: 12 },
      { size: 'M', stock: 24 },
      { size: 'L', stock: 8 },
      { size: 'XL', stock: 10 },
      { size: 'XXL', stock: 5 }
    ],
    sku: 'RWY-HD-567-BLU',
    isFeatured: true,
    isNewDrop: true,
    isSoldOut: false,
    createdAt: '2026-10-02T12:00:00Z',
  },
  {
    id: 'rwy-balloon',
    name: 'RWYSE Heavyweight Curved Balloon Sweatpants',
    slug: 'rwyse-heavyweight-curved-balloon-sweatpants',
    price: 165,
    salePrice: 145,
    category: 'Pants',
    collection: 'DROP 01: RISE & GRIND',
    description: 'The authentic RWYSE curved balloon jogger. Masterfully patterned with an extreme curved barrel silhouette that stacks dramatically over sneakers and boots. Features the official RWYSE wordmark logo with arrow insignia printed in crisp white on the upper left thigh, heavy ribbed elastic waist, and custom round black drawstrings.',
    details: [
      '480 GSM dense French loopback organic cotton',
      'Official RWYSE logo printed in white on upper left thigh',
      'Sculptural curved balloon barrel silhouette with articulated side paneling',
      'Heavy ribbed elastic waistband with round black drawstring & metal aglets',
      'Deep slash side pockets designed for heavy mobile phone storage',
      'Tapered lower cuffs designed to stack over sneakers or boots',
      'Crafted with pride in Tunisia'
    ],
    fabric: '100% Combed Heavyweight French Terry Cotton (480 GSM)',
    fit: 'Curved balloon baggy streetwear drape with elastic waist.',
    careInstructions: 'Cold gentle cycle. Hang dry.',
    colors: [
      {
        name: 'Pitch Black',
        hex: '#0d0d0f',
        images: [balloonPantImg, modelBlueImg]
      },
      {
        name: 'Heather Charcoal',
        hex: '#2b2b30',
        images: [cargoImg, balloonPantImg]
      }
    ],
    sizes: [
      { size: 'S', stock: 15 },
      { size: 'M', stock: 20 },
      { size: 'L', stock: 10 },
      { size: 'XL', stock: 8 },
      { size: 'XXL', stock: 4 }
    ],
    sku: 'RWY-PT-BLN-BLK',
    isFeatured: true,
    isNewDrop: true,
    isSoldOut: false,
    createdAt: '2026-10-02T11:30:00Z',
  },
  {
    id: 'rwy-ringer',
    name: 'RWYSE Retro Contrast Rib Ringer T-Shirt',
    slug: 'rwyse-retro-contrast-rib-ringer-t-shirt',
    price: 95,
    salePrice: 85,
    category: 'T-Shirts',
    collection: 'MEDINA RAW ARCHIVE',
    description: 'The iconic RWYSE Medina campaign ringer tee. Built with authentic vintage proportions and thick contrast ribbed neckband and sleeve cuffs. Pairs effortlessly with baggy denim and sneakers.',
    details: [
      '260 GSM high-density ring-spun cotton jersey',
      'Thick contrast 1.25-inch ribbing at neck collar and sleeve trims',
      'Boxy streetwear cut with structured drape',
      'Discreet tonal RWYSE typographic print on the rear collar',
      'Pre-washed with gentle enzyme bath for an ultra-soft handfeel'
    ],
    fabric: '100% Ring-Spun Premium Combed Cotton (260 GSM)',
    fit: 'Classic boxy streetwear fit. True to size for clean vintage drape.',
    careInstructions: 'Machine wash cold inside out with similar colors.',
    colors: [
      {
        name: 'Navy / Contrast White',
        hex: '#1e293b',
        images: [ringerTeeImg, teeImg]
      },
      {
        name: 'Vintage Cream / Brown Trim',
        hex: '#f5f5f0',
        images: [teeImg, ringerTeeImg]
      }
    ],
    sizes: [
      { size: 'S', stock: 25 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 18 },
      { size: 'XL', stock: 12 },
      { size: 'XXL', stock: 6 }
    ],
    sku: 'RWY-TS-RNG-NVY',
    isFeatured: true,
    isNewDrop: true,
    isSoldOut: false,
    createdAt: '2026-10-01T15:00:00Z',
  },
  {
    id: 'rwy-longsleeve',
    name: 'RWYSE Architectural Relaxed Long-Sleeve Mockneck',
    slug: 'rwyse-architectural-relaxed-long-sleeve-mockneck',
    price: 125,
    salePrice: 110,
    category: 'T-Shirts',
    collection: 'MEDINA RAW ARCHIVE',
    description: 'A heavyweight architectural long-sleeve tee with an elevated mockneck stance. Featured prominently in the outdoor lookbook. Crafted with drop-shoulder patterning and thick wrist cuffs for effortless stacking.',
    details: [
      '300 GSM ultra-heavy single jersey organic cotton',
      'Structured 1.5-inch raised mockneck collar that retains its shape',
      'Drop-shoulder boxy silhouette with elongated sleeves',
      'Dense ribbed cuffs engineered for clean wrist stacking',
      'Minimalist tonal RWYSE embroidery at the nape'
    ],
    fabric: '100% Organic Heavyweight Cotton (300 GSM)',
    fit: 'Relaxed boxy cut with drop shoulders. Model wears size L.',
    careInstructions: 'Machine wash cold. Hang dry.',
    colors: [
      {
        name: 'Onyx Black',
        hex: '#0e0e11',
        images: [longsleeveImg, whiteLsImg]
      },
      {
        name: 'Optic Raw White',
        hex: '#f8f8fa',
        images: [whiteLsImg, longsleeveImg]
      }
    ],
    sizes: [
      { size: 'S', stock: 16 },
      { size: 'M', stock: 22 },
      { size: 'L', stock: 14 },
      { size: 'XL', stock: 8 },
      { size: 'XXL', stock: 3 }
    ],
    sku: 'RWY-LS-MCK-BLK',
    isFeatured: true,
    isNewDrop: true,
    isSoldOut: false,
    createdAt: '2026-10-02T13:00:00Z',
  },
  {
    id: 'rwy-performance',
    name: 'RWYSE Discipline Athletic Compression Muscle Top',
    slug: 'rwyse-discipline-athletic-compression-muscle-top',
    price: 85,
    salePrice: 75,
    category: 'T-Shirts',
    collection: 'DISCIPLINE & COMMUNITY',
    description: 'Engineered for community discipline and physical elevation as seen in the RWYSE gym editorial. Cut from high-stretch breathable compression fabric with ergonomic flatlock seams and heat-transferred RWYSE insignia.',
    details: [
      'Four-way stretch technical moisture-wicking micro-polyester blend',
      'Ergonomic flatlock stitching to eliminate chafing during intense training',
      'Reinforced crewneck and armhole binding',
      'Reflective micro RWYSE crest on left chest',
      'Breathable quick-drying construction'
    ],
    fabric: '85% Technical Micro-Polyester, 15% Spandex (220 GSM)',
    fit: 'Athletic muscle cut. Size up for relaxed drape.',
    careInstructions: 'Machine wash cold delicate. Do not tumble dry.',
    colors: [
      {
        name: 'Stealth Black',
        hex: '#0a0a0c',
        images: [tankImg, longsleeveImg]
      }
    ],
    sizes: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 28 },
      { size: 'L', stock: 16 },
      { size: 'XL', stock: 10 },
      { size: 'XXL', stock: 4 }
    ],
    sku: 'RWY-TN-DSP-BLK',
    isFeatured: true,
    isNewDrop: true,
    isSoldOut: false,
    createdAt: '2026-10-02T13:30:00Z',
  }
];

export const initialPromotions: Promotion[] = [
  {
    id: 'promo-1',
    code: 'RISE10',
    name: 'Community Welcome Offer',
    discountType: 'percentage',
    value: 10,
    minOrder: 100,
    active: true,
    maxUses: 500,
    currentUses: 64,
    expiresAt: '2026-12-31',
  },
  {
    id: 'promo-2',
    code: 'RWYSE20',
    name: 'Drop 01 VIP Launch Discount',
    discountType: 'percentage',
    value: 20,
    minOrder: 250,
    active: true,
    maxUses: 100,
    currentUses: 29,
    expiresAt: '2026-11-15',
  },
  {
    id: 'promo-3',
    code: 'FREEDROP',
    name: 'Fixed 25 TND Off',
    discountType: 'fixed',
    value: 25,
    minOrder: 200,
    active: false,
    maxUses: 200,
    currentUses: 112,
    expiresAt: '2026-10-31',
  },
];

export const initialDeliveryZones: DeliveryZone[] = [
  { id: 'zone-1', region: 'Grand Tunis (Tunis, Ariana, Ben Arous, Manouba)', fee: 8, estimatedDays: '24-48 Hours', active: true },
  { id: 'zone-2', region: 'Sahel (Sousse, Monastir, Mahdia)', fee: 8, estimatedDays: '2-3 Business Days', active: true },
  { id: 'zone-3', region: 'North (Bizerte, Nabeul, Zaghouan)', fee: 8, estimatedDays: '2-3 Business Days', active: true },
  { id: 'zone-4', region: 'Center & South (Sfax, Gabes, Medenine, Kairouan)', fee: 8, estimatedDays: '3-4 Business Days', active: true },
  { id: 'zone-5', region: 'Inland Regions (Gafsa, Tozeur, Tataouine, Beja, Jendouba, Kef)', fee: 8, estimatedDays: '3-5 Business Days', active: true },
];

export const initialAdvertisements: Advertisement[] = [
  {
    id: 'ad-1',
    title: 'RISE & GRIND // DROP 01 LIVE',
    subtitle: 'Featuring the Royal Blue 567 Oversized Box Hoodie in 500 GSM loopback cotton.',
    ctaText: 'SHOP THE PIECE',
    ctaLink: '/product/rwyse-567-royal-blue-oversized-box-hoodie',
    image: modelBlueImg,
    placement: 'hero',
    active: true,
  },
  {
    id: 'ad-2',
    title: '567 ROYAL BLUE EDITION',
    subtitle: 'High-density 3D hood embroidery and calligraphic sleeve details.',
    ctaText: 'EXPLORE PIECE',
    ctaLink: '/product/rwyse-567-royal-blue-oversized-box-hoodie',
    image: blueHoodieImg,
    placement: 'shop_banner',
    active: true,
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'RWY-84920',
    customerName: 'Yassine Ben Amor',
    customerEmail: 'yassine.ba@example.tn',
    customerPhone: '+216 98 421 890',
    address: 'Résidence Les Palmiers, Apt B4, Les Berges du Lac 2',
    city: 'Tunis',
    region: 'Grand Tunis (Tunis, Ariana, Ben Arous, Manouba)',
    postalCode: '1053',
    notes: 'Please call before arriving, building has access code #1984.',
    items: [
      {
        productId: 'rwy-00',
        name: 'RWYSE "567" Royal Blue Oversized Box Hoodie',
        price: 175,
        color: 'Royal Cobalt Blue',
        size: 'L',
        quantity: 1,
        image: blueHoodieImg,
      }
    ],
    subtotal: 175,
    deliveryFee: 7,
    discountAmount: 0,
    total: 182,
    paymentMethod: 'cod',
    status: 'Shipped',
    trackingSteps: [
      { status: 'Pending', title: 'Order Placed', desc: 'Order received and logged in RWYSE system', date: '2026-10-01 14:22', completed: true },
      { status: 'Confirmed', title: 'Order Verified', desc: 'Customer phone confirmed by RWYSE concierge', date: '2026-10-01 16:05', completed: true },
      { status: 'Preparing', title: 'Curated & Packaged', desc: 'Packed in bespoke matte black RWYSE garment bag', date: '2026-10-02 09:30', completed: true },
      { status: 'Shipped', title: 'Dispatched with Courier', desc: 'Out for regional transit (Aramex Express TN #892182)', date: '2026-10-02 11:15', completed: true },
      { status: 'Delivered', title: 'Delivered', desc: 'Package handed to recipient with Cash on Delivery collected', date: 'Estimated: 2026-10-03', completed: false }
    ],
    createdAt: '2026-10-01T14:22:00Z',
  },
  {
    id: 'ord-102',
    orderNumber: 'RWY-84921',
    customerName: 'Sarra Mansour',
    customerEmail: 'sarra.mansour@example.tn',
    customerPhone: '+216 52 341 890',
    address: 'Résidence Port Kantaoui, Bloc C, Appt 14',
    city: 'Sousse',
    region: 'Sahel (Sousse, Monastir, Mahdia)',
    postalCode: '4089',
    notes: 'Livraison l’après-midi s’il vous plaît.',
    items: [
      {
        productId: 'rwy-02',
        name: 'RWYSE Club Heavyweight Raw Box Hoodie',
        price: 165,
        color: 'Onyx Mineral Black',
        size: 'M',
        quantity: 1,
        image: hoodieImg,
      }
    ],
    subtotal: 165,
    deliveryFee: 7,
    discountAmount: 0,
    total: 172,
    paymentMethod: 'cod',
    status: 'Pending',
    trackingSteps: [
      { status: 'Pending', title: 'Commande Reçue', desc: 'Commande enregistrée dans le système RWYSE', date: 'Aujourd\'hui', completed: true },
      { status: 'Confirmed', title: 'Confirmation Téléphonique', desc: 'Appel de vérification par le concierge RWYSE', date: 'En attente', completed: false },
      { status: 'Preparing', title: 'Préparation & Emballage', desc: 'Conditionné dans l\'emballage noir mat RWYSE', date: 'En attente', completed: false },
      { status: 'Shipped', title: 'Expédition Colis', desc: 'Prise en charge par le transporteur express', date: 'En attente', completed: false },
      { status: 'Delivered', title: 'Livraison Réussie', desc: 'Remis en main propre contre paiement à la livraison', date: 'En attente', completed: false }
    ],
    createdAt: new Date().toISOString(),
  }
];

export const defaultSizeGuide = [
  { size: 'S', chest: '58 cm (22.8")', length: '70 cm (27.5")', shoulders: '54 cm (21.2")', sleeve: '62 cm (24.4")' },
  { size: 'M', chest: '61 cm (24.0")', length: '72 cm (28.3")', shoulders: '56 cm (22.0")', sleeve: '63 cm (24.8")' },
  { size: 'L', chest: '64 cm (25.2")', length: '74 cm (29.1")', shoulders: '58 cm (22.8")', sleeve: '64 cm (25.2")' },
  { size: 'XL', chest: '67 cm (26.4")', length: '76 cm (29.9")', shoulders: '60 cm (23.6")', sleeve: '65 cm (25.6")' },
  { size: 'XXL', chest: '70 cm (27.5")', length: '78 cm (30.7")', shoulders: '62 cm (24.4")', sleeve: '66 cm (26.0")' },
];
