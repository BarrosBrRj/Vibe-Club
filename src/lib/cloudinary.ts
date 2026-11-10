export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

const STORAGE_KEY = 'vibe_clube_cloudinary_config';

export const getCloudinaryConfig = (): CloudinaryConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.cloudName && parsed.uploadPreset) {
        return {
          cloudName: parsed.cloudName.trim(),
          uploadPreset: parsed.uploadPreset.trim()
        };
      }
    }
  } catch (e) {
    console.warn('Erro ao ler configuração do Cloudinary:', e);
  }

  return {
    cloudName: '',
    uploadPreset: ''
  };
};

export const setCloudinaryConfig = (config: CloudinaryConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      cloudName: config.cloudName.trim(),
      uploadPreset: config.uploadPreset.trim()
    }));
  } catch (e) {
    console.error('Erro ao salvar configuração do Cloudinary:', e);
  }
};

export const hasCloudinaryConfig = (): boolean => {
  const config = getCloudinaryConfig();
  return Boolean(config.cloudName && config.uploadPreset);
};

/**
 * Gera miniatura (thumbnail) automática do vídeo usando canvas no browser
 */
export const generateVideoThumbnail = (
  videoBlob: Blob | File
): Promise<{ thumbnailDataUrl: string; duration: number }> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    const objectUrl = URL.createObjectURL(videoBlob);
    video.src = objectUrl;

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
    };

    const timeout = setTimeout(() => {
      cleanup();
      resolve({ thumbnailDataUrl: '', duration: 0 });
    }, 12000);

    video.onloadedmetadata = () => {
      const duration = video.duration || 0;
      // Seek to 0.5s or 10% of the video
      const seekTime = Math.min(Math.max(0.5, duration * 0.1), Math.max(0, duration - 0.1));
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        const maxDim = 640;
        let w = video.videoWidth || 640;
        let h = video.videoHeight || 360;

        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          cleanup();
          resolve({ thumbnailDataUrl: dataUrl, duration: video.duration || 0 });
          return;
        }
      } catch (e) {
        console.warn('Falha ao renderizar frame no canvas:', e);
      }
      cleanup();
      resolve({ thumbnailDataUrl: '', duration: video.duration || 0 });
    };

    video.onerror = () => {
      clearTimeout(timeout);
      cleanup();
      resolve({ thumbnailDataUrl: '', duration: 0 });
    };
  });
};

export interface UploadResult {
  url: string;
  publicId?: string;
  thumbnailUrl?: string;
  duration?: number;
  format?: string;
  bytes?: number;
}

/**
 * Realiza upload unsigned de vídeo para o Cloudinary com acompanhamento de progresso e cancelamento
 */
export const uploadVideoToCloudinary = (
  file: File | Blob,
  onProgress: (percent: number) => void,
  abortSignal?: AbortSignal
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const config = getCloudinaryConfig();

    if (!config.cloudName || !config.uploadPreset) {
      // Se ainda não configurado, rejeita com erro explicativo
      return reject(new Error('CLOUDINARY_NOT_CONFIGURED'));
    }

    const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/video/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint, true);

    if (abortSignal) {
      abortSignal.addEventListener('abort', () => {
        xhr.abort();
        reject(new Error('UPLOAD_CANCELLED'));
      });
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          const secureUrl = response.secure_url || response.url;
          
          // Gera miniatura automática do Cloudinary se possível (.jpg)
          let autoThumb = '';
          if (secureUrl && typeof secureUrl === 'string') {
            autoThumb = secureUrl.replace(/\.[^/.]+$/, '.jpg');
          }

          resolve({
            url: secureUrl,
            publicId: response.public_id,
            thumbnailUrl: autoThumb,
            duration: response.duration,
            format: response.format,
            bytes: response.bytes
          });
        } catch (err) {
          reject(new Error('Resposta inválida do Cloudinary.'));
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          const message = errData?.error?.message || `Erro ${xhr.status} no Cloudinary.`;
          reject(new Error(message));
        } catch {
          reject(new Error(`Falha no upload do Cloudinary (Status: ${xhr.status}). Verifique o Cloud Name e Upload Preset.`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Erro de conexão ao enviar vídeo para o Cloudinary. Verifique sua conexão ou se o Cloud Name está correto.'));
    };

    xhr.ontimeout = () => {
      reject(new Error('Tempo limite de envio excedido.'));
    };

    xhr.send(formData);
  });
};

/**
 * Realiza upload unsigned de imagem ou GIF para o Cloudinary mantendo a animação do GIF
 */
export const uploadImageOrGifToCloudinary = (
  file: File | Blob,
  onProgress?: (percent: number) => void,
  abortSignal?: AbortSignal
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const config = getCloudinaryConfig();

    if (!config.cloudName || !config.uploadPreset) {
      return reject(new Error('CLOUDINARY_NOT_CONFIGURED'));
    }

    const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/auto/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint, true);

    if (abortSignal) {
      abortSignal.addEventListener('abort', () => {
        xhr.abort();
        reject(new Error('UPLOAD_CANCELLED'));
      });
    }

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          const secureUrl = response.secure_url || response.url;

          resolve({
            url: secureUrl,
            publicId: response.public_id,
            format: response.format,
            bytes: response.bytes
          });
        } catch {
          reject(new Error('Resposta inválida do Cloudinary.'));
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          const message = errData?.error?.message || `Erro ${xhr.status} no Cloudinary.`;
          reject(new Error(message));
        } catch {
          reject(new Error(`Falha no upload do Cloudinary (Status: ${xhr.status}).`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Erro de conexão ao enviar GIF/imagem para o Cloudinary.'));
    };

    xhr.ontimeout = () => {
      reject(new Error('Tempo limite de envio excedido.'));
    };

    xhr.send(formData);
  });
};

/**
 * Verifica se a URL é hospedada no Cloudinary
 */
export const isCloudinaryUrl = (url?: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('res.cloudinary.com');
};

/**
 * Otimiza a URL de vídeo do Cloudinary aplicando compressão automática,
 * formato moderno (H.264/WebM) e limitação de resolução para performance mobile
 */
export const optimizeCloudinaryVideoUrl = (url: string, maxWidth = 720): string => {
  if (!isCloudinaryUrl(url)) return url;
  // Se já possui transformação no path, retorna original
  if (url.includes('/video/upload/q_auto') || url.includes('/video/upload/f_auto')) {
    return url;
  }
  // Aplica otimizações de performance do Cloudinary
  return url.replace(
    '/video/upload/',
    `/video/upload/q_auto,f_auto,w_${maxWidth},c_limit/`
  );
};

/**
 * Gera thumbnail dinâmico no Cloudinary pegando o primeiro segundo do vídeo
 */
export const getCloudinaryVideoThumbnail = (videoUrl: string): string => {
  if (!isCloudinaryUrl(videoUrl)) return '';
  return videoUrl
    .replace('/video/upload/', '/video/upload/so_1,q_auto,f_jpg,w_640,c_fill,ar_9:16/')
    .replace(/\.[^/.]+$/, '.jpg');
};

export interface CloudinaryReelItem {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  content: string;
  mediaUrl: string;
  videoThumbnail: string;
  duration: number;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  vibeTag: string;
  isCloudinaryHosted?: boolean;
  musicTitle?: string;
}

/**
 * Vídeos oficiais e demonstrativos do Cloudinary para preencher o feed de reels
 */
export const CLOUDINARY_SAMPLE_REELS: CloudinaryReelItem[] = [
  {
    id: 'cld_reel_1',
    authorId: 'user_claudia',
    authorName: 'Claudia Mendes',
    authorUsername: 'claudia_travel',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    content: 'Mergulho incrível com tartarugas marinhas em Fernando de Noronha! A nitidez dessa água é surreal 🐢🌊✨ #VibeNoronha #Natureza',
    mediaUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,f_auto/sea-turtle.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
    duration: 12,
    viewsCount: 3840,
    likesCount: 245,
    commentsCount: 34,
    sharesCount: 42,
    createdAt: 'Há 25 min',
    vibeTag: '🌊 Praias & Natureza',
    isCloudinaryHosted: true,
    musicTitle: 'Ocean Breeze • VIBE Sound Lab'
  },
  {
    id: 'cld_reel_2',
    authorId: 'user_marcos',
    authorName: 'Marcos Vinicius',
    authorUsername: 'marcos_pets',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    content: 'Meu golden retriever descobrindo a praia pela primeira vez! Impossível não sorrir com essa energia 🐕☀️💛 #DogLovers #VibePet',
    mediaUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,f_auto/dog.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
    duration: 10,
    viewsCount: 5120,
    likesCount: 412,
    commentsCount: 58,
    sharesCount: 76,
    createdAt: 'Há 45 min',
    vibeTag: '🐕 Pets & Fofura',
    isCloudinaryHosted: true,
    musicTitle: 'Happy Days • Tropical Beats'
  },
  {
    id: 'cld_reel_3',
    authorId: 'user_lucas',
    authorName: 'Lucas Puzzle',
    authorUsername: 'lucas_speedcubing',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    content: 'Resolvendo o Cubo Mágico 3x3 em menos de 8 segundos no encontro de Speedcubers do Vibe Clube! 🧊⚡🧠 #DesafioArcade',
    mediaUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,f_auto/cld_rubiks_cube.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
    duration: 14,
    viewsCount: 2940,
    likesCount: 189,
    commentsCount: 22,
    sharesCount: 19,
    createdAt: 'Há 2 horas',
    vibeTag: '🧩 Quebra-Cabeças',
    isCloudinaryHosted: true,
    musicTitle: 'Speed Pulse • Synthwave 80s'
  },
  {
    id: 'cld_reel_4',
    authorId: 'user_amanda',
    authorName: 'Amanda Safari',
    authorUsername: 'amanda_wildlife',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    content: 'Família de elefantes ao entardecer. A majestade da vida selvagem transmitida ao vivo em alta resolução direto do Cloudinary! 🐘🌅',
    mediaUrl: 'https://res.cloudinary.com/demo/video/upload/q_auto,f_auto/elephants.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&auto=format&fit=crop&q=80',
    duration: 16,
    viewsCount: 4620,
    likesCount: 310,
    commentsCount: 41,
    sharesCount: 53,
    createdAt: 'Há 4 horas',
    vibeTag: '🌍 Planeta Terra',
    isCloudinaryHosted: true,
    musicTitle: 'Savanna Sunset • Acoustic Chill'
  }
];


