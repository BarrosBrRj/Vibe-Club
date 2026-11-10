import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Coins, DollarSign, Wallet, CreditCard, Sparkles, Check, 
  Copy, Clock, ArrowUpRight, ArrowDownLeft, ShieldCheck, 
  AlertCircle, Plus, Trash2, ExternalLink, Calendar, Filter, 
  ShoppingBag, CheckCircle2, ChevronRight, Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { WalletTab, VibesTransaction, MarketplaceAdSpend, SavedPaymentMethod } from '../../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: WalletTab;
}

export const WalletModal: React.FC<WalletModalProps> = ({ 
  isOpen, 
  onClose, 
  initialTab = 'balance' 
}) => {
  const { 
    currentUser, 
    walletActiveTab, 
    setWalletActiveTab, 
    vibesTransactions, 
    addVibesTransaction,
    marketplaceAdSpends,
    savedPaymentMethods,
    addSavedPaymentMethod,
    removeSavedPaymentMethod,
    setDefaultSavedPaymentMethod,
    buyVibesWithPix,
    setActiveTab,
    showToast 
  } = useApp();

  const [activeTab, setActiveTabState] = useState<WalletTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTabState(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (walletActiveTab) {
      setActiveTabState(walletActiveTab);
    }
  }, [walletActiveTab]);

  const handleTabChange = (tab: WalletTab) => {
    setActiveTabState(tab);
    setWalletActiveTab(tab);
  };

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Packages defined per user spec:
  // 50 Vibes = R$4,90 | 150 Vibes = R$12,90 | 400 Vibes = R$29,90 (MAIS POPULAR) | 1000 Vibes = R$59,90 (MELHOR OFERTA)
  const packages = [
    {
      id: 'pkg_50',
      amount: 50,
      price: 4.90,
      bonus: 0,
      tag: null,
      unitPrice: 'R$ 0,098 / vibe',
      description: 'Ideal para experimentar e enviar seus primeiros presentes'
    },
    {
      id: 'pkg_150',
      amount: 150,
      price: 12.90,
      bonus: 10,
      tag: 'BOM CUSTO',
      unitPrice: 'R$ 0,086 / vibe',
      description: 'Ótimo para desbloquear chats e enviar Super Likes'
    },
    {
      id: 'pkg_400',
      amount: 400,
      price: 29.90,
      bonus: 40,
      popular: true,
      tag: 'MAIS POPULAR',
      unitPrice: 'R$ 0,074 / vibe',
      description: 'O pacote preferido pelos membros do Vibe Encontros'
    },
    {
      id: 'pkg_1000',
      amount: 1000,
      price: 59.90,
      bonus: 150,
      bestOffer: true,
      tag: 'MELHOR OFERTA',
      unitPrice: 'R$ 0,059 / vibe',
      description: 'Máxima economia com +150 Vibes de bônus exclusivos'
    }
  ];

  // Pix Checkout State (Mercado Pago flow)
  const [selectedPkgForPix, setSelectedPkgForPix] = useState<typeof packages[0] | null>(null);
  const [pixTimeRemaining, setPixTimeRemaining] = useState<number>(15 * 60); // 15 mins in seconds
  const [isCopiedPix, setIsCopiedPix] = useState(false);
  const [isConfirmingPix, setIsConfirmingPix] = useState(false);

  // Period filters
  type PeriodFilter = '7days' | '30days' | 'all';
  const [statementPeriod, setStatementPeriod] = useState<PeriodFilter>('30days');
  const [statementType, setStatementType] = useState<'all' | 'income' | 'expense'>('all');
  const [adSpendPeriod, setAdSpendPeriod] = useState<PeriodFilter>('30days');

  // Add Payment Method Form State
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [paymentFormType, setPaymentFormType] = useState<'pix' | 'credit_card'>('pix');
  const [pixKeyType, setPixKeyType] = useState<'cpf' | 'email' | 'phone' | 'random'>('cpf');
  const [pixKeyValue, setPixKeyValue] = useState('');
  const [pixAsDefault, setPixAsDefault] = useState(true);

  // Card form state
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardAsDefault, setCardAsDefault] = useState(false);

  // Countdown timer for Pix modal
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedPkgForPix && pixTimeRemaining > 0) {
      interval = setInterval(() => {
        setPixTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedPkgForPix, pixTimeRemaining]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleOpenPixForPackage = (pkg: typeof packages[0]) => {
    setSelectedPkgForPix(pkg);
    setPixTimeRemaining(15 * 60);
    setIsCopiedPix(false);
  };

  const handleCopyPix = () => {
    if (!selectedPkgForPix) return;
    const dummyPix = `00020126580014br.gov.bcb.pix0136vibeclube-${selectedPkgForPix.id}-mp-${Date.now()}5204000053039865405${selectedPkgForPix.price.toFixed(2)}5802BR5916VIBE CLUBE LTDA6009SAO PAULO62070503***6304A9B2`;
    navigator.clipboard.writeText(dummyPix).catch(() => {});
    setIsCopiedPix(true);
    showToast('Código Pix Copia e Cola copiado com sucesso!', 'success');
    setTimeout(() => setIsCopiedPix(false), 3000);
  };

  const handleConfirmPixPayment = () => {
    if (!selectedPkgForPix) return;
    setIsConfirmingPix(true);

    setTimeout(() => {
      setIsConfirmingPix(false);
      buyVibesWithPix(selectedPkgForPix.id);
      setSelectedPkgForPix(null);
      handleTabChange('vibes_statement');
    }, 1200);
  };

  // Filter vibes transactions
  const filteredVibesTransactions = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    return vibesTransactions.filter(tx => {
      // Period filter
      if (statementPeriod === '7days' && now - tx.timestamp > 7 * dayMs) return false;
      if (statementPeriod === '30days' && now - tx.timestamp > 30 * dayMs) return false;

      // Type filter
      if (statementType === 'income' && tx.amount <= 0) return false;
      if (statementType === 'expense' && tx.amount >= 0) return false;

      return true;
    });
  }, [vibesTransactions, statementPeriod, statementType]);

  // Statistics for vibes statement
  const vibesStatementStats = useMemo(() => {
    let totalIn = 0;
    let totalOut = 0;
    filteredVibesTransactions.forEach(tx => {
      if (tx.amount > 0) totalIn += tx.amount;
      else totalOut += Math.abs(tx.amount);
    });
    return { totalIn, totalOut };
  }, [filteredVibesTransactions]);

  // Filter ad spends
  const filteredAdSpends = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    return marketplaceAdSpends.filter(ad => {
      if (adSpendPeriod === '7days' && now - ad.timestamp > 7 * dayMs) return false;
      if (adSpendPeriod === '30days' && now - ad.timestamp > 30 * dayMs) return false;
      return true;
    });
  }, [marketplaceAdSpends, adSpendPeriod]);

  // Total spent in ads this current month
  const totalAdSpentThisMonth = useMemo(() => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return marketplaceAdSpends
      .filter(ad => ad.timestamp >= thirtyDaysAgo)
      .reduce((sum, ad) => sum + ad.amountBrl, 0);
  }, [marketplaceAdSpends]);

  // Handle add payment method
  const handleSavePaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentFormType === 'pix') {
      if (!pixKeyValue.trim()) {
        showToast('Informe a sua chave Pix.', 'error');
        return;
      }
      addSavedPaymentMethod({
        type: 'pix',
        label: `Chave Pix ${pixKeyType.toUpperCase()}`,
        details: pixKeyValue.trim(),
        isDefault: pixAsDefault,
        brand: 'pix',
        pixKeyType
      });
      showToast('Chave Pix cadastrada com sucesso!', 'success');
      setPixKeyValue('');
      setIsAddingPayment(false);
    } else {
      if (!cardNumber.trim() || !cardHolder.trim() || !cardExpiry.trim()) {
        showToast('Preencha todos os campos do cartão.', 'error');
        return;
      }
      const last4 = cardNumber.replace(/\D/g, '').slice(-4) || '1234';
      const cleanNum = cardNumber.replace(/\D/g, '');
      let brand: 'mastercard' | 'visa' | 'elo' = 'mastercard';
      if (cleanNum.startsWith('4')) brand = 'visa';
      else if (cleanNum.startsWith('5')) brand = 'mastercard';
      else if (cleanNum.startsWith('6')) brand = 'elo';

      addSavedPaymentMethod({
        type: 'credit_card',
        label: `${brand.toUpperCase()} final ${last4}`,
        details: `•••• ${last4} - Venc. ${cardExpiry.trim()}`,
        isDefault: cardAsDefault,
        brand
      });
      showToast('Cartão de crédito salvo com sucesso!', 'success');
      setCardNumber('');
      setCardHolder('');
      setCardExpiry('');
      setCardCvv('');
      setIsAddingPayment(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div 
        id="vibe-wallet-modal-container"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full my-auto overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-slate-900 tracking-tight">Carteira & Saldo</h2>
                <span className="text-[10px] font-black uppercase bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  Vibe Clube
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Gerencie suas Vibes (Encontros) e seus investimentos em anúncios (Marketplace)
              </p>
            </div>
          </div>
          <button
            id="wallet-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            title="Fechar carteira"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-3 sm:px-5 gap-1 overflow-x-auto scrollbar-none">
          <button
            id="wallet-tab-balance"
            onClick={() => handleTabChange('balance')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'balance'
                ? 'border-purple-600 text-purple-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-500" />
            <span>Saldo & Comprar Vibes</span>
          </button>

          <button
            id="wallet-tab-vibes-statement"
            onClick={() => handleTabChange('vibes_statement')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'vibes_statement'
                ? 'border-purple-600 text-purple-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4 text-purple-600" />
            <span>Extrato de Vibes</span>
          </button>

          <button
            id="wallet-tab-ads-spend"
            onClick={() => handleTabChange('ads_spend')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'ads_spend'
                ? 'border-purple-600 text-purple-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Gastos com Anúncios (R$)</span>
          </button>

          <button
            id="wallet-tab-payment-methods"
            onClick={() => handleTabChange('payment_methods')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'payment_methods'
                ? 'border-purple-600 text-purple-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4 text-slate-500" />
            <span>Métodos de Pagamento</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: SALDO & COMPRA DE VIBES */}
          {activeTab === 'balance' && (
            <div className="space-y-6">
              {/* 1. Card de Saldo em Destaque com Gradiente */}
              <div 
                id="wallet-balance-highlight-card"
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 p-6 text-white shadow-xl shadow-purple-500/20"
              >
                {/* Decorative background circle */}
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <div className="absolute right-6 top-6 text-6xl opacity-20 select-none pointer-events-none">
                  🪙
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-100 flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-amber-300 fill-amber-300" />
                      Saldo Atual de Vibes
                    </span>
                    <span className="text-[11px] font-extrabold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white">
                      Moeda Interna
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-xs">
                        {currentUser?.vibesBalance.toLocaleString('pt-BR') || 0}
                      </span>
                      <span className="text-xl font-bold text-amber-200">Vibes</span>
                    </div>

                    <div className="sm:ml-auto">
                      <button
                        id="wallet-quick-buy-btn"
                        onClick={() => {
                          const el = document.getElementById('wallet-packages-grid');
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="px-5 py-2.5 rounded-xl bg-white text-purple-900 hover:bg-purple-50 font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-purple-600" />
                        <span>Comprar Vibes</span>
                      </button>
                    </div>
                  </div>

                  {/* Clarifications & Business Rules */}
                  <div className="pt-2 border-t border-white/20 text-xs space-y-1 text-purple-100">
                    <p className="flex items-center gap-1.5 font-semibold">
                      <span>✨</span>
                      <span>Vibes são usadas <strong>apenas na aba Encontros</strong> (desbloqueio de conversas, envio de presentes e Super Likes).</span>
                    </p>
                    <p className="text-[11px] text-white/80 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 shrink-0 text-amber-200" />
                      <span>Vibes não são reembolsáveis nem sacáveis em dinheiro e não podem ser convertidas de volta em moeda real.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Grid de Pacotes de Compra de Vibes */}
              <div id="wallet-packages-grid" className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Pacotes de Compra de Vibes</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pagamento seguro e instantâneo via Pix Mercado Pago
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      id={`wallet-pkg-${pkg.id}`}
                      className={`relative rounded-2xl p-4 transition-all flex flex-col justify-between border ${
                        pkg.popular
                          ? 'bg-gradient-to-br from-purple-50/90 via-pink-50/40 to-white border-purple-400 ring-2 ring-purple-400 shadow-md'
                          : pkg.bestOffer
                          ? 'bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30 border-amber-300 ring-1 ring-amber-300 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-purple-200 hover:shadow-sm'
                      }`}
                    >
                      {/* Tag Highlight Badge */}
                      {pkg.tag && (
                        <span className={`absolute -top-2.5 right-4 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs ${
                          pkg.popular
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-amber-500 text-white'
                        }`}>
                          {pkg.tag}
                        </span>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">🪙</span>
                            <div>
                              <div className="font-black text-lg text-slate-900 leading-tight">
                                {pkg.amount.toLocaleString('pt-BR')} Vibes
                              </div>
                              {pkg.bonus > 0 ? (
                                <div className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-md inline-block">
                                  +{pkg.bonus} Vibes bônus
                                </div>
                              ) : (
                                <div className="text-[11px] text-slate-400">{pkg.unitPrice}</div>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xl font-black text-purple-700">
                              R$ {pkg.price.toFixed(2).replace('.', ',')}
                            </div>
                            {pkg.bonus > 0 && (
                              <div className="text-[10px] text-slate-400 font-medium">
                                {pkg.unitPrice}
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-snug">
                          {pkg.description}
                        </p>
                      </div>

                      <div className="pt-3.5 mt-3 border-t border-slate-100">
                        <button
                          id={`wallet-buy-btn-${pkg.id}`}
                          onClick={() => handleOpenPixForPackage(pkg)}
                          className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98 ${
                            pkg.popular
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-purple-500/25'
                              : 'bg-slate-900 hover:bg-slate-800 text-white'
                          }`}
                        >
                          <span>Pagar R$ {pkg.price.toFixed(2).replace('.', ',')} via Pix</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distinction Banner: Encontros vs Marketplace */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600">
                <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-extrabold text-slate-800 block">
                    Dois fluxos financeiros distintos para sua tranquilidade:
                  </span>
                  <p>
                    <strong>1. Vibes:</strong> Moeda virtual comprada com dinheiro real, exclusiva para paqueras, presentes e conexões no <strong>Vibe Encontros</strong>.
                  </p>
                  <p>
                    <strong>2. Marketplace:</strong> Impulsionamentos de anúncios no topo são pagos diretamente em <strong>Reais (R$)</strong> no ato do anúncio, sem descontar nem misturar com suas Vibes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXTRATO DE VIBES */}
          {activeTab === 'vibes_statement' && (
            <div className="space-y-4">
              {/* Summary of period */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3.5">
                  <div className="text-[11px] font-bold text-purple-700 uppercase">Saldo Disponível</div>
                  <div className="text-2xl font-black text-purple-900 mt-0.5">
                    {currentUser?.vibesBalance || 0} Vibes
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5">
                  <div className="text-[11px] font-bold text-emerald-700 uppercase">Total Entradas</div>
                  <div className="text-2xl font-black text-emerald-800 mt-0.5">
                    +{vibesStatementStats.totalIn} Vibes
                  </div>
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5">
                  <div className="text-[11px] font-bold text-rose-700 uppercase">Total Utilizado</div>
                  <div className="text-2xl font-black text-rose-800 mt-0.5">
                    -{vibesStatementStats.totalOut} Vibes
                  </div>
                </div>
              </div>

              {/* Filters Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                {/* Period Pills */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setStatementPeriod('7days')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      statementPeriod === '7days' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Últimos 7 dias
                  </button>
                  <button
                    onClick={() => setStatementPeriod('30days')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      statementPeriod === '30days' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Últimos 30 dias
                  </button>
                  <button
                    onClick={() => setStatementPeriod('all')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      statementPeriod === 'all' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tudo
                  </button>
                </div>

                {/* Type Filter */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400 font-medium hidden sm:inline">Tipo:</span>
                  <select
                    value={statementType}
                    onChange={(e) => setStatementType(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-2.5 py-1 font-bold focus:outline-hidden focus:border-purple-400"
                  >
                    <option value="all">Todas as transações</option>
                    <option value="income">Apenas Entradas (+)</option>
                    <option value="expense">Apenas Gastos (-)</option>
                  </select>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-2 pt-1">
                {filteredVibesTransactions.length > 0 ? (
                  filteredVibesTransactions.map((tx) => {
                    const isPositive = tx.amount > 0;
                    return (
                      <div
                        key={tx.id}
                        className="bg-white border border-slate-200 hover:border-purple-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-colors shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                            isPositive ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
                          }`}>
                            {isPositive ? <ArrowDownLeft className="w-5 h-5 text-emerald-600" /> : <ArrowUpRight className="w-5 h-5 text-rose-600" />}
                          </div>

                          <div className="min-w-0">
                            <div className="font-extrabold text-sm text-slate-900 truncate">
                              {tx.description}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                              <span>{tx.date}</span>
                              <span>•</span>
                              <span className="capitalize font-medium text-slate-500">
                                {tx.category === 'store' ? 'Loja Pix' : 
                                 tx.category === 'chat_unlock' ? 'Encontros' : 
                                 tx.category === 'superlike' ? 'Super Like' : 
                                 tx.category === 'bonus' ? 'Bônus' : 'Encontros'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className={`font-black text-sm sm:text-base flex items-center justify-end gap-1 ${
                            isPositive ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                            <span>{isPositive ? `+${tx.amount}` : tx.amount}</span>
                            <Coins className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] text-slate-400">Vibes</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-2">
                    <Coins className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold">Nenhuma movimentação encontrada para o período selecionado.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: GASTOS COM ANÚNCIOS (MARKETPLACE - R$) */}
          {activeTab === 'ads_spend' && (
            <div className="space-y-4">
              {/* Rule alert banner */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 space-y-1">
                  <span className="font-extrabold block">
                    Cobrança Direta em Reais (R$)
                  </span>
                  <p>
                    Os gastos com impulsionamento de anúncios no topo do Marketplace são faturados <strong>diretamente em dinheiro real (R$)</strong> via Pix ou Cartão. Eles <strong>não utilizam nem deduzem moedas Vibes</strong>.
                  </p>
                </div>
              </div>

              {/* Monthly Total Spend Card */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    Investimento nos Últimos 30 Dias
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                    R$ {totalAdSpentThisMonth.toFixed(2).replace('.', ',')}
                  </div>
                  <p className="text-xs text-slate-400">
                    Total pago para manter anúncios impulsionados no topo do Vibe Marketplace
                  </p>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => {
                      onClose();
                      setActiveTab('marketplace');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Ir para o Marketplace</span>
                  </button>
                </div>
              </div>

              {/* Filter */}
              <div className="flex items-center justify-between pt-1">
                <h4 className="font-extrabold text-sm text-slate-900">
                  Histórico de Impulsionamentos
                </h4>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setAdSpendPeriod('7days')}
                    className={`px-3 py-1 font-bold rounded-lg transition-colors cursor-pointer ${
                      adSpendPeriod === '7days' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    7 dias
                  </button>
                  <button
                    onClick={() => setAdSpendPeriod('30days')}
                    className={`px-3 py-1 font-bold rounded-lg transition-colors cursor-pointer ${
                      adSpendPeriod === '30days' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    30 dias
                  </button>
                  <button
                    onClick={() => setAdSpendPeriod('all')}
                    className={`px-3 py-1 font-bold rounded-lg transition-colors cursor-pointer ${
                      adSpendPeriod === 'all' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Tudo
                  </button>
                </div>
              </div>

              {/* List of Ads Spends */}
              <div className="space-y-3">
                {filteredAdSpends.length > 0 ? (
                  filteredAdSpends.map((ad) => (
                    <div
                      key={ad.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {ad.itemImage ? (
                          <img
                            src={ad.itemImage}
                            alt={ad.itemTitle}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}

                        <div className="min-w-0 space-y-1">
                          <div className="font-extrabold text-sm text-slate-900 truncate">
                            {ad.itemTitle}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                            <span className="font-bold text-slate-700">Duração: {ad.durationDays} dias</span>
                            <span>•</span>
                            <span>{ad.startDate}</span>
                            <span>•</span>
                            <span className="text-[11px] font-medium uppercase bg-slate-100 px-1.5 py-0.2 rounded text-slate-600">
                              {ad.paymentMethod === 'pix' ? 'Pix Mercado Pago' : 'Cartão de Crédito'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <div className="font-black text-base text-slate-900">
                            R$ {ad.amountBrl.toFixed(2).replace('.', ',')}
                          </div>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            ad.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {ad.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                            {ad.status === 'active' ? 'Ativo no topo' : 'Encerrado'}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            setActiveTab('marketplace');
                          }}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          title="Ver anúncio no Marketplace"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-2">
                    <DollarSign className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold">Nenhum impulsionamento encontrado no período.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: MÉTODOS DE PAGAMENTO */}
          {activeTab === 'payment_methods' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Formas de Pagamento Salvas</h3>
                  <p className="text-xs text-slate-500">
                    Facilite suas recargas de Vibes e impulsionamentos no Marketplace
                  </p>
                </div>
                {!isAddingPayment && (
                  <button
                    onClick={() => setIsAddingPayment(true)}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                )}
              </div>

              {/* Add form */}
              {isAddingPayment && (
                <form 
                  onSubmit={handleSavePaymentMethod}
                  className="bg-purple-50/60 border border-purple-200 rounded-2xl p-4 space-y-4 animate-in fade-in"
                >
                  <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                    <span className="font-extrabold text-xs text-purple-900 uppercase">
                      Novo Método de Pagamento
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingPayment(false)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Form type selector */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentFormType('pix')}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                        paymentFormType === 'pix'
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>Chave Pix</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentFormType('credit_card')}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                        paymentFormType === 'credit_card'
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Cartão de Crédito</span>
                    </button>
                  </div>

                  {paymentFormType === 'pix' ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Tipo de Chave Pix
                        </label>
                        <select
                          value={pixKeyType}
                          onChange={(e) => setPixKeyType(e.target.value as any)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                        >
                          <option value="cpf">CPF</option>
                          <option value="email">E-mail</option>
                          <option value="phone">Telefone celular</option>
                          <option value="random">Chave Aleatória (EVP)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Sua Chave Pix
                        </label>
                        <input
                          type="text"
                          value={pixKeyValue}
                          onChange={(e) => setPixKeyValue(e.target.value)}
                          placeholder={
                            pixKeyType === 'cpf' ? '000.000.000-00' :
                            pixKeyType === 'email' ? 'voce@exemplo.com' :
                            pixKeyType === 'phone' ? '(11) 98765-4321' : 'Chave aleatória de 32 dígitos'
                          }
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                          required
                        />
                      </div>

                      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={pixAsDefault}
                          onChange={(e) => setPixAsDefault(e.target.checked)}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span>Definir como chave padrão do clube</span>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nome no Cartão</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="Ex: LUCAS SILVA"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs uppercase font-medium text-slate-800"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Número do Cartão</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Validade (MM/AA)</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/28"
                            maxLength={5}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="123"
                            maxLength={4}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
                            required
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={cardAsDefault}
                          onChange={(e) => setCardAsDefault(e.target.checked)}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span>Definir como cartão principal</span>
                      </label>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingPayment(false)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-xs cursor-pointer"
                    >
                      Salvar Método
                    </button>
                  </div>
                </form>
              )}

              {/* Methods List */}
              <div className="space-y-2.5">
                {savedPaymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                        {method.type === 'pix' ? (
                          <span className="font-black text-xs text-purple-700">PIX</span>
                        ) : (
                          <CreditCard className="w-5 h-5 text-purple-600" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">{method.label}</span>
                          {method.isDefault && (
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full">
                              Padrão
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {method.details}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!method.isDefault && (
                        <button
                          onClick={() => {
                            setDefaultSavedPaymentMethod(method.id);
                            showToast('Método definido como padrão!', 'info');
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                        >
                          Tornar Padrão
                        </button>
                      )}

                      <button
                        onClick={() => {
                          removeSavedPaymentMethod(method.id);
                          showToast('Método de pagamento removido.', 'info');
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Remover método"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Ambiente seguro certificado Mercado Pago & Vibe Clube</span>
          </div>
          <button
            onClick={onClose}
            className="font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>

      {/* MODAL CHECKOUT PIX (MERCADO PAGO) */}
      {selectedPkgForPix && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Pagamento Pix</h3>
                  <p className="text-xs text-slate-500">Mercado Pago Gateway</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPkgForPix(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Summary */}
            <div className="bg-purple-50/80 border border-purple-200/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-purple-700 font-bold block">Item selecionado:</span>
                <span className="text-base font-black text-slate-900">
                  {selectedPkgForPix.amount} Vibes {selectedPkgForPix.bonus > 0 ? `(+${selectedPkgForPix.bonus} bônus)` : ''}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-purple-700 font-bold block">Valor total:</span>
                <span className="text-xl font-black text-purple-700">
                  R$ {selectedPkgForPix.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* QR Code Canvas Mock */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-44 h-44 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-center relative shadow-inner">
                {/* Visual authentic QR code representation */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                  <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="12" y="12" width="11" height="11" fill="currentColor" />
                  <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="77" y="12" width="11" height="11" fill="currentColor" />
                  <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="12" y="77" width="11" height="11" fill="currentColor" />
                  {/* Internal pseudo-random code blocks */}
                  <rect x="40" y="10" width="8" height="8" fill="currentColor" />
                  <rect x="55" y="15" width="6" height="12" fill="currentColor" />
                  <rect x="45" y="30" width="15" height="8" fill="currentColor" />
                  <rect x="15" y="45" width="10" height="10" fill="currentColor" />
                  <rect x="35" y="45" width="8" height="8" fill="currentColor" />
                  <rect x="55" y="45" width="15" height="15" fill="currentColor" />
                  <rect x="75" y="45" width="10" height="8" fill="currentColor" />
                  <rect x="40" y="65" width="8" height="20" fill="currentColor" />
                  <rect x="65" y="70" width="12" height="8" fill="currentColor" />
                  <rect x="80" y="75" width="8" height="15" fill="currentColor" />
                  <rect x="50" y="85" width="10" height="8" fill="currentColor" />
                </svg>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                <span>Expira em {formatTimer(pixTimeRemaining)}</span>
              </div>
            </div>

            {/* Pix Copy and Paste Button */}
            <div>
              <button
                onClick={handleCopyPix}
                className="w-full py-2.5 px-4 rounded-xl border-2 border-purple-600 bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {isCopiedPix ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Chave Pix Copiada com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Código Pix Copia e Cola</span>
                  </>
                )}
              </button>
            </div>

            {/* Confirm Payment Simulation */}
            <div className="pt-2">
              <button
                onClick={handleConfirmPixPayment}
                disabled={isConfirmingPix}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {isConfirmingPix ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Confirmando no Banco Central...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Já fiz o Pix (Confirmar Pagamento)</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              Após o pagamento no seu banco, o saldo de Vibes é creditado instantaneamente.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
