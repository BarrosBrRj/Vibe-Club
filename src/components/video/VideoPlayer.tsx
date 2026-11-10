import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Eye } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  thumbnailUrl?: string;
  postId?: string;
  viewsCount?: number;
  onView?: () => void;
  className?: string;
  autoPlayOnVisible?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  thumbnailUrl,
  postId,
  viewsCount,
  onView,
  className = '',
  autoPlayOnVisible = true
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [soundFeedback, setSoundFeedback] = useState<string | null>(null);
  const viewLoggedRef = useRef(false);
  const controlsTimeoutRef = useRef<number | null>(null);

  // IntersectionObserver para tocar quando visível e pausar quando sai
  useEffect(() => {
    if (!autoPlayOnVisible) return;
    const videoEl = videoRef.current;
    const containerEl = containerRef.current;
    if (!videoEl || !containerEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Entrou na tela: tocar mudo
            videoEl.muted = isMuted;
            videoEl.play().catch(() => {
              // Navegador pode bloquear se não tiver interação
            });
            setIsPlaying(true);
          } else {
            // Saiu da tela: pausar
            videoEl.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(containerEl);

    return () => {
      observer.disconnect();
    };
  }, [autoPlayOnVisible, isMuted]);

  // Contabilizar visualização após 2 segundos de reprodução
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setCurrentTime(current);

    if (!viewLoggedRef.current && current >= 1.8) {
      viewLoggedRef.current = true;
      if (onView) onView();
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  // Alternar som (Mudo / Ativado) com aviso visual amigável
  const toggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);

    setSoundFeedback(nextMuted ? 'Mudo 🔇' : 'Som Ativado 🔊');
    setTimeout(() => {
      setSoundFeedback(null);
    }, 1400);
  };

  // Alternar Play / Pause
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    triggerControlsVisibility();
  };

  // Alternar Tela Cheia
  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const triggerControlsVisibility = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, 2800);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={triggerControlsVisibility}
      onClick={toggleSound}
      className={`relative w-full max-w-full overflow-hidden rounded-2xl bg-black select-none group cursor-pointer ${className}`}
    >
      {/* Vídeo HTML5 */}
      <video
        ref={videoRef}
        src={src}
        poster={thumbnailUrl}
        playsInline
        muted={isMuted}
        loop
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full max-w-full h-auto max-h-[520px] object-contain mx-auto block bg-black"
      />

      {/* Floating Sound Feedback Pill (Central) */}
      {soundFeedback && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="px-4 py-2 rounded-full bg-black/80 backdrop-blur-md text-white font-extrabold text-sm border border-white/20 shadow-2xl animate-in zoom-in-95 duration-200 flex items-center gap-2">
            <span>{soundFeedback}</span>
          </div>
        </div>
      )}

      {/* Persistent / Hover Floating Sound Icon Badge (Top Right) */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        {viewsCount !== undefined && viewsCount > 0 && (
          <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-[11px] font-semibold flex items-center gap-1 border border-white/10 pointer-events-none">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>{viewsCount.toLocaleString('pt-BR')}</span>
          </div>
        )}
        <button
          onClick={toggleSound}
          className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-transform active:scale-90 cursor-pointer"
          title={isMuted ? 'Ativar som' : 'Desativar som'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          )}
        </button>
      </div>

      {/* Floating Tap-to-Unmute prompt when muted and playing */}
      {isMuted && isPlaying && !soundFeedback && (
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/80 text-[10px] font-semibold flex items-center gap-1.5 border border-white/10">
            <VolumeX className="w-3 h-3 text-slate-300" />
            <span>Toque para ativar o som</span>
          </div>
        </div>
      )}

      {/* Central Play/Pause Watermark when paused */}
      {!isPlaying && (
        <div 
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-white/25 hover:bg-white/35 backdrop-blur-md text-white flex items-center justify-center shadow-xl transition-transform transform active:scale-95">
            <Play className="w-7 h-7 fill-white translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Bottom Controls Bar (Fades in on hover or tap) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white z-10 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Scrubber */}
        <div className="w-full flex items-center gap-2 mb-2">
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="hover:text-purple-400 transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <button
              onClick={toggleSound}
              className="hover:text-purple-400 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <span className="text-[11px] text-slate-300 font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="hover:text-purple-400 transition-colors cursor-pointer"
              title="Tela Cheia"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
