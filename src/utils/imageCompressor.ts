/**
 * Compresses an uploaded image file using an HTML5 Canvas
 * so that avatar/cover images are lightweight (under 50KB),
 * preventing localStorage QuotaExceeded errors and ensuring instant rendering.
 */
export async function compressImage(
  file: File, 
  maxDim: number = 360, 
  quality: number = 0.85
): Promise<string> {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result !== 'string') {
          resolve('');
          return;
        }

        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxDim) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              }
            } else {
              if (height > maxDim) {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', quality));
            } else {
              resolve(result);
            }
          } catch {
            resolve(result);
          }
        };
        img.onerror = () => resolve(result);
        img.src = result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    } catch {
      resolve('');
    }
  });
}

export const compressImageFile = compressImage;
