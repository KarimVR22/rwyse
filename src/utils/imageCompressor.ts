/**
 * Helper to compress or scale base64 images to ensure they comfortably fit within Firestore's 1MB document limits.
 */
export const compressImageIfNeeded = async (
  dataUrlOrUrl: string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<string> => {
  if (!dataUrlOrUrl || !dataUrlOrUrl.startsWith('data:image/')) {
    return dataUrlOrUrl;
  }

  // If already under ~250KB, keep as is
  if (dataUrlOrUrl.length < 250000) {
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
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
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
