import React, { useState } from 'react';
import { 
  MessageSquare, Send, Trash2, Reply, Lock, Smile, CornerDownRight
} from 'lucide-react';
import { Scrap, User } from '../../types';
import { AnimatedEmojiPicker } from '../emoji/AnimatedEmojiPicker';

interface ProfileMuralTabProps {
  scraps: Scrap[];
  targetUser: User;
  currentUser: User | null;
  isOwnProfile: boolean;
  onSendScrap: (content: string, emoji?: string, isPrivate?: boolean) => void;
  onReplyScrap: (scrapId: string, content: string) => void;
  onDeleteScrap: (scrapId: string) => void;
}

export const ProfileMuralTab: React.FC<ProfileMuralTabProps> = ({
  scraps,
  targetUser,
  currentUser,
  isOwnProfile,
  onSendScrap,
  onReplyScrap,
  onDeleteScrap
}) => {
  const [newScrapText, setNewScrapText] = useState('');
  const [newScrapEmoji, setNewScrapEmoji] = useState('✨');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  // Replying state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Sort newest first
  const sortedScraps = [...scraps].sort((a, b) => {
    return (b.id || '').localeCompare(a.id || '');
  });

  const handleSubmitScrap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScrapText.trim()) return;
    onSendScrap(newScrapText.trim(), newScrapEmoji, isPrivate);
    setNewScrapText('');
    setIsPrivate(false);
  };

  const handleSendReply = (scrapId: string) => {
    if (!replyText.trim()) return;
    onReplyScrap(scrapId, replyText.trim());
    setReplyText('');
    setReplyingToId(null);
  };

  return (
    <div className="space-y-3 font-sans">
      
      {/* 1. Deixar Recado Box */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-white text-slate-900 font-extrabold text-xs px-4 py-2.5 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
            <span>{isOwnProfile ? 'Mural de Recados' : `Deixar recado para ${targetUser.name}`}</span>
          </div>
          <span className="text-[11px] font-bold text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-full">
            {scraps.length} recados
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmitScrap} className="p-4 space-y-3">
          <textarea
            rows={3}
            value={newScrapText}
            onChange={(e) => setNewScrapText(e.target.value)}
            placeholder={isOwnProfile ? "Escreva um recado de boas-vindas no seu próprio mural..." : `Escreva uma mensagem bem legal para ${targetUser.name}...`}
            className="w-full p-3 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 focus:bg-white outline-hidden transition-all resize-none font-normal"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              {/* Emoji selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                  title="Escolher Emoticon"
                >
                  <Smile className="w-3.5 h-3.5 text-purple-600" />
                  <span>{newScrapEmoji} Emoticon</span>
                </button>

                {isEmojiPickerOpen && (
                  <div className="absolute top-9 left-0 z-30 bg-white rounded-2xl shadow-xl border border-slate-200 p-2">
                    <AnimatedEmojiPicker
                      onSelectEmoji={(emoji) => {
                        setNewScrapEmoji(emoji);
                        setIsEmojiPickerOpen(false);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Private scrap toggle */}
              <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="rounded text-purple-600 w-3.5 h-3.5 cursor-pointer"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Recado secreto (apenas {targetUser.name.split(' ')[0]} poderá ler)</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!newScrapText.trim()}
              className="vibe-btn"
            >
              <Send className="w-3 h-3" />
              <span>Enviar recado</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Lista de Recados */}
      <div className="space-y-3">
        {sortedScraps.length > 0 ? (
          sortedScraps.map((scrap) => {
            const canDelete = isOwnProfile || (currentUser && scrap.fromUserId === currentUser.id);

            return (
              <div
                key={scrap.id}
                className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden"
              >
                {/* Header of the scrap */}
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="hover:text-purple-700 cursor-pointer">{scrap.fromUserName}</span>
                    {scrap.emoji && <span className="text-base">{scrap.emoji}</span>}
                    {scrap.isPrivate && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        🔒 Secreto
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{scrap.createdAt}</span>
                </div>

                {/* Content */}
                <div className="p-4 flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl border border-slate-200 bg-slate-100 shrink-0 overflow-hidden">
                    <img
                      src={scrap.fromUserAvatar}
                      alt={scrap.fromUserName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                      {scrap.content}
                    </p>

                    {/* Replies if any */}
                    {scrap.replies && scrap.replies.length > 0 && (
                      <div className="mt-2.5 space-y-2">
                        {scrap.replies.map(reply => (
                          <div key={reply.id} className="pl-3.5 border-l-2 border-purple-600 bg-purple-50/50 rounded-r-xl p-2.5 text-xs text-slate-700">
                            <div className="font-extrabold text-purple-900 text-xs mb-0.5">
                              {reply.authorName} respondeu:
                            </div>
                            <p>{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-3 text-xs">
                      {isOwnProfile && (
                        <button
                          onClick={() => setReplyingToId(replyingToId === scrap.id ? null : scrap.id)}
                          className="text-purple-700 hover:text-purple-900 font-bold hover:underline cursor-pointer"
                        >
                          Responder
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => onDeleteScrap(scrap.id)}
                          className="text-red-600 hover:text-red-800 hover:underline cursor-pointer text-xs"
                        >
                          Excluir recado
                        </button>
                      )}
                    </div>

                    {/* Inline reply box */}
                    {replyingToId === scrap.id && (
                      <div className="mt-2.5 flex items-center gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Escreva sua resposta..."
                          className="flex-1 p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-purple-500 focus:bg-white"
                        />
                        <button
                          onClick={() => handleSendReply(scrap.id)}
                          className="vibe-btn text-xs py-2"
                        >
                          Enviar
                        </button>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            );
          })
        ) : (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-8 text-center text-xs text-slate-500 space-y-1">
            <div className="text-2xl mb-1">💌</div>
            <div className="font-bold text-slate-700 text-sm">Nenhum recado ainda</div>
            <p>Seja o primeiro a deixar uma mensagem no mural de {targetUser.name}!</p>
          </div>
        )}
      </div>

    </div>
  );
};
