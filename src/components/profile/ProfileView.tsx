import React, { useState } from 'react';
import { 
  MessageSquare, Heart, Image as ImageIcon, User as UserIcon, 
  Compass, Edit3, Award, Palette, Rocket, Sparkles, Check, 
  Pin, ArrowLeft, Briefcase, Star
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PostCard } from '../feed/PostCard';
import { CreatePostCard } from '../feed/CreatePostCard';
import { User, Scrap, Testimonial } from '../../types';
import { ProfileHeader } from './ProfileHeader';
import { ProfileMuralTab } from './ProfileMuralTab';
import { ProfileTestimonialsTab } from './ProfileTestimonialsTab';
import { ProfileSobreTab } from './ProfileSobreTab';
import { ProfileComunidadesTab } from './ProfileComunidadesTab';
import { ProfileFotosTab } from './ProfileFotosTab';
import { ProfileMessageModal } from './ProfileMessageModal';
import { ProfileEditModal } from './ProfileEditModal';
import { AdsManagerView } from '../ads/AdsManagerView';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    viewingUserId, 
    setViewingUserId, 
    posts, 
    scraps, 
    testimonials, 
    albums, 
    communities, 
    achievements, 
    createScrap, 
    replyScrap,
    deleteScrap, 
    createTestimonial, 
    approveTestimonial, 
    rejectTestimonial, 
    deleteTestimonial, 
    updateProfile, 
    sendFriendRequest, 
    setIsGiftModalOpen, 
    setGiftTargetUser, 
    setIsReportModalOpen, 
    setReportTarget,
    setViewingCommunityId,
    showToast,
    setActiveTab,
    addPhotoToAlbum,
    createAlbum
  } = useApp();

  const isOwnProfile = currentUser?.id === viewingUserId || viewingUserId === 'user_me';
  const targetUser: User | undefined = isOwnProfile && currentUser 
    ? currentUser 
    : (allUsers.find(u => u.id === viewingUserId) || currentUser || allUsers[0]);

  // Main Orkut SubTabs matching screenshot: social is 1st, then professional, personal, scraps, etc.
  const [activeSubTab, setActiveSubTab] = useState<
    'social' | 'professional' | 'personal' | 'mural' | 'testimonials' | 'photos' | 'posts' | 'communities' | 'achievements'
  >('social');

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  if (!targetUser) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200/90 rounded-2xl shadow-xs">
        <p className="text-slate-500 font-medium">Usuário não encontrado.</p>
      </div>
    );
  }

  const userPosts = [...posts]
    .filter(p => {
      const isAuthor = 
        (p.authorId && targetUser.id && p.authorId === targetUser.id) ||
        (p.authorUsername && targetUser.username && p.authorUsername.toLowerCase().replace(/^@/, '').trim() === targetUser.username.toLowerCase().replace(/^@/, '').trim()) ||
        (p.authorName && targetUser.name && p.authorName.trim().toLowerCase() === targetUser.name.trim().toLowerCase());
      if (!isAuthor) return false;
      if (p.autoHidden) return false;
      if (p.privacy === 'only_me' && currentUser?.id !== targetUser.id) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  const userScraps = scraps.filter(s => s.toUserId === targetUser.id);
  const userTestimonials = testimonials.filter(t => t.toUserId === targetUser.id);
  const approvedTestimonials = userTestimonials.filter(t => t.status === 'approved');
  const userAlbums = albums.filter(a => a.userId === targetUser.id);

  return (
    <div className="w-full space-y-2.5 font-sans">
      
      {/* Back button if visiting another user's profile */}
      {!isOwnProfile && (
        <div className="flex items-center justify-between pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('feed')}
            className="flex items-center gap-1.5 text-xs text-purple-700 font-bold hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>« Voltar à página inicial</span>
          </button>
        </div>
      )}

      {/* 1. Orkut Profile Header Box */}
      <ProfileHeader
        user={targetUser}
        isOwnProfile={isOwnProfile}
        onSendFriendRequest={() => sendFriendRequest(targetUser.id)}
        onOpenMessage={() => setIsMessageModalOpen(true)}
        onOpenGift={() => {
          setGiftTargetUser(targetUser);
          setIsGiftModalOpen(true);
        }}
        onReport={() => {
          setReportTarget({ type: 'user', id: targetUser.id, name: targetUser.name });
          setIsReportModalOpen(true);
        }}
        onUpdateUser={(fields) => updateProfile(fields)}
        approvedTestimonialsCount={approvedTestimonials.length || targetUser.testimonialsCount}
        postsCount={userPosts.length}
        onSelectSubTab={(tab) => {
          if (tab === 'sobre') setActiveSubTab('social');
          else setActiveSubTab(tab as any);
        }}
      />

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex items-center flex-wrap gap-1.5 p-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
        
        {/* Tab 1: social */}
        <button
          onClick={() => setActiveSubTab('social')}
          className={activeSubTab === 'social' ? 'vibe-tab-active' : 'vibe-tab'}
        >
          <span className="flex items-center gap-1.5">
            <span>👤</span>
            <span>Social</span>
          </span>
        </button>

        {/* Tab 2: professional */}
        <button
          onClick={() => setActiveSubTab('professional')}
          className={activeSubTab === 'professional' ? 'vibe-tab-active' : 'vibe-tab'}
        >
          <span className="flex items-center gap-1.5">
            <span>💼</span>
            <span>Profissional</span>
          </span>
        </button>

        {/* Tab 3: personal */}
        <button
          onClick={() => setActiveSubTab('personal')}
          className={activeSubTab === 'personal' ? 'vibe-tab-active' : 'vibe-tab'}
        >
          <span className="flex items-center gap-1.5">
            <span>⭐</span>
            <span>Pessoal</span>
          </span>
        </button>

        {/* Tab 4: recados (mural) */}
        <button
          onClick={() => setActiveSubTab('mural')}
          className={activeSubTab === 'mural' ? 'vibe-tab-active' : 'vibe-tab'}
        >
          <span className="flex items-center gap-1.5">
            <span>📝</span>
            <span>Recados ({userScraps.length})</span>
          </span>
        </button>

        {/* Tab 5: depoimentos */}
        <button
          onClick={() => setActiveSubTab('testimonials')}
          className={activeSubTab === 'testimonials' ? 'vibe-tab-active' : 'vibe-tab'}
        >
          <span className="flex items-center gap-1.5">
            <span>❤️</span>
            <span>Depoimentos ({approvedTestimonials.length})</span>
          </span>
        </button>

        {/* Tab 6: fotos */}
        <button
          onClick={() => setActiveSubTab('photos')}
          className={activeSubTab === 'photos' ? 'vibe-tab-active' : 'vibe-tab'}
        >
          <span className="flex items-center gap-1.5">
            <span>📷</span>
            <span>Fotos</span>
          </span>
        </button>

        {/* Tab 7: comunidades */}
        <button
          onClick={() => setActiveSubTab('communities')}
          className={activeSubTab === 'communities' ? 'vibe-tab-active' : 'vibe-tab'}
        >
          <span className="flex items-center gap-1.5">
            <span>🏘️</span>
            <span>Comunidades</span>
          </span>
        </button>

        {/* Tab 8: posts */}
        <button
          onClick={() => setActiveSubTab('posts')}
          className={activeSubTab === 'posts' ? 'vibe-tab-active' : 'vibe-tab'}
        >
          <span className="flex items-center gap-1.5">
            <span>📰</span>
            <span>Posts ({userPosts.length})</span>
          </span>
        </button>

      </div>

      {/* 3. Sub-Tab Content Views */}

      {/* SOCIAL TAB (Ficha de Perfil Principal do Orkut) */}
      {activeSubTab === 'social' && (
        <ProfileSobreTab
          user={targetUser}
          isOwnProfile={isOwnProfile}
          onOpenEditModal={() => setIsEditProfileModalOpen(true)}
          subCategory="social"
        />
      )}

      {/* PROFESSIONAL TAB */}
      {activeSubTab === 'professional' && (
        <ProfileSobreTab
          user={targetUser}
          isOwnProfile={isOwnProfile}
          onOpenEditModal={() => setIsEditProfileModalOpen(true)}
          subCategory="professional"
        />
      )}

      {/* PERSONAL TAB */}
      {activeSubTab === 'personal' && (
        <ProfileSobreTab
          user={targetUser}
          isOwnProfile={isOwnProfile}
          onOpenEditModal={() => setIsEditProfileModalOpen(true)}
          subCategory="personal"
        />
      )}

      {/* MURAL / RECADOS (SCRAPS) TAB */}
      {activeSubTab === 'mural' && (
        <ProfileMuralTab
          scraps={userScraps}
          targetUser={targetUser}
          currentUser={currentUser}
          isOwnProfile={isOwnProfile}
          onSendScrap={(content, emoji, isPrivate) => {
            createScrap(targetUser.id, content, emoji, isPrivate);
          }}
          onReplyScrap={(scrapId, content) => {
            replyScrap(scrapId, content);
          }}
          onDeleteScrap={(scrapId) => {
            deleteScrap(scrapId);
          }}
        />
      )}

      {/* TESTIMONIALS (DEPOIMENTOS) TAB */}
      {activeSubTab === 'testimonials' && (
        <ProfileTestimonialsTab
          testimonials={userTestimonials}
          targetUser={targetUser}
          currentUser={currentUser}
          isOwnProfile={isOwnProfile}
          onCreateTestimonial={(content) => {
            createTestimonial(targetUser.id, content);
          }}
          onApproveTestimonial={(id) => {
            approveTestimonial(id);
          }}
          onRejectTestimonial={(id) => {
            rejectTestimonial(id);
          }}
          onDeleteTestimonial={(id) => {
            deleteTestimonial(id);
          }}
        />
      )}

      {/* PHOTOS TAB */}
      {activeSubTab === 'photos' && (
        <ProfileFotosTab
          albums={userAlbums}
          user={targetUser}
          isOwnProfile={isOwnProfile}
          onAddPhotoToAlbum={addPhotoToAlbum}
          onCreateAlbum={(title, description, coverPhoto) => createAlbum(title, description, 'public', coverPhoto)}
        />
      )}

      {/* COMMUNITIES TAB */}
      {activeSubTab === 'communities' && (
        <ProfileComunidadesTab
          user={targetUser}
          allCommunities={communities}
          isOwnProfile={isOwnProfile}
          onSelectCommunity={(commId) => {
            setViewingCommunityId(commId);
            setActiveTab('communities');
          }}
          onExploreCommunities={() => {
            setActiveTab('communities');
          }}
        />
      )}

      {/* POSTS TAB */}
      {activeSubTab === 'posts' && (
        <div className="space-y-3">
          {isOwnProfile && <CreatePostCard />}

          {userPosts.length > 0 ? (
            <div className="space-y-3">
              {userPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-8 text-center text-xs text-slate-500 shadow-xs">
              Nenhuma publicação encontrada no feed.
            </div>
          )}
        </div>
      )}

      {/* Direct Message Modal */}
      <ProfileMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        targetUser={targetUser}
        onSendMessage={(text, isPriv) => {
          createScrap(targetUser.id, text, '💌', isPriv);
          showToast(`Mensagem enviada com sucesso para ${targetUser.name}!`, 'success');
        }}
      />

      {/* Edit Profile Full Modal */}
      <ProfileEditModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        user={targetUser}
        onSave={(updated) => updateProfile(updated)}
      />

    </div>
  );
};
