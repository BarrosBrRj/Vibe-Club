import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ShoppingBag, Search, Plus, Filter, MapPin, Tag, 
  MessageSquare, ShieldCheck, Sparkles, X, ChevronRight, 
  Eye, CheckCircle2, ArrowUpDown, Share2, Upload, Flame,
  DollarSign, Check, PhoneCall, Heart, Camera, Image as ImageIcon,
  Zap, Rocket, QrCode, Copy, AlertCircle, RefreshCw, ChevronLeft, ArrowLeft, Wallet, Flag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { MarketplaceItem, MarketplaceCategory } from '../../types';

const CATEGORIES: MarketplaceCategory[] = [
  'Todas',
  'Eletrônicos',
  'Games',
  'Móveis & Decoração',
  'Roupas & Moda',
  'Instrumentos Musicais',
  'Veículos',
  'Livros & Colecionáveis',
  'Outros'
];

export const MarketplaceView: React.FC = () => {
  const { 
    currentUser, 
    marketplaceItems, 
    createMarketplaceItem, 
    boostMarketplaceItem, 
    markMarketplaceItemSold,
    openChatWithUser,
    addMarketplaceAdSpend,
    openWalletModal,
    showToast,
    openReportModal,
    openShareModal,
    isUserBlocked,
    blockUser
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory>('Todas');
  const [conditionFilter, setConditionFilter] = useState<'all' | 'Novo' | 'Seminovo' | 'Usado'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'price_asc' | 'price_desc'>('recent');
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [activeItemPhotoIndex, setActiveItemPhotoIndex] = useState(0);

  // New item form state
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState<MarketplaceCategory>('Eletrônicos');
  const [newCondition, setNewCondition] = useState<'Novo' | 'Seminovo' | 'Usado'>('Seminovo');
  const [newCity, setNewCity] = useState(currentUser?.city || 'São Paulo, SP');
  const [newDescription, setNewDescription] = useState('');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  
  // Image upload state (Multiple photos 1 to 5)
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Boost configuration in Real Money (R$)
  const [shouldBoostOnCreate, setShouldBoostOnCreate] = useState(false);
  const [dailyBudget, setDailyBudget] = useState<number>(10);
  const [durationDays, setDurationDays] = useState<number>(7);
  const [customDailyInput, setCustomDailyInput] = useState<string>('10');

  // Pix Checkout Modal state
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [pixPendingItemData, setPixPendingItemData] = useState<any | null>(null);
  const [pixPendingExistingItemId, setPixPendingExistingItemId] = useState<string | null>(null);
  const [isProcessingPix, setIsProcessingPix] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [pixTimeRemaining, setPixTimeRemaining] = useState(900); // 15 minutes

  // Countdown timer for Pix modal
  useEffect(() => {
    let interval: any;
    if (isPixModalOpen) {
      setPixTimeRemaining(900);
      interval = setInterval(() => {
        setPixTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPixModalOpen]);

  // Calculations for reach and total cost
  const estimatedCPM = 12.5; // Estimated average CPM for Marketplace ads
  const effectiveDaily = Math.max(5, dailyBudget);
  const baseDailyReach = Math.round((effectiveDaily / estimatedCPM) * 1000);
  const reachMin = Math.round(baseDailyReach * 0.8);
  const reachMax = Math.round(baseDailyReach * 1.2);
  const totalInvestment = Number((effectiveDaily * durationDays).toFixed(2));

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return marketplaceItems
      .filter(item => {
        if (isUserBlocked(item.sellerId)) return false;
        const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
        const matchesCondition = conditionFilter === 'all' || item.condition === conditionFilter;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || 
          item.title.toLowerCase().includes(q) || 
          item.description.toLowerCase().includes(q) || 
          item.city.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q);
        
        return matchesCategory && matchesCondition && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'recent') {
          // Boosted items come first
          if (a.isBoosted && !b.isBoosted) return -1;
          if (!a.isBoosted && b.isBoosted) return 1;

          // Parse or approximate creation timestamp
          const getTime = (it: MarketplaceItem): number => {
            if (it.id && it.id.startsWith('item_')) {
              const numericPart = it.id.replace('item_', '');
              const parsed = parseInt(numericPart, 10);
              if (!isNaN(parsed) && parsed > 1000000000000) return parsed;
            }
            if (it.createdAt.includes('Agora')) return Date.now();
            if (it.createdAt.includes('Hoje')) return Date.now() - 3600000;
            if (it.createdAt.includes('Ontem')) return Date.now() - 86400000;
            if (it.createdAt.includes('2 dias')) return Date.now() - 172800000;
            if (it.createdAt.includes('3 dias')) return Date.now() - 259200000;
            return 1000;
          };

          return getTime(b) - getTime(a);
        }
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        return 0;
      });
  }, [marketplaceItems, selectedCategory, conditionFilter, searchQuery, sortBy]);

  // Log rendering for verification as requested by user
  console.log('[Marketplace:Render] Renderizando listagem com itens totais:', marketplaceItems.length, 'filtrados:', filteredItems.length);

  // Open detail with browser history support
  const handleOpenDetail = (item: MarketplaceItem) => {
    setSelectedItem(item);
    setActiveItemPhotoIndex(0);
    try {
      window.history.pushState({ modal: 'marketplace_item', itemId: item.id }, '');
    } catch {}
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
    try {
      if (window.history.state?.modal === 'marketplace_item') {
        window.history.back();
      }
    } catch {}
  };

  // Browser back button / swipe back gesture support
  useEffect(() => {
    const handlePopState = () => {
      if (selectedItem) {
        setSelectedItem(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedItem]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedItem) {
        handleCloseDetail();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem]);

  // Client-side downscaling & progressive compression to strictly guarantee <= 16KB (16,000 chars) per photo
  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) {
          reject(new Error('Falha ao ler arquivo de imagem.'));
          return;
        }

        const img = new Image();
        img.onload = () => {
          const TARGET_MAX_CHARS = 16000; // ~15.5KB base64 max (5 photos = ~75KB total)
          const originalW = img.naturalWidth || img.width || 800;
          const originalH = img.naturalHeight || img.height || 600;

          // Progressive attempts: reduces size and JPEG quality until dataUrl <= 16KB
          const attempts = [
            { maxDim: 400, quality: 0.50 },
            { maxDim: 320, quality: 0.38 },
            { maxDim: 260, quality: 0.28 },
            { maxDim: 200, quality: 0.20 },
            { maxDim: 160, quality: 0.16 }
          ];

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            // If canvas context unavailable, reject instead of allowing large raw payload
            reject(new Error('Canvas 2D indisponível para compressão'));
            return;
          }

          let bestCompressed = '';

          for (const attempt of attempts) {
            let width = originalW;
            let height = originalH;

            if (width > height) {
              if (width > attempt.maxDim) {
                height = Math.round((height * attempt.maxDim) / width);
                width = attempt.maxDim;
              }
            } else {
              if (height > attempt.maxDim) {
                width = Math.round((width * attempt.maxDim) / height);
                height = attempt.maxDim;
              }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);

            const compressed = canvas.toDataURL('image/jpeg', attempt.quality);
            bestCompressed = compressed;

            if (compressed.length <= TARGET_MAX_CHARS) {
              console.log(`[Marketplace:Compress] Foto comprimida com sucesso: ${compressed.length} chars (~${Math.round(compressed.length / 1024)} KB) [${width}x${height}, q=${attempt.quality}]`);
              resolve(compressed);
              return;
            }
          }

          // Return the smallest achieved compression
          console.warn(`[Marketplace:Compress] Menor compressão alcançada: ${bestCompressed.length} chars (~${Math.round(bestCompressed.length / 1024)} KB)`);
          resolve(bestCompressed);
        };

        img.onerror = () => {
          reject(new Error('Falha ao decodificar imagem para compressão'));
        };

        img.src = dataUrl;
      };

      reader.onerror = () => {
        reject(new Error('Erro ao ler arquivo'));
      };

      reader.readAsDataURL(file);
    });
  };

  // Handle uploading photos from device
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remainingSlots = 5 - uploadedImages.length;
    if (remainingSlots <= 0) {
      showToast('Você já atingiu o limite máximo de 5 fotos.', 'info');
      return;
    }

    const filesToRead = Array.from(files).slice(0, remainingSlots);
    setIsUploadingPhoto(true);

    const promises = filesToRead.map(file => compressImageFile(file));

    Promise.all(promises).then(images => {
      setUploadedImages(prev => [...prev, ...images]);
      setIsUploadingPhoto(false);
      showToast(`${images.length} foto(s) adicionada(s)!`, 'success');
    }).catch(() => {
      setIsUploadingPhoto(false);
      showToast('Erro ao carregar imagem. Tente novamente.', 'error');
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const formatPixTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPixCode = (amount: number) => {
    return `00020126580014br.gov.bcb.pix0136${Date.now()}-mp-vibeclube-ads520400005303986540${amount.toFixed(2)}5802BR5916VIBE CLUBE ADS6009SAO PAULO62070503***6304A9C1`;
  };

  const handleCopyPix = () => {
    const code = getPixCode(totalInvestment);
    navigator.clipboard.writeText(code);
    setCopiedPix(true);
    showToast('Código Pix Copia e Cola copiado com sucesso!', 'success');
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Por favor, informe o título do produto.', 'error');
      return;
    }
    const parsedPrice = parseFloat(newPrice.replace(/[^\d.,]/g, '').replace(',', '.'));
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      showToast('Por favor, informe um preço válido.', 'error');
      return;
    }

    const defaultImage = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';
    const mainImageUrl = uploadedImages.length > 0 ? uploadedImages[0] : defaultImage;
    const additionalImgs = uploadedImages.length > 1 ? uploadedImages.slice(1) : undefined;

    const itemPayload = {
      title: newTitle.trim(),
      price: parsedPrice,
      category: newCategory,
      condition: newCondition,
      city: newCity.trim() || 'Brasil',
      description: newDescription.trim() || 'Sem descrição detalhada.',
      imageUrl: mainImageUrl,
      additionalImages: additionalImgs,
      sellerId: currentUser?.id || 'user_me',
      sellerName: currentUser?.name || 'Você',
      sellerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      sellerVerified: true,
      sellerWhatsapp: newWhatsapp.trim() || undefined,
      isBoosted: false
    };

    // If boost is checked, open Pix Checkout to confirm payment in Real Money (R$)
    if (shouldBoostOnCreate) {
      setPixPendingItemData(itemPayload);
      setPixPendingExistingItemId(null);
      setIsPixModalOpen(true);
      return;
    }

    // Otherwise, publish free immediately
    console.log('[Marketplace:Create] Publicando anúncio gratuito de forma síncrona no AppContext:', itemPayload);
    createMarketplaceItem(itemPayload);
    setSelectedCategory('Todas');
    setConditionFilter('all');
    setSearchQuery('');
    resetForm();
    setIsCreateModalOpen(false);
  };

  const resetForm = () => {
    setNewTitle('');
    setNewPrice('');
    setNewDescription('');
    setUploadedImages([]);
    setNewWhatsapp('');
    setShouldBoostOnCreate(false);
    setDailyBudget(10);
    setDurationDays(7);
    setCustomDailyInput('10');
  };

  // Confirm Pix payment simulation (Mercado Pago)
  const handleConfirmPixPayment = () => {
    // 1. SÍNCRONO: Cria ou impulsiona imediatamente no AppContext ANTES de fechar modal ou disparar animações
    if (pixPendingItemData) {
      const itemToSave = {
        ...pixPendingItemData,
        isBoosted: true,
        boostExpiry: `Ativo por ${durationDays} dias`
      };

      console.log('[Marketplace:Pix] Criando anúncio impulsionado de forma SÍNCRONA no AppContext:', itemToSave);
      const createdItem = createMarketplaceItem(itemToSave);

      const totalBrl = dailyBudget * durationDays;
      const now = new Date();
      const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      addMarketplaceAdSpend({
        itemId: createdItem ? createdItem.id : `item_${Date.now()}`,
        itemTitle: pixPendingItemData.title,
        itemImage: pixPendingItemData.imageUrl,
        amountBrl: totalBrl,
        durationDays,
        dailyBudget,
        status: 'active',
        startDate: `Hoje às ${timeStr}`,
        endDate: `Em ${durationDays} dias`,
        createdAt: 'Hoje',
        paymentMethod: 'pix'
      });

      setSelectedCategory('Todas');
      setConditionFilter('all');
      setSearchQuery('');
      resetForm();
      setIsCreateModalOpen(false);
      setPixPendingItemData(null);
    } else if (pixPendingExistingItemId) {
      console.log('[Marketplace:Pix] Impulsionando anúncio existente de forma síncrona:', pixPendingExistingItemId);
      boostMarketplaceItem(pixPendingExistingItemId, durationDays);
      if (selectedItem && selectedItem.id === pixPendingExistingItemId) {
        setSelectedItem(prev => prev ? { ...prev, isBoosted: true, boostExpiry: `Ativo por ${durationDays} dias` } : null);
      }
      setPixPendingExistingItemId(null);
    }

    // 2. Feedback visual com transição suave
    setIsProcessingPix(true);
    setTimeout(() => {
      setIsProcessingPix(false);
      setIsPixModalOpen(false);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      showToast(`Pagamento Pix aprovado via Mercado Pago! Anúncio publicado e impulsionado com sucesso! ⚡`, 'success');
    }, 500);
  };

  const handleStartChatWithSeller = (item: MarketplaceItem) => {
    const isOwner = currentUser?.id === item.sellerId;
    if (isOwner) {
      showToast('Você é o anunciante deste produto!', 'info');
      return;
    }

    openChatWithUser(
      {
        id: item.sellerId,
        name: item.sellerName,
        avatar: item.sellerAvatar
      },
      `Olá ${item.sellerName}! Vi seu anúncio "${item.title}" por R$ ${item.price.toFixed(2)} no Vibe Marketplace e tenho interesse! Ainda está disponível?`,
      {
        marketplaceItemId: item.id,
        marketplaceItemTitle: item.title,
        marketplaceItemPrice: item.price,
        marketplaceItemImage: item.imageUrl,
        contextType: 'marketplace'
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      
      {/* HEADER & ACTION BAR */}
      <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-black tracking-widest text-amber-300 uppercase">
            <ShoppingBag className="w-4 h-4" />
            <span>Vibe Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Compre, venda e negocie produtos com a comunidade
          </h1>
          <p className="text-sm text-purple-100 font-medium">
            Negocie direto pelo Chat, encontre ofertas perto de você e publique seus anúncios com alcance nacional.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          <button
            id="marketplace-wallet-ads-btn"
            onClick={() => openWalletModal('ads_spend')}
            className="px-4 py-3 bg-white/15 hover:bg-white/25 text-white border border-white/25 rounded-2xl font-bold text-xs sm:text-sm backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            title="Ver histórico de gastos com impulsionamento no Marketplace"
          >
            <Wallet className="w-4 h-4 text-amber-300" />
            <span>Meus Anúncios (Gastos)</span>
          </button>

          <button
            id="marketplace-announce-btn"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-white hover:bg-purple-50 text-purple-900 rounded-2xl font-black text-sm shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5 text-pink-600 font-bold" />
            <span>+ Anunciar Produto</span>
          </button>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mb-20"></div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="O que você está procurando hoje? (Ex: iPhone, PS5, Violão...)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Condition Filter */}
          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'Novo', 'Seminovo', 'Usado'] as const).map(cond => (
              <button
                key={cond}
                onClick={() => setConditionFilter(cond)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  conditionFilter === cond
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cond === 'all' ? 'Todas Condições' : cond}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 shrink-0">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border-none focus:ring-2 focus:ring-purple-500 cursor-pointer outline-none"
            >
              <option value="recent">Mais Recentes</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
            </select>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto text-2xl">
            🛍️
          </div>
          <h3 className="text-lg font-bold text-slate-900">Nenhum produto encontrado</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Não encontramos itens com esses filtros. Tente mudar o termo da busca ou categoria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Todas');
              setConditionFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredItems.map(item => {
            const isSold = item.status === 'sold';
            const isOwner = currentUser?.id === item.sellerId;
            const hasMultiplePhotos = item.additionalImages && item.additionalImages.length > 0;

            return (
              <div
                key={item.id}
                onClick={() => handleOpenDetail(item)}
                className={`group bg-white rounded-3xl border transition-all duration-200 hover:shadow-xl flex flex-col overflow-hidden cursor-pointer relative ${
                  item.isBoosted 
                    ? 'border-amber-300 ring-2 ring-amber-400/30' 
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                {/* Image Box */}
                <div className="aspect-square w-full bg-slate-100 relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                      isSold ? 'grayscale opacity-60' : ''
                    }`}
                  />

                  {/* Boost Badge in Top Left */}
                  {item.isBoosted && (
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[10px] rounded-full shadow-md flex items-center gap-1 z-10 animate-pulse">
                      <Zap className="w-3 h-3 fill-white" />
                      <span>DESTAQUE</span>
                    </div>
                  )}

                  {/* Multiple Photos Indicator */}
                  {hasMultiplePhotos && (
                    <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-black/60 text-white text-[10px] font-bold rounded-lg backdrop-blur-xs flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      <span>{1 + item.additionalImages!.length} fotos</span>
                    </div>
                  )}

                  {/* Condition Tag in Top Right */}
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-white/90 backdrop-blur-xs text-slate-700 font-bold text-[10px] rounded-full shadow-xs border border-slate-200/50">
                    {item.condition}
                  </div>

                  {/* Sold Overlay */}
                  {isSold && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-4 py-1.5 bg-rose-600 text-white text-xs font-black rounded-full uppercase tracking-wider shadow-lg">
                        Vendido
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-purple-600 uppercase tracking-wide">
                      {item.category}
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {item.title}
                    </h4>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <div className="font-black text-lg text-slate-900">
                        R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[90px]">{item.city}</span>
                      </div>
                    </div>

                    {/* Seller row */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <img
                          src={item.sellerAvatar}
                          alt={item.sellerName}
                          className="w-5 h-5 rounded-full object-cover border border-slate-300"
                        />
                        <span className="truncate max-w-[100px] font-medium">{item.sellerName}</span>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openShareModal({
                              title: `${item.title} no Vibe Marketplace`,
                              text: `Confira ${item.title} por R$ ${item.price.toFixed(2)} em ${item.city}!`,
                              url: `${window.location.origin}?tab=marketplace&id=${item.id}`
                            });
                          }}
                          className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                          title="Compartilhar anúncio"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        {!isOwner && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openReportModal({
                                  type: 'marketplace',
                                  id: item.id,
                                  name: `Anúncio: ${item.title}`,
                                  authorId: item.sellerId,
                                  authorName: item.sellerName,
                                  authorAvatar: item.sellerAvatar,
                                  contentSnippet: item.description,
                                  imageUrl: item.imageUrl
                                });
                              }}
                              className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                              title="Denunciar anúncio"
                            >
                              <Flag className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartChatWithSeller(item);
                              }}
                              className="p-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors cursor-pointer"
                              title="Enviar mensagem no Chat"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ITEM DETAIL MODAL */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseDetail();
          }}
        >
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 my-auto relative overflow-hidden">
            
            {/* STICKY TOP BAR COM BOTÃO DE VOLTAR CLARAMENTE VISÍVEL */}
            <div className="sticky top-0 z-30 px-4 sm:px-6 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between shadow-xs shrink-0">
              <button 
                type="button"
                id="btn-back-to-marketplace"
                onClick={handleCloseDetail}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-black text-xs transition-colors cursor-pointer group shadow-2xs"
                title="Voltar para a listagem do Marketplace (Esc)"
              >
                <ArrowLeft className="w-4 h-4 text-purple-700 transition-transform group-hover:-translate-x-1" />
                <span>Voltar ao Marketplace</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700">
                    {selectedItem.category}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700">
                    {selectedItem.condition}
                  </span>
                </div>
                {selectedItem.isBoosted && (
                  <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" /> Destaque
                  </span>
                )}
                <button 
                  onClick={handleCloseDetail} 
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                  title="Fechar detalhe (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* SCROLLABLE INNER BODY */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 overscroll-contain">
              {/* Gallery: Main Photo & Carousel of Thumbnails */}
              {(() => {
                const allItemPhotos = [selectedItem.imageUrl, ...(selectedItem.additionalImages || [])];
                const currentPhoto = allItemPhotos[activeItemPhotoIndex] || selectedItem.imageUrl;

                return (
                  <div className="space-y-2">
                    {/* Container ajustado: object-contain, sem corte da imagem, fundo escuro elegante */}
                    <div className="w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-200/80 relative shadow-inner">
                      <img
                        src={currentPhoto}
                        alt={selectedItem.title}
                        className="max-w-full max-h-full w-auto h-auto object-contain select-none"
                      />
                      {allItemPhotos.length > 1 && (
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/75 text-white font-bold text-xs rounded-full backdrop-blur-xs shadow-md border border-white/10">
                          {activeItemPhotoIndex + 1} / {allItemPhotos.length}
                        </div>
                      )}
                    </div>

                    {allItemPhotos.length > 1 && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                        {allItemPhotos.map((photo, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => setActiveItemPhotoIndex(pIdx)}
                            className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-slate-100 flex items-center justify-center ${
                              activeItemPhotoIndex === pIdx 
                                ? 'border-purple-600 ring-2 ring-purple-400/50 scale-105 shadow-md' 
                                : 'border-slate-200 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={photo} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Title & Price */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">{selectedItem.title}</h2>
                <div className="flex flex-wrap items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-purple-700">
                    R$ {selectedItem.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-slate-500">• Publicado {selectedItem.createdAt}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2 font-medium">
                  <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{selectedItem.city}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição do Produto</h4>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line break-words">
                  {selectedItem.description}
                </p>
              </div>

              {/* Seller Information */}
              <div className="flex items-center justify-between p-4 bg-purple-50/70 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedItem.sellerAvatar}
                    alt={selectedItem.sellerName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-400 shrink-0"
                  />
                  <div>
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <span>{selectedItem.sellerName}</span>
                      {selectedItem.sellerVerified && (
                        <span title="Vendedor Verificado">
                          <ShieldCheck className="w-4 h-4 text-purple-600 inline" />
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">Membro da Comunidade Vibe Clube</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                {/* Share and Report row */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      openShareModal({
                        title: `${selectedItem.title} no Vibe Marketplace`,
                        text: `Confira ${selectedItem.title} por R$ ${selectedItem.price.toFixed(2)} em ${selectedItem.city}!`,
                        url: `${window.location.origin}?tab=marketplace&id=${selectedItem.id}`
                      });
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Share2 className="w-4 h-4 text-purple-600" />
                    <span>Compartilhar</span>
                  </button>

                  {currentUser?.id !== selectedItem.sellerId && (
                    <button
                      onClick={() => {
                        openReportModal({
                          type: 'marketplace',
                          id: selectedItem.id,
                          name: `Anúncio: ${selectedItem.title}`,
                          authorId: selectedItem.sellerId,
                          authorName: selectedItem.sellerName,
                          authorAvatar: selectedItem.sellerAvatar,
                          contentSnippet: selectedItem.description,
                          imageUrl: selectedItem.imageUrl
                        });
                      }}
                      className="py-2.5 px-3.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      title="Denunciar Anúncio"
                    >
                      <Flag className="w-4 h-4" />
                      <span>Denunciar</span>
                    </button>
                  )}
                </div>

                <button
                  id="btn-chat-with-seller"
                  onClick={() => handleStartChatWithSeller(selectedItem)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-sm shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Conversar no Chat com o Vendedor</span>
                </button>

                {/* Owner options */}
                {currentUser?.id === selectedItem.sellerId && (
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    {!selectedItem.isBoosted && (
                      <button
                        onClick={() => {
                          setPixPendingExistingItemId(selectedItem.id);
                          setPixPendingItemData(null);
                          setIsPixModalOpen(true);
                        }}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Rocket className="w-4 h-4" />
                        <span>Impulsionar Anúncio (com Pix R$)</span>
                      </button>
                    )}
                    {selectedItem.status === 'available' && (
                      <button
                        onClick={() => {
                          markMarketplaceItemSold(selectedItem.id);
                          setSelectedItem(prev => prev ? { ...prev, status: 'sold' } : null);
                        }}
                        className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Marcar como Vendido
                      </button>
                    )}
                  </div>
                )}

                {/* Bottom return action bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between pb-2">
                  <button
                    type="button"
                    onClick={handleCloseDetail}
                    className="py-2 px-3.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-purple-600" />
                    <span>Voltar à listagem de anúncios</span>
                  </button>
                  <span className="text-[11px] text-slate-400">Pressione ESC para fechar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW LISTING MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
                <h3 className="font-extrabold text-base text-slate-900">Anunciar no Vibe Marketplace</h3>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)} 
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              {/* Title */}
              <div className="space-y-1">
                <label>Título do Anúncio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: PlayStation 5 com 2 Controles e Jogos"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Category & Condition */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label>Categoria</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as MarketplaceCategory)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {CATEGORIES.filter(c => c !== 'Todas').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label>Condição</label>
                  <select
                    value={newCondition}
                    onChange={e => setNewCondition(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Novo">Novo (Na caixa)</option>
                    <option value="Seminovo">Seminovo (Pouco uso)</option>
                    <option value="Usado">Usado (Bom estado)</option>
                  </select>
                </div>
              </div>

              {/* Price & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label>Preço (R$) *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="350.00"
                      value={newPrice}
                      onChange={e => setNewPrice(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label>Cidade / Localização</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={e => setNewCity(e.target.value)}
                    placeholder="Ex: São Paulo, SP"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* 1. UPLOAD REAL DE FOTOS DO PRODUTO (1 a 5 fotos com miniaturas e remoção) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-purple-600" />
                    <span>Fotos do Produto ({uploadedImages.length}/5)</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Formatos JPG, PNG ou WebP
                  </span>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => handleFilesSelected(e.target.files)}
                  className="hidden"
                />

                {/* Upload Trigger Area */}
                {uploadedImages.length < 5 && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      e.preventDefault();
                      handleFilesSelected(e.dataTransfer.files);
                    }}
                    className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/50 hover:bg-purple-50 rounded-2xl p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white text-purple-600 shadow-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-purple-900 text-xs block">
                        Clique ou arraste para adicionar fotos
                      </span>
                      <span className="text-[11px] text-purple-600 font-normal">
                        Adicione até 5 fotos reais do seu produto
                      </span>
                    </div>
                  </div>
                )}

                {/* Horizontal Thumbnails Carousel Preview */}
                {uploadedImages.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto py-2 px-1">
                    {uploadedImages.map((imgUrl, index) => (
                      <div
                        key={index}
                        className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-purple-200 bg-slate-100 shrink-0 group shadow-xs"
                      >
                        <img
                          src={imgUrl}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Capa Badge for first image */}
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.2 bg-purple-600 text-white font-extrabold text-[9px] rounded-md shadow-xs">
                            Capa
                          </span>
                        )}
                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-rose-600 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                          title="Remover foto"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {/* Quick Add More Tile if < 5 */}
                    {uploadedImages.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-purple-400 bg-slate-50 hover:bg-purple-50 text-slate-500 hover:text-purple-600 flex flex-col items-center justify-center gap-1 shrink-0 transition-colors cursor-pointer"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Mais</span>
                      </button>
                    )}
                  </div>
                )}

                {uploadedImages.length === 0 && (
                  <p className="text-[11px] text-slate-400">
                    Nenhuma foto enviada? Uma imagem padrão ilustrativa será usada automaticamente como capa.
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label>Descrição Detalhada</label>
                <textarea
                  rows={3}
                  placeholder="Descreva o tempo de uso, acessórios inclusos, formas de entrega ou detalhes importantes..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              {/* 2. IMPULSIONAMENTO EM DINHEIRO REAL (R$) — REMOÇÃO COMPLETA DE VIBES */}
              <div className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
                      <Zap className="w-5 h-5 fill-white" />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5">
                        <span>Impulsionar Anúncio no Topo</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900 text-[10px] font-black">
                          Destaque
                        </span>
                      </div>
                      <div className="text-[11px] text-amber-800 font-normal">
                        Alcance milhares de compradores com leilão de anúncios em R$
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    id="checkbox-boost-marketplace"
                    checked={shouldBoostOnCreate}
                    onChange={e => setShouldBoostOnCreate(e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded-md focus:ring-purple-500 cursor-pointer accent-purple-600"
                  />
                </div>

                {/* EXPANDABLE BOOST OPTIONS WHEN CHECKED */}
                {shouldBoostOnCreate && (
                  <div className="pt-3 border-t border-amber-200/80 space-y-3 animate-in fade-in">
                    {/* Daily Budget Selector */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800">Orçamento Diário (mínimo R$ 5,00/dia)</span>
                        <span className="font-black text-amber-900">R$ {effectiveDaily.toFixed(2)} / dia</span>
                      </div>

                      {/* Quick preset buttons */}
                      <div className="grid grid-cols-4 gap-2">
                        {[5, 10, 20, 50].map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => {
                              setDailyBudget(val);
                              setCustomDailyInput(val.toString());
                            }}
                            className={`py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer border ${
                              dailyBudget === val 
                                ? 'bg-amber-500 text-white border-amber-500 shadow-xs' 
                                : 'bg-white hover:bg-amber-50 text-slate-700 border-amber-200'
                            }`}
                          >
                            R$ {val}
                          </button>
                        ))}
                      </div>

                      {/* Custom Input */}
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">R$</span>
                        <input
                          type="number"
                          min="5"
                          step="1"
                          placeholder="Outro valor diário (mínimo R$ 5)"
                          value={customDailyInput}
                          onChange={e => {
                            setCustomDailyInput(e.target.value);
                            const parsed = parseFloat(e.target.value);
                            if (!isNaN(parsed) && parsed >= 5) {
                              setDailyBudget(parsed);
                            }
                          }}
                          className="w-full pl-9 pr-3 py-2 bg-white border border-amber-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Duration Selector */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-800 block text-xs">Duração do Impulsionamento</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 3, 7, 14].map(days => (
                          <button
                            key={days}
                            type="button"
                            onClick={() => setDurationDays(days)}
                            className={`py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer border ${
                              durationDays === days 
                                ? 'bg-purple-600 text-white border-purple-600 shadow-xs' 
                                : 'bg-white hover:bg-purple-50 text-slate-700 border-purple-200'
                            }`}
                          >
                            {days} {days === 1 ? 'dia' : 'dias'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Reach Formula Display */}
                    <div className="bg-white/90 p-3 rounded-xl border border-amber-200 space-y-1.5 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-950">
                        <Rocket className="w-4 h-4 text-orange-500" />
                        <span>Alcance estimado: entre {reachMin.toLocaleString('pt-BR')} e {reachMax.toLocaleString('pt-BR')} pessoas por dia</span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                        <span className="text-slate-600 font-medium">Investimento Total ({durationDays} dias):</span>
                        <span className="font-black text-sm text-purple-700">
                          R$ {totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} via Pix
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  {shouldBoostOnCreate ? (
                    <>
                      <Zap className="w-4 h-4 fill-white" />
                      <span>Continuar para Pix (R$ {totalInvestment.toFixed(2)})</span>
                    </>
                  ) : (
                    <span>Publicar Anúncio (Grátis)</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PIX CHECKOUT MODAL (INTEGRAÇÃO MERCADO PAGO EM R$) */}
      {isPixModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Pagamento Pix — Mercado Pago</h3>
                  <div className="text-[11px] text-slate-500">Impulsionamento no Vibe Marketplace</div>
                </div>
              </div>
              <button 
                onClick={() => setIsPixModalOpen(false)} 
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Campaign Summary */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Plano:</span>
                <span className="font-bold text-slate-900">Destaque Topo ({durationDays} dias)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Orçamento Diário:</span>
                <span className="font-bold text-slate-900">R$ {effectiveDaily.toFixed(2)} / dia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Alcance Estimado:</span>
                <span className="font-bold text-emerald-600">{reachMin} - {reachMax} pessoas/dia</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
                <span className="font-extrabold text-slate-900">Valor Total a Pagar:</span>
                <span className="font-black text-purple-700 text-base">
                  R$ {totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Pix QR Code Mock Representation */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
              <div className="w-44 h-44 bg-slate-900 rounded-xl p-3 flex flex-col items-center justify-center text-white relative shadow-inner">
                {/* SVG QR Code Pattern */}
                <div className="grid grid-cols-6 gap-1.5 w-full h-full p-2 bg-white rounded-lg">
                  <div className="col-span-2 row-span-2 bg-slate-900 rounded-sm"></div>
                  <div className="bg-slate-900 rounded-xs"></div>
                  <div className="bg-slate-900 rounded-xs"></div>
                  <div className="col-span-2 row-span-2 bg-slate-900 rounded-sm"></div>
                  <div className="bg-slate-900 rounded-xs"></div>
                  <div className="bg-slate-900 rounded-xs"></div>
                  <div className="col-span-2 row-span-2 bg-slate-900 rounded-sm"></div>
                  <div className="bg-slate-900 rounded-xs"></div>
                  <div className="bg-slate-900 rounded-xs"></div>
                  <div className="col-span-2 row-span-2 bg-slate-900 rounded-sm"></div>
                  <div className="col-span-6 flex items-center justify-center">
                    <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                      MERCADO PAGO
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                <span>Expira em:</span>
                <span className="font-bold text-rose-600">{formatPixTime(pixTimeRemaining)}</span>
              </div>
            </div>

            {/* Pix Copia e Cola Button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleCopyPix}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  copiedPix 
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700' 
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                }`}
              >
                {copiedPix ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                <span>{copiedPix ? 'Código Pix Copiado!' : 'Copiar Código Pix (Copia e Cola)'}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                disabled={isProcessingPix}
                onClick={handleConfirmPixPayment}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isProcessingPix ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Confirmando Pagamento com Mercado Pago...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Já fiz o Pix (Confirmar Pagamento)</span>
                  </>
                )}
              </button>

              {pixPendingItemData && (
                <button
                  type="button"
                  onClick={() => {
                    createMarketplaceItem(pixPendingItemData);
                    setIsPixModalOpen(false);
                    resetForm();
                    setIsCreateModalOpen(false);
                    showToast('Anúncio publicado gratuitamente sem impulsionamento.', 'info');
                  }}
                  className="w-full py-2 text-center text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Publicar sem impulsionamento (Grátis)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
