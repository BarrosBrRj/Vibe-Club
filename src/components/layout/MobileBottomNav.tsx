import React from 'react';
import { Home, Compass, PlusCircle, MessageSquare, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    setViewingUserId, 
    setIsCreateModalOpen,
    setIsAuthModalOpen,
    isAuthenticated,
    unreadMessagesCount
  } = useApp();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 w-full max-w-full z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 shadow-lg safe-area-pb font-sans">
      <div className="flex items-center justify-around w-full max-w-md mx-auto">
        
        {/* 1. Início */}
        <button
          id="mobile-nav-home"
          onClick={() => {
            setActiveTab('home');
            if (currentUser) setViewingUserId(currentUser.id);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
            activeTab === 'home' || activeTab === 'feed'
              ? 'text-purple-700 font-extrabold bg-purple-50'
              : 'text-slate-500 hover:text-purple-600'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Início</span>
        </button>

        {/* 2. Comunidades */}
        <button
          id="mobile-nav-communities"
          onClick={() => setActiveTab('communities')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
            activeTab === 'communities'
              ? 'text-purple-700 font-extrabold bg-purple-50'
              : 'text-slate-500 hover:text-purple-600'
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Clubes</span>
        </button>

        {/* 3. Central Create Button (+) in Vibe Clube Gradient */}
        <button
          id="mobile-nav-create"
          onClick={() => {
            if (isAuthenticated) {
              setIsCreateModalOpen(true);
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          className="flex flex-col items-center justify-center p-1 -mt-4 bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-500 hover:opacity-95 text-white rounded-full shadow-lg shadow-purple-500/30 w-11 h-11 active:scale-95 transition-transform cursor-pointer border-2 border-white"
          title="Criar novo post ou recado no Vibe Clube"
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        {/* 4. Chat / Mensagens */}
        <button
          id="mobile-nav-chat"
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-xs font-semibold cursor-pointer relative transition-colors ${
            activeTab === 'chat'
              ? 'text-purple-700 font-extrabold bg-purple-50'
              : 'text-slate-500 hover:text-purple-600'
          }`}
        >
          <MessageSquare className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Chat</span>
          {unreadMessagesCount > 0 && (
            <span className="absolute top-0.5 right-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[8px] font-bold px-1 rounded-full">
              {unreadMessagesCount}
            </span>
          )}
        </button>

        {/* 5. Perfil */}
        <button
          id="mobile-nav-profile"
          onClick={() => {
            if (isAuthenticated && currentUser) {
              setViewingUserId(currentUser.id);
              setActiveTab('profile');
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
            activeTab === 'profile'
              ? 'text-purple-700 font-extrabold bg-purple-50'
              : 'text-slate-500 hover:text-purple-600'
          }`}
        >
          {currentUser ? (
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className={`w-4 h-4 object-cover rounded-full mb-0.5 border ${
                activeTab === 'profile' ? 'border-purple-600 ring-1 ring-purple-400' : 'border-slate-300'
              }`}
            />
          ) : (
            <User className="w-4 h-4 mb-0.5" />
          )}
          <span className="text-[10px]">Perfil</span>
        </button>

      </div>
    </div>
  );
};
