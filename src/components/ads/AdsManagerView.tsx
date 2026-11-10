import React, { useState } from 'react';
import { 
  Rocket, TrendingUp, Eye, MessageCircle, DollarSign, 
  Pause, Play, Plus, CheckCircle, Clock, ShieldAlert,
  ArrowRight, ExternalLink, Sparkles, Filter, AlertCircle, QrCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BoostCampaign, AdStatus } from '../../types';

export const AdsManagerView: React.FC = () => {
  const { 
    campaigns, 
    currentUser, 
    pauseCampaign, 
    resumeCampaign, 
    updateCampaignBudget, 
    simulateModerationApproval,
    setActiveTab,
    showToast 
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<'all' | AdStatus>('all');
  const [budgetModalCampaign, setBudgetModalCampaign] = useState<BoostCampaign | null>(null);
  const [extraBudget, setExtraBudget] = useState<number>(30);
  const [extraDays, setExtraDays] = useState<number>(7);
  const [isAddingBudget, setIsAddingBudget] = useState(false);

  // Filter campaigns belonging to the current user (or demo user)
  const userCampaigns = campaigns.filter(c => c.userId === (currentUser?.id || 'user_me'));

  // Metrics totals
  const totalSpent = userCampaigns.reduce((acc, c) => acc + (c.amountSpent || 0), 0);
  const totalBudget = userCampaigns.reduce((acc, c) => acc + (c.budget || 0), 0);
  const totalImpressions = userCampaigns.reduce((acc, c) => acc + (c.impressions || 0), 0);
  const totalInteractions = userCampaigns.reduce((acc, c) => acc + (c.clicks || 0) + (c.messages || 0), 0);
  const activeCount = userCampaigns.filter(c => c.status === 'active').length;
  const inReviewCount = userCampaigns.filter(c => c.status === 'in_review').length;
  const pausedCount = userCampaigns.filter(c => c.status === 'paused').length;

  const filteredCampaigns = userCampaigns.filter(c => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  const handleAddBudgetSubmit = () => {
    if (!budgetModalCampaign) return;
    setIsAddingBudget(true);
    setTimeout(() => {
      updateCampaignBudget(budgetModalCampaign.id, extraBudget, extraDays);
      setIsAddingBudget(false);
      setBudgetModalCampaign(null);
    }, 1000);
  };

  return (
    <div className="space-y-5 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-xs">
                Vibe Clube Ads
              </span>
              <span className="text-[10px] font-bold text-pink-200">
                • 100% via Pix
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1 tracking-tight">
              Painel de Anúncios Impulsionados
            </h2>
            <p className="text-xs sm:text-sm text-purple-100 max-w-xl mt-1 leading-relaxed">
              Monitore impressões, cliques, mensagens e gerencie o orçamento das suas publicações em tempo real.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveTab('home');
              showToast('Escolha um post no seu feed e clique em 🚀 Impulsionar!', 'info');
            }}
            className="self-start sm:self-center px-4 py-2.5 bg-white text-purple-700 hover:bg-purple-50 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <Rocket className="w-4 h-4" />
            <span>Impulsionar Post</span>
          </button>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total Investido */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Investido</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-800">
            R$ {totalBudget.toFixed(2)}
          </div>
          <div className="text-[10px] font-medium text-emerald-600 mt-1">
            Gasto até agora: R$ {totalSpent.toFixed(2)}
          </div>
        </div>

        {/* Card 2: Impressões */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total de Visualizações</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-800">
            {totalImpressions.toLocaleString('pt-BR')}
          </div>
          <div className="text-[10px] font-medium text-purple-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Alcance no feed
          </div>
        </div>

        {/* Card 3: Interações */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Cliques & Conversas</span>
            <div className="p-2 rounded-xl bg-pink-50 text-pink-600">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-800">
            {totalInteractions.toLocaleString('pt-BR')}
          </div>
          <div className="text-[10px] font-medium text-pink-600 mt-1">
            Interações diretas
          </div>
        </div>

        {/* Card 4: Status Ativos */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Status de Campanhas</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Rocket className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
            <span>{activeCount} Ativas</span>
          </div>
          <div className="text-[10px] font-medium text-slate-500 mt-1">
            {inReviewCount} em análise • {pausedCount} pausadas
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Filtrar:
        </span>
        {[
          { id: 'all', label: 'Todas' },
          { id: 'active', label: `Ativas (${activeCount})` },
          { id: 'in_review', label: `Em análise (${inReviewCount})` },
          { id: 'paused', label: `Pausadas (${pausedCount})` },
          { id: 'completed', label: 'Concluídas' }
        ].map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilterStatus(item.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filterStatus === item.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <Rocket className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Nenhuma campanha encontrada neste filtro
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Você pode impulsionar qualquer anúncio do Marketplace ou publicação comum do seu perfil para atrair milhares de pessoas com pagamento Pix!
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer hover:opacity-90"
            >
              Ir para o Feed e Impulsionar
            </button>
          </div>
        ) : (
          filteredCampaigns.map(campaign => {
            const percentageSpent = Math.min(100, Math.round((campaign.amountSpent / campaign.budget) * 100));

            return (
              <div 
                key={campaign.id} 
                className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-purple-200 transition-all space-y-4"
              >
                {/* Top Row: Post Snippet & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {campaign.postSnippet.mediaUrl ? (
                      <img
                        src={campaign.postSnippet.mediaUrl}
                        alt="Anúncio"
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                        <Rocket className="w-6 h-6" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                          {campaign.objective === 'views' ? '👁️ Mais visualizações' : campaign.objective === 'messages' ? '💬 Mais mensagens' : '🔗 Mais cliques'}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          Modelo {campaign.billingModel}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-1 mt-0.5">
                        {campaign.postSnippet.content}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Criado {campaign.createdAt} • Duração total: {campaign.durationDays} dias
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {campaign.status === 'active' && (
                      <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Ativo no feed
                      </span>
                    )}
                    {campaign.status === 'in_review' && (
                      <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Em análise
                      </span>
                    )}
                    {campaign.status === 'paused' && (
                      <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        <Pause className="w-3.5 h-3.5 text-slate-500" />
                        Pausado
                      </span>
                    )}
                    {campaign.status === 'completed' && (
                      <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-500">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Concluído
                      </span>
                    )}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Visualizações</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {campaign.impressions.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">
                      {campaign.objective === 'messages' ? 'Mensagens' : 'Cliques'}
                    </span>
                    <span className="font-bold text-slate-800 text-sm">
                      {(campaign.clicks + campaign.messages).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Consumido / Total</span>
                    <span className="font-bold text-slate-800 text-sm">
                      R$ {campaign.amountSpent.toFixed(2)} / <span className="text-slate-400">R$ {campaign.budget.toFixed(2)}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Tempo Restante</span>
                    <span className="font-bold text-purple-700 text-sm">
                      {campaign.daysRemaining > 0 ? `${campaign.daysRemaining} dias restantes` : 'Encerrado'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>Progresso do orçamento:</span>
                    <span className="font-bold text-slate-700">{percentageSpent}% utilizado</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-pink-500 h-full rounded-full transition-all"
                      style={{ width: `${percentageSpent}%` }}
                    />
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    {campaign.status === 'active' && (
                      <button
                        type="button"
                        onClick={() => pauseCampaign(campaign.id)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Pause className="w-3.5 h-3.5 text-slate-500" />
                        <span>Pausar Anúncio</span>
                      </button>
                    )}

                    {campaign.status === 'paused' && (
                      <button
                        type="button"
                        onClick={() => resumeCampaign(campaign.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Retomar Anúncio</span>
                      </button>
                    )}

                    {campaign.status === 'in_review' && (
                      <button
                        type="button"
                        onClick={() => simulateModerationApproval(campaign.id)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Aprovar na Moderação (Demo)</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setBudgetModalCampaign(campaign)}
                      className="px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-xs font-bold text-purple-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-purple-600" />
                      <span>Adicionar Orçamento (Pix)</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('home');
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-purple-600 flex items-center gap-1 transition-colors cursor-pointer ml-auto"
                  >
                    <span>Ver no feed</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Extra Budget Modal */}
      {budgetModalCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800">Adicionar Orçamento Pix</h4>
                  <p className="text-[11px] text-slate-500">Estenda o alcance do seu anúncio</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBudgetModalCampaign(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-800 truncate">{budgetModalCampaign.postSnippet.content}</div>
              <div>Orçamento atual: R$ {budgetModalCampaign.budget.toFixed(2)}</div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Valor adicional a injetar:</label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 30, 50].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setExtraBudget(val)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      extraBudget === val
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    + R$ {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Dias adicionais:</label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 7, 14].map(days => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setExtraDays(days)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      extraDays === days
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    + {days} dias
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-800">Total a pagar via Pix:</span>
              <span className="font-black text-emerald-700 text-sm">R$ {extraBudget.toFixed(2)}</span>
            </div>

            <button
              type="button"
              disabled={isAddingBudget}
              onClick={handleAddBudgetSubmit}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer hover:opacity-90 disabled:opacity-50"
            >
              {isAddingBudget ? 'Confirmando Pix...' : 'Confirmar e Pagar via Pix'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
