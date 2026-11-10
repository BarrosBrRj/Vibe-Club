import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    try {
      // Check if running in standalone mode (already installed)
      const isStandalone = 
        (typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)')?.matches) ||
        (typeof navigator !== 'undefined' && (navigator as any).standalone === true);

      if (isStandalone) {
        setIsInstalled(true);
        return;
      }

      // Check if iOS device
      const userAgent = typeof navigator !== 'undefined' ? (navigator.userAgent || '').toLowerCase() : '';
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isIosDevice);

      const handler = (e: Event) => {
        try {
          e.preventDefault();
          setDeferredPrompt(e as BeforeInstallPromptEvent);
          setIsInstallable(true);
        } catch {}
      };

      window.addEventListener('beforeinstallprompt', handler);

      const onAppInstalled = () => {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
      };

      window.addEventListener('appinstalled', onAppInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
        window.removeEventListener('appinstalled', onAppInstalled);
      };
    } catch {}
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return false;
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult && choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
    } catch (err) {
      console.warn('PWA prompt handled error:', err);
    }
    return false;
  };

  return {
    isInstallable,
    isInstalled,
    isIOS,
    installApp
  };
}
