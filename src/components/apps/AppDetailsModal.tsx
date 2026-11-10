import React, { useState } from 'react';
import { 
  X, Star, Download, CheckCircle2, ShieldCheck, Share2, 
  Smartphone, HardDrive, Calendar, User as UserIcon, ThumbsUp, 
  MessageSquare, Sparkles, ExternalLink, ArrowLeft, Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppItem } from '../../types';

interface AppDetailsModalProps {
  app: AppItem | null;
  onClose: () => void;
}

export const AppDetailsModal: React.FC<AppDetailsModalProps> = ({ app, onClose }) => {
  const { 
    currentUser, 
    installedAppIds, 
    installApp, 
    rateApp, 
    likeAppReview, 
    showToast 
  } = useApp();

  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'changelog'>('about');
  
  // Review form
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!app) return null;

  const isInstalled = installedAppIds.includes(app.id);

  const handleInstall = () => {
    if (isInstalled) {
      showToast(`Abrindo ${app.name}...`, 'info');
      return;
    }

    setIsInstalling(true);
    setInstallProgress(15);

    const interval = setInterval(() => {
      setInstallProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsInstalling(false);
            installApp(app.id);
          }, 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 200);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showToast('Escreva um comentário sobre o app.', 'error');
      return;
    }
    rateApp(app.id, newRating, newTitle.trim(), newComment.trim());
    setNewTitle('');
    setNewComment('');
    setShowReviewForm(false);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link do aplicativo copiado para a área de transferência!', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 my-auto">
        
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-extrabold text-xs transition-colors cursor-pointer shadow-2xs group"
              title="Voltar aos Aplicativos"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-purple-600 transition-transform group-hover:-translate-x-1" />
              <span>Voltar</span>
            </button>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-extrabold uppercase tracking-wider rounded-md">
              {app.category}
            </span>
            {app.editorsChoice && (
              <span className="hidden sm:flex px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-md items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Escolha dos Editores
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
              title="Compartilhar"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          
          {/* Main App Info Header */}
          <div className="flex items-start gap-4 sm:gap-5">
            <img
              src={app.iconUrl}
              alt={app.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl object-cover shadow-md border border-slate-100 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {app.name}
              </h1>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-purple-700 font-bold">
                <span>{app.developer.name}</span>
                {app.developer.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-100" />
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">{app.packageName}</p>

              {/* Tagline */}
              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                {app.tagline}
              </p>
            </div>
          </div>

          {/* Metrics Row (Rating, Downloads, Size, Age) */}
          <div className="grid grid-cols-4 gap-2 py-3 px-2 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <div className="border-r border-slate-200/60">
              <div className="flex items-center justify-center gap-1 font-extrabold text-xs sm:text-sm text-slate-800">
                <span>{app.rating.toFixed(1)}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{app.ratingsCount.toLocaleString()} avaliações</div>
            </div>

            <div className="border-r border-slate-200/60">
              <div className="font-extrabold text-xs sm:text-sm text-slate-800">
                {app.downloadsCount > 1000 ? `${(app.downloadsCount / 1000).toFixed(1)}k+` : app.downloadsCount}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Downloads</div>
            </div>

            <div className="border-r border-slate-200/60">
              <div className="font-extrabold text-xs sm:text-sm text-slate-800">
                {app.size}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Tamanho APK</div>
            </div>

            <div>
              <div className="font-extrabold text-xs sm:text-sm text-slate-800">
                {app.ageRating}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Classificação</div>
            </div>
          </div>

          {/* Install / Download Action Button */}
          <div className="space-y-2">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              id={`btn-install-${app.id}`}
              className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2.5 shadow-md cursor-pointer ${
                isInstalled
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  : isInstalling
                  ? 'bg-purple-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-600/25 active:scale-98'
              }`}
            >
              {isInstalled ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Aplicativo Instalado (Abrir)</span>
                </>
              ) : isInstalling ? (
                <>
                  <Download className="w-5 h-5 animate-bounce" />
                  <span>Baixando e Instalando APK ({installProgress}%)...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Instalar Aplicativo ({app.size})</span>
                </>
              )}
            </button>

            {isInstalling && (
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-purple-600 h-full transition-all duration-200" 
                  style={{ width: `${installProgress}%` }}
                />
              </div>
            )}

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Verificado pelo Vibe Play Protect
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                {app.minAndroid}
              </span>
            </div>
          </div>

          {/* Screenshots Gallery */}
          {app.screenshots && app.screenshots.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Capturas de Tela do Aplicativo
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {app.screenshots.map((shot, idx) => (
                  <img
                    key={idx}
                    src={shot}
                    alt={`${app.name} preview ${idx + 1}`}
                    className="h-52 w-auto rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0 hover:scale-102 transition-transform cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tabs: Sobre o App, Avaliações, Atualizações */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex border-b border-slate-100 mb-4 gap-6 text-xs font-bold">
              <button
                onClick={() => setActiveTab('about')}
                className={`pb-2.5 transition-colors relative cursor-pointer ${
                  activeTab === 'about' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Sobre o App
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2.5 transition-colors relative cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'reviews' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span>Avaliações</span>
                <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-full text-[10px]">
                  {app.comments.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('changelog')}
                className={`pb-2.5 transition-colors relative cursor-pointer ${
                  activeTab === 'changelog' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Novidades ({app.version})
              </button>
            </div>

            {/* TAB: ABOUT */}
            {activeTab === 'about' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p className="whitespace-pre-line">{app.description}</p>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-800">Informações Técnicas</h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div><span className="text-slate-400">Versão:</span> {app.version}</div>
                    <div><span className="text-slate-400">Requisito:</span> {app.minAndroid}</div>
                    <div><span className="text-slate-400">Desenvolvedor:</span> {app.developer.name}</div>
                    <div><span className="text-slate-400">Data de publicação:</span> {app.createdAt}</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-5">
                {/* Review Action Trigger */}
                <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Já usou este aplicativo?</h4>
                    <p className="text-[11px] text-slate-500">Deixe sua nota com estrelas e opinião!</p>
                  </div>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="py-2 px-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>Avaliar App</span>
                  </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Sua nota:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-slate-300 fill-slate-100'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Título da sua avaliação (ex: Muito bom!)"
                      className="w-full p-2.5 bg-white text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                    />

                    <textarea
                      required
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Conte para outros usuários como foi sua experiência com este aplicativo..."
                      className="w-full p-2.5 bg-white text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium resize-none"
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="py-1.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="py-1.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publicar Avaliação</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-3">
                  {app.comments.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      Nenhuma avaliação ainda. Seja o primeiro a avaliar!
                    </div>
                  ) : (
                    app.comments.map((rev) => (
                      <div key={rev.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={rev.userAvatar}
                              alt={rev.userName}
                              className="w-7 h-7 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <span className="font-bold text-xs text-slate-800 block">{rev.userName}</span>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-2.5 h-2.5 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400">{rev.createdAt}</span>
                        </div>

                        {rev.title && (
                          <div className="font-bold text-xs text-slate-800">{rev.title}</div>
                        )}
                        <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => likeAppReview(app.id, rev.id)}
                            className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                              rev.isLiked ? 'text-purple-600 bg-purple-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{rev.likesCount > 0 ? rev.likesCount : 'Útil'}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: CHANGELOG */}
            {activeTab === 'changelog' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>Versão {app.version}</span>
                  <span className="text-slate-400 font-normal">{app.createdAt}</span>
                </div>
                <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                  {app.changelog || '• Correções de bugs e otimizações de performance geral.'}
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
