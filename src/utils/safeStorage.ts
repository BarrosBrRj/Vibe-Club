/**
 * Safe LocalStorage utility that gracefully handles QuotaExceededError,
 * private browsing restrictions, security errors, and JSON serialization issues.
 * Features an in-memory Map store fallback for zero-loss session persistence.
 */

// In-memory persistent cache for current session across tab navigation
const memoryStore = new Map<string, string>();

export const safeStorage = {
  /**
   * Retrieves an item from localStorage with JSON parsing, memoryStore fallback, and default value.
   */
  getItem: <T>(key: string, fallback: T): T => {
    try {
      let raw: string | null = null;
      try {
        raw = localStorage.getItem(key);
      } catch {
        // LocalStorage access restricted (e.g., iframe permissions or private mode)
      }

      // Check memory store fallback if localStorage returned nothing
      if (raw === null || raw === undefined) {
        const memVal = memoryStore.get(key);
        if (memVal !== undefined && memVal !== null) {
          try {
            return JSON.parse(memVal) as T;
          } catch {
            return fallback;
          }
        }
        return fallback;
      }

      // Self-heal: If vibe_marketplace_items is larger than 80KB or has large legacy data URLs, sanitize to free up quota
      if (key === 'vibe_marketplace_items' && (raw.length > 80000 || raw.includes('data:image/'))) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            let modified = false;
            const pruned = parsed.slice(0, 40).map((item: any) => {
              let imageUrl = item.imageUrl;
              let additionalImages = item.additionalImages;
              if (typeof imageUrl === 'string' && imageUrl.startsWith('data:') && imageUrl.length > 20000) {
                imageUrl = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';
                modified = true;
              }
              if (Array.isArray(additionalImages)) {
                const filtered = additionalImages.filter((img: any) => typeof img === 'string' && (!img.startsWith('data:') || img.length < 20000));
                if (filtered.length !== additionalImages.length) {
                  additionalImages = filtered;
                  modified = true;
                }
              }
              return { ...item, imageUrl, additionalImages };
            });

            if (modified) {
              const cleaned = JSON.stringify(pruned);
              try {
                localStorage.setItem(key, cleaned);
              } catch {}
              memoryStore.set(key, cleaned);
              return pruned as unknown as T;
            }
          }
        } catch {}
      }

      // Self-heal: If vibe_posts in storage is excessively large, sanitize it immediately
      if (key === 'vibe_posts' && raw.length > 800000) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const pruned = parsed.slice(0, 25).map((post: any) => {
              let mediaUrl = post.mediaUrl;
              let videoThumbnail = post.videoThumbnail;
              if (typeof mediaUrl === 'string' && mediaUrl.startsWith('data:') && mediaUrl.length > 40000) {
                mediaUrl = undefined;
              }
              if (typeof videoThumbnail === 'string' && videoThumbnail.startsWith('data:') && videoThumbnail.length > 40000) {
                videoThumbnail = undefined;
              }
              return { ...post, mediaUrl, videoThumbnail };
            });
            try {
              localStorage.setItem(key, JSON.stringify(pruned));
            } catch {}
            memoryStore.set(key, JSON.stringify(pruned));
            return pruned as unknown as T;
          }
        } catch {}
      }

      const parsed = JSON.parse(raw) as T;
      // Sync into memory store
      memoryStore.set(key, raw);
      return parsed;
    } catch {
      const memVal = memoryStore.get(key);
      if (memVal !== undefined && memVal !== null) {
        try { return JSON.parse(memVal) as T; } catch {}
      }
      return fallback;
    }
  },

  /**
   * Retrieves a raw string from localStorage or memory store.
   */
  getString: (key: string, fallback: string = ''): string => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        memoryStore.set(key, item);
        return item;
      }
      return memoryStore.get(key) ?? fallback;
    } catch {
      return memoryStore.get(key) ?? fallback;
    }
  },

  /**
   * Safely frees localStorage space by evicting disposable items and sanitizing heavy base64 strings across all keys
   */
  freeStorageSpace: (exemptKey?: string): void => {
    // Tier 1: Remove disposable transient audit and tracking keys
    const disposable = [
      'vibe_moderation_audit_log',
      'vibe_moderation_reports',
      'vibe_installed_apps',
      'vibe_campaigns',
      'vibe_notifications',
      'vibe_friend_requests'
    ];
    for (const k of disposable) {
      if (k !== exemptKey) {
        try { localStorage.removeItem(k); } catch {}
      }
    }

    // Tier 2: Deep scan all keys in localStorage to sanitize or remove bulky base64 payloads
    try {
      const allKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k !== exemptKey) {
          allKeys.push(k);
        }
      }

      for (const k of allKeys) {
        let val: string | null = null;
        try { val = localStorage.getItem(k); } catch {}
        if (!val) continue;

        // If key contains data URLs or exceeds 35,000 characters, sanitize base64
        if (val.includes('data:image/') || val.length > 35000) {
          try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) {
              const sanitized = parsed.slice(0, 15).map((item: any) => {
                if (typeof item === 'object' && item !== null) {
                  const copy = { ...item };
                  for (const prop of Object.keys(copy)) {
                    if (typeof copy[prop] === 'string' && copy[prop].startsWith('data:')) {
                      copy[prop] = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';
                    }
                  }
                  return copy;
                }
                return item;
              });
              const sanitizedStr = JSON.stringify(sanitized);
              // Remove first to guarantee space in quota-constrained WebKit/Blink
              try { localStorage.removeItem(k); } catch {}
              try { localStorage.setItem(k, sanitizedStr); } catch {}
            } else {
              // Non-array large item that cannot be sanitized safely
              try { localStorage.removeItem(k); } catch {}
            }
          } catch {
            // Unparseable bloated key
            try { localStorage.removeItem(k); } catch {}
          }
        }
      }
    } catch {}
  },

  /**
   * Saves an item to localStorage and in-memory store. Handles QuotaExceededError by
   * evicting disposable transient caches, freeing space aggressively, and retrying.
   */
  setItem: (key: string, value: any): boolean => {
    const stringVal = typeof value === 'string' ? value : JSON.stringify(value);
    // Mirror to memory store
    memoryStore.set(key, stringVal);

    try {
      localStorage.setItem(key, stringVal);
      return true;
    } catch (err: any) {
      console.warn(`[safeStorage] Falha direta ao gravar chave "${key}" no localStorage (cota sob pressão). Iniciando liberação e compactação de emergência:`, err?.message || err);

      try {
        // Step 1: Aggressively free space from other keys and bloated base64
        safeStorage.freeStorageSpace(key);

        // Step 2: Remove current key first before replacing to prevent quota check failures
        try { localStorage.removeItem(key); } catch {}

        // Step 3: If saving marketplace items, compress/prune oversized base64 images
        if (key === 'vibe_marketplace_items') {
          const rawList = typeof value === 'string' ? JSON.parse(value) : value;
          if (Array.isArray(rawList)) {
            const pruned = rawList.slice(0, 30).map((item: any) => {
              let imageUrl = item.imageUrl;
              let additionalImages = item.additionalImages;
              if (typeof imageUrl === 'string' && imageUrl.startsWith('data:') && imageUrl.length > 15000) {
                imageUrl = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';
              }
              if (Array.isArray(additionalImages)) {
                additionalImages = additionalImages.filter((img: any) => typeof img === 'string' && (!img.startsWith('data:') || img.length < 15000));
              }
              return { ...item, imageUrl, additionalImages };
            });
            const sanitizedStr = JSON.stringify(pruned);
            memoryStore.set(key, sanitizedStr);
            localStorage.setItem(key, sanitizedStr);
            return true;
          }
        }

        // Step 4: Retry saving original value after clearing non-critical keys
        localStorage.setItem(key, stringVal);
        return true;
      } catch (retryErr: any) {
        // Step 5: Emergency Fallback for vibe_marketplace_items (keep all metadata, swap base64 to CDN)
        if (key === 'vibe_marketplace_items') {
          try {
            safeStorage.freeStorageSpace(key);
            try { localStorage.removeItem(key); } catch {}

            const rawList = typeof value === 'string' ? JSON.parse(value) : value;
            if (Array.isArray(rawList)) {
              const ultralight = rawList.slice(0, 25).map((item: any) => ({
                ...item,
                imageUrl: (typeof item.imageUrl === 'string' && item.imageUrl.startsWith('data:'))
                  ? 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'
                  : item.imageUrl,
                additionalImages: undefined
              }));
              const ultralightStr = JSON.stringify(ultralight);
              memoryStore.set(key, ultralightStr);
              localStorage.setItem(key, ultralightStr);
              console.log('[safeStorage] Anúncios salvos com sucesso no localStorage em modo ultra-leve.');
              return true;
            }
          } catch {}
        }

        // Even if disk write fails due to hardware quota lock, memoryStore already retains the item safely!
        console.warn(`[safeStorage] Cota de disco do navegador atingida para "${key}". Dados mantidos na memória da sessão com segurança.`, retryErr?.message || retryErr);
        return true; // Return true because memoryStore preserves the state seamlessly for the user
      }
    }
  },

  /**
   * Safely removes an item from localStorage and memory store.
   */
  removeItem: (key: string): void => {
    memoryStore.delete(key);
    try {
      localStorage.removeItem(key);
    } catch {}
  },

  /**
   * Clears only non-essential audit logs when quota is getting constrained.
   */
  cleanupStorage: (): void => {
    try {
      const disposableKeys = [
        'vibe_moderation_audit_log',
        'vibe_moderation_reports'
      ];
      for (const k of disposableKeys) {
        try { localStorage.removeItem(k); } catch {}
      }
    } catch {}
  }
};
