import React, { useState } from 'react';
import { Users, UserPlus, Check, X, Search, Gift } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FriendsView: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    friendRequests, 
    acceptFriendRequest, 
    rejectFriendRequest, 
    sendFriendRequest, 
    setViewingUserId, 
    setActiveTab, 
    setIsGiftModalOpen, 
    setGiftTargetUser 
  } = useApp();

  const [activeTab, setSubTab] = useState<'my_friends' | 'requests' | 'suggestions'>('my_friends');
  const [search, setSearch] = useState('');

  const myFriends = allUsers.filter(u => u.id !== currentUser?.id);
  const pendingReqs = friendRequests.filter(r => r.status === 'pending');

  const filteredFriends = myFriends.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.city.toLowerCase().includes(search.toLowerCase()) ||
    u.interests.some(i => i.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto w-full space-y-4 font-sans">
      
      {/* Box */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-white text-slate-800 font-extrabold text-xs px-4 py-3 border-b border-purple-100 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="text-slate-900 font-extrabold">Amigos de {currentUser?.name || 'você'}</span>
          </span>
          <span className="text-xs font-medium text-slate-500 bg-white/80 px-2 py-0.5 rounded-full border border-purple-100">
            {myFriends.length} conexões
          </span>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="bg-slate-50/70 p-3 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSubTab('my_friends')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all ${
                activeTab === 'my_friends'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-white'
              }`}
            >
              Meus Amigos ({myFriends.length})
            </button>

            <button
              onClick={() => setSubTab('requests')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === 'requests'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-white'
              }`}
            >
              <span>Solicitações</span>
              {pendingReqs.length > 0 && (
                <span className="px-1.5 py-0.2 bg-pink-500 text-white text-[10px] rounded-full">
                  {pendingReqs.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setSubTab('suggestions')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer transition-all ${
                activeTab === 'suggestions'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-white'
              }`}
            >
              Descobrir Pessoas
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar amigos por nome ou cidade..."
              className="w-full pl-8 pr-3 py-1.5 bg-white text-xs border border-slate-200 rounded-xl outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all placeholder:text-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* 1. My Friends */}
        {activeTab === 'my_friends' && (
          <div className="p-4">
            {filteredFriends.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredFriends.map(friend => (
                  <div
                    key={friend.id}
                    className="bg-white border border-slate-200/80 rounded-xl p-3 hover:border-purple-300 hover:shadow-xs transition-all flex flex-col justify-between group"
                  >
                    <div 
                      onClick={() => {
                        setViewingUserId(friend.id);
                        setActiveTab('profile');
                      }}
                      className="cursor-pointer flex flex-col items-center text-center"
                    >
                      <div className="w-20 h-20 rounded-full border-2 border-purple-100 bg-slate-100 overflow-hidden mb-2 relative group-hover:scale-105 transition-transform">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-full h-full object-cover"
                        />
                        {friend.isOnline && (
                          <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" title="Online" />
                        )}
                      </div>

                      <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700 line-clamp-1 transition-colors">
                        {friend.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate w-full">
                        {friend.city}
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
                      <button
                        onClick={() => {
                          setViewingUserId(friend.id);
                          setActiveTab('profile');
                        }}
                        className="text-purple-700 hover:underline cursor-pointer font-semibold"
                      >
                        Ver Perfil
                      </button>
                      <button
                        onClick={() => {
                          setGiftTargetUser(friend);
                          setIsGiftModalOpen(true);
                        }}
                        className="text-pink-600 hover:text-pink-700 cursor-pointer p-1 rounded-lg hover:bg-pink-50 transition-colors"
                        title="Enviar presente"
                      >
                        <Gift className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-slate-500">
                Nenhum amigo encontrado para "{search}".
              </div>
            )}
          </div>
        )}

        {/* 2. Requests */}
        {activeTab === 'requests' && (
          <div className="p-4 space-y-2.5">
            {pendingReqs.length > 0 ? (
              pendingReqs.map(req => (
                <div
                  key={req.id}
                  className="bg-slate-50/60 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between gap-3"
                >
                  <div 
                    onClick={() => {
                      setViewingUserId(req.fromUserId);
                      setActiveTab('profile');
                    }}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="w-11 h-11 rounded-full border border-purple-200 bg-slate-100 overflow-hidden shrink-0">
                      <img
                        src={req.fromUserAvatar}
                        alt={req.fromUserName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-slate-900 hover:text-purple-700 transition-colors">
                        {req.fromUserName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        @{req.fromUserUsername} • enviado em {req.createdAt}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => acceptFriendRequest(req.id)}
                      className="vibe-btn text-xs py-1 px-3"
                    >
                      Aceitar
                    </button>
                    <button
                      onClick={() => rejectFriendRequest(req.id)}
                      className="px-2.5 py-1 text-xs text-rose-600 hover:underline cursor-pointer font-medium"
                    >
                      Recusar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-xs text-slate-500">
                Nenhuma solicitação de amizade pendente no momento!
              </div>
            )}
          </div>
        )}

        {/* 3. Suggestions */}
        {activeTab === 'suggestions' && (
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {myFriends.map(friend => (
                <div
                  key={friend.id}
                  className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-start gap-3 hover:border-purple-200 transition-all"
                >
                  <div className="w-12 h-12 rounded-full border border-purple-200 bg-slate-100 overflow-hidden shrink-0">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div
                      onClick={() => {
                        setViewingUserId(friend.id);
                        setActiveTab('profile');
                      }}
                      className="font-bold text-xs text-slate-900 hover:text-purple-700 cursor-pointer truncate transition-colors"
                    >
                      {friend.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{friend.city}</div>
                    
                    <button
                      onClick={() => sendFriendRequest(friend.id)}
                      className="vibe-btn text-[11px] py-1 px-2.5 mt-2 flex items-center gap-1"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>Conectar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
