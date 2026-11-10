import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Users, MessageSquare, Image as ImageIcon, Info, 
  ShieldCheck, Camera, Upload, Plus, Trash2, Check, X, 
  Lock, Globe, EyeOff, Building2, Compass, Sparkles, Send, 
  UserPlus, UserMinus, Crown, Shield, Heart, MoreVertical, Move
} from 'lucide-react';
import { Community, CommunityTopic, GroupRole, Post, User } from '../../types';
import { PostCard } from '../feed/PostCard';
import { CoverUploadModal } from '../profile/CoverUploadModal';

interface ClubDetailViewProps {
  community: Community;
  currentUser: User | null;
  topics: CommunityTopic[];
  posts: Post[];
  onBack: () => void;
  onJoinCommunity: (id: string) => void;
  onLeaveCommunity: (id: string) => void;
  onRequestJoinGroup: (id: string) => void;
  onApproveRequest: (groupId: string, userId: string) => void;
  onRejectRequest: (groupId: string, userId: string) => void;
  onRemoveMember: (groupId: string, userId: string) => void;
  onChangeRole: (groupId: string, userId: string, newRole: GroupRole) => void;
  onUpdateCover: (communityId: string, url: string) => void;
  onUpdateCommunity: (communityId: string, fields: Partial<Community>) => void;
  onAddPhoto: (communityId: string, url: string) => void;
  onCreateTopic: (communityId: string, title: string, content: string) => void;
  onSelectTopic: (topic: CommunityTopic) => void;
  onCreatePost: (data: { content: string; mediaUrl?: string; mediaType: 'none' | 'image' | 'video'; communityId?: string }) => void;
  onDeletePost: (postId: string) => void;
}

export const ClubDetailView: React.FC<ClubDetailViewProps> = ({
  community,
  currentUser,
  topics,
  posts,
  onBack,
  onJoinCommunity,
  onLeaveCommunity,
  onRequestJoinGroup,
  onApproveRequest,
  onRejectRequest,
  onRemoveMember,
  onChangeRole,
  onUpdateCover,
  onUpdateCommunity,
  onAddPhoto,
  onCreateTopic,
  onSelectTopic,
  onCreatePost,
  onDeletePost
}) => {
  // Tabs: discussao, membros, fotos, sobre, admin
  const [activeTab, setActiveTab] = useState<'discussion' | 'members' | 'photos' | 'about' | 'admin'>('discussion');

  // Cover change modal
  const [showCoverModal, setShowCoverModal] = useState(false);

  // New Post in Community Form
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  // Topic creation modal/form (for Orkut-style communities)
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [topicTitle, setTopicTitle] = useState('');
  const [topicContent, setTopicContent] = useState('');

  // Add photo to gallery modal
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [selectedLightboxPhoto, setSelectedLightboxPhoto] = useState<string | null>(null);

  // Admin edit form state
  const [adminName, setAdminName] = useState(community.name);
  const [adminDesc, setAdminDesc] = useState(community.description);
  const [adminRules, setAdminRules] = useState(community.rules.join('\n'));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const coverBannerRef = useRef<HTMLDivElement>(null);

  // Cover repositioning state
  const [isRepositioningCover, setIsRepositioningCover] = useState(false);
  const [tempCoverPosY, setTempCoverPosY] = useState(community.coverPositionY ?? 50);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const dragCoverStartYRef = useRef<number>(0);
  const startCoverPosYRef = useRef<number>(50);

  const handleCoverDragStart = (clientY: number) => {
    if (!isRepositioningCover) return;
    setIsDraggingCover(true);
    dragCoverStartYRef.current = clientY;
    startCoverPosYRef.current = tempCoverPosY;
  };

  const handleCoverDragMove = (clientY: number) => {
    if (!isDraggingCover || !coverBannerRef.current) return;
    const rect = coverBannerRef.current.getBoundingClientRect();
    const height = rect.height || 180;
    const deltaY = clientY - dragCoverStartYRef.current;
    const deltaPercent = (deltaY / height) * 100;
    const newPos = Math.min(100, Math.max(0, startCoverPosYRef.current - deltaPercent));
    setTempCoverPosY(Math.round(newPos));
  };

  const handleCoverDragEnd = () => {
    setIsDraggingCover(false);
  };

  const handleSaveCoverPosition = () => {
    onUpdateCommunity(community.id, { coverPositionY: tempCoverPosY });
    setIsRepositioningCover(false);
  };

  // CRITICAL: Block native page scroll on touch while repositioning so only the photo moves
  React.useEffect(() => {
    const el = coverBannerRef.current;
    if (!el || !isRepositioningCover) return;
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
  }, [isRepositioningCover]);

  // Permissions
  const isOwner = currentUser?.id === community.creatorId || community.currentUserRole === 'owner';
  const isAdmin = isOwner || community.currentUserRole === 'admin';
  const isModerator = isAdmin || community.currentUserRole === 'moderator';
  const isMember = community.isMember;
  const isPending = community.pendingRequests?.some(r => r.userId === currentUser?.id);

  const kind = community.type || 'community';
  const isPage = kind === 'page';
  const isGroup = kind === 'group';

  // Filter posts belonging to this community
  const communityPosts = posts.filter(p => p.communityId === community.id);

  // Handle post creation in community
  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    onCreatePost({
      content: newPostContent.trim(),
      mediaUrl: newPostImage.trim() || undefined,
      mediaType: newPostImage.trim() ? 'image' : 'none',
      communityId: community.id
    });
    setNewPostContent('');
    setNewPostImage('');
    setShowImageInput(false);
  };

  // Handle topic creation
  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim() || !topicContent.trim()) return;
    onCreateTopic(community.id, topicTitle.trim(), topicContent.trim());
    setTopicTitle('');
    setTopicContent('');
    setShowTopicModal(false);
  };

  // Handle member photo upload
  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onAddPhoto(community.id, reader.result);
          setShowAddPhotoModal(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Admin settings
  const handleSaveAdminSettings = () => {
    onUpdateCommunity(community.id, {
      name: adminName.trim(),
      description: adminDesc.trim(),
      rules: adminRules.split('\n').map(r => r.trim()).filter(Boolean)
    });
  };

  return (
    <div className="space-y-3 max-w-4xl mx-auto w-full font-sans">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="text-purple-700 text-xs font-bold hover:underline cursor-pointer flex items-center gap-1"
        >
          &lt;&lt; Voltar para comunidades
        </button>
      </div>

      {/* 1. CABEÇALHO DO CLUBE: Vibe Clube Community Box */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-white text-slate-800 font-extrabold text-xs px-4 py-3 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <Compass className="w-4 h-4 text-purple-600 shrink-0" />
            <span className="truncate text-slate-900 font-extrabold">Comunidade: {community.name}</span>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setTempCoverPosY(community.coverPositionY ?? 50);
                  setIsRepositioningCover(true);
                }}
                className="text-xs text-purple-700 hover:underline cursor-pointer font-semibold flex items-center gap-1"
              >
                <Move className="w-3.5 h-3.5" />
                <span>Ajustar posição</span>
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => setShowCoverModal(true)}
                className="text-xs text-purple-700 hover:underline cursor-pointer font-semibold flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Alterar capa</span>
              </button>
            </div>
          )}
        </div>

        {/* Cover Banner with Drag-to-Reposition */}
        <div
          ref={coverBannerRef}
          onMouseDown={(e) => isRepositioningCover && (e.preventDefault(), handleCoverDragStart(e.clientY))}
          onMouseMove={(e) => isRepositioningCover && isDraggingCover && (e.preventDefault(), handleCoverDragMove(e.clientY))}
          onMouseUp={handleCoverDragEnd}
          onMouseLeave={handleCoverDragEnd}
          onTouchStart={(e) => isRepositioningCover && e.touches[0] && handleCoverDragStart(e.touches[0].clientY)}
          onTouchMove={(e) => isRepositioningCover && isDraggingCover && e.touches[0] && handleCoverDragMove(e.touches[0].clientY)}
          onTouchEnd={handleCoverDragEnd}
          style={{ touchAction: isRepositioningCover ? 'none' : 'auto' }}
          className={`relative h-36 sm:h-52 bg-slate-900 overflow-hidden select-none ${
            isRepositioningCover
              ? isDraggingCover
                ? 'cursor-grabbing ring-4 ring-pink-500/50'
                : 'cursor-grab ring-2 ring-purple-400'
              : ''
          }`}
        >
          <img
            src={community.coverImage || community.logo}
            alt={`Capa de ${community.name}`}
            className="w-full h-full object-cover pointer-events-none transition-[object-position] duration-75"
            style={{ 
              objectPosition: `${community.coverPositionX ?? 50}% ${isRepositioningCover ? tempCoverPosY : (community.coverPositionY ?? 50)}%`,
              transform: (community.coverZoom || community.coverRotation) ? `scale(${community.coverZoom ?? 1}) rotate(${community.coverRotation ?? 0}deg)` : undefined
            }}
            draggable={false}
          />

          {/* Repositioning Active Overlay Bar */}
          {isRepositioningCover ? (
            <div className="absolute inset-0 bg-black/25 flex flex-col justify-between p-3 sm:p-4 pointer-events-none animate-in fade-in">
              <div className="self-center bg-black/75 backdrop-blur-md text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-white/20">
                <Move className="w-4 h-4 text-pink-300 animate-pulse" />
                <span>Arraste para cima ou para baixo para acertar a posição ({tempCoverPosY}%)</span>
              </div>

              <div className="pointer-events-auto flex items-center justify-between gap-2 flex-wrap bg-black/65 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-xl">
                <div className="flex items-center gap-1.5 text-xs text-white">
                  <span className="font-semibold text-pink-200 hidden sm:inline">Ajuste rápido:</span>
                  <button
                    type="button"
                    onClick={() => setTempCoverPosY(0)}
                    className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Topo
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempCoverPosY(50)}
                    className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Centro
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempCoverPosY(100)}
                    className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Fundo
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRepositioningCover(false)}
                    className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCoverPosition}
                    className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Salvar Posição</span>
                  </button>
                </div>
              </div>
            </div>
          ) : isAdmin && (
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                onClick={() => {
                  setTempCoverPosY(community.coverPositionY ?? 50);
                  setIsRepositioningCover(true);
                }}
                className="px-3 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all border border-white/20 shadow-md"
                title="Ajustar posição da capa deslizando"
              >
                <Move className="w-3.5 h-3.5 text-pink-300" />
                <span className="hidden sm:inline">Ajustar posição</span>
                <span className="sm:hidden">Posição</span>
              </button>
              <button
                onClick={() => setShowCoverModal(true)}
                className="px-3 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all border border-white/20 shadow-md"
              >
                <Camera className="w-3.5 h-3.5 text-pink-300" />
                <span>Mudar capa</span>
              </button>
            </div>
          )}
        </div>

        {/* Community Info Body */}
        <div className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Square Logo with rounded corners */}
            <div className="w-24 h-24 rounded-2xl border-2 border-purple-100 bg-slate-100 overflow-hidden shrink-0 shadow-xs">
              <img
                src={community.logo}
                alt={community.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info Table */}
            <div className="flex-1 min-w-0 space-y-1.5 text-xs">
              <h1 className="text-base sm:text-lg font-bold text-slate-900">
                {community.name}
              </h1>

              <div className="grid grid-cols-[90px_1fr] gap-x-2 gap-y-1 text-xs pt-1">
                <span className="font-bold text-purple-900 text-right">Categoria:</span>
                <span className="text-slate-800">{community.category}</span>

                <span className="font-bold text-purple-900 text-right">Criador:</span>
                <span className="text-slate-800">{community.creatorName}</span>

                <span className="font-bold text-purple-900 text-right">Membros:</span>
                <span className="text-slate-800 font-semibold">{community.membersCount.toLocaleString('pt-BR')}</span>

                <span className="font-bold text-purple-900 text-right">Tipo:</span>
                <span className="text-slate-800">{community.privacy === 'private' ? 'Privada' : 'Pública'}</span>
              </div>

              <div className="pt-2.5 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                {community.description}
              </div>
            </div>

            {/* Join / Leave Button */}
            <div className="shrink-0 pt-1">
              {isPage ? (
                <button
                  onClick={() => isMember ? onLeaveCommunity(community.id) : onJoinCommunity(community.id)}
                  className="vibe-btn text-xs"
                >
                  {isMember ? 'Deixar de Seguir' : 'Seguir Página'}
                </button>
              ) : isMember ? (
                <button
                  onClick={() => onLeaveCommunity(community.id)}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:underline cursor-pointer font-semibold"
                >
                  [ Sair da Comunidade ]
                </button>
              ) : (
                <button
                  onClick={() => onJoinCommunity(community.id)}
                  className="vibe-btn text-xs"
                >
                  Participar
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 2. ABAS: Discussão, Membros, Fotos, Sobre + Painel Admin */}
      <div className="flex gap-1.5 border-b border-slate-200 px-2 pt-1 bg-white rounded-2xl shadow-xs p-1.5">
        {/* Aba Discussão */}
        <button
          onClick={() => setActiveTab('discussion')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all ${
            activeTab === 'discussion'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
          }`}
        >
          Fórum ({communityPosts.length})
        </button>

        {/* Aba Membros */}
        <button
          onClick={() => setActiveTab('members')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all ${
            activeTab === 'members'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
          }`}
        >
          Membros ({community.members?.length || community.membersCount})
        </button>

        {/* Aba Fotos */}
        <button
          onClick={() => setActiveTab('photos')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all ${
            activeTab === 'photos'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
          }`}
        >
          Fotos ({community.photos?.length || 1})
        </button>

        {/* Aba Sobre */}
        <button
          onClick={() => setActiveTab('about')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all ${
            activeTab === 'about'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
          }`}
        >
          Sobre
        </button>

        {/* Aba Painel Admin (visível SOMENTE para admins) */}
        {isAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-all ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-xs'
                : 'text-pink-600 hover:bg-pink-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
            {community.pendingRequests && community.pendingRequests.length > 0 && (
              <span className="bg-white text-pink-600 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {community.pendingRequests.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* 3. CONTEÚDO DAS ABAS */}

      {/* ABA 1: DISCUSSÃO (Feed de posts dos membros + Fórum Orkut se for comunidade) */}
      {activeTab === 'discussion' && (
        <div className="space-y-4">
          
          {/* Post Creator Box inside Community */}
          {isMember ? (
            <div className="bg-white rounded-3xl border border-purple-100 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                  alt="Você"
                  className="w-9 h-9 rounded-full object-cover border border-purple-200"
                />
                <span className="text-xs font-bold text-slate-700">
                  Publicar em {community.name}
                </span>
              </div>

              <form onSubmit={handlePublishPost} className="space-y-3">
                <textarea
                  rows={3}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder={`Escreva algo interessante para os membros de ${community.name}...`}
                  className="w-full p-3 bg-slate-50 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:border-purple-500 outline-hidden resize-none font-normal"
                />

                {showImageInput && (
                  <input
                    type="text"
                    value={newPostImage}
                    onChange={(e) => setNewPostImage(e.target.value)}
                    placeholder="URL da imagem (ex: https://...)"
                    className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden"
                  />
                )}

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowImageInput(!showImageInput)}
                      className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{showImageInput ? 'Remover Foto' : 'Adicionar Foto'}</span>
                    </button>

                    {/* Botão Novo Tópico caso seja Comunidade */}
                    {!isPage && (
                      <button
                        type="button"
                        onClick={() => setShowTopicModal(true)}
                        className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Criar Tópico Fórum</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!newPostContent.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl shadow-md shadow-purple-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publicar</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-purple-50/60 rounded-3xl border border-purple-100 p-4 text-center text-xs font-semibold text-purple-900">
              Entre em {community.name} para participar das discussões e publicar conteúdo!
            </div>
          )}

          {/* Fórum de Tópicos (se houver tópicos e for comunidade) */}
          {!isPage && topics.length > 0 && (
            <div className="bg-white rounded-3xl border border-purple-100 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-extrabold text-sm text-purple-950 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  <span>Fórum de Tópicos & Discussões</span>
                </h3>
                <button
                  onClick={() => setShowTopicModal(true)}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800"
                >
                  + Novo Debate
                </button>
              </div>

              <div className="space-y-2">
                {topics.map(t => (
                  <div
                    key={t.id}
                    onClick={() => onSelectTopic(t)}
                    className="p-3 bg-slate-50 hover:bg-purple-50/60 rounded-2xl border border-slate-100 transition-colors cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">{t.title}</h4>
                      <p className="text-[11px] text-slate-400">Por {t.authorName} • {t.createdAt}</p>
                    </div>
                    <span className="text-xs font-bold text-purple-700 bg-white px-2 py-1 rounded-lg border border-purple-100 shrink-0">
                      {t.repliesCount || t.replies?.length || 0} respostas
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts Feed */}
          <div className="space-y-4">
            {communityPosts.length > 0 ? (
              communityPosts.map(post => (
                <div key={post.id} className="relative group/post">
                  <PostCard post={post} />
                  {/* Admin post removal button */}
                  {isAdmin && (
                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="absolute top-4 right-4 z-10 p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                      title="Remover publicação (Admin)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Excluir Post</span>
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-2">
                <div className="text-3xl">💬</div>
                <h4 className="font-bold text-slate-800 text-sm sm:text-base">Nenhuma discussão publicada ainda</h4>
                <p className="text-xs text-slate-500">Seja o primeiro membro a publicar uma ideia ou foto neste espaço!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 2: MEMBROS */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-3xl border border-purple-100 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Membros de {community.name}</span>
              </h3>
              <p className="text-xs text-slate-500">Participantes ativos deste espaço</p>
            </div>
            <span className="text-xs font-extrabold text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              {community.members?.length || community.membersCount} participantes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(community.members || [
              {
                userId: community.creatorId,
                userName: community.creatorName,
                userUsername: community.creatorName.toLowerCase().replace(' ', '_'),
                userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
                role: 'owner',
                joinedAt: community.createdAt
              }
            ]).map((member) => (
              <div
                key={member.userId}
                className="p-3.5 rounded-2xl border border-slate-200/90 bg-slate-50/50 flex items-center justify-between gap-3 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={member.userAvatar}
                    alt={member.userName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-xs text-slate-900 truncate">{member.userName}</span>
                      {member.role === 'owner' && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                          <Crown className="w-2.5 h-2.5 text-amber-600" /> Dono
                        </span>
                      )}
                      {member.role === 'admin' && (
                        <span className="text-[10px] bg-purple-100 text-purple-800 font-extrabold px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5 text-purple-600" /> Admin
                        </span>
                      )}
                      {member.role === 'moderator' && (
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-1.5 py-0.2 rounded-md">
                          Mod
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-purple-600 font-semibold truncate">@{member.userUsername}</div>
                  </div>
                </div>

                {/* Admin member actions: Promote / Remove */}
                {isAdmin && member.userId !== currentUser?.id && member.role !== 'owner' && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onChangeRole(community.id, member.userId, member.role === 'admin' ? 'member' : 'admin')}
                      className="p-1.5 hover:bg-purple-100 text-purple-700 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                      title={member.role === 'admin' ? 'Rebaixar a Membro' : 'Promover a Admin'}
                    >
                      {member.role === 'admin' ? 'Tirar Admin' : '+ Admin'}
                    </button>
                    <button
                      onClick={() => onRemoveMember(community.id, member.userId)}
                      className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                      title="Remover do Grupo"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 3: FOTOS */}
      {activeTab === 'photos' && (
        <div className="bg-white rounded-3xl border border-purple-100 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                <span>Galeria de Fotos do Clube</span>
              </h3>
              <p className="text-xs text-slate-500">Imagens e lembranças compartilhadas pelos membros</p>
            </div>

            {isMember && (
              <button
                onClick={() => setShowAddPhotoModal(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Foto</span>
              </button>
            )}
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {(community.photos || [community.coverImage, community.logo]).map((url, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedLightboxPhoto(url)}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 aspect-square bg-slate-900 cursor-pointer shadow-2xs hover:shadow-md transition-all hover:scale-101"
              >
                <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                  <span className="text-white text-xs font-bold">Ampliar</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 4: SOBRE */}
      {activeTab === 'about' && (
        <div className="bg-white rounded-3xl border border-purple-100 p-5 sm:p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-600" />
              <span>Sobre {community.name}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Detalhes e diretrizes de convivência</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-purple-900 uppercase tracking-wider">Descrição</h4>
            <div className="p-4 bg-purple-50/40 rounded-2xl border border-purple-100/60 text-xs sm:text-sm text-slate-800 leading-relaxed">
              {community.description}
            </div>
          </div>

          {/* Regras */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-purple-900 uppercase tracking-wider">Regras de Convivência</h4>
            <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {community.rules.map((rule, idx) => (
                <li key={idx} className="font-medium">{rule}</li>
              ))}
            </ul>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-500 block">Tipo:</span>
              <span className="font-extrabold text-slate-900 capitalize">{kind}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-500 block">Privacidade:</span>
              <span className="font-extrabold text-slate-900 capitalize">{community.privacy || 'Pública'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-500 block">Fundador:</span>
              <span className="font-extrabold text-slate-900">{community.creatorName}</span>
            </div>
          </div>
        </div>
      )}

      {/* ABA 5: PAINEL DE ADMINISTRAÇÃO (visível só pra admins) */}
      {activeTab === 'admin' && isAdmin && (
        <div className="bg-white rounded-3xl border border-purple-200 p-5 sm:p-6 shadow-md space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Painel de Administração do Clube</h3>
                <p className="text-xs text-slate-500">Gerencie solicitações de entrada, equipe de moderação e conteúdo</p>
              </div>
            </div>
          </div>

          {/* 1. Aprovar Membros Pendentes */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs sm:text-sm text-amber-950 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                <span>Solicitações de Entrada Pendentes ({community.pendingRequests?.length || 0})</span>
              </h4>
            </div>

            {community.pendingRequests && community.pendingRequests.length > 0 ? (
              <div className="space-y-2 pt-1">
                {community.pendingRequests.map(req => (
                  <div
                    key={req.userId}
                    className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={req.userAvatar} alt={req.userName} className="w-8 h-8 rounded-full object-cover border border-amber-300" />
                      <div>
                        <div className="font-bold text-xs text-slate-900">{req.userName}</div>
                        <div className="text-[10px] text-slate-400">@{req.userUsername} • {req.requestedAt}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onApproveRequest(community.id, req.userId)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Aprovar</span>
                      </button>
                      <button
                        onClick={() => onRejectRequest(community.id, req.userId)}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Recusar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-amber-800 italic">Nenhuma solicitação de entrada pendente no momento.</p>
            )}
          </div>

          {/* 2. Editar Informações Principais */}
          <div className="space-y-4 pt-2 border-t">
            <h4 className="font-extrabold text-xs text-purple-950 uppercase tracking-wider">
              Editar Informações do Espaço
            </h4>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nome:</label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Descrição:</label>
              <textarea
                rows={3}
                value={adminDesc}
                onChange={(e) => setAdminDesc(e.target.value)}
                className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-normal"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Regras (uma por linha):</label>
              <textarea
                rows={3}
                value={adminRules}
                onChange={(e) => setAdminRules(e.target.value)}
                className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-normal"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveAdminSettings}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-purple-500/20 cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Photo Gallery */}
      {selectedLightboxPhoto && (
        <div
          onClick={() => setSelectedLightboxPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full max-h-[90vh] bg-slate-950 rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col"
          >
            <button
              onClick={() => setSelectedLightboxPhoto(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex-1 overflow-hidden flex items-center justify-center bg-black">
              <img src={selectedLightboxPhoto} alt="Foto ampliada" className="max-w-full max-h-[80vh] object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Foto ao Clube */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-purple-100 shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-600" />
                <span>Adicionar Foto à Galeria</span>
              </h4>
              <button onClick={() => setShowAddPhotoModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                ref={photoFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadPhoto}
                className="hidden"
              />
              <div
                onClick={() => photoFileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 rounded-2xl p-6 text-center cursor-pointer transition-colors"
              >
                <Upload className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Clique para enviar uma foto do dispositivo</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ou cole uma URL da foto:</label>
                <input
                  type="text"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://exemplo.com/foto.jpg"
                  className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowAddPhotoModal(false)}
                className="px-3 py-1.5 text-xs text-slate-500 font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newPhotoUrl) {
                    onAddPhoto(community.id, newPhotoUrl);
                    setNewPhotoUrl('');
                    setShowAddPhotoModal(false);
                  }
                }}
                disabled={!newPhotoUrl}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Salvar Foto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Criar Tópico no Fórum */}
      {showTopicModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-purple-100 shadow-2xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span>Novo Tópico de Discussão em {community.name}</span>
              </h4>
              <button onClick={() => setShowTopicModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Título do Tópico:</label>
                <input
                  type="text"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  placeholder="Ex: Qual sua opinião sobre o assunto?"
                  required
                  className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mensagem Inicial:</label>
                <textarea
                  rows={4}
                  value={topicContent}
                  onChange={(e) => setTopicContent(e.target.value)}
                  placeholder="Explique sua ideia para abrir o debate..."
                  required
                  className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowTopicModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Publicar Tópico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Mudar Foto de Capa (Admin only) */}
      <CoverUploadModal
        isOpen={showCoverModal}
        onClose={() => setShowCoverModal(false)}
        currentCover={community.coverImage}
        currentPositionY={community.coverPositionY ?? 50}
        currentPositionX={community.coverPositionX ?? 50}
        currentZoom={community.coverZoom ?? 1}
        currentRotation={community.coverRotation ?? 0}
        onSaveCover={(url, posY, posX, zoom, rot) => {
          const newPosY = typeof posY === 'number' ? posY : 50;
          const newPosX = typeof posX === 'number' ? posX : 50;
          onUpdateCommunity(community.id, { 
            coverImage: url,
            coverPositionY: newPosY,
            coverPositionX: newPosX,
            coverZoom: zoom ?? 1,
            coverRotation: rot ?? 0
          });
          onUpdateCover(community.id, url);
        }}
        title={`Capa de ${community.name}`}
      />
    </div>
  );
};
