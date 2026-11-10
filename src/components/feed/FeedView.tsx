import React, { useState } from 'react';
import { 
  Sparkles, Users, Compass, Bookmark, Flame, 
  MessageSquareHeart, SmilePlus, Video, Camera,
  Edit3, Heart, Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CreatePostCard } from './CreatePostCard';
import { PostCard } from './PostCard';
import { ReelsView } from '../video/ReelsView';

export const FeedView: React.FC = () => {
  const { posts, currentUser, allUsers, setViewingUserId, setActiveTab, isUserBlocked } = useApp();
  const [feedFilter, setFeedFilter] = useState<'all' | 'videos' | 'friends' | 'communities' | 'saved'>('all');

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (isUserBlocked(post.authorId)) return false;
    if (post.autoHidden) return false;
    if (post.privacy === 'only_me' && post.authorId !== currentUser?.id) return false;
    if (feedFilter === 'videos') return post.mediaType === 'video' && !!post.mediaUrl;
    if (feedFilter === 'saved') return post.isSaved;
    if (feedFilter === 'communities') return !!post.communityId;
    if (feedFilter === 'friends') {
      return post.authorId !== currentUser?.id;
    }
    return true;
  });

  const userPostsCount = posts.filter(p => p.authorId === currentUser?.id).length;
  const firstLetter = (currentUser?.name || 'V').charAt(0).toUpperCase();

  return (
    <div className="space-y-4 font-sans w-full min-w-0">
      
      {/* 1. Classic Orkut-Style Home Profile Dashboard */}
      {currentUser && (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
          
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-white px-4 py-2.5 border-b border-purple-100 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="font-extrabold text-slate-900">
                Página Inicial de {currentUser.name}
              </span>
            </div>
            <button
              onClick={() => {
                setViewingUserId(currentUser.id);
                setActiveTab('profile');
              }}
              className="text-xs text-purple-700 hover:underline font-bold cursor-pointer"
            >
              [ ver meu perfil ]
            </button>
          </div>

          {/* Profile Overview Body */}
          <div className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="flex items-center gap-3.5">
                {/* User Avatar with gradient frame */}
                <div 
                  onClick={() => {
                    setViewingUserId(currentUser.id);
                    setActiveTab('profile');
                  }}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 p-0.5 shadow-md shrink-0 cursor-pointer overflow-hidden group"
                  title="Ir para o meu perfil"
                >
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover rounded-2xl bg-slate-100 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-3xl font-black text-purple-700 font-heading">
                      {firstLetter}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 
                      onClick={() => {
                        setViewingUserId(currentUser.id);
                        setActiveTab('profile');
                      }}
                      className="text-lg sm:text-xl font-black text-slate-900 hover:text-purple-700 cursor-pointer tracking-tight font-heading"
                    >
                      Olá, {currentUser.name}!
                    </h2>
                    {currentUser.isPremium && (
                      <span className="text-[11px] bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                        VIP
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-600 font-medium mt-0.5">
                    {currentUser.city} • {currentUser.orkutFields?.relationshipStatus === 'dating' ? 'Namorando' : currentUser.orkutFields?.relationshipStatus === 'married' ? 'Casado(a)' : 'Solteiro(a)'}
                  </div>
                </div>
              </div>

              {/* Quick Profile Shortcuts */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setViewingUserId(currentUser.id);
                    setActiveTab('profile');
                  }}
                  className="vibe-btn text-xs sm:text-sm py-1.5 px-3.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar Perfil</span>
                </button>
                <button
                  onClick={() => {
                    setViewingUserId(currentUser.id);
                    setActiveTab('profile');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs sm:text-sm border border-purple-200 transition-colors cursor-pointer"
                >
                  <span>Mural de Recados</span>
                </button>
              </div>

            </div>

            {/* Stats Row with Emoticons (Classic Orkut Style) */}
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap text-sm text-slate-700 mt-4 pt-3.5 border-t border-slate-100">
              <button 
                onClick={() => {
                  setViewingUserId(currentUser.id);
                  setActiveTab('profile');
                }}
                className="hover:text-purple-700 flex items-center gap-1.5 cursor-pointer font-bold transition-colors"
              >
                <span className="text-base">📝</span>
                <span>{currentUser.testimonialsCount || 43} recados</span>
              </button>
              <span className="text-slate-300">•</span>
              <button 
                onClick={() => setActiveTab('photos')}
                className="hover:text-purple-700 flex items-center gap-1.5 cursor-pointer font-bold transition-colors"
              >
                <span className="text-base">📷</span>
                <span>{currentUser.photosCount || 9} fotos</span>
              </button>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <span className="text-base">🎥</span>
                <span>{userPostsCount || 5} publicações</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                <span className="text-base">⭐</span>
                <span>{allUsers.length + 10} fãs</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. Friends Updates & Vibes Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-white text-slate-800 font-extrabold text-sm px-4 py-2.5 border-b border-purple-100 flex items-center justify-between">
          <span className="text-slate-900 font-extrabold">Vibes dos Amigos & Histórias</span>
          <span className="text-xs text-purple-600 font-semibold">Atualizações recentes</span>
        </div>
        <div className="p-3.5 overflow-x-auto">
          <div className="flex items-center gap-4 min-w-0 w-max">
            {/* User's own status */}
            {currentUser && (
              <div 
                onClick={() => {
                  setViewingUserId(currentUser.id);
                  setActiveTab('profile');
                }}
                className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
              >
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 overflow-hidden relative shadow-xs group-hover:scale-105 transition-transform">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover rounded-full bg-white p-0.5"
                  />
                  <span className="absolute bottom-0 right-0 text-sm bg-white shadow-xs px-1 rounded-full border border-purple-100">
                    {currentUser.vibeOfTheDay?.emoji || '✨'}
                  </span>
                </div>
                <span className="text-xs text-slate-900 group-hover:text-purple-700 truncate max-w-[72px] font-bold text-center">
                  Sua Vibe
                </span>
              </div>
            )}

            {/* Friends */}
            {allUsers.filter(u => u.id !== currentUser?.id && !isUserBlocked(u.id)).map(user => (
              <div
                key={user.id}
                onClick={() => {
                  setViewingUserId(user.id);
                  setActiveTab('profile');
                }}
                className="flex flex-col items-center gap-1.5 cursor-pointer group shrink-0"
              >
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-purple-300 via-pink-300 to-purple-200 overflow-hidden relative shadow-xs group-hover:scale-105 transition-transform">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-full bg-white p-0.5"
                  />
                  <span className="absolute bottom-0 right-0 text-sm bg-white shadow-xs px-1 rounded-full border border-purple-100">
                    {user.vibeOfTheDay?.emoji || '😎'}
                  </span>
                </div>
                <span className="text-xs text-slate-700 group-hover:text-purple-700 truncate max-w-[72px] font-medium text-center">
                  {user.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Create Post / Mural Card */}
      <CreatePostCard />

      {/* 4. Feed Navigation Folder Tabs (Classic Orkut Aesthetic) */}
      <div className="flex items-center flex-wrap gap-2 border-b border-slate-200 pb-2 px-1 bg-white/70 p-2 rounded-2xl shadow-xs">
        <button
          onClick={() => setFeedFilter('all')}
          className={`px-4 py-2 text-sm font-bold rounded-xl cursor-pointer transition-all ${
            feedFilter === 'all'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
              : 'text-slate-700 hover:text-purple-700 hover:bg-purple-50'
          }`}
        >
          Todos os posts
        </button>

        <button
          onClick={() => setFeedFilter('friends')}
          className={`px-4 py-2 text-sm font-bold rounded-xl cursor-pointer transition-all ${
            feedFilter === 'friends'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
              : 'text-slate-700 hover:text-purple-700 hover:bg-purple-50'
          }`}
        >
          Amigos
        </button>

        <button
          onClick={() => setFeedFilter('communities')}
          className={`px-4 py-2 text-sm font-bold rounded-xl cursor-pointer transition-all ${
            feedFilter === 'communities'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
              : 'text-slate-700 hover:text-purple-700 hover:bg-purple-50'
          }`}
        >
          Clubes & Comunidades
        </button>

        <button
          onClick={() => setFeedFilter('videos')}
          className={`px-4 py-2 text-sm font-bold rounded-xl cursor-pointer transition-all ${
            feedFilter === 'videos'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
              : 'text-slate-700 hover:text-purple-700 hover:bg-purple-50'
          }`}
        >
          Vídeos
        </button>

        <button
          onClick={() => setFeedFilter('saved')}
          className={`px-4 py-2 text-sm font-bold rounded-xl cursor-pointer transition-all ${
            feedFilter === 'saved'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
              : 'text-slate-700 hover:text-purple-700 hover:bg-purple-50'
          }`}
        >
          Salvos
        </button>
      </div>

      {/* 5. Posts Stream or Reels View */}
      {feedFilter === 'videos' ? (
        <ReelsView />
      ) : (
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-sm text-slate-500 shadow-xs">
              Nenhuma publicação encontrada nesta categoria.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
