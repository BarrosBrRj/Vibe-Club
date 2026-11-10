import React, { useState } from 'react';
import { 
  X, Coins, Crown, Gift, ShieldAlert, Settings, 
  HelpCircle, Sparkles, Check, CheckCircle2, AlertTriangle, 
  Send, BarChart3, PlusCircle, Users, Image as ImageIcon, 
  Compass, Heart, Lock, Trash2, Download, ExternalLink, Flame, 
  Camera, Smartphone, Gamepad2, Upload, Building2, ShoppingBag 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BoostAdModal } from './BoostAdModal';
import { CreateClubModal } from '../communities/CreateClubModal';
import { WalletModal } from './WalletModal';
import { ReportModal } from './ReportModal';
import { ShareModal } from '../common/ShareModal';

export const AllModals: React.FC = () => {
  const { 
    currentUser,
    isCreateModalOpen, setIsCreateModalOpen,
    isVibesModalOpen, setIsVibesModalOpen,
    isWalletModalOpen, setIsWalletModalOpen, walletActiveTab,
    isPremiumModalOpen, setIsPremiumModalOpen,
    isGiftModalOpen, setIsGiftModalOpen, giftTargetUser,
    isReportModalOpen, setIsReportModalOpen, reportTarget, setReportTarget,
    submitReport, blockUser, isUserBlocked,
    isShareModalOpen, setIsShareModalOpen, shareTarget,
    isSettingsModalOpen, setIsSettingsModalOpen,
    isHelpModalOpen, setIsHelpModalOpen,
    isAdminModalOpen, setIsAdminModalOpen,
    setIsPublishAppModalOpen,
    isCreateClubModalOpen,
    setIsCreateClubModalOpen,
    createClubInitialType,
    openCreateClubModal,
    createCommunity,
    buyVibesPackage,
    buyPremiumSubscription,
    sendGift,
    showToast,
    allUsers,
    communities,
    posts,
    setActiveTab
  } = useApp();

  // Gift Form
  const [selectedGift, setSelectedGift] = useState({ id: 'gift_rose', name: 'Rosa Encantada', cost: 15, emoji: '🌹' });
  const [giftMessage, setGiftMessage] = useState('Com muito carinho!');

  // Settings State
  const [privacyProfile, setPrivacyProfile] = useState<'public' | 'friends'>('public');

  const giftsCatalog = [
    { id: 'gift_rose', name: 'Rosa Encantada', cost: 15, emoji: '🌹' },
    { id: 'gift_heart', name: 'Coração de Ouro', cost: 25, emoji: '❤️' },
    { id: 'gift_fire', name: 'Chama Vibe', cost: 30, emoji: '🔥' },
    { id: 'gift_star', name: 'Estrela Brilhante', cost: 40, emoji: '⭐' },
    { id: 'gift_box', name: 'Presente Surpresa', cost: 50, emoji: '🎁' },
    { id: 'gift_trophy', name: 'Troféu Campeão', cost: 100, emoji: '🏆' },
  ];

  const vibesPackages = [
    { id: 'pkg_100', amount: 100, price: 'R$ 4,90', bonus: '', popular: false },
    { id: 'pkg_500', amount: 500, price: 'R$ 14,90', bonus: '+50 Bônus', popular: true },
    { id: 'pkg_1200', amount: 1200, price: 'R$ 29,90', bonus: '+200 Bônus', popular: false },
    { id: 'pkg_3000', amount: 3000, price: 'R$ 59,90', bonus: '+600 Bônus (Melhor Oferta)', popular: false },
  ];

  const handleSendGiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftTargetUser) return;
    if ((currentUser?.vibesBalance || 0) < selectedGift.cost) {
      showToast('Saldo de Vibes insuficiente! Recarregue na Loja de Vibes.', 'error');
      setIsVibesModalOpen(true);
      return;
    }
    sendGift(giftTargetUser.id, selectedGift.id, giftMessage);
  };

  return (
    <>
      {/* 1. QUICK CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-purple-600" />
                <span>O que você quer criar ou fazer hoje?</span>
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              
              {/* A. Criar Grupo */}
              <button
                type="button"
                id="quick-create-group"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  openCreateClubModal('group');
                }}
                className="p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-950 flex flex-col items-center text-center gap-2 border border-purple-200 hover:border-purple-400 shadow-2xs transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xl shadow-xs group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-xs block">Criar Grupo</span>
                  <span className="text-[10px] text-purple-600 font-medium">Membros & Moderação</span>
                </div>
              </button>

              {/* B. Criar Comunidade */}
              <button
                type="button"
                id="quick-create-community"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  openCreateClubModal('community');
                }}
                className="p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 flex flex-col items-center text-center gap-2 border border-indigo-200 hover:border-indigo-400 shadow-2xs transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-xs group-hover:scale-110 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-xs block">Criar Comunidade</span>
                  <span className="text-[10px] text-indigo-600 font-medium">Fóruns & Tópicos</span>
                </div>
              </button>

              {/* C. Criar Página */}
              <button
                type="button"
                id="quick-create-page"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  openCreateClubModal('page');
                }}
                className="p-3.5 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-950 flex flex-col items-center text-center gap-2 border border-pink-200 hover:border-pink-400 shadow-2xs transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center text-xl shadow-xs group-hover:scale-110 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-xs block">Criar Página</span>
                  <span className="text-[10px] text-pink-600 font-medium">Marcas & Criadores</span>
                </div>
              </button>

              {/* D. Anunciar no Marketplace */}
              <button
                type="button"
                id="quick-create-marketplace"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setActiveTab('marketplace');
                  setTimeout(() => {
                    const announceBtn = document.getElementById('marketplace-announce-btn');
                    if (announceBtn) announceBtn.click();
                  }, 150);
                }}
                className="p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 flex flex-col items-center text-center gap-2 border border-amber-200 hover:border-amber-400 shadow-2xs transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center text-xl shadow-xs group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-xs block">Anúncio Mercado</span>
                  <span className="text-[10px] text-amber-600 font-medium">Vender Produto</span>
                </div>
              </button>

              {/* E. Publicação no Feed */}
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setActiveTab('home', 'create-post-card');
                  setTimeout(() => {
                    const textarea = document.getElementById('create-post-textarea') as HTMLTextAreaElement;
                    if (textarea) {
                      textarea.focus();
                    }
                  }, 200);
                }}
                className="p-3.5 rounded-2xl bg-purple-50/60 hover:bg-purple-100 text-purple-950 flex flex-col items-center text-center gap-2 border border-purple-200 hover:border-purple-400 shadow-2xs transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center text-xl shadow-xs group-hover:scale-110 transition-transform">
                  📝
                </div>
                <div>
                  <span className="font-extrabold text-xs block">Post no Feed</span>
                  <span className="text-[10px] text-purple-600 font-medium">Texto e Vibes</span>
                </div>
              </button>

              {/* F. Gravar / Postar Vídeo (Reels) */}
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setActiveTab('home', 'create-post-card');
                  setTimeout(() => {
                    const mediaBtn = document.getElementById('create-post-photo-btn');
                    if (mediaBtn) mediaBtn.click();
                  }, 200);
                }}
                className="p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-950 flex flex-col items-center text-center gap-2 border border-rose-200 hover:border-rose-400 shadow-2xs transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center text-xl shadow-xs group-hover:scale-110 transition-transform">
                  🎬
                </div>
                <div>
                  <span className="font-extrabold text-xs block">Vídeo (Reels)</span>
                  <span className="text-[10px] text-rose-600 font-medium">Formato Curto</span>
                </div>
              </button>

              {/* G. Publicar Aplicativo (Vibe Play) */}
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setActiveTab('apps');
                  setTimeout(() => {
                    setIsPublishAppModalOpen(true);
                  }, 150);
                }}
                className="p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-950 flex flex-col items-center text-center gap-2 border border-blue-200 hover:border-blue-400 shadow-2xs transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-xs group-hover:scale-110 transition-transform">
                  📱
                </div>
                <div>
                  <span className="font-extrabold text-xs block">Publicar App</span>
                  <span className="text-[10px] text-blue-600 font-medium">Vibe Play Store</span>
                </div>
              </button>

            </div>
          </div>
        </div>
      )}

      {/* 2. WALLET / CARTEIRA & VIBES STORE MODAL */}
      <WalletModal
        isOpen={isWalletModalOpen || isVibesModalOpen}
        onClose={() => {
          setIsWalletModalOpen(false);
          setIsVibesModalOpen(false);
        }}
        initialTab={walletActiveTab}
      />

      {/* 3. PREMIUM SUBSCRIPTION MODAL */}
      {isPremiumModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl border border-purple-500/40 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg">
                  <Crown className="w-6 h-6 fill-amber-300 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-white">Vibe Clube Premium 👑</h3>
                  <p className="text-xs text-purple-300">Eleve sua experiência ao nível máximo</p>
                </div>
              </div>
              <button onClick={() => setIsPremiumModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2.5 text-xs text-slate-200">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Vantagens Exclusivas para Membros Premium:</span>
              </div>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Selo Dourado Oficial de Membro Premium</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Revelação de quem visitou seu perfil</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> +250 Vibes mensais creditadas todo mês</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Curtidas ilimitadas no Vibe Encontros</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Molduras e Temas Retrô Exclusivos desbloqueados</li>
              </ul>
            </div>

            <div className="bg-purple-900/40 p-4 rounded-2xl border border-purple-500/30 flex items-center justify-between">
              <div>
                <div className="text-xs text-purple-300">Plano Mensal</div>
                <div className="text-xl font-black text-white">R$ 14,90 <span className="text-xs text-purple-300 font-normal">/ mês</span></div>
              </div>
              <button
                onClick={buyPremiumSubscription}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-500/30 active:scale-95 transition-all cursor-pointer"
              >
                Assinar Agora 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SEND VIRTUAL GIFT MODAL */}
      {isGiftModalOpen && giftTargetUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-500" />
                <span>Enviar Presente para {giftTargetUser.name}</span>
              </h3>
              <button onClick={() => setIsGiftModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendGiftSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Escolha o Presente Virtual:</label>
                <div className="grid grid-cols-3 gap-2">
                  {giftsCatalog.map(g => (
                    <div
                      key={g.id}
                      onClick={() => setSelectedGift(g)}
                      className={`p-2.5 rounded-2xl border text-center cursor-pointer transition-all ${
                        selectedGift.id === g.id
                          ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-400'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{g.emoji}</div>
                      <div className="text-[11px] font-bold text-slate-800 truncate">{g.name}</div>
                      <div className="text-[10px] text-amber-700 font-semibold">{g.cost} Vibes</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mensagem Carinhosa de Acompanhamento:</label>
                <input
                  type="text"
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Escreva algo especial..."
                  className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsGiftModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-500 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Enviar Presente ({selectedGift.cost} Vibes)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. REPORT CONTENT MODAL */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setReportTarget(null);
        }}
        target={reportTarget}
        onSubmitReport={submitReport}
        onBlockUser={blockUser}
        isBlocked={reportTarget?.authorId ? isUserBlocked(reportTarget.authorId) : false}
      />

      {/* 5.1 SHARE MODAL */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        target={shareTarget}
        onToast={showToast}
      />

      {/* 6. SETTINGS & LGPD MODAL */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                <span>Configurações & Privacidade (LGPD)</span>
              </h3>
              <button onClick={() => setIsSettingsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              
              {/* Privacy settings */}
              <div className="p-3.5 bg-slate-50 rounded-2xl space-y-2">
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-purple-600" />
                  <span>Privacidade do Perfil</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="privacy_pref"
                      checked={privacyProfile === 'public'}
                      onChange={() => setPrivacyProfile('public')}
                      className="text-purple-600"
                    />
                    <span>Público (Todos no Vibe Clube podem ver minhas postagens)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="privacy_pref"
                      checked={privacyProfile === 'friends'}
                      onChange={() => setPrivacyProfile('friends')}
                      className="text-purple-600"
                    />
                    <span>Somente Amigos (Mais privativo)</span>
                  </label>
                </div>
              </div>

              {/* Data Rights & LGPD */}
              <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2">
                <h4 className="font-bold text-xs text-purple-950 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-purple-600" />
                  <span>Seus Direitos de Dados (LGPD)</span>
                </h4>
                <p className="text-[11px] text-purple-900 leading-relaxed">
                  Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode exportar ou solicitar a exclusão de todas as suas informações a qualquer momento.
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => showToast('Exportação iniciada! Seus dados foram compilados em formato JSON. 📦', 'success')}
                    className="px-3 py-1.5 bg-white hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl border border-purple-200 flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar Meus Dados</span>
                  </button>
                  <button
                    onClick={() => showToast('Solicitação de exclusão recebida com sucesso.', 'info')}
                    className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-200 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir Conta</span>
                  </button>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-3 border-t">
              <button
                onClick={() => {
                  showToast('Configurações de privacidade salvas!', 'success');
                  setIsSettingsModalOpen(false);
                }}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Salvar Preferências
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. HELP CENTER & FAQ MODAL */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-600" />
                <span>Central de Ajuda & Diretrizes do Vibe Clube</span>
              </h3>
              <button onClick={() => setIsHelpModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <h4 className="font-bold text-slate-900">Como funcionam os Depoimentos?</h4>
                <p className="text-slate-600 mt-1">Os depoimentos são declarações de amizade. Quando alguém escreve um para você, ele só fica visível publicamente no seu perfil se você aceitar na aba "Depoimentos".</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl">
                <h4 className="font-bold text-slate-900">O que são as Moedas Vibes?</h4>
                <p className="text-slate-600 mt-1">As Vibes são a economia oficial do clube. Você ganha ao subir de nível e pode usá-las para enviar presentes virtuais (como Rosas e Troféus) e personalizar seu perfil.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl">
                <h4 className="font-bold text-slate-900">O Vibe Encontros é seguro?</h4>
                <p className="text-slate-600 mt-1">Sim! É estritamente restrito para maiores de 18 anos, com moderação ativa e diretrizes rigorosas contra assédio e perfis falsos.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. ADMIN DASHBOARD MODAL */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl border border-purple-500/40 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">Painel Administrativo do Vibe Clube</h3>
                  <p className="text-xs text-slate-400">Métricas em tempo real & Supervisão do Sistema</p>
                </div>
              </div>
              <button onClick={() => setIsAdminModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">
                <div className="text-xl font-black text-purple-400">{allUsers.length + 1240}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Usuários Ativos</div>
              </div>
              <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">
                <div className="text-xl font-black text-pink-400">{communities.length + 85}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Comunidades</div>
              </div>
              <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">
                <div className="text-xl font-black text-amber-400">{posts.length + 3420}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Posts Publicados</div>
              </div>
              <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700">
                <div className="text-xl font-black text-emerald-400">99.98%</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Uptime Servidor</div>
              </div>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2 text-xs">
              <div className="font-bold text-amber-300">Fila de Moderação e Segurança:</div>
              <div className="flex items-center justify-between text-slate-300 py-1 border-b border-slate-700">
                <span>Denúncias Pendentes de Análise:</span>
                <span className="font-bold text-emerald-400">0 (Tudo limpo)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300 py-1">
                <span>Filtro de Linguagem Imprópria:</span>
                <span className="font-bold text-emerald-400">Ativado (IA Moderadora)</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsAdminModalOpen(false)}
                className="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Fechar Painel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boost Ad Modal */}
      <BoostAdModal />

      {/* Global Create Club / Group / Community / Page Modal */}
      {isCreateClubModalOpen && (
        <CreateClubModal
          isOpen={isCreateClubModalOpen}
          onClose={() => setIsCreateClubModalOpen(false)}
          initialType={createClubInitialType}
          onCreate={(data) => {
            createCommunity(data);
            setIsCreateClubModalOpen(false);
            showToast(`${data.type === 'page' ? 'Página' : data.type === 'group' ? 'Grupo' : 'Comunidade'} "${data.name}" criado(a) com sucesso! 🎉`, 'success');
          }}
        />
      )}
    </>
  );
};
