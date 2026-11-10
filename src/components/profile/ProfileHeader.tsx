import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Users, MessageSquare, Edit3, ShieldAlert, 
  Crown, Gift, Heart, Sparkles, Wallet, Upload, Move, Check, X
} from 'lucide-react';
import { User } from '../../types';
import { useApp } from '../../context/AppContext';
import { CoverUploadModal } from './CoverUploadModal';
import { ProfileEditModal } from './ProfileEditModal';
import { compressImage } from '../../utils/imageCompressor';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  onSendFriendRequest: () => void;
  onOpenMessage: () => void;
  onOpenGift: () => void;
  onReport: () => void;
  onUpdateUser: (fields: Partial<User>) => void;
  approvedTestimonialsCount: number;
  postsCount?: number;
  onSelectSubTab?: (tab: 'posts' | 'mural' | 'testimonials' | 'photos' | 'sobre' | 'communities') => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isOwnProfile,
  onSendFriendRequest,
  onOpenMessage,
  onOpenGift,
  onReport,
  onUpdateUser,
  approvedTestimonialsCount,
  postsCount,
  onSelectSubTab
}) => {
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [tempPositionY, setTempPositionY] = useState(user.coverPositionY ?? 50);
  const [isDraggingBanner, setIsDraggingBanner] = useState(false);

  const { openWalletModal, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const dragStartYRef = useRef<number>(0);
  const startPosYRef = useRef<number>(50);

  const firstLetter = (user.name || 'V').charAt(0).toUpperCase();

  const handleQuickAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 360, 0.88);
        if (compressed) {
          onUpdateUser({ avatar: compressed });
          setAvatarError(false);
          showToast('Foto de perfil atualizada com sucesso! 📸', 'success');
        }
      } catch {
        showToast('Não foi possível carregar a imagem selecionada.', 'error');
      }
    }
  };

  const startRepositioning = () => {
    setTempPositionY(user.coverPositionY ?? 50);
    setIsRepositioning(true);
  };

  const handleBannerDragStart = (clientY: number) => {
    if (!isRepositioning) return;
    setIsDraggingBanner(true);
    dragStartYRef.current = clientY;
    startPosYRef.current = tempPositionY;
  };

  const handleBannerDragMove = (clientY: number) => {
    if (!isDraggingBanner || !bannerRef.current) return;
    const rect = bannerRef.current.getBoundingClientRect();
    const height = rect.height || 180;
    const deltaY = clientY - dragStartYRef.current;
    const deltaPercent = (deltaY / height) * 100;
    const newPos = Math.min(100, Math.max(0, startPosYRef.current - deltaPercent));
    setTempPositionY(Math.round(newPos));
  };

  const handleBannerDragEnd = () => {
    setIsDraggingBanner(false);
  };

  const saveReposition = () => {
    onUpdateUser({ coverPositionY: tempPositionY });
    setIsRepositioning(false);
    showToast('Posição da foto de capa salva com sucesso! ✨', 'success');
  };

  const cancelReposition = () => {
    setTempPositionY(user.coverPositionY ?? 50);
    setIsRepositioning(false);
  };

  // CRITICAL: Block native page scroll on touch while repositioning so only the photo moves
  useEffect(() => {
    const el = bannerRef.current;
    if (!el || !isRepositioning) return;
    const preventScroll = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    el.addEventListener('touchstart', preventScroll, { passive: false });
    el.addEventListener('touchmove', preventScroll, { passive: false });
    return () => {
      el.removeEventListener('touchstart', preventScroll);
      el.removeEventListener('touchmove', preventScroll);
    };
  }, [isRepositioning]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden font-sans">
      
      {/* Cover Banner - with Drag to Reposition */}
      <div 
        ref={bannerRef}
        onMouseDown={(e) => isRepositioning && (e.preventDefault(), handleBannerDragStart(e.clientY))}
        onMouseMove={(e) => isRepositioning && isDraggingBanner && (e.preventDefault(), handleBannerDragMove(e.clientY))}
        onMouseUp={handleBannerDragEnd}
        onMouseLeave={handleBannerDragEnd}
        onTouchStart={(e) => isRepositioning && e.touches[0] && handleBannerDragStart(e.touches[0].clientY)}
        onTouchMove={(e) => isRepositioning && isDraggingBanner && e.touches[0] && handleBannerDragMove(e.touches[0].clientY)}
        onTouchEnd={handleBannerDragEnd}
        style={{ touchAction: isRepositioning ? 'none' : 'auto' }}
        className={`relative h-40 sm:h-52 bg-gradient-to-r from-purple-700 via-pink-600 to-amber-500 overflow-hidden group select-none ${
          isRepositioning 
            ? isDraggingBanner 
              ? 'cursor-grabbing ring-4 ring-pink-500/50' 
              : 'cursor-grab ring-2 ring-purple-400' 
            : ''
        }`}
      >
        {user.coverImage ? (
          <img
            src={user.coverImage}
            alt={`Capa de ${user.name}`}
            className="w-full h-full object-cover pointer-events-none transition-[object-position] duration-75"
            style={{ 
              objectPosition: `${user.coverPositionX ?? 50}% ${isRepositioning ? tempPositionY : (user.coverPositionY ?? 50)}%`,
              transform: (user.coverZoom || user.coverRotation) ? `scale(${user.coverZoom ?? 1}) rotate(${user.coverRotation ?? 0}deg)` : undefined
            }}
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 opacity-90" />
        )}
        
        {/* Repositioning Active Overlay Bar */}
        {isRepositioning ? (
          <div className="absolute inset-0 bg-black/25 flex flex-col justify-between p-3 sm:p-4 pointer-events-none animate-in fade-in">
            <div className="self-center bg-black/75 backdrop-blur-md text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-white/20">
              <Move className="w-4 h-4 text-pink-300 animate-pulse" />
              <span>Arraste para cima ou para baixo para acertar a posição ({tempPositionY}%)</span>
            </div>

            <div className="pointer-events-auto flex items-center justify-between gap-2 flex-wrap bg-black/65 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-xl">
              <div className="flex items-center gap-1.5 text-xs text-white">
                <span className="font-semibold text-pink-200 hidden sm:inline">Ajuste rápido:</span>
                <button
                  type="button"
                  onClick={() => setTempPositionY(0)}
                  className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Topo
                </button>
                <button
                  type="button"
                  onClick={() => setTempPositionY(50)}
                  className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Centro
                </button>
                <button
                  type="button"
                  onClick={() => setTempPositionY(100)}
                  className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Fundo
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={cancelReposition}
                  className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveReposition}
                  className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar Posição</span>
                </button>
              </div>
            </div>
          </div>
        ) : isOwnProfile && (
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {user.coverImage && (
              <button
                onClick={startRepositioning}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-all border border-white/20 shadow-md"
                title="Ajustar posição da capa deslizando com o dedo ou mouse"
              >
                <Move className="w-3.5 h-3.5 text-pink-300" />
                <span className="hidden sm:inline">Ajustar posição</span>
                <span className="sm:hidden">Posição</span>
              </button>
            )}
            <button
              onClick={() => setShowCoverModal(true)}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-all border border-white/20 shadow-md"
            >
              <Camera className="w-3.5 h-3.5 text-pink-300" />
              <span>Mudar capa</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Info Row */}
      <div className="p-4 sm:p-6 bg-white">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            
            {/* Avatar with gradient ring - Displays user.avatar or initial */}
            <div className="relative group shrink-0">
              <div 
                onClick={() => isOwnProfile && fileInputRef.current?.click()}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 p-0.5 shadow-md overflow-hidden ${isOwnProfile ? 'cursor-pointer' : ''}`}
                title={isOwnProfile ? 'Clique para trocar sua foto de perfil' : user.name}
              >
                {user.avatar && !avatarError ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-2xl bg-slate-100 group-hover:scale-105 transition-transform duration-200"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black font-heading text-purple-700">
                    {firstLetter}
                  </div>
                )}
              </div>

              {isOwnProfile && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleQuickAvatarChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-1.5 rounded-full shadow-lg border-2 border-white cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    title="Mudar foto de perfil"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
                  {user.name}
                </h1>
                {user.isPremium && (
                  <span className="text-xs bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                    VIP
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-600 font-semibold mt-1">
                @{user.username} • {user.city}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {isOwnProfile ? (
              <>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="vibe-btn text-sm py-2 px-4.5"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Editar perfil</span>
                </button>
                <button
                  onClick={() => openWalletModal('balance')}
                  className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-sm border border-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Wallet className="w-4 h-4 text-amber-600" />
                  <span>{user.vibesBalance} V$</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onSendFriendRequest}
                  className="vibe-btn text-sm py-2 px-4.5"
                >
                  <Users className="w-4 h-4" />
                  <span>Adicionar amigo</span>
                </button>
                <button
                  onClick={onOpenMessage}
                  className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-sm border border-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Recado</span>
                </button>
                <button
                  onClick={onOpenGift}
                  className="px-4 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 font-bold text-sm border border-pink-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-pink-500" />
                  <span>Presentear</span>
                </button>
                <button
                  onClick={onReport}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                  title="Denunciar"
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap text-sm text-slate-700 mt-4 pt-3.5 border-t border-slate-100">
          <button 
            onClick={() => onSelectSubTab?.('mural')}
            className="hover:text-purple-700 flex items-center gap-1.5 cursor-pointer font-bold transition-colors"
          >
            <span className="text-base">📝</span>
            <span>{user.testimonialsCount || 43} recados</span>
          </button>
          <span className="text-slate-300">•</span>
          <button 
            onClick={() => onSelectSubTab?.('photos')}
            className="hover:text-purple-700 flex items-center gap-1.5 cursor-pointer font-bold transition-colors"
          >
            <span className="text-base">📷</span>
            <span>{user.photosCount || 9} fotos</span>
          </button>
          <span className="text-slate-300">•</span>
          <button 
            onClick={() => onSelectSubTab?.('posts')}
            className="hover:text-purple-700 flex items-center gap-1.5 cursor-pointer font-bold transition-colors"
          >
            <span className="text-base">🎥</span>
            <span>{postsCount ?? 5} publicações</span>
          </button>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5 text-amber-700 font-bold">
            <span className="text-base">⭐</span>
            <span>{user.friendsCount + 12} fãs</span>
          </div>
        </div>
      </div>

      {/* Cover Upload Modal */}
      <CoverUploadModal
        isOpen={showCoverModal}
        onClose={() => setShowCoverModal(false)}
        currentCover={user.coverImage}
        currentPositionY={user.coverPositionY ?? 50}
        currentPositionX={user.coverPositionX ?? 50}
        currentZoom={user.coverZoom ?? 1}
        currentRotation={user.coverRotation ?? 0}
        onSaveCover={(url, posY, posX, zoom, rot) => {
          onUpdateUser({ 
            coverImage: url,
            coverPositionY: typeof posY === 'number' ? posY : 50,
            coverPositionX: typeof posX === 'number' ? posX : 50,
            coverZoom: zoom ?? 1,
            coverRotation: rot ?? 0
          });
        }}
      />

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onSave={(updated) => {
          onUpdateUser(updated);
        }}
      />

    </div>
  );
};
