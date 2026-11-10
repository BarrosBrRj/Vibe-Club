import React, { useState, useEffect } from 'react';
import { 
  X, Rocket, Eye, MessageCircle, ExternalLink, Users, 
  MapPin, Calendar, CheckCircle, Copy, Check, ShieldAlert,
  Sparkles, ArrowRight, ArrowLeft, QrCode, AlertCircle, RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdObjective, AudienceScope, AdAudience } from '../../types';

export const BoostAdModal: React.FC = () => {
  const { 
    isBoostModalOpen, 
    setIsBoostModalOpen, 
    boostTargetPost, 
    communities, 
    currentUser,
    createBoostCampaign,
    confirmPixPayment,
    simulateModerationApproval,
    setActiveTab,
    showToast
  } = useApp();

  // Multi-step flow: 1 (objective), 2 (audience), 3 (budget), 4 (review & payment), 5 (success / moderation)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [copiedPix, setCopiedPix] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [createdCampaignId, setCreatedCampaignId] = useState<string | null>(null);

  // Form State
  const [objective, setObjective] = useState<AdObjective>('views');
  const [audienceScope, setAudienceScope] = useState<AudienceScope>('all');
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [targetState, setTargetState] = useState<string>('BR');
  const [targetCity, setTargetCity] = useState<string>('');
  const [ageMin, setAgeMin] = useState<number>(18);
  const [ageMax, setAgeMax] = useState<number>(55);
  
  // Budget and Duration
  const [budget, setBudget] = useState<number>(30);
  const [durationDays, setDurationDays] = useState<number>(7);

  // Reset or initialize modal when opened
  useEffect(() => {
    if (isBoostModalOpen) {
      setStep(1);
      setCopiedPix(false);
      setIsProcessingPayment(false);
      setCreatedCampaignId(null);
      setObjective('views');
      setBudget(30);
      setDurationDays(7);
      if (communities.length > 0) {
        setSelectedGroupIds([communities[0].id]);
      }
    }
  }, [isBoostModalOpen, communities]);

  if (!isBoostModalOpen || !boostTargetPost) return null;

  // Real-time calculations
  const dailyBudget = Number((budget / durationDays).toFixed(2));
  const cpm = objective === 'views' ? 12 : objective === 'messages' ? 15 : 14;
  const baseReach = Math.round((budget / cpm) * 1000);
  const estimatedReachMin = Math.round(baseReach * 0.8);
  const estimatedReachMax = Math.round(baseReach * 1.25);

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroupIds(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId) 
        : [...prev, groupId]
    );
  };

  const handleGenerateCampaign = () => {
    const audience: AdAudience = {
      scope: audienceScope,
      targetGroupIds: audienceScope === 'groups' ? selectedGroupIds : undefined,
      state: targetState !== 'BR' ? targetState : undefined,
      city: targetCity.trim() ? targetCity.trim() : undefined,
      ageMin,
      ageMax
    };

    const campaign = createBoostCampaign({
      postId: boostTargetPost.id,
      objective,
      audience,
      budget,
      durationDays
    });

    setCreatedCampaignId(campaign.id);
    setStep(4);
  };

  const handleConfirmPix = () => {
    if (!createdCampaignId) return;
    setIsProcessingPayment(true);
    setTimeout(() => {
      confirmPixPayment(createdCampaignId);
      setIsProcessingPayment(false);
      setStep(5);
    }, 1500);
  };

  const handleCopyPixCode = () => {
    const pixCode = `00020126580014br.gov.bcb.pix0136${Date.now()}-mp-vibeclube-pix520400005303986540${budget.toFixed(2)}5802BR5916VIBE CLUBE ADS6009SAO PAULO62070503***6304A1B2`;
    navigator.clipboard.writeText(pixCode);
    setCopiedPix(true);
    showToast('Código Pix Copia e Cola copiado com sucesso!', 'success');
    setTimeout(() => setCopiedPix(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/70 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto animate-in fade-in">
      <div 
        className="w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] transition-all"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-pink-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Rocket className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
                  Impulsionar Anúncio
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                  PIX Real
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {step === 1 && 'Etapa 1 de 4: Objetivo do anúncio'}
                {step === 2 && 'Etapa 2 de 4: Público-alvo e segmentação'}
                {step === 3 && 'Etapa 3 de 4: Orçamento e duração'}
                {step === 4 && 'Etapa 4 de 4: Revisão e Pagamento Pix'}
                {step === 5 && 'Campanha Enviada com Sucesso'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBoostModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer border border-slate-200"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        {step <= 4 && (
          <div className="w-full bg-slate-100 h-1.5 flex">
            <div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* STEP 1: OBJETIVO */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-800">
                  O que você quer alcançar?
                </h4>
                <p className="text-xs sm:text-sm text-slate-500">
                  Escolha o objetivo principal para otimizar a distribuição do seu anúncio no feed.
                </p>
              </div>

              <div className="space-y-3">
                {/* Opção A: Mais Visualizações */}
                <div
                  onClick={() => setObjective('views')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                    objective === 'views'
                      ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${objective === 'views' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Eye className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-slate-800">Mais visualizações</h5>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">
                        CPM • Impressões
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Mostre seu anúncio para o maior número possível de pessoas que navegam no Vibe Clube. Ideal para marcas e notoriedade.
                    </p>
                  </div>
                </div>

                {/* Opção B: Mais Mensagens */}
                <div
                  onClick={() => setObjective('messages')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                    objective === 'messages'
                      ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${objective === 'messages' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-slate-800">Mais mensagens</h5>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-pink-100 text-pink-700">
                        CPC • Conversas
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Incentiva pessoas interessadas a abrirem uma conversa direta ou negociarem pelo chat privado. Ideal para vendas e marketplace.
                    </p>
                  </div>
                </div>

                {/* Opção C: Mais Cliques no Link */}
                <div
                  onClick={() => setObjective('clicks')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                    objective === 'clicks'
                      ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${objective === 'clicks' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <ExternalLink className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-slate-800">Mais cliques no link</h5>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
                        CPC • Tráfego
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Direciona o público para seu site externo, catálogo, página no Vibe Clube ou botão direto do WhatsApp.
                    </p>
                  </div>
                </div>
              </div>

              {/* Informação sobre dinheiro real */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Aviso:</strong> O sistema de impulsionamento utiliza <strong>Pix (dinheiro real)</strong>. A postagem gratuita no Marketplace continua 100% gratuita. Moedas virtuais do Vibe Clube não são aplicáveis nesta área.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: PÚBLICO-ALVO */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-800">
                  Quem deve ver seu anúncio?
                </h4>
                <p className="text-xs sm:text-sm text-slate-500">
                  Defina o alcance geográfico e as comunidades onde o post será exibido.
                </p>
              </div>

              {/* Scope Selection */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAudienceScope('all')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    audienceScope === 'all'
                      ? 'border-purple-600 bg-purple-50/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Users className="w-5 h-5 text-purple-600 mb-1.5" />
                  <div className="text-xs sm:text-sm font-bold text-slate-800">Todo o Vibe Clube</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Feed principal de todos os usuários</div>
                </button>

                <button
                  type="button"
                  onClick={() => setAudienceScope('groups')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    audienceScope === 'groups'
                      ? 'border-purple-600 bg-purple-50/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-pink-600 mb-1.5" />
                  <div className="text-xs sm:text-sm font-bold text-slate-800">Grupos específicos</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Público segmentado por interesse</div>
                </button>
              </div>

              {/* If Groups selected */}
              {audienceScope === 'groups' && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="text-xs font-bold text-slate-700">Selecione os grupos para veicular:</div>
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                    {communities.map(c => {
                      const isChecked = selectedGroupIds.includes(c.id);
                      return (
                        <label 
                          key={c.id} 
                          className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleGroupToggle(c.id)}
                            className="rounded-sm text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                          />
                          <img src={c.logo} alt={c.name} className="w-7 h-7 rounded-lg object-cover" />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold text-slate-800 truncate">{c.name}</div>
                            <div className="text-[10px] text-slate-500">{c.membersCount} membros • {c.category}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  {selectedGroupIds.length === 0 && (
                    <p className="text-[11px] text-amber-600">Selecione pelo menos um grupo.</p>
                  )}
                </div>
              )}

              {/* Geographical & Demographic Filters */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  Localização e Idade
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Estado</label>
                    <select
                      value={targetState}
                      onChange={e => setTargetState(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 cursor-pointer"
                    >
                      <option value="BR">Brasil Inteiro (Todos)</option>
                      <option value="SP">São Paulo (SP)</option>
                      <option value="RJ">Rio de Janeiro (RJ)</option>
                      <option value="MG">Minas Gerais (MG)</option>
                      <option value="RS">Rio Grande do Sul (RS)</option>
                      <option value="PR">Paraná (PR)</option>
                      <option value="BA">Bahia (BA)</option>
                      <option value="PE">Pernambuco (PE)</option>
                      <option value="SC">Santa Catarina (SC)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Cidade (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ex: São Paulo, Campinas..."
                      value={targetCity}
                      onChange={e => setTargetCity(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Age Range */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>Faixa Etária</span>
                    <span className="text-purple-600 font-bold">{ageMin} a {ageMax} anos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="18"
                      max="40"
                      value={ageMin}
                      onChange={e => setAgeMin(Math.min(Number(e.target.value), ageMax - 2))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                    <input
                      type="range"
                      min="30"
                      max="65"
                      value={ageMax}
                      onChange={e => setAgeMax(Math.max(Number(e.target.value), ageMin + 2))}
                      className="w-full accent-pink-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Reach Preview Badge */}
              <div className="p-3.5 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-transparent border border-purple-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-slate-500">Alcance estimado aproximado:</div>
                  <div className="text-base font-black text-purple-900">
                    {estimatedReachMin.toLocaleString('pt-BR')} a {estimatedReachMax.toLocaleString('pt-BR')} pessoas
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-white border border-purple-200 text-purple-700 shadow-xs">
                  Alta relevância 🎯
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: ORÇAMENTO E DURAÇÃO */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-800">
                  Quanto você quer investir?
                </h4>
                <p className="text-xs sm:text-sm text-slate-500">
                  Defina o investimento total e a quantidade de dias da campanha.
                </p>
              </div>

              {/* Quick Budget Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Valores rápidos:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 50, 100].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setBudget(val)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        budget === val
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 scale-102'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      R$ {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Slider */}
              <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">Orçamento Total:</span>
                  <div className="text-base sm:text-lg font-black text-purple-700">
                    R$ {budget.toFixed(2)}
                  </div>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                  <span>Mínimo: R$ 10</span>
                  <span>Máximo: R$ 500</span>
                </div>
              </div>

              {/* Duration Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  Duração da Campanha:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { days: 1, label: '1 dia' },
                    { days: 3, label: '3 dias' },
                    { days: 7, label: '7 dias' },
                    { days: 14, label: '14 dias' }
                  ].map(item => (
                    <button
                      key={item.days}
                      type="button"
                      onClick={() => setDurationDays(item.days)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        durationDays === item.days
                          ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metrics Summary Box */}
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 space-y-2.5">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Investimento diário:</span>
                  <span className="font-bold text-slate-800">R$ {dailyBudget.toFixed(2)} / dia</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Alcance estimado total:</span>
                  <span className="font-black text-purple-700">{estimatedReachMin.toLocaleString('pt-BR')} a {estimatedReachMax.toLocaleString('pt-BR')} pessoas</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Modelo de cobrança:</span>
                  <span className="font-bold text-slate-700">
                    {objective === 'views' ? 'CPM (por mil impressões)' : 'CPC (por clique/interação)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: RESUMO E PAGAMENTO PIX */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-800">
                  Revise seu anúncio e pague via Pix
                </h4>
                <p className="text-xs sm:text-sm text-slate-500">
                  Confirme os detalhes e realize a transferência Pix para ativar a veiculação.
                </p>
              </div>

              {/* Post Preview Snippet */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex gap-3 items-center">
                {boostTargetPost.mediaUrl ? (
                  <img
                    src={boostTargetPost.mediaUrl}
                    alt="Post media"
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                    <Rocket className="w-6 h-6" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      Patrocinado • 🚀 Impulsionado
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 line-clamp-2 font-medium">
                    {boostTargetPost.content}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Por {boostTargetPost.authorName}</p>
                </div>
              </div>

              {/* Order Summary Details */}
              <div className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Objetivo:</span>
                  <span className="font-bold text-slate-800">
                    {objective === 'views' ? 'Mais visualizações' : objective === 'messages' ? 'Mais mensagens' : 'Mais cliques no link'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Público:</span>
                  <span className="font-bold text-slate-800">
                    {audienceScope === 'all' ? 'Todo o Vibe Clube (Nacional)' : `${selectedGroupIds.length} grupo(s) selecionado(s)`}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Duração:</span>
                  <span className="font-bold text-slate-800">{durationDays} dias</span>
                </div>
                <div className="flex justify-between py-1 pt-1.5">
                  <span className="text-sm font-bold text-slate-800">Valor Total a Pagar (Pix):</span>
                  <span className="text-base font-black text-emerald-600">R$ {budget.toFixed(2)}</span>
                </div>
              </div>

              {/* PIX Payment Section */}
              <div className="p-4 bg-emerald-50/70 border-2 border-emerald-200 rounded-2xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-emerald-700" />
                    <span className="text-xs sm:text-sm font-bold text-emerald-900">
                      Pagamento Instantâneo via Pix
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                    Sem taxas
                  </span>
                </div>

                {/* QR Code and Instructions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3.5 rounded-xl border border-emerald-200">
                  {/* Fake QR Code Graphic */}
                  <div className="w-28 h-28 bg-slate-900 rounded-xl p-2 flex flex-col items-center justify-center shrink-0 shadow-xs relative">
                    <div className="w-full h-full border-2 border-white flex items-center justify-center p-1 bg-white rounded-lg">
                      {/* Grid representation */}
                      <div className="grid grid-cols-5 gap-1 w-full h-full p-1">
                        <div className="bg-slate-900 rounded-xs"></div>
                        <div className="bg-slate-900 rounded-xs"></div>
                        <div className="bg-white"></div>
                        <div className="bg-slate-900 rounded-xs"></div>
                        <div className="bg-slate-900 rounded-xs"></div>
                        <div className="bg-slate-900 rounded-xs"></div>
                        <div className="bg-white"></div>
                        <div className="bg-slate-900 rounded-xs"></div>
                        <div className="bg-white"></div>
                        <div className="bg-slate-900 rounded-xs"></div>
                        <div className="bg-white"></div>
                        <div className="bg-slate-900 rounded-xs"></div>
                        <div className="bg-emerald-600 rounded-xs"></div>
                        <div className="bg-slate-900 rounded-xs"></div>
                        <div className="bg-white"></div>
                        <div className="bg-slate-900 rounded-xs"></div>
                        <div className="bg-slate-900 rounded-xs"></div>
                        <div className="bg-white"></div>
                        <div className="bg-slate-900 rounded-xs"></div>
                        <div className="bg-slate-900 rounded-xs"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                    <div className="text-xs font-bold text-slate-800">Escaneie o QR Code no app do seu banco</div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Abra o app do seu banco, escolha Pix, selecione "Ler QR Code" ou copie o código Pix abaixo.
                    </p>
                    <div className="pt-1 text-[11px] font-bold text-emerald-700">
                      Beneficiário: VIBE CLUBE ADS LTDA
                    </div>
                  </div>
                </div>

                {/* Pix Copia e Cola */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-600">Código Pix Copia e Cola:</div>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={`00020126580014br.gov.bcb.pix0136${createdCampaignId || Date.now()}-mp-vibeclube-pix520400005303986540${budget.toFixed(2)}5802BR5916VIBE CLUBE ADS6009SAO PAULO62070503***6304A1B2`}
                      className="w-full text-[11px] font-mono bg-white px-3 py-2 border border-slate-200 rounded-xl text-slate-600 truncate"
                    />
                    <button
                      type="button"
                      onClick={handleCopyPixCode}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer shadow-xs"
                    >
                      {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>

                {/* Action to confirm payment */}
                <button
                  type="button"
                  onClick={handleConfirmPix}
                  disabled={isProcessingPayment}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-black rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verificando pagamento Pix...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>JÁ FIZ O PIX / CONFIRMAR PAGAMENTO</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SUCESSO & MODERAÇÃO */}
          {step === 5 && (
            <div className="space-y-4 py-4 text-center animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-amber-500/25">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Status: 🛡️ Em análise
                </span>
                <h4 className="text-lg sm:text-xl font-black text-slate-800 mt-2">
                  Anúncio enviado para a moderação!
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                  Seu pagamento Pix de <strong>R$ {budget.toFixed(2)}</strong> foi confirmado! Por segurança de todos os usuários, todo anúncio passa por uma rápida fila de análise antes de entrar no feed.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Pagamento Pix confirmado (100% aprovado)
                </div>
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <ClockIcon className="w-4 h-4 text-amber-600" />
                  Tempo estimado de análise: poucos minutos
                </div>
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Rocket className="w-4 h-4 text-purple-600" />
                  Veiculação automática assim que aprovado
                </div>
              </div>

              {/* Demo test button to approve right now */}
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 max-w-md mx-auto space-y-2">
                <p className="text-[11px] text-purple-700 font-medium">
                  💡 <strong>Ambiente de Demonstração:</strong> Você pode aprovar o anúncio imediatamente para testar o feed com status ativo!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (createdCampaignId) {
                      simulateModerationApproval(createdCampaignId);
                    }
                    setIsBoostModalOpen(false);
                    setActiveTab('profile');
                  }}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  ⚡ Aprovar Agora na Moderação (Modo Teste)
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsBoostModalOpen(false);
                    setActiveTab('profile');
                  }}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Ver Meus Anúncios
                </button>
                <button
                  type="button"
                  onClick={() => setIsBoostModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Voltar ao Feed
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        {step < 4 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(prev => (prev - 1) as any)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={() => {
                if (step === 1) setStep(2);
                else if (step === 2) {
                  if (audienceScope === 'groups' && selectedGroupIds.length === 0) {
                    showToast('Selecione ao menos um grupo para continuar', 'error');
                    return;
                  }
                  setStep(3);
                }
                else if (step === 3) handleGenerateCampaign();
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-purple-500/25 transition-all cursor-pointer"
            >
              <span>{step === 3 ? 'Avançar para Pagamento' : 'Continuar'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
