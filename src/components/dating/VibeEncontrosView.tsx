import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, X, Star, Zap, MessageSquare, ShieldCheck, 
  MapPin, Sparkles, UserCheck, Flame, RefreshCw, Send, 
  Check, ChevronLeft, ChevronRight, Coins, Info, Lock, Flag, UserX
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DatingCandidate, DatingMatch } from '../../types';
import { AnimatedText } from '../common/AnimatedText';
import { AnimatedEmojiPicker } from '../emoji/AnimatedEmojiPicker';

export const VibeEncontrosView: React.FC = () => {
  const { 
    datingCandidates, 
    datingMatches, 
    currentUser, 
    swipeDating, 
    buyDatingUnlimited, 
    showToast,
    datingLikesUsed,
    hasUnlimitedDating,
    pricingConfig,
    setIsVibesModalOpen,
    openReportModal,
    isUserBlocked,
    blockUser
  } = useApp();

  const [hasConsented18, setHasConsented18] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'cards' | 'matches'>('cards');
  const [selectedMatch, setSelectedMatch] = useState<DatingMatch | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [isChatEmojiOpen, setIsChatEmojiOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<Record<string, { id: string; sender: 'me' | 'them'; text: string; time: string }[]>>({});
  const chatInputRef = useRef<HTMLInputElement | null>(null);

  // Drag & Swipe gesture state (Pure React implementation without external hook dependencies)
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Filter candidates excluding blocked users
  const availableCandidates = datingCandidates.filter(c => !isUserBlocked(c.userId));
  const availableMatches = datingMatches.filter(m => !isUserBlocked(m.user?.id || ''));

  // Active profile currently on top of deck
  const currentCard: DatingCandidate | undefined = availableCandidates[activeCardIndex];

  // Reset photo and drag offset when card changes
  useEffect(() => {
    setActivePhotoIndex(0);
    setSwipeDirection(null);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
    isDraggingRef.current = false;
  }, [activeCardIndex]);

  // Check coins and likes limits
  const checkCanLike = (): boolean => {
    if (hasUnlimitedDating) return true;

    const maxLikes = pricingConfig.maxDailyDatingLikes || 50;
    if (datingLikesUsed >= maxLikes) {
      const requiredCoins = 10;
      const userBalance = currentUser?.vibesBalance || 0;

      if (userBalance < requiredCoins) {
        showToast(
          `Você atingiu o limite de ${maxLikes} curtidas de hoje! Recarregue suas moedas Vibes para continuar.`,
          'error'
        );
        setIsVibesModalOpen(true);
        return false;
      }
    }
    return true;
  };

  const handlePass = () => {
    if (!currentCard || isAnimating) return;
    setIsAnimating(true);
    setSwipeDirection('left');

    setTimeout(() => {
      swipeDating(currentCard.userId, 'pass');
      setActiveCardIndex(prev => prev + 1);
      setIsAnimating(false);
      setSwipeDirection(null);
      setDragOffset({ x: 0, y: 0 });
    }, 280);
  };

  const handleLike = () => {
    if (!currentCard || isAnimating) return;

    if (!checkCanLike()) {
      setDragOffset({ x: 0, y: 0 });
      return;
    }

    setIsAnimating(true);
    setSwipeDirection('right');

    setTimeout(() => {
      swipeDating(currentCard.userId, 'like');
      setActiveCardIndex(prev => prev + 1);
      setIsAnimating(false);
      setSwipeDirection(null);
      setDragOffset({ x: 0, y: 0 });
    }, 280);
  };

  const handleSuperLike = () => {
    if (!currentCard || isAnimating) return;

    if (!checkCanLike()) {
      setDragOffset({ x: 0, y: 0 });
      return;
    }

    setIsAnimating(true);
    setSwipeDirection('up');

    setTimeout(() => {
      swipeDating(currentCard.userId, 'superlike');
      setActiveCardIndex(prev => prev + 1);
      setIsAnimating(false);
      setSwipeDirection(null);
      setDragOffset({ x: 0, y: 0 });
    }, 280);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'cards' || !currentCard || isAnimating) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowLeft') {
        handlePass();
      } else if (e.key === 'ArrowRight') {
        handleLike();
      } else if (e.key === 'ArrowUp') {
        handleSuperLike();
      } else if (e.key === ' ') {
        e.preventDefault();
        const totalPhotos = currentCard.photos?.length || 1;
        setActivePhotoIndex(prev => (prev + 1) % totalPhotos);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, currentCard, isAnimating, datingLikesUsed, hasUnlimitedDating]);

  // Touch gesture handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating || !currentCard) return;
    const touch = e.touches[0];
    startPosRef.current = { x: touch.clientX, y: touch.clientY };
    isDraggingRef.current = true;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || isAnimating) return;
    const touch = e.touches[0];
    const dx = touch.clientX - startPosRef.current.x;
    const dy = touch.clientY - startPosRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current || isAnimating) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    if (dragOffset.x > 90) {
      handleLike();
    } else if (dragOffset.x < -90) {
      handlePass();
    } else if (dragOffset.y < -90) {
      handleSuperLike();
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAnimating || !currentCard) return;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = true;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || isAnimating) return;
    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current || isAnimating) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    if (dragOffset.x > 90) {
      handleLike();
    } else if (dragOffset.x < -90) {
      handlePass();
    } else if (dragOffset.y < -90) {
      handleSuperLike();
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard || !currentCard.photos || currentCard.photos.length <= 1) return;
    setActivePhotoIndex(prev => (prev + 1) % currentCard.photos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard || !currentCard.photos || currentCard.photos.length <= 1) return;
    setActivePhotoIndex(prev => (prev - 1 + currentCard.photos.length) % currentCard.photos.length);
  };

  const handleBoost = () => {
    showToast('🚀 Perfil Impulsionado! Você será visto por 10x mais pessoas na sua região.', 'vibe');
  };

  const handleInsertChatEmoji = (char: string) => {
    if (chatInputRef.current) {
      const start = chatInputRef.current.selectionStart ?? chatMessage.length;
      const end = chatInputRef.current.selectionEnd ?? chatMessage.length;
      const newText = chatMessage.substring(0, start) + char + chatMessage.substring(end);
      setChatMessage(newText);
      setTimeout(() => {
        if (chatInputRef.current) {
          chatInputRef.current.focus();
          const nextPos = start + char.length;
          chatInputRef.current.setSelectionRange(nextPos, nextPos);
        }
      }, 10);
    } else {
      setChatMessage(prev => prev + char);
    }
  };

  const handleSendMessageToMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch || !chatMessage.trim()) return;

    const matchId = selectedMatch.id;
    const newMsg = {
      id: String(Date.now()),
      sender: 'me' as const,
      text: chatMessage.trim(),
      time: 'Agora'
    };

    setChatHistory(prev => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), newMsg]
    }));

    showToast(`Mensagem enviada para ${selectedMatch.user.name}! 💬`, 'success');
    setChatMessage('');
    setIsChatEmojiOpen(false);
  };

  // Card transform styles
  let cardTransform = 'translate3d(0, 0, 0)';
  let cardTransition = isDragging ? 'none' : 'transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 280ms ease';
  let cardOpacity = 1;

  if (swipeDirection === 'right') {
    cardTransform = 'translate3d(450px, 0px, 0) rotate(16deg)';
    cardOpacity = 0;
  } else if (swipeDirection === 'left') {
    cardTransform = 'translate3d(-450px, 0px, 0) rotate(-16deg)';
    cardOpacity = 0;
  } else if (swipeDirection === 'up') {
    cardTransform = 'translate3d(0px, -450px, 0) scale(1.05)';
    cardOpacity = 0;
  } else if (isDragging) {
    cardTransform = `translate3d(${dragOffset.x}px, ${dragOffset.y * 0.4}px, 0) rotate(${dragOffset.x * 0.05}deg)`;
  }

  // 18+ Verification Gate
  if (!hasConsented18) {
    return (
      <div className="max-w-2xl mx-auto w-full p-4">
        <div className="bg-gradient-to-br from-pink-900 via-purple-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-500/30 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-pink-500/20 text-pink-400 border border-pink-400/40 flex items-center justify-center mx-auto text-3xl">
            🔞
          </div>
          
          <div>
            <span className="text-xs font-extrabold tracking-widest text-pink-400 uppercase">
              RECURSO EXCLUSIVO PARA MAIORES
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Bem-vindo ao Vibe Encontros! 💘
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
              O Vibe Encontros é o espaço seguro do Vibe Clube para conhecer pessoas especiais, paquerar e iniciar novas histórias com respeito mútuo.
            </p>
          </div>

          <div className="p-4 bg-white/10 rounded-2xl text-left space-y-2 text-xs text-slate-200 border border-white/10 max-w-md mx-auto">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Diretrizes de Convivência & Segurança:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Eu declaro solenemente que tenho 18 anos ou mais.</li>
              <li>Comprometo-me a tratar todas as pessoas com respeito.</li>
              <li>Assédio, conteúdo impróprio ou perfis falsos resultam em banimento imediato.</li>
            </ul>
          </div>

          <button
            onClick={() => setHasConsented18(true)}
            className="w-full max-w-md py-3.5 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-pink-500/30 active:scale-95 transition-all cursor-pointer"
          >
            Tenho 18+ anos & Concordo com as Regras
          </button>
        </div>
      </div>
    );
  }

  const remainingLikes = Math.max(0, (pricingConfig.maxDailyDatingLikes || 50) - datingLikesUsed);

  return (
    <div className="max-w-xl mx-auto w-full space-y-4 pb-8">
      
      {/* Top Header Tabs & Wallet Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 sm:p-2.5 shadow-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'cards' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-purple-50'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Descobrir Vibes</span>
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
              activeTab === 'matches' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs' 
                : 'text-slate-600 hover:bg-purple-50'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>Matches ({availableMatches.length})</span>
            {availableMatches.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
            )}
          </button>
        </div>

        {/* Coins / Boost Shortcut */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVibesModalOpen(true)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all cursor-pointer"
            title="Recarregar Moedas Vibes"
          >
            <Coins className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{currentUser?.vibesBalance ?? 0} Vibes</span>
          </button>

          <button
            onClick={handleBoost}
            className="px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-amber-500 to-purple-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
            title="Impulsionar Perfil"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span className="hidden sm:inline">Impulsionar</span>
          </button>
        </div>
      </div>

      {/* 1. Cards View */}
      {activeTab === 'cards' && (
        <div className="flex flex-col items-center w-full">
          
          {currentCard ? (
            <div className="w-full flex flex-col items-center space-y-4">
              
              {/* Card Container with Touch & Mouse Swipe Drag */}
              <div 
                className="relative w-full max-w-sm sm:max-w-md h-[460px] sm:h-[510px] select-none touch-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div
                  style={{
                    transform: cardTransform,
                    transition: cardTransition,
                    opacity: cardOpacity
                  }}
                  className="absolute inset-0 bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 cursor-grab active:cursor-grabbing flex flex-col justify-end will-change-transform"
                >
                  {/* Candidate Photo */}
                  <img
                    src={currentCard.photos[activePhotoIndex] || currentCard.photos[0]}
                    alt={currentCard.name}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    draggable={false}
                  />

                  {/* Gradient Overlay for Text Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20 pointer-events-none" />

                  {/* Top Photo Pagination Dots */}
                  {currentCard.photos && currentCard.photos.length > 1 && (
                    <div className="absolute top-3 inset-x-3 flex items-center gap-1.5 z-20 pointer-events-none">
                      {currentCard.photos.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            idx === activePhotoIndex ? 'bg-white shadow-xs' : 'bg-white/35'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Touch / Click zones to switch photos */}
                  <div className="absolute inset-0 z-10 flex">
                    <div
                      onClick={handlePrevPhoto}
                      className="w-1/2 h-2/3 cursor-pointer"
                      title="Foto anterior"
                    />
                    <div
                      onClick={handleNextPhoto}
                      className="w-1/2 h-2/3 cursor-pointer"
                      title="Próxima foto"
                    />
                  </div>

                  {/* Swipe Visual Feedback Stamps */}
                  {/* Report / Safety button */}
                  <div className="absolute top-6 right-3 z-30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openReportModal({
                          type: 'user',
                          id: currentCard.userId,
                          name: `Perfil Encontros: ${currentCard.name}`,
                          authorId: currentCard.userId,
                          authorName: currentCard.name,
                          authorAvatar: currentCard.photos?.[0],
                          contentSnippet: currentCard.bio,
                          imageUrl: currentCard.photos?.[0]
                        });
                      }}
                      className="p-2 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white/80 hover:text-red-400 transition-colors cursor-pointer shadow-xs"
                      title="Denunciar este perfil"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {(dragOffset.x > 45 || swipeDirection === 'right') && (
                    <div className="absolute top-12 left-6 z-30 px-4 py-1.5 rounded-2xl border-3 border-emerald-400 bg-emerald-500/30 backdrop-blur-xs text-emerald-300 font-black text-xl tracking-wider -rotate-12 shadow-lg animate-in fade-in">
                      CURTIR ❤️
                    </div>
                  )}

                  {(dragOffset.x < -45 || swipeDirection === 'left') && (
                    <div className="absolute top-12 right-6 z-30 px-4 py-1.5 rounded-2xl border-3 border-rose-500 bg-rose-500/30 backdrop-blur-xs text-rose-300 font-black text-xl tracking-wider rotate-12 shadow-lg animate-in fade-in">
                      PASSAR ❌
                    </div>
                  )}

                  {(dragOffset.y < -45 || swipeDirection === 'up') && (
                    <div className="absolute top-1/3 inset-x-0 mx-auto w-fit z-30 px-5 py-2 rounded-2xl border-3 border-amber-400 bg-amber-500/40 backdrop-blur-xs text-amber-200 font-black text-xl tracking-wider shadow-lg animate-in zoom-in-95">
                      SUPER VIBE ⭐
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-7 left-4 z-20 flex items-center gap-2 pointer-events-none">
                    <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-[11px] font-extrabold border border-white/20 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-pink-400" />
                      <span>{currentCard.interests[0] || 'Vibe Clube'}</span>
                    </div>
                  </div>

                  <div className="absolute top-7 right-4 z-20 pointer-events-none">
                    <div className="px-3 py-1 bg-purple-900/80 backdrop-blur-md rounded-full text-purple-100 text-[11px] font-bold border border-purple-400/30">
                      {currentCard.distanceKm} km de você
                    </div>
                  </div>

                  {/* Bottom Card Profile Info */}
                  <div className="relative z-20 p-5 text-white space-y-2 pointer-events-none">
                    <div className="flex items-baseline gap-2.5">
                      <h2 className="text-2xl sm:text-3xl font-black drop-shadow-md">
                        {currentCard.name}, {currentCard.age}
                      </h2>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" title="Online" />
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <span>{currentCard.city}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-100 line-clamp-2 leading-relaxed font-normal drop-shadow-xs">
                      {currentCard.bio}
                    </p>

                    {/* Interest Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {currentCard.interests.map((int, idx) => (
                        <span 
                          key={idx} 
                          className="text-[10px] sm:text-[11px] bg-white/20 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full font-bold border border-white/15"
                        >
                          {int}
                        </span>
                      ))}
                    </div>

                    {/* Photo indicator hint */}
                    {currentCard.photos && currentCard.photos.length > 1 && (
                      <div className="text-[10px] text-slate-300/80 pt-0.5 flex items-center justify-between">
                        <span>Foto {activePhotoIndex + 1} de {currentCard.photos.length}</span>
                        <span className="text-[9px] opacity-75">Toque nas laterais para ver mais fotos</span>
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* BARRA DE AÇÃO FIXA / PRINCIPAL (Estilo Vibe Clube / Orkut + Tinder) */}
              <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl border border-purple-100 p-3 sm:p-4 shadow-md space-y-2">
                
                {/* Status Bar / Likes indicator */}
                <div className="flex items-center justify-between px-2 text-[11px]">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    {hasUnlimitedDating ? (
                      <span className="text-purple-600 font-extrabold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-pink-500" />
                        <span>Curtidas Ilimitadas VIP</span>
                      </span>
                    ) : (
                      <>
                        <Flame className="w-3 h-3 text-pink-500" />
                        <span>
                          <strong className="text-purple-700">{remainingLikes}</strong> curtidas restantes hoje
                        </span>
                      </>
                    )}
                  </span>

                  <button
                    onClick={() => setIsVibesModalOpen(true)}
                    className="text-purple-600 hover:text-purple-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Coins className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>+ Moedas</span>
                  </button>
                </div>

                {/* The 3 Action Buttons */}
                <div className="flex items-center justify-center gap-6 sm:gap-8 pt-1">
                  
                  {/* 1. Botão "Não Curtir" — Círculo branco com ícone de X vermelho/rosa, à esquerda */}
                  <button
                    onClick={handlePass}
                    disabled={isAnimating}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-rose-500 border border-rose-100 shadow-md hover:shadow-lg hover:bg-rose-50 hover:border-rose-200 active:scale-90 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 group"
                    title="Não Curtir (Pular)"
                    aria-label="Não Curtir"
                  >
                    <X className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
                  </button>

                  {/* 3. Botão "Super Like" / "Destacar" — Ícone de estrela, menor, entre os dois */}
                  <button
                    onClick={handleSuperLike}
                    disabled={isAnimating}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-amber-500 border border-amber-200 shadow-md hover:shadow-lg hover:bg-amber-50 active:scale-90 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 group"
                    title="Super Like / Super Vibe ⭐"
                    aria-label="Super Like"
                  >
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400 text-amber-500 group-hover:scale-110 transition-transform duration-200" />
                  </button>

                  {/* 2. Botão "Curtir" — Círculo com gradiente roxo/rosa e ícone de coração branco, à direita, maior/destacado (ação principal) */}
                  <button
                    onClick={handleLike}
                    disabled={isAnimating}
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white shadow-xl shadow-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-2 border-white disabled:opacity-50 group"
                    title="Curtir Vibe ❤️"
                    aria-label="Curtir"
                  >
                    <Heart className="w-8 h-8 sm:w-9 sm:h-9 fill-white text-white group-hover:scale-110 transition-transform duration-200" />
                  </button>

                </div>

                <div className="text-center pt-1">
                  <span className="text-[10px] text-slate-400">
                    Dica: Você também pode arrastar o card para a esquerda (passar) ou direita (curtir)
                  </span>
                </div>

              </div>

            </div>
          ) : (
            // No more cards state
            <div className="w-full max-w-md bg-white rounded-3xl border border-purple-100 p-8 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-xs">
                ✨
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">
                Você viu todos os perfis disponíveis por enquanto!
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Novas pessoas chegam ao Vibe Clube a todo momento. Você pode rever os perfis da rodada ou trocar mensagens com seus matches!
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <button
                  onClick={() => setActiveCardIndex(0)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Rever Perfis</span>
                </button>
                <button
                  onClick={() => setActiveTab('matches')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs rounded-xl border border-purple-200 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-4 h-4 text-pink-600 fill-pink-600" />
                  <span>Ver Meus Matches</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 2. Matches & Chat View */}
      {activeTab === 'matches' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500 fill-pink-400" />
              <span>Seus Encontros & Conversas</span>
            </h3>
            <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">
              {availableMatches.length} Matches
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Matches list */}
            <div className="md:col-span-1 border-r border-slate-100 pr-2 space-y-2">
              {availableMatches.length > 0 ? (
                availableMatches.map(match => (
                  <div
                    key={match.id}
                    onClick={() => setSelectedMatch(match)}
                    className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                      selectedMatch?.id === match.id
                        ? 'bg-pink-50 border-pink-300 ring-1 ring-pink-300'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <img 
                      src={match.user.avatar} 
                      alt={match.user.name} 
                      className="w-10 h-10 rounded-full object-cover border border-pink-300 shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-slate-900 truncate">{match.user.name}</div>
                      <div className="text-[10px] text-pink-600 font-semibold">{match.user.city}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                  <p>Você ainda não tem matches.</p>
                  <button
                    onClick={() => setActiveTab('cards')}
                    className="text-purple-600 font-bold hover:underline cursor-pointer"
                  >
                    Começar a paquerar →
                  </button>
                </div>
              )}
            </div>

            {/* Chat Box */}
            <div className="md:col-span-2">
              {selectedMatch ? (
                <div className="flex flex-col h-80 justify-between bg-slate-50 rounded-2xl p-3 border border-slate-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <img src={selectedMatch.user.avatar} alt={selectedMatch.user.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-xs text-slate-900">{selectedMatch.user.name}</div>
                      <div className="text-[10px] text-emerald-600 font-medium">Deu Match! Comece a conversar 💕</div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto py-2 space-y-2">
                    <div className="p-2.5 bg-pink-100 text-pink-950 text-xs rounded-xl rounded-tl-none max-w-[80%]">
                      <AnimatedText text="Oi! Adorei a sua vibe no clube. Vamos conversar? 😊" />
                    </div>

                    {selectedMatch && chatHistory[selectedMatch.id]?.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-2.5 text-xs rounded-xl max-w-[80%] ${
                          msg.sender === 'me'
                            ? 'ml-auto bg-purple-600 text-white rounded-tr-none'
                            : 'bg-pink-100 text-pink-950 rounded-tl-none'
                        }`}
                      >
                        <AnimatedText text={msg.text} />
                        <div className={`text-[9px] mt-0.5 ${msg.sender === 'me' ? 'text-purple-200 text-right' : 'text-slate-400'}`}>
                          {msg.time}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Emoji picker dropdown for chat */}
                  {isChatEmojiOpen && (
                    <div className="pb-2">
                      <AnimatedEmojiPicker
                        onSelectEmoji={handleInsertChatEmoji}
                        onClose={() => setIsChatEmojiOpen(false)}
                      />
                    </div>
                  )}

                  {/* Input Form */}
                  <form onSubmit={handleSendMessageToMatch} className="flex items-center gap-1.5 pt-2 border-t border-slate-200">
                    <div className="flex-1 relative flex items-center">
                      <input
                        ref={chatInputRef}
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder={`Envie uma mensagem para ${selectedMatch.user.name}...`}
                        className="w-full pl-3 pr-8 py-1.5 bg-white text-xs rounded-xl border border-slate-200 outline-hidden focus:border-pink-500"
                      />
                      <button
                        type="button"
                        onClick={() => setIsChatEmojiOpen(!isChatEmojiOpen)}
                        className="absolute right-2 text-slate-400 hover:text-amber-500 text-sm cursor-pointer p-0.5"
                        title="Inserir emoticon animado"
                      >
                        😀
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={!chatMessage.trim()}
                      className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl disabled:opacity-40 hover:from-purple-700 hover:to-pink-700 transition-colors cursor-pointer shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="h-80 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                  <Heart className="w-10 h-10 text-pink-300" />
                  <p className="text-xs">Selecione um Match ao lado para abrir a conversa.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
