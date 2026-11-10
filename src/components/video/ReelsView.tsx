import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Heart, MessageCircle, Share2, Eye, Volume2, VolumeX, 
  ChevronUp, ChevronDown, Plus, Video, Music, Send, X, Settings,
  Play, Pause, Cloud, Sparkles, Check, RefreshCw, AlertCircle, Smile
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Post } from '../../types';
import { CloudinaryConfigModal } from './CloudinaryConfigModal';
import { VideoRecorderModal } from './VideoRecorderModal';
import { AnimatedText } from '../common/AnimatedText';
import { AnimatedEmojiPicker } from '../emoji/AnimatedEmojiPicker';
import { 
  CLOUDINARY_SAMPLE_REELS, 
  CloudinaryReelItem, 
  optimizeCloudinaryVideoUrl, 
  isCloudinaryUrl, 
  hasCloudinaryConfig,
  getCloudinaryConfig
} from '../../lib/cloudinary';

interface UnifiedReel {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorBadge?: string;
  content: string;
  mediaUrl: string;
  videoThumbnail?: string;
  duration?: number;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  createdAt: string;
  vibeTag?: string;
  isCloudinary?: boolean;
  musicTitle?: string;
  comments?: Array<{
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
  }>;
}

export const ReelsView: React.FC = () => {
  const { 
    posts, 
    currentUser, 
    likePost, 
    addComment, 
    setViewingUserId, 
    setActiveTab, 
    showToast,
    createPost
  } = useApp();

  // Navigation & playback states
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('vibe_reels_muted');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // UI feedback states
  const [soundFeedback, setSoundFeedback] = useState<string | null>(null);
  const [playPauseFeedback, setPlayPauseFeedback] = useState<'play' | 'pause' | null>(null);
  const [heartBurst, setHeartBurst] = useState<{ id: string; x: number; y: number } | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  // Filters: 'all' | 'cloudinary' | 'mine'
  const [filterMode, setFilterMode] = useState<'all' | 'cloudinary' | 'mine'>('all');

  // Modals & Panels
  const [activeCommentsReelId, setActiveCommentsReelId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isCommentEmojiOpen, setIsCommentEmojiOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isRecorderOpen, setIsRecorderOpen] = useState(false);

  // Local reels storage for sample comments/likes if not in AppContext
  const [localReelsState, setLocalReelsState] = useState<Record<string, { isLiked: boolean; likesCount: number; comments: any[] }>>({});

  // Refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reelItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const lastTapRef = useRef<number>(0);
  const isCloudinaryActive = hasCloudinaryConfig();

  // 1. Build unified reels list combining User Posts and Cloudinary Sample Reels
  const allReels: UnifiedReel[] = React.useMemo(() => {
    // A. User Posts that are videos
    const userVideoPosts: UnifiedReel[] = posts
      .filter(p => p.mediaType === 'video' && Boolean(p.mediaUrl))
      .map(p => {
        const isCld = isCloudinaryUrl(p.mediaUrl);
        const optimizedUrl = isCld ? optimizeCloudinaryVideoUrl(p.mediaUrl!) : p.mediaUrl!;
        return {
          id: p.id,
          authorId: p.authorId,
          authorName: p.authorName,
          authorUsername: p.authorUsername,
          authorAvatar: p.authorAvatar,
          authorBadge: p.authorBadge,
          content: p.content,
          mediaUrl: optimizedUrl,
          videoThumbnail: p.videoThumbnail,
          duration: p.duration || 15,
          viewsCount: p.viewsCount || Math.max(24, (p.likesCount * 3) + 18),
          likesCount: p.likesCount,
          commentsCount: p.commentsCount || (p.comments ? p.comments.length : 0),
          sharesCount: p.sharesCount || 3,
          isLiked: p.isLiked,
          createdAt: p.createdAt,
          vibeTag: p.vibeTag || '🎬 Vibe Reels',
          isCloudinary: isCld,
          musicTitle: 'Áudio original • VIBE CLUBE 🇧🇷',
          comments: p.comments?.map(c => ({
            id: c.id,
            authorName: c.authorName,
            authorAvatar: c.authorAvatar,
            content: c.content,
            createdAt: c.createdAt
          })) || []
        };
      });

    // B. Cloudinary Sample Reels (hosted on Cloudinary CDN)
    const cldReels: UnifiedReel[] = CLOUDINARY_SAMPLE_REELS.map(s => {
      const local = localReelsState[s.id];
      return {
        id: s.id,
        authorId: s.authorId,
        authorName: s.authorName,
        authorUsername: s.authorUsername,
        authorAvatar: s.authorAvatar,
        authorBadge: 'PRO',
        content: s.content,
        mediaUrl: optimizeCloudinaryVideoUrl(s.mediaUrl),
        videoThumbnail: s.videoThumbnail,
        duration: s.duration,
        viewsCount: s.viewsCount,
        likesCount: local ? local.likesCount : s.likesCount,
        commentsCount: local ? local.comments.length : s.commentsCount,
        sharesCount: s.sharesCount,
        isLiked: local ? local.isLiked : false,
        createdAt: s.createdAt,
        vibeTag: s.vibeTag,
        isCloudinary: true,
        musicTitle: s.musicTitle || 'Cloudinary HD Audio • VIBE CLUBE',
        comments: local ? local.comments : [
          {
            id: `c_${s.id}_1`,
            authorName: 'Thiago Moura',
            authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
            content: 'Vídeo fantástico, carregou instantâneo pelo Cloudinary! 👏⚡',
            createdAt: 'Há 15 min'
          }
        ]
      };
    });

    // Evita duplicatas se algum já estiver nos posts
    const existingIds = new Set(userVideoPosts.map(p => p.id));
    const filteredCld = cldReels.filter(c => !existingIds.has(c.id));

    // Combina: posts do usuário no topo e Cloudinary reels em seguida
    return [...userVideoPosts, ...filteredCld];
  }, [posts, localReelsState]);

  // 2. Filtered reels according to active filter tab
  const displayedReels = React.useMemo(() => {
    if (filterMode === 'cloudinary') {
      return allReels.filter(r => r.isCloudinary);
    }
    if (filterMode === 'mine') {
      return allReels.filter(r => r.authorId === currentUser?.id);
    }
    return allReels;
  }, [allReels, filterMode, currentUser?.id]);

  const currentReel: UnifiedReel | undefined = displayedReels[activeIndex];

  // 3. Audio persistence
  useEffect(() => {
    try {
      localStorage.setItem('vibe_reels_muted', JSON.stringify(isMuted));
    } catch {}
  }, [isMuted]);

  // 4. Reset activeIndex when filter changes
  useEffect(() => {
    setActiveIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [filterMode]);

  // 5. IntersectionObserver de Alta Performance: detecta qual reel está visível
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const indexAttr = entry.target.getAttribute('data-reel-index');
            if (indexAttr !== null) {
              const nextIndex = parseInt(indexAttr, 10);
              if (!isNaN(nextIndex) && nextIndex !== activeIndex) {
                setActiveIndex(nextIndex);
                setIsPlaying(true);
              }
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6
      }
    );

    reelItemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      observer.disconnect();
    };
  }, [displayedReels.length, activeIndex]);

  // 6. Controle de Reprodução Seguro: só toca o ativo; os outros pausam e resetam
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;

      video.muted = isMuted;

      if (idx === activeIndex) {
        if (isPlaying) {
          setIsLoadingVideo(true);
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsLoadingVideo(false);
              })
              .catch(() => {
                // Silently fallback if autoplay is restricted by browser policy
                setIsLoadingVideo(false);
              });
          }
        } else {
          video.pause();
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex, isPlaying, isMuted, displayedReels.length]);

  // 7. Timeupdate do vídeo ativo para barra de progresso
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video && video.duration) {
      const pct = (video.currentTime / video.duration) * 100;
      setProgressPercent(pct);
    }
  };

  // 8. Alternar Play / Pause
  const togglePlayPause = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const activeVideo = videoRefs.current[activeIndex];
    if (!activeVideo) return;

    if (activeVideo.paused) {
      activeVideo.play().then(() => {
        setIsPlaying(true);
        setPlayPauseFeedback('play');
        setTimeout(() => setPlayPauseFeedback(null), 800);
      }).catch(() => {});
    } else {
      activeVideo.pause();
      setIsPlaying(false);
      setPlayPauseFeedback('pause');
      setTimeout(() => setPlayPauseFeedback(null), 800);
    }
  };

  // 9. Alternar Áudio (Mute / Unmute)
  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    // Atualiza o vídeo ativo imediatamente
    const activeVideo = videoRefs.current[activeIndex];
    if (activeVideo) {
      activeVideo.muted = nextMuted;
    }

    setSoundFeedback(nextMuted ? 'Mudo 🔇' : 'Som Ativado 🔊');
    setTimeout(() => {
      setSoundFeedback(null);
    }, 1200);
  };

  // 10. Double Tap / Double Click para Curtir com Explosão de Coração
  const handleVideoTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detectado
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (currentReel) {
        handleLike(currentReel);
        setHeartBurst({ id: currentReel.id, x, y });
        setTimeout(() => setHeartBurst(null), 900);
      }
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      // Single tap: toggle play/pause
      setTimeout(() => {
        if (lastTapRef.current === now) {
          togglePlayPause();
        }
      }, DOUBLE_TAP_DELAY + 20);
    }
  };

  // 11. Curtir Reel
  const handleLike = (reel: UnifiedReel) => {
    if (posts.some(p => p.id === reel.id)) {
      likePost(reel.id);
    } else {
      // Local state para reels de exemplo
      setLocalReelsState(prev => {
        const current = prev[reel.id] || { isLiked: false, likesCount: reel.likesCount, comments: reel.comments || [] };
        const nextLiked = !current.isLiked;
        return {
          ...prev,
          [reel.id]: {
            ...current,
            isLiked: nextLiked,
            likesCount: nextLiked ? current.likesCount + 1 : Math.max(0, current.likesCount - 1)
          }
        };
      });
    }
    showToast('Reel curtido! ❤️', 'vibe');
  };

  // 12. Compartilhar Reel
  const handleShare = (reel: UnifiedReel, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `Reel de ${reel.authorName} no VIBE CLUBE`,
        text: reel.content || 'Confira este Reel incrível no VIBE CLUBE!',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Link do Reel copiado para a área de transferência! 🚀', 'success');
    }
  };

  // 13. Adicionar Comentário
  const handleAddComment = (e: React.FormEvent, reelId: string) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `comm_${Date.now()}`,
      authorName: currentUser?.name || 'Você',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      content: commentText.trim(),
      createdAt: 'Agora'
    };

    if (posts.some(p => p.id === reelId)) {
      addComment(reelId, commentText.trim());
    } else {
      setLocalReelsState(prev => {
        const current = prev[reelId] || { 
          isLiked: false, 
          likesCount: currentReel?.likesCount || 10, 
          comments: currentReel?.comments || [] 
        };
        return {
          ...prev,
          [reelId]: {
            ...current,
            comments: [newComment, ...current.comments]
          }
        };
      });
    }

    setCommentText('');
    setIsCommentEmojiOpen(false);
    showToast('Comentário enviado no Reel! 💬', 'success');
  };

  // 14. Navegação por Botões Próximo / Anterior
  const scrollToNext = () => {
    if (activeIndex < displayedReels.length - 1) {
      const next = activeIndex + 1;
      const targetEl = reelItemsRef.current[next];
      targetEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveIndex(next);
      setIsPlaying(true);
    }
  };

  const scrollToPrev = () => {
    if (activeIndex > 0) {
      const prev = activeIndex - 1;
      const targetEl = reelItemsRef.current[prev];
      targetEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveIndex(prev);
      setIsPlaying(true);
    }
  };

  // 15. Atalhos de Teclado (Seta Cima/Baixo, Espaço para Play/Pause, M para Mudo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se estiver digitando em campo de texto
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToPrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleMute();
      } else if (e.key.toLowerCase() === 'l' && currentReel) {
        e.preventDefault();
        handleLike(currentReel);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, displayedReels.length, currentReel, isMuted, isPlaying]);

  // Reel ativo selecionado para modal de comentários
  const activeCommentsReel = displayedReels.find(r => r.id === activeCommentsReelId);

  return (
    <div className="w-full max-w-full flex flex-col items-center select-none overflow-x-hidden">
      
      {/* Top Header & Cloudinary Controls Bar */}
      <div className="w-full max-w-[440px] flex items-center justify-between px-3 py-2 mb-1 text-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-600 to-amber-500 text-white flex items-center justify-center shadow-xs">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Vibe Reels
              </span>
              {isCloudinaryActive && (
                <span 
                  title="Cloudinary Ativo e Otimizado"
                  className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-0.5"
                >
                  <Cloud className="w-2.5 h-2.5 text-emerald-600" />
                  <span>CDN HD</span>
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">
              {displayedReels.length} vídeos em alta definição
            </span>
          </div>
        </div>

        {/* Action buttons: Cloudinary config & Record */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsConfigModalOpen(true)}
            title="Configurações do Cloudinary"
            className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => setIsRecorderOpen(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Gravar</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs: Todos / Cloudinary / Meus Vídeos */}
      <div className="w-full max-w-[440px] px-3 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setFilterMode('all')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
            filterMode === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          🔥 Todos os Reels
        </button>

        <button
          type="button"
          onClick={() => setFilterMode('cloudinary')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
            filterMode === 'cloudinary'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
          }`}
        >
          <Cloud className="w-3 h-3" />
          <span>Cloudinary HD</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterMode('mine')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
            filterMode === 'mine'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          📹 Meus Vídeos
        </button>
      </div>

      {/* Main Reels Vertical Container */}
      {/* 
        Atenção à altura responsiva para mobile:
        - h-[calc(100dvh-175px)] em mobile para garantir que não ultrapasse nem colida com a barra inferior (MobileBottomNav)
        - max-w-[420px] e max-h-[820px] para proporção 9:16 perfeita
      */}
      <div 
        id="reels-main-viewport"
        className="relative w-full max-w-[420px] h-[calc(100dvh-175px)] sm:h-[calc(100dvh-150px)] max-h-[820px] rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-900 mx-auto"
      >
        
        {displayedReels.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Video className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-white">Nenhum reel encontrado</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                {filterMode === 'mine' 
                  ? 'Você ainda não gravou nenhum vídeo. Clique no botão abaixo para começar!'
                  : 'Nenhum vídeo disponível nesta categoria no momento.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsRecorderOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Gravar Meu Primeiro Vídeo</span>
            </button>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar touch-pan-y"
          >
            {displayedReels.map((reel, idx) => {
              const isCurrent = idx === activeIndex;
              const isAdjacent = Math.abs(idx - activeIndex) <= 1;
              const views = reel.viewsCount || 100;

              return (
                <div
                  key={reel.id}
                  ref={(el) => { reelItemsRef.current[idx] = el; }}
                  data-reel-index={idx}
                  onClick={handleVideoTap}
                  className="w-full h-full snap-start snap-always relative flex items-center justify-center bg-black overflow-hidden cursor-pointer select-none"
                >
                  
                  {/* HTML5 Video Element com Alta Performance */}
                  <video
                    ref={(el) => { videoRefs.current[idx] = el; }}
                    src={reel.mediaUrl}
                    poster={reel.videoThumbnail}
                    playsInline
                    loop
                    muted={isMuted}
                    preload={isCurrent ? 'auto' : isAdjacent ? 'metadata' : 'none'}
                    onTimeUpdate={isCurrent ? handleTimeUpdate : undefined}
                    onWaiting={() => isCurrent && setIsLoadingVideo(true)}
                    onPlaying={() => isCurrent && setIsLoadingVideo(false)}
                    onCanPlay={() => isCurrent && setIsLoadingVideo(false)}
                    className="w-full h-full object-cover bg-black select-none pointer-events-none"
                  />

                  {/* Loading Spinner se o vídeo estiver carregando */}
                  {isCurrent && isLoadingVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-xs z-15 pointer-events-none">
                      <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Play / Pause Feedback Animation ao tocar no vídeo */}
                  {isCurrent && playPauseFeedback && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                      <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center animate-in zoom-in-75 duration-200 border border-white/20">
                        {playPauseFeedback === 'play' ? (
                          <Play className="w-8 h-8 fill-white text-white ml-1" />
                        ) : (
                          <Pause className="w-8 h-8 fill-white text-white" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Se estiver pausado persistentemente, mostra pequeno badge no topo */}
                  {isCurrent && !isPlaying && !playPauseFeedback && (
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/15">
                      <Play className="w-3 h-3 fill-white" />
                      <span>Pausado</span>
                    </div>
                  )}

                  {/* Sound Feedback Pill Central ao alternar áudio */}
                  {isCurrent && soundFeedback && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-25">
                      <div className="px-4 py-2 rounded-full bg-black/85 backdrop-blur-md text-white font-black text-xs border border-white/20 shadow-2xl animate-in zoom-in-95 duration-150 flex items-center gap-1.5">
                        {soundFeedback}
                      </div>
                    </div>
                  )}

                  {/* Double Tap Heart Burst Animation */}
                  {heartBurst && heartBurst.id === reel.id && (
                    <div 
                      className="absolute z-30 pointer-events-none animate-in zoom-in-50 fade-out-0 duration-700"
                      style={{ 
                        left: `${heartBurst.x}px`, 
                        top: `${heartBurst.y}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <Heart className="w-20 h-20 fill-rose-500 text-rose-500 drop-shadow-2xl animate-bounce" />
                    </div>
                  )}

                  {/* Sound Toggle Icon (Top Right) */}
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="absolute top-4 right-4 z-25 p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/15 transition-transform active:scale-90 cursor-pointer shadow-lg"
                    title={isMuted ? 'Ativar som (ou pressione M)' : 'Desativar som (ou pressione M)'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-slate-300" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                    )}
                  </button>

                  {/* Right Floating Actions Column (Likes, Comments, Share, Views) */}
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    className="absolute right-2 sm:right-3 bottom-12 sm:bottom-14 z-25 flex flex-col items-center gap-3 sm:gap-4 text-white pointer-events-auto"
                  >
                    {/* Author Avatar with Follow '+' button */}
                    <div 
                      onClick={() => {
                        setViewingUserId(reel.authorId);
                        setActiveTab('profile');
                      }}
                      className="relative cursor-pointer group"
                      title={`Ver perfil de ${reel.authorName}`}
                    >
                      <img
                        src={reel.authorAvatar}
                        alt={reel.authorName}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-white shadow-xl group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-rose-600 rounded-full flex items-center justify-center text-white text-[10px] font-black border border-white">
                        +
                      </div>
                    </div>

                    {/* Like Button */}
                    <button
                      type="button"
                      onClick={() => handleLike(reel)}
                      className="flex flex-col items-center gap-0.5 group transition-transform active:scale-90 cursor-pointer min-w-[44px]"
                      title="Curtir Reel"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors shadow-lg ${
                        reel.isLiked 
                          ? 'bg-rose-600 text-white' 
                          : 'bg-black/50 text-white group-hover:bg-black/70'
                      }`}>
                        <Heart className={`w-5 h-5 ${reel.isLiked ? 'fill-white text-white' : 'text-white'}`} />
                      </div>
                      <span className="text-[11px] font-extrabold drop-shadow-md">
                        {reel.likesCount}
                      </span>
                    </button>

                    {/* Comments Button */}
                    <button
                      type="button"
                      onClick={() => setActiveCommentsReelId(reel.id)}
                      className="flex flex-col items-center gap-0.5 group transition-transform active:scale-90 cursor-pointer min-w-[44px]"
                      title="Comentários"
                    >
                      <div className="w-10 h-10 rounded-full bg-black/50 group-hover:bg-black/70 flex items-center justify-center backdrop-blur-md transition-colors shadow-lg">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[11px] font-extrabold drop-shadow-md">
                        {reel.commentsCount}
                      </span>
                    </button>

                    {/* Share Button */}
                    <button
                      type="button"
                      onClick={(e) => handleShare(reel, e)}
                      className="flex flex-col items-center gap-0.5 group transition-transform active:scale-90 cursor-pointer min-w-[44px]"
                      title="Compartilhar"
                    >
                      <div className="w-10 h-10 rounded-full bg-black/50 group-hover:bg-black/70 flex items-center justify-center backdrop-blur-md transition-colors shadow-lg">
                        <Share2 className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[11px] font-extrabold drop-shadow-md">
                        {reel.sharesCount}
                      </span>
                    </button>

                    {/* Views Count Pill */}
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-md">
                        <Eye className="w-4 h-4 text-amber-300" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-300 drop-shadow-md">
                        {views > 999 ? `${(views / 1000).toFixed(1)}k` : views}
                      </span>
                    </div>

                    {/* Cloudinary CDN Indicator badge */}
                    {reel.isCloudinary && (
                      <div 
                        title="Transmitido via Cloudinary Video CDN"
                        className="px-1.5 py-0.5 rounded-md bg-purple-950/80 backdrop-blur-md border border-purple-500/40 text-purple-300 text-[9px] font-bold flex items-center gap-0.5"
                      >
                        <Cloud className="w-2.5 h-2.5 text-purple-300" />
                        <span>HD</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Info Overlay (Author, Caption, Audio Ticker) */}
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-2 left-0 right-14 sm:right-16 px-3 sm:px-4 py-2 bg-gradient-to-t from-black/95 via-black/60 to-transparent text-white z-20 space-y-1.5 pointer-events-auto max-w-[calc(100%-3.75rem)]"
                  >
                    {/* Author & Vibe Tag */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span 
                        onClick={() => {
                          setViewingUserId(reel.authorId);
                          setActiveTab('profile');
                        }}
                        className="font-black text-sm hover:underline cursor-pointer flex items-center gap-1 drop-shadow-md"
                      >
                        @{reel.authorUsername}
                        {reel.authorBadge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/90 text-white font-black">
                            {reel.authorBadge}
                          </span>
                        )}
                      </span>

                      {reel.vibeTag && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-slate-100">
                          {reel.vibeTag}
                        </span>
                      )}
                    </div>

                    {/* Content Text with Animated Emoticons support */}
                    {reel.content && (
                      <div className="text-xs sm:text-sm text-slate-100 line-clamp-2 leading-relaxed drop-shadow-md break-words font-medium">
                        <AnimatedText text={reel.content} />
                      </div>
                    )}

                    {/* Music / Audio Ticker */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-semibold pt-0.5">
                      <Music className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-spin-slow" />
                      <span className="truncate">{reel.musicTitle || 'Áudio original • VIBE CLUBE'}</span>
                    </div>
                  </div>

                  {/* Playback Progress Scrubber at bottom edge */}
                  {isCurrent && (
                    <div 
                      ref={progressBarRef}
                      className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-30 cursor-pointer overflow-hidden group"
                      onClick={(e) => {
                        e.stopPropagation();
                        const bar = progressBarRef.current;
                        const activeVideo = videoRefs.current[activeIndex];
                        if (bar && activeVideo && activeVideo.duration) {
                          const rect = bar.getBoundingClientRect();
                          const clickX = e.clientX - rect.left;
                          const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                          activeVideo.currentTime = ratio * activeVideo.duration;
                        }
                      }}
                    >
                      <div 
                        className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-amber-400 transition-all duration-100"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

        {/* Desktop Up/Down Chevrons (Visible on tablet & desktop) */}
        {displayedReels.length > 1 && (
          <div className="hidden sm:flex flex-col gap-2 absolute left-3 bottom-6 z-25">
            <button
              type="button"
              onClick={scrollToPrev}
              disabled={activeIndex === 0}
              className="p-2 rounded-full bg-black/60 hover:bg-black/90 disabled:opacity-25 text-white backdrop-blur-md transition-all cursor-pointer shadow-lg"
              title="Reel anterior (Seta para cima)"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={scrollToNext}
              disabled={activeIndex === displayedReels.length - 1}
              className="p-2 rounded-full bg-black/60 hover:bg-black/90 disabled:opacity-25 text-white backdrop-blur-md transition-all cursor-pointer shadow-lg"
              title="Próximo reel (Seta para baixo)"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>

      {/* Keyboard Shortcuts Hint Pill (Desktop only) */}
      <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500 font-medium mt-2">
        <span>⌨️ <strong>Espaço</strong>: Play/Pause</span>
        <span>•</span>
        <span><strong>M</strong>: Áudio</span>
        <span>•</span>
        <span><strong>↑ / ↓</strong>: Navegar</span>
        <span>•</span>
        <span><strong>L</strong>: Curtir</span>
      </div>

      {/* Comments Drawer / Bottom Sheet */}
      {activeCommentsReelId && activeCommentsReel && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-4 space-y-3 max-h-[82dvh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-purple-600" />
                <span>Comentários ({activeCommentsReel.comments?.length || 0})</span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  setActiveCommentsReelId(null);
                  setIsCommentEmojiOpen(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 py-1 pr-1 max-h-[46dvh]">
              {activeCommentsReel.comments && activeCommentsReel.comments.length > 0 ? (
                activeCommentsReel.comments.map(c => (
                  <div key={c.id} className="flex items-start gap-2.5 text-xs">
                    <img
                      src={c.authorAvatar}
                      alt={c.authorName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="bg-slate-50 p-2.5 rounded-2xl flex-1 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-[11px]">{c.authorName}</span>
                        <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                      </div>
                      <div className="text-slate-700 mt-1 leading-relaxed break-words">
                        <AnimatedText text={c.content} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-xs text-slate-400 space-y-1">
                  <div className="text-2xl">💬</div>
                  <p className="font-bold text-slate-600">Nenhum comentário ainda</p>
                  <p>Seja o primeiro a deixar uma mensagem legal!</p>
                </div>
              )}
            </div>

            {/* Emoticon Picker if toggled */}
            {isCommentEmojiOpen && (
              <div className="pt-1 pb-1">
                <AnimatedEmojiPicker
                  onSelectEmoji={(char) => {
                    setCommentText(prev => prev + char);
                    commentInputRef.current?.focus();
                  }}
                  onClose={() => setIsCommentEmojiOpen(false)}
                />
              </div>
            )}

            {/* Input Form with Emoticon & Submit */}
            <form
              onSubmit={(e) => handleAddComment(e, activeCommentsReel.id)}
              className="w-full flex items-center gap-1.5 sm:gap-2 pt-2 border-t border-slate-100 shrink-0"
            >
              <div className="flex-1 min-w-0 relative flex items-center">
                <input
                  ref={commentInputRef}
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Escreva um comentário amigável..."
                  className="w-full min-w-0 pl-3 pr-8 py-2 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                />
                <button
                  type="button"
                  onClick={() => setIsCommentEmojiOpen(!isCommentEmojiOpen)}
                  className="absolute right-2 text-slate-400 hover:text-amber-500 text-sm cursor-pointer p-0.5 transition-colors"
                  title="Inserir emoticon animado"
                  aria-label="Inserir emoji"
                >
                  😀
                </button>
              </div>

              <button
                type="submit"
                disabled={!commentText.trim()}
                className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-xl cursor-pointer transition-colors shrink-0"
                title="Enviar comentário"
                aria-label="Enviar comentário"
              >
                <Send className="w-4 h-4 shrink-0" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cloudinary Config Modal */}
      <CloudinaryConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />

      {/* Video Recorder Modal */}
      <VideoRecorderModal
        isOpen={isRecorderOpen}
        onClose={() => setIsRecorderOpen(false)}
        onVideoRecorded={(file, thumb, dur) => {
          const objectUrl = URL.createObjectURL(file);
          createPost({
            content: 'Gravado ao vivo no Vibe Reels! 🎥✨',
            mediaType: 'video',
            mediaUrl: objectUrl,
            vibeTag: '🎬 Vibe Reels'
          });
          showToast('Seu vídeo gravado foi publicado no feed com sucesso! 🎬', 'success');
        }}
      />

    </div>
  );
};
