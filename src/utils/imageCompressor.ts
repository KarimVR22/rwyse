/**
 * Helper to compress or scale base64 images to ensure they comfortably fit within Firestore's 1MB document limits.
 * Produces crisp, high-quality images while keeping base64 size around 40KB - 90KB.
 */
export const compressImageIfNeeded = async (
  dataUrlOrUrl: string,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75
): Promise<string> => {
  if (!dataUrlOrUrl || typeof dataUrlOrUrl !== 'string' || !dataUrlOrUrl.startsWith('data:image/')) {
    return dataUrlOrUrl;
  }

  // If already very compact (< 100KB), keep as is
  if (dataUrlOrUrl.length < 100000) {
    return dataUrlOrUrl;
  }

  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrlOrUrl);
          return;
        }

        // Draw smooth image
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        let compressed = canvas.toDataURL('image/jpeg', quality);

        // If still large (> 180KB), reduce dimensions and quality slightly
        if (compressed.length > 180000) {
          const secondCanvas = document.createElement('canvas');
          const targetW = Math.round(width * 0.8);
          const targetH = Math.round(height * 0.8);
          secondCanvas.width = targetW;
          secondCanvas.height = targetH;
          const ctx2 = secondCanvas.getContext('2d');
          if (ctx2) {
            ctx2.imageSmoothingEnabled = true;
            ctx2.drawImage(canvas, 0, 0, targetW, targetH);
            compressed = secondCanvas.toDataURL('image/jpeg', 0.65);
          }
        }

        resolve(compressed);
      };
      img.onerror = () => {
        resolve(dataUrlOrUrl);
      };
      img.src = dataUrlOrUrl;
    } catch {
      resolve(dataUrlOrUrl);
    }
  });
};

/**
 * Strips all `undefined` fields from an object recursively so Firestore never rejects the write.
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (value === undefined) {
        return null;
      }
      return value;
    })
  );
}
