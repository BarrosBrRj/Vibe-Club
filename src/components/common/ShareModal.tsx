import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Send, Twitter, Mail, ExternalLink } from 'lucide-react';
import { ShareTarget } from '../../types/moderation';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: ShareTarget | null;
  onToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, target, onToast }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !target) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(target.url);
    setCopied(true);
    onToast?.('Link copiado com sucesso para a área de transferência! 📋', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const encodedUrl = encodeURIComponent(target.url);
  const encodedText = encodeURIComponent(`${target.title} - Veja no Vibe Clube:`);

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`, '_blank');
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank');
  };

  const shareEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(target.title)}&body=${encodedText}%20${encodedUrl}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Compartilhar</h3>
              <p className="text-xs text-slate-500 truncate max-w-[240px]">{target.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Snippet / preview */}
        {target.text && (
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 line-clamp-2 italic">
            "{target.text}"
          </div>
        )}

        {/* Quick Social Buttons */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">Compartilhar diretamente:</label>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={shareWhatsApp}
              className="flex flex-col items-center justify-center p-3 rounded-2xl border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all cursor-pointer group"
            >
              <MessageCircle className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform text-emerald-600" />
              <span className="text-[11px] font-bold">WhatsApp</span>
            </button>

            <button
              onClick={shareTelegram}
              className="flex flex-col items-center justify-center p-3 rounded-2xl border border-sky-100 bg-sky-50 hover:bg-sky-100 text-sky-700 transition-all cursor-pointer group"
            >
              <Send className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform text-sky-500" />
              <span className="text-[11px] font-bold">Telegram</span>
            </button>

            <button
              onClick={shareTwitter}
              className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 transition-all cursor-pointer group"
            >
              <Twitter className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform text-slate-800" />
              <span className="text-[11px] font-bold">X / Twitter</span>
            </button>

            <button
              onClick={shareEmail}
              className="flex flex-col items-center justify-center p-3 rounded-2xl border border-purple-100 bg-purple-50 hover:bg-purple-100 text-purple-700 transition-all cursor-pointer group"
            >
              <Mail className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform text-purple-600" />
              <span className="text-[11px] font-bold">E-mail</span>
            </button>
          </div>
        </div>

        {/* Copy Link Input */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">Ou copie o link:</label>
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            <input
              type="text"
              readOnly
              value={target.url}
              className="flex-1 bg-transparent px-2.5 text-xs text-slate-700 outline-hidden select-all font-mono truncate"
            />
            <button
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                copied 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
