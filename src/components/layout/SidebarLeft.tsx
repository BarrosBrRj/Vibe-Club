import React, { useRef, useState } from 'react';
import { 
  Users, MessageSquare, Image as ImageIcon, Video, 
  Heart, Bookmark, Flame, ShieldAlert, Sparkles, 
  Coins, UserCheck, EyeOff, Camera
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { compressImage } from '../../utils/imageCompressor';

export const SidebarLeft: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    viewingUserId, 
    setViewingUserId, 
    activeTab, 
    setActiveTab,
    showToast,
    setReportTarget,
    setIsReportModalOpen,
    openWalletModal,
    updateProfile
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarError, setAvatarError] = useState(false);

  // If viewing a profile, display that user. Otherwise display current logged-in user.
  const displayUser = (activeTab === 'profile' && viewingUserId)
    ? (allUsers.find(u => u.id === viewingUserId) || currentUser)
    : currentUser;

  const isOwnProfile = !displayUser || displayUser.id === currentUser?.id;
  const firstLetter = (displayUser?.name || 'V').charAt(0).toUpperCase();

  const handleActionClick = (actionName: string) => {
    if (actionName === 'scraps') {
      if (displayUser) setViewingUserId(displayUser.id);
      setActiveTab('profile');
      showToast('Mural de recados aberto', 'info');
    } else if (actionName === 'photos') {
      setActiveTab('photos');
    } else if (actionName === 'videos') {
      setActiveTab('videos');
    } else if (actionName === 'message') {
      setActiveTab('chat');
    } else if (actionName === 'testimonial') {
      if (displayUser) setViewingUserId(displayUser.id);
      setActiveTab('profile');
      showToast('Aba de depoimentos aberta', 'info');
    } else if (actionName === 'teaser') {
      showToast(`Você enviou uma cutucada para ${displayUser?.name}! 😉`, 'vibe');
    } else if (actionName === 'bookmark') {
      showToast(`${displayUser?.name} adicionado(a) aos seus favoritos! 📎`, 'success');
    } else if (actionName === 'hotlist') {
      showToast(`${displayUser?.name} adicionado(a) à sua Hot-list! 🔥`, 'vibe');
    } else if (actionName === 'crushlist') {
      showToast(`${displayUser?.name} adicionado(a) à sua Crush-list! ❤️`, 'vibe');
    } else if (actionName === 'ignore') {
      showToast(`Usuário ignorado temporariamente.`, 'info');
    } else if (actionName === 'report') {
      if (displayUser) {
        setReportTarget({ type: 'user', id: displayUser.id, name: displayUser.name });
        setIsReportModalOpen(true);
      }
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 360, 0.88);
        if (compressed) {
          updateProfile({ avatar: compressed });
          setAvatarError(false);
          showToast('Foto de perfil atualizada! 📸', 'success');
        }
      } catch {
        showToast('Não foi possível carregar a foto.', 'error');
      }
    }
  };

  return (
    <aside className="w-56 sm:w-60 shrink-0 hidden md:block space-y-3 font-sans">
      
      {/* 1. User Profile Card (Classic Orkut Box) */}
      {displayUser && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs">
          
          <div className="relative group">
            <div 
              onClick={() => {
                if (isOwnProfile && fileInputRef.current) {
                  fileInputRef.current.click();
                } else {
                  setViewingUserId(displayUser.id);
                  setActiveTab('profile');
                }
              }}
              className="w-full aspect-square rounded-2xl overflow-hidden cursor-pointer relative border border-slate-200/90 shadow-xs bg-slate-100 flex items-center justify-center"
              title={isOwnProfile ? 'Clique para trocar sua foto de perfil' : `Ver perfil de ${displayUser.name}`}
            >
              {displayUser.avatar && !avatarError ? (
                <img 
                  src={displayUser.avatar} 
                  alt={displayUser.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-purple-100 to-pink-100 flex items-center justify-center text-5xl font-black text-purple-700 font-heading">
                  {firstLetter}
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
                <span className="text-white text-xs font-bold">
                  {isOwnProfile ? 'Trocar foto' : 'Ver perfil'}
                </span>
                {isOwnProfile && <Camera className="w-4 h-4 text-white" />}
              </div>
            </div>

            {isOwnProfile && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-1.5 rounded-full shadow-lg border-2 border-white cursor-pointer transition-transform hover:scale-110 active:scale-95"
                  title="Mudar foto de perfil"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          <div className="pt-3 text-slate-800 leading-snug">
            <div 
              className="font-extrabold text-slate-900 truncate hover:text-purple-700 cursor-pointer text-base"
              onClick={() => {
                setViewingUserId(displayUser.id);
                setActiveTab('profile');
              }}
            >
              {displayUser.name}
            </div>
            <div className="text-slate-600 text-xs sm:text-sm font-medium mt-1">
              {displayUser.orkutFields?.relationshipStatus === 'single' ? 'Solteiro(a)' : 
               displayUser.orkutFields?.relationshipStatus === 'dating' ? 'Namorando' : 
               displayUser.orkutFields?.relationshipStatus === 'married' ? 'Casado(a)' : 'Solteiro(a)'}
            </div>
            <div className="text-slate-500 text-xs sm:text-sm truncate mt-0.5">{displayUser.city}</div>
          </div>
        </div>
      )}

      {/* 2. Classic Vertical Actions List */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2 shadow-xs">
        <div className="space-y-1 text-sm">
          
          <button
            onClick={() => handleActionClick('scraps')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer font-semibold"
          >
            <span className="text-base">📝</span>
            <span className="flex-1 truncate">Mural de Recados</span>
            <span className="text-xs text-slate-400 font-bold">({displayUser?.testimonialsCount || 12})</span>
          </button>

          <button
            onClick={() => handleActionClick('photos')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer font-semibold"
          >
            <span className="text-base">📷</span>
            <span className="flex-1 truncate">Fotos</span>
            <span className="text-xs text-slate-400 font-bold">({displayUser?.photosCount || 18})</span>
          </button>

          <button
            onClick={() => handleActionClick('videos')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer font-semibold"
          >
            <span className="text-base">🎥</span>
            <span className="flex-1 truncate">Vídeos & Reels</span>
          </button>

          <button
            onClick={() => handleActionClick('message')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer font-semibold"
          >
            <span className="text-base">✉️</span>
            <span className="flex-1 truncate">Enviar Mensagem</span>
          </button>

          <button
            onClick={() => handleActionClick('testimonial')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer font-semibold"
          >
            <span className="text-base">✍️</span>
            <span className="flex-1 truncate">Depoimentos</span>
          </button>

          <button
            onClick={() => handleActionClick('teaser')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer font-semibold"
          >
            <span className="text-base">💬</span>
            <span className="flex-1 truncate">Cutucar</span>
          </button>

          <div className="my-1.5 border-t border-slate-100"></div>

          <button
            onClick={() => handleActionClick('bookmark')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer font-semibold"
          >
            <span className="text-base">📎</span>
            <span className="flex-1 truncate">Adicionar Favoritos</span>
          </button>

          <button
            onClick={() => handleActionClick('hotlist')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-slate-700 hover:text-pink-600 hover:bg-pink-50 transition-colors cursor-pointer font-semibold"
          >
            <span className="text-base">🔥</span>
            <span className="flex-1 truncate">Hot-List</span>
          </button>

          <button
            onClick={() => handleActionClick('crushlist')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-slate-700 hover:text-pink-600 hover:bg-pink-50 transition-colors cursor-pointer font-semibold"
          >
            <span className="text-base">❤️</span>
            <span className="flex-1 truncate">Crush-List</span>
          </button>

          <div className="my-1.5 border-t border-slate-100"></div>

          <button
            onClick={() => handleActionClick('report')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-xs font-semibold"
          >
            <span className="text-base">⚠️</span>
            <span className="flex-1 truncate">Denunciar Perfil</span>
          </button>

        </div>
      </div>

      {/* 3. Vibe Clube Quick Navigation */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs text-sm space-y-2.5">
        <div className="font-extrabold text-slate-900 flex items-center gap-1.5 pb-1.5 border-b border-slate-100 text-xs uppercase tracking-wider text-purple-700">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Atalhos Vibe Clube</span>
        </div>
        
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab('communities')}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-purple-700 text-left font-semibold cursor-pointer"
          >
            <span className="text-base">🏘️</span>
            <span>Comunidades</span>
          </button>
          <button
            onClick={() => setActiveTab('arcade')}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-purple-700 text-left font-semibold cursor-pointer"
          >
            <span className="text-base">🕹️</span>
            <span>Arcade & Jogos</span>
          </button>
          <button
            onClick={() => setActiveTab('encontros')}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-purple-700 text-left font-semibold cursor-pointer"
          >
            <span className="text-base">💘</span>
            <span>Vibe Encontros</span>
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-purple-700 text-left font-semibold cursor-pointer"
          >
            <span className="text-base">🛍️</span>
            <span>Marketplace</span>
          </button>
          <button
            onClick={() => openWalletModal('balance')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-left font-extrabold cursor-pointer border border-amber-200/70 mt-1.5 text-sm"
          >
            <Coins className="w-4 h-4 text-amber-600" />
            <span>Carteira: {currentUser?.vibesBalance || 0} V$</span>
          </button>
        </div>
      </div>

    </aside>
  );
};
