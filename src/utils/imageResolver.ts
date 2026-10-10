import {
  blueHoodieImg,
  balloonPantImg,
  ringerTeeImg,
  modelBlueImg,
  longsleeveImg,
  whiteLsImg,
  tankImg,
  hoodieImg,
  cargoImg,
  teeImg,
  heroImg,
  editorialImg,
} from '../data/initialData';

export const ASSET_MAP: Record<string, string> = {
  'rw_blue_567_hoodie': blueHoodieImg,
  'blue_567': blueHoodieImg,
  'rw_black_balloon_pant': balloonPantImg,
  'balloon_pant': balloonPantImg,
  'rw_contrast_ringer_tee': ringerTeeImg,
  'ringer_tee': ringerTeeImg,
  'rw_model_lookbook_blue': modelBlueImg,
  'model_lookbook': modelBlueImg,
  'rw_product_longsleeve': longsleeveImg,
  'longsleeve': longsleeveImg,
  'rw_product_white_ls': whiteLsImg,
  'white_ls': whiteLsImg,
  'rw_product_tank': tankImg,
  'tank': tankImg,
  'rw_product_hoodie': hoodieImg,
  'rw_product_cargo': cargoImg,
  'rw_product_tee': teeImg,
  'rw_hero_campaign': heroImg,
  'rw_editorial_drop': editorialImg,
};

export const FALLBACK_IMAGE = hoodieImg;

/**
 * Resolves any image source to a reliable, visible URL.
 * Automatically fixes local development paths like `/src/assets/images/...`
 * or stale build paths, ensuring images are 100% visible on all devices and builds.
 */
export function resolveProductImage(src?: string | null): string {
  if (!src || typeof src !== 'string' || !src.trim()) {
    return FALLBACK_IMAGE;
  }
  const clean = src.trim();

  // 1. Standalone base64 Data URL (uploaded from phone/PC)
  if (clean.startsWith('data:image/')) {
    return clean;
  }

  // 2. External HTTP/HTTPS URL (Unsplash, CDN, etc.)
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }

  // 3. Match against known asset filenames
  for (const [key, assetValue] of Object.entries(ASSET_MAP)) {
    if (clean.includes(key)) {
      return assetValue;
    }
  }

  // 4. Match common keywords in the string
  const lower = clean.toLowerCase();
  if (lower.includes('blue') && (lower.includes('hoodie') || lower.includes('567'))) return blueHoodieImg;
  if (lower.includes('balloon') || lower.includes('sweatpant')) return balloonPantImg;
  if (lower.includes('ringer') || lower.includes('contrast')) return ringerTeeImg;
  if (lower.includes('model') || lower.includes('lookbook')) return modelBlueImg;
  if (lower.includes('white_ls') || lower.includes('white-ls')) return whiteLsImg;
  if (lower.includes('longsleeve')) return longsleeveImg;
  if (lower.includes('tank')) return tankImg;
  if (lower.includes('cargo')) return cargoImg;
  if (lower.includes('editorial')) return editorialImg;
  if (lower.includes('hoodie')) return hoodieImg;
  if (lower.includes('tee')) return teeImg;

  // 5. If it's a relative path that looks like a valid asset, return it, otherwise fallback
  if (clean.startsWith('/assets/') || clean.startsWith('./assets/')) {
    return clean;
  }

  return FALLBACK_IMAGE;
}
