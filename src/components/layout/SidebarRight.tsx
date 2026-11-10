import React from 'react';
import { Users, Compass, Cake, Heart, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SidebarRight: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    communities, 
    setViewingUserId, 
    viewingUserId,
    setActiveTab, 
    setViewingCommunityId
  } = useApp();

  const isOwnProfile = !viewingUserId || viewingUserId === currentUser?.id || viewingUserId === 'user_me';
  const displayUser = isOwnProfile ? (currentUser || allUsers[0]) : (allUsers.find(u => u.id === viewingUserId) || currentUser || allUsers[0]);

  // 9 Friends for the classic 3x3 grid
  const friendsList = allUsers.filter(u => u.id !== displayUser?.id).slice(0, 9);
  
  // 6 Communities for the grid
  const communitiesList = communities.slice(0, 6);

  return (
    <aside className="w-64 sm:w-72 shrink-0 hidden lg:block space-y-3.5 font-sans">
      
      {/* 1. Amigos Box (Classic 3x3 Photo Grid) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-white px-4 py-2.5 border-b border-purple-100 flex items-center justify-between text-sm">
          <span className="font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span>Amigos ({displayUser?.friendsCount || 147})</span>
          </span>
          <button
            onClick={() => setActiveTab('friends')}
            className="text-xs text-purple-700 hover:underline font-bold cursor-pointer"
          >
            ver todos
          </button>
        </div>

        {/* 3x3 Grid */}
        <div className="p-3.5 grid grid-cols-3 gap-3 text-center">
          {friendsList.map(friend => (
            <div 
              key={friend.id}
              onClick={() => {
                setViewingUserId(friend.id);
                setActiveTab('profile');
              }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-xl border border-slate-200 bg-slate-100 overflow-hidden group-hover:border-purple-400 group-hover:shadow-xs transition-all">
                <img 
                  src={friend.avatar} 
                  alt={friend.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                />
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-purple-700 group-hover:underline mt-1.5 truncate max-w-[70px] block leading-tight">
                {friend.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Action Button */}
        <div className="p-3 pt-0 text-center">
          <button
            onClick={() => setActiveTab('friends')}
            className="w-full py-2 bg-slate-50 hover:bg-purple-50 text-purple-700 hover:text-purple-800 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 hover:border-purple-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <span>Ver todos os amigos</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Comunidades Box */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-white px-4 py-2.5 border-b border-purple-100 flex items-center justify-between text-sm">
          <span className="font-extrabold text-slate-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-purple-600" />
            <span>Comunidades ({displayUser?.communitiesCount || 121})</span>
          </span>
          <button
            onClick={() => setActiveTab('communities')}
            className="text-xs text-purple-700 hover:underline font-bold cursor-pointer"
          >
            ver todas
          </button>
        </div>

        {/* Grid of communities */}
        <div className="p-3.5 grid grid-cols-3 gap-3 text-center">
          {communitiesList.map(comm => (
            <div 
              key={comm.id}
              onClick={() => {
                setViewingCommunityId(comm.id);
                setActiveTab('communities');
              }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-xl border border-slate-200 bg-slate-100 overflow-hidden group-hover:border-purple-400 group-hover:shadow-xs transition-all">
                <img 
                  src={comm.logo} 
                  alt={comm.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                />
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-purple-700 group-hover:underline mt-1.5 truncate max-w-[70px] block leading-tight">
                {comm.name}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Action Button */}
        <div className="p-3 pt-0 text-center">
          <button
            onClick={() => setActiveTab('communities')}
            className="w-full py-2 bg-slate-50 hover:bg-purple-50 text-purple-700 hover:text-purple-800 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 hover:border-purple-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <span>Explorar comunidades</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Aniversários & Avisos */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden text-sm">
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-white px-4 py-2.5 border-b border-purple-100 flex items-center gap-2 font-extrabold text-slate-900">
          <Cake className="w-4 h-4 text-pink-500" />
          <span>Aniversários da Semana</span>
        </div>
        <div className="p-3.5 space-y-3 text-slate-700">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🎂</span>
            <div>
              <strong className="text-slate-900 block font-bold text-sm">Mariana Rios</strong>
              <span className="text-xs text-slate-500">Faz aniversário nesta sexta-feira</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
            <span className="text-lg">💌</span>
            <span className="text-xs text-slate-600">
              Deixe um recado legal no mural dos seus amigos!
            </span>
          </div>
        </div>
      </div>

    </aside>
  );
};
