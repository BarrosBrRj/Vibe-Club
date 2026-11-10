import React, { useState, useEffect } from 'react';
import { 
  Compass, Plus, Users, MessageSquare, Check, 
  Search, ShieldCheck, Flame, Pin, ThumbsUp, Send, 
  ChevronRight, ArrowLeft, BarChart2, Sparkles, X, 
  Camera, Image as ImageIcon, Upload, Link as LinkIcon, 
  Building2, Lock, Globe, EyeOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Community, CommunityTopic } from '../../types';
import { CreateClubModal } from './CreateClubModal';
import { ClubDetailView } from './ClubDetailView';

export const CommunitiesHub: React.FC = () => {
  const { 
    communities, 
    topics, 
    posts,
    joinCommunity, 
    leaveCommunity, 
    createCommunity, 
    updateCommunityCover,
    updateCommunity,
    createTopic, 
    replyTopic, 
    likeTopic, 
    currentUser, 
    showToast,
    requestJoinGroup,
    approveJoinRequest,
    rejectJoinRequest,
    removeGroupMember,
    changeMemberRole,
    addCommunityPhoto,
    createPost,
    deleteGroupPost,
    viewingCommunityId,
    setViewingCommunityId
  } = useApp();

  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'community' | 'group' | 'page'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active selected community
  const [activeCommunity, setActiveCommunity] = useState<Community | null>(null);
  const [activeTopic, setActiveTopic] = useState<CommunityTopic | null>(null);

  // Unified creation modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Topic reply input
  const [replyText, setReplyText] = useState('');

  // Sync with global viewingCommunityId if set from elsewhere (e.g. profile)
  useEffect(() => {
    if (viewingCommunityId) {
      const comm = communities.find(c => c.id === viewingCommunityId);
      if (comm) setActiveCommunity(comm);
    }
  }, [viewingCommunityId, communities]);

  // Keep activeCommunity synced with context updates
  useEffect(() => {
    if (activeCommunity) {
      const fresh = communities.find(c => c.id === activeCommunity.id);
      if (fresh) setActiveCommunity(fresh);
    }
  }, [communities]);

  const categories = [
    'Todas', 'Amizade', 'Música', 'Games', 'Nostalgia 2000s', 
    'Cinema & TV', 'Tecnologia', 'Humor & Memes', 'Animais & Pets'
  ];

  const filteredCommunities = communities.filter(c => {
    const matchType = selectedTypeFilter === 'all' || (c.type || 'community') === selectedTypeFilter;
    const matchCat = selectedCategory === 'Todas' || c.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchCat && matchSearch;
  });

  const handleReplyTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTopic || !replyText.trim()) return;
    replyTopic(activeTopic.id, replyText.trim());
    setReplyText('');
    const updatedTopic = topics.find(t => t.id === activeTopic.id);
    if (updatedTopic) setActiveTopic(updatedTopic);
  };

  // If a topic discussion is specifically opened inside a community
  if (activeTopic && activeCommunity) {
    return (
      <div className="max-w-4xl mx-auto w-full space-y-4">
        <button
          onClick={() => setActiveTopic(null)}
          className="flex items-center gap-2 text-xs font-bold text-purple-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs hover:bg-purple-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para {activeCommunity.name}</span>
        </button>

        {/* Topic Header & Body */}
        <div className="bg-white rounded-3xl border border-purple-100 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <img src={activeTopic.authorAvatar} alt={activeTopic.authorName} className="w-10 h-10 rounded-full object-cover border border-purple-200" />
              <div>
                <h1 className="font-extrabold text-base sm:text-lg text-slate-900">{activeTopic.title}</h1>
                <div className="text-xs text-slate-400">
                  Por <span className="font-semibold text-slate-700">{activeTopic.authorName}</span> • {activeTopic.createdAt}
                </div>
              </div>
            </div>

            <button
              onClick={() => likeTopic(activeTopic.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                activeTopic.isLiked ? 'bg-purple-50 text-purple-700 border-purple-300' : 'bg-slate-50 hover:bg-purple-50 text-slate-600 border-slate-200'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${activeTopic.isLiked ? 'fill-purple-600' : ''}`} />
              <span>{activeTopic.likesCount} Curtidas</span>
            </button>
          </div>

          <div className="text-slate-800 text-sm leading-relaxed p-4 bg-purple-50/30 rounded-2xl border border-purple-100/50">
            {activeTopic.content}
          </div>
        </div>

        {/* Replies Stream */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider px-1">
            Respostas dos Membros ({activeTopic.replies?.length || 0})
          </h3>

          {activeTopic.replies && activeTopic.replies.length > 0 ? (
            activeTopic.replies.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2">
                <div className="flex items-center gap-2.5">
                  <img src={r.authorAvatar} alt={r.authorName} className="w-8 h-8 rounded-full object-cover border border-purple-200" />
                  <div>
                    <div className="font-bold text-xs text-slate-900">{r.authorName}</div>
                    <div className="text-[10px] text-slate-400">{r.createdAt}</div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 pl-10 leading-relaxed font-normal">{r.content}</p>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-400">
              Nenhuma resposta ainda. Seja o primeiro a opinar!
            </div>
          )}

          {/* Reply Form */}
          <form onSubmit={handleReplyTopicSubmit} className="bg-white rounded-2xl border border-purple-100 p-4 shadow-xs flex gap-2 items-center">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Escreva sua resposta para este debate..."
              className="flex-1 p-2.5 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-normal"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Responder</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // If a community/group/page is selected, show the full ClubDetailView!
  if (activeCommunity) {
    const communityTopics = topics.filter(t => t.communityId === activeCommunity.id);

    return (
      <ClubDetailView
        community={activeCommunity}
        currentUser={currentUser}
        topics={communityTopics}
        posts={posts}
        onBack={() => {
          setActiveCommunity(null);
          setViewingCommunityId(null);
        }}
        onJoinCommunity={joinCommunity}
        onLeaveCommunity={leaveCommunity}
        onRequestJoinGroup={requestJoinGroup}
        onApproveRequest={approveJoinRequest}
        onRejectRequest={rejectJoinRequest}
        onRemoveMember={removeGroupMember}
        onChangeRole={changeMemberRole}
        onUpdateCover={updateCommunityCover}
        onUpdateCommunity={updateCommunity}
        onAddPhoto={addCommunityPhoto}
        onCreateTopic={createTopic}
        onSelectTopic={(topic) => setActiveTopic(topic)}
        onCreatePost={createPost}
        onDeletePost={(postId) => deleteGroupPost(activeCommunity.id, postId)}
      />
    );
  }

  // Primary Explorer view (List of Communities, Groups and Pages)
  return (
    <div className="max-w-4xl mx-auto w-full space-y-4 font-sans">
      
      {/* Vibe Clube Communities Box */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-white text-slate-800 font-extrabold text-xs px-4 py-3 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-purple-600" />
            <span className="text-slate-900 font-extrabold">Clubes & Comunidades | Diretório</span>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="vibe-btn text-xs py-1 px-3 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Criar Comunidade</span>
          </button>
        </div>

        {/* Sub-bar: Type selector & Search */}
        <div className="bg-slate-50/70 p-3 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs flex-wrap">
            <button
              onClick={() => setSelectedTypeFilter('all')}
              className={`px-3 py-1.5 font-bold rounded-xl cursor-pointer transition-all ${
                selectedTypeFilter === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-white'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setSelectedTypeFilter('community')}
              className={`px-3 py-1.5 font-bold rounded-xl cursor-pointer transition-all ${
                selectedTypeFilter === 'community'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-white'
              }`}
            >
              Comunidades
            </button>
            <button
              onClick={() => setSelectedTypeFilter('group')}
              className={`px-3 py-1.5 font-bold rounded-xl cursor-pointer transition-all ${
                selectedTypeFilter === 'group'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-white'
              }`}
            >
              Grupos
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar comunidades..."
              className="w-full pl-8 pr-3 py-1.5 bg-white text-xs border border-slate-200 rounded-xl outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all placeholder:text-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="px-4 py-2 bg-purple-50/30 border-b border-purple-50 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="font-bold text-purple-900 shrink-0 text-[11px]">Categorias:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap text-[11px] ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Communities Grid - Large Images with Title Underneath */}
        <div className="p-4 sm:p-5">
          {filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {filteredCommunities.map(comm => {
                const kind = comm.type || 'community';
                const isPage = kind === 'page';

                return (
                  <div
                    key={comm.id}
                    onClick={() => setActiveCommunity(comm)}
                    className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-purple-300 hover:shadow-md transition-all cursor-pointer flex flex-col group"
                  >
                    {/* Imagem Grande no Topo */}
                    <div className="w-full aspect-[16/9] sm:h-48 bg-slate-100 overflow-hidden relative">
                      <img
                        src={comm.coverImage || comm.logo}
                        alt={comm.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        style={{ objectPosition: `center ${comm.coverPositionY ?? 50}%` }}
                        onError={(e) => {
                          // Fallback to logo if cover fails
                          if (comm.logo && (e.currentTarget as HTMLImageElement).src !== comm.logo) {
                            (e.currentTarget as HTMLImageElement).src = comm.logo;
                          }
                        }}
                      />
                      
                      {/* Badge de Membros */}
                      <div className="absolute top-3 right-3">
                        <span className="bg-black/65 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          {comm.membersCount.toLocaleString('pt-BR')} membros
                        </span>
                      </div>

                      {/* Badge de Status Membro */}
                      {comm.isMember && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                            ✓ Membro
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Conteúdo Abaixo da Imagem */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {/* Título da Comunidade Embaixo da Imagem */}
                        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-1 leading-snug">
                          {comm.name}
                        </h3>

                        {/* Categoria */}
                        <div className="text-xs font-semibold text-purple-700 mt-1">
                          Categoria: <span className="text-slate-700 font-medium">{comm.category}</span>
                        </div>

                        {/* Descrição */}
                        <p className="text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                          {comm.description}
                        </p>
                      </div>

                      {/* Rodapé com Dono e Ação */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-slate-500 font-medium">
                          Criador: <strong className="text-slate-700">{comm.creatorName}</strong>
                        </span>
                        <div>
                          {comm.isMember ? (
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200/60 inline-block">
                              Acessar espaço →
                            </span>
                          ) : (
                            <span className="text-purple-700 font-bold bg-purple-50 group-hover:bg-purple-100 px-3.5 py-1.5 rounded-xl border border-purple-200/60 transition-colors inline-block">
                              Participar →
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-sm text-slate-500">
              Nenhuma comunidade encontrada com os filtros selecionados.
            </div>
          )}
        </div>

      </div>

      {/* Unified Create Club Modal with 3 options at the top */}
      <CreateClubModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(data) => {
          createCommunity(data);
          showToast(`Espaço "${data.name}" criado com sucesso! 🎉`, 'vibe');
        }}
      />

    </div>
  );
};
