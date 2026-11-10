import React, { useState } from 'react';
import { Send, Lock } from 'lucide-react';
import { User } from '../../types';

interface ProfileMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: User;
  onSendMessage: (text: string, isPrivate: boolean) => void;
}

export const ProfileMessageModal: React.FC<ProfileMessageModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  onSendMessage
}) => {
  const [text, setText] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text.trim(), isPrivate);
    setText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 font-sans backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-3.5 px-5 bg-gradient-to-r from-purple-50 via-pink-50 to-white border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full border border-purple-200 bg-slate-100 overflow-hidden shrink-0">
              <img
                src={targetUser.avatar}
                alt={targetUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
              Mensagem para {targetUser.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-600 cursor-pointer text-xs font-bold px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Fechar ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="text-xs text-slate-600 bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
            <strong>Destinatário:</strong> {targetUser.name} (@{targetUser.username})
          </div>

          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Oi ${targetUser.name}! Tudo bem?`}
            className="w-full p-3 bg-slate-50 text-xs sm:text-sm border border-slate-200 rounded-xl outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-200 resize-none font-normal"
          />

          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="rounded accent-purple-600"
            />
            <Lock className="w-3.5 h-3.5 text-purple-600" />
            <span>Mensagem privada (apenas {targetUser.name} poderá ler)</span>
          </label>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:underline cursor-pointer font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="vibe-btn flex items-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs py-1.5 px-4"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar Mensagem</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
