import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(true);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if dismissed previously within 3 days
    const dismissedAt = localStorage.getItem('vibe_pwa_dismissed_at');
    if (dismissedAt) {
      const diff = Date.now() - parseInt(dismissedAt, 10);
      if (diff < 3 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Delay banner display slightly so it doesn't interrupt immediate initial render
    const timer = setTimeout(() => {
      if (!isInstalled && (isInstallable || isIOS)) {
        setIsDismissed(false);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled, isIOS]);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('vibe_pwa_dismissed_at', Date.now().toString());
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
    } else {
      const success = await installApp();
      if (success) {
        setIsDismissed(true);
      }
    }
  };

  if (isDismissed || isInstalled) return null;

  return (
    <>
      <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in fade-in slide-in-from-bottom-5">
        <div className="bg-slate-900/95 backdrop-blur-md border border-purple-500/40 rounded-2xl p-3.5 sm:p-4 shadow-2xl text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Official Vibe Clube PWA Logo */}
            <div className="w-11 h-11 rounded-xl bg-black p-1 shrink-0 shadow-md border border-purple-500/40 overflow-hidden flex items-center justify-center">
              <img 
                src="/icon.svg" 
                alt="Vibe Clube Logo" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
                <span>Instalar Vibe Clube</span>
                <span className="text-[10px] bg-purple-500/30 text-purple-300 font-bold px-1.5 py-0.5 rounded-full border border-purple-400/30">App PWA</span>
              </h4>
              <p className="text-xs text-slate-300 truncate">Acesso instantâneo e offline na tela inicial</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari instructions modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl border border-purple-500/40 p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <img 
                  src="/icon.svg" 
                  alt="Vibe Clube Logo" 
                  className="w-6 h-6 object-contain rounded-md bg-black"
                />
                <span>Instalar no iPhone/iPad</span>
              </h3>
              <button onClick={() => setShowIOSInstructions(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>Para adicionar o Vibe Clube à tela de início no iOS Safari:</p>
              <ol className="space-y-2 list-decimal list-inside bg-slate-800/60 p-3 rounded-2xl border border-slate-700">
                <li className="flex items-center gap-2">
                  <Share className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Toque no botão <strong>Compartilhar</strong> na barra do Safari.</span>
                </li>
                <li className="flex items-center gap-2">
                  <PlusSquare className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.</span>
                </li>
                <li>Confirme tocando em <strong>Adicionar</strong> no canto superior direito.</li>
              </ol>
            </div>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Entendido!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
