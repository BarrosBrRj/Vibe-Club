import React, { useState } from 'react';
import { Heart, Send, Check, X, ShieldCheck, Sparkles } from 'lucide-react';
import { Testimonial, User } from '../../types';

interface ProfileTestimonialsTabProps {
  testimonials: Testimonial[];
  targetUser: User;
  currentUser: User | null;
  isOwnProfile: boolean;
  onCreateTestimonial: (content: string) => void;
  onApproveTestimonial: (id: string) => void;
  onRejectTestimonial: (id: string) => void;
  onDeleteTestimonial: (id: string) => void;
}

export const ProfileTestimonialsTab: React.FC<ProfileTestimonialsTabProps> = ({
  testimonials,
  targetUser,
  currentUser,
  isOwnProfile,
  onCreateTestimonial,
  onApproveTestimonial,
  onRejectTestimonial,
  onDeleteTestimonial
}) => {
  const [newTestimonialContent, setNewTestimonialContent] = useState('');

  const approvedTestimonials = testimonials.filter(t => t.status === 'approved');
  const pendingTestimonials = testimonials.filter(t => t.status === 'pending');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonialContent.trim()) return;
    onCreateTestimonial(newTestimonialContent.trim());
    setNewTestimonialContent('');
  };

  return (
    <div className="space-y-3 font-sans">
      {/* 1. Caixa de Enviar Depoimento */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-white px-4 py-2.5 border-b border-purple-100 flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 font-extrabold text-slate-900">
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
            <span>{isOwnProfile ? 'Depoimentos de Amizade' : `Escrever depoimento para ${targetUser.name}`}</span>
          </span>
          <span className="text-[11px] font-bold text-pink-700 bg-pink-100/70 px-2.5 py-0.5 rounded-full">
            {approvedTestimonials.length} aprovados
          </span>
        </div>

        {!isOwnProfile ? (
          <form onSubmit={handleSend} className="p-4 space-y-3">
            <p className="text-xs text-slate-500">
              * O depoimento é uma homenagem especial e só aparecerá no perfil de <strong>{targetUser.name}</strong> após aprovação.
            </p>
            <textarea
              rows={3}
              value={newTestimonialContent}
              onChange={(e) => setNewTestimonialContent(e.target.value)}
              placeholder={`"Conheço ${targetUser.name} há anos... Uma pessoa 100% incrível, parceira e de ótima vibe!"`}
              className="w-full p-3 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-pink-500 focus:bg-white outline-hidden transition-all resize-none font-normal"
            />
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400 italic">
                Depoimento não é recado, é uma declaração de amizade!
              </span>
              <button
                type="submit"
                disabled={!newTestimonialContent.trim()}
                className="vibe-btn cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar depoimento</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 text-xs text-slate-600 bg-purple-50/50 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
            <span>
              Este é o seu perfil. Os depoimentos que seus amigos enviarem passarão pela sua aprovação antes de serem publicados.
            </span>
          </div>
        )}
      </div>

      {/* 2. Pendentes para Aprovação */}
      {isOwnProfile && pendingTestimonials.length > 0 && (
        <div className="bg-white border-2 border-pink-400 rounded-2xl shadow-xs overflow-hidden">
          <div className="bg-pink-50 px-4 py-2 border-b border-pink-200 flex items-center justify-between text-xs font-bold text-pink-900">
            <span>Depoimentos aguardando aprovação ({pendingTestimonials.length})</span>
            <span className="text-[11px] text-pink-700 font-normal">Apenas você pode ver</span>
          </div>

          <div className="divide-y divide-pink-100">
            {pendingTestimonials.map((depo) => (
              <div key={depo.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={depo.fromUserAvatar}
                      alt={depo.fromUserName}
                      className="w-10 h-10 rounded-xl object-cover border border-pink-200"
                    />
                    <div>
                      <div className="font-extrabold text-xs text-slate-900">
                        {depo.fromUserName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        @{depo.fromUserUsername} • {depo.createdAt}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={() => onApproveTestimonial(depo.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => onRejectTestimonial(depo.id)}
                      className="px-3 py-1 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Recusar
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-pink-50/50 rounded-xl border border-pink-100 text-xs text-slate-800 leading-relaxed italic">
                  "{depo.content}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Depoimentos Aprovados */}
      <div className="space-y-2.5">
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-white px-4 py-2 border border-slate-200/90 rounded-2xl flex items-center justify-between text-xs">
          <span className="font-extrabold text-slate-900">Depoimentos Públicos ({approvedTestimonials.length})</span>
        </div>

        {approvedTestimonials.length > 0 ? (
          <div className="space-y-2.5">
            {approvedTestimonials.map((depo) => {
              const canDelete = isOwnProfile || (currentUser && depo.fromUserId === currentUser.id);

              return (
                <div
                  key={depo.id}
                  className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden"
                >
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-extrabold text-slate-900">
                      <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                      <span>{depo.fromUserName}</span>
                      <span className="text-[11px] font-normal text-slate-400">(@{depo.fromUserUsername})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">{depo.createdAt}</span>
                      {canDelete && (
                        <button
                          onClick={() => onDeleteTestimonial(depo.id)}
                          className="text-red-600 hover:underline text-xs cursor-pointer"
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-4 flex items-start gap-3.5">
                    <img
                      src={depo.fromUserAvatar}
                      alt={depo.fromUserName}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 text-xs sm:text-sm text-slate-800 leading-relaxed italic">
                      "{depo.content}"
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-8 text-center text-xs text-slate-500 space-y-1">
            <div className="text-2xl mb-1">⭐</div>
            <div className="font-bold text-slate-700 text-sm">Nenhum depoimento ainda</div>
            <p>
              {isOwnProfile
                ? 'Quando seus amigos escreverem depoimentos de amizade, eles aparecerão aqui após você aceitar!'
                : `Escreva o primeiro depoimento para ${targetUser.name}!`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
