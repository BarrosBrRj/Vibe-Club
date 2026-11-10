import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Bell, MessageSquare, User as UserIcon, 
  Coins, Crown, LogOut, Settings, HelpCircle, 
  ShieldAlert, PlusCircle, Wallet, X, ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { NotificationsPanel } from '../notifications/NotificationsPanel';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    isAuthenticated, 
    activeTab, 
    setActiveTab, 
    setViewingUserId, 
    unreadNotificationsCount, 
    unreadMessagesCount,
    isNotificationsOpen,
    setIsNotificationsOpen,
    logout, 
    setIsAuthModalOpen, 
    setAuthModalMode, 
    setIsCreateModalOpen, 
    openWalletModal,
    setIsPremiumModalOpen, 
    setIsSettingsModalOpen, 
    setIsHelpModalOpen, 
    setIsAdminModalOpen,
    allUsers,
    communities
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsUserMenuOpen(false);
    };

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isUserMenuOpen]);

  const filteredUsers = searchQuery.trim() ? allUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.city.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4) : [];

  const filteredCommunities = searchQuery.trim() ? communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3) : [];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs w-full max-w-full text-slate-800">
      <div className="w-full max-w-[1240px] mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
        
        <div className="flex items-center justify-between gap-3">
          
          {/* 1. Official Vibe Clube Logo & Branding */}
          <button
            onClick={() => { setActiveTab('home'); setViewingUserId(currentUser?.id || 'user_me'); }}
            className="flex items-center gap-2 group cursor-pointer focus:outline-hidden shrink-0"
            title="Vibe Clube"
          >
            <img 
              src="/icon.svg" 
              alt="Logo Vibe Clube" 
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-xs transition-transform group-hover:scale-105" 
            />
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 bg-clip-text text-transparent font-heading leading-tight">
                Vibe Clube
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase -mt-0.5 hidden sm:inline">
                Rede Social
              </span>
            </div>
          </button>

          {/* 2. Main Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-bold">
            <button
              onClick={() => { setActiveTab('home'); setViewingUserId(currentUser?.id || 'user_me'); }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'home' || activeTab === 'feed'
                  ? 'bg-purple-100/80 text-purple-800 font-extrabold'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-slate-100'
              }`}
            >
              Início
            </button>
            <button
              onClick={() => {
                if (currentUser) setViewingUserId(currentUser.id);
                setActiveTab('profile');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-purple-100/80 text-purple-800 font-extrabold'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-slate-100'
              }`}
            >
              Meu Perfil
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'friends'
                  ? 'bg-purple-100/80 text-purple-800 font-extrabold'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-slate-100'
              }`}
            >
              Amigos
            </button>
            <button
              onClick={() => setActiveTab('communities')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'communities'
                  ? 'bg-purple-100/80 text-purple-800 font-extrabold'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-slate-100'
              }`}
            >
              Comunidades
            </button>
            <button
              onClick={() => setActiveTab('arcade')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'arcade'
                  ? 'bg-purple-100/80 text-purple-800 font-extrabold'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-slate-100'
              }`}
            >
              Arcade
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-purple-100/80 text-purple-800 font-extrabold'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-slate-100'
              }`}
            >
              Vídeos
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'marketplace'
                  ? 'bg-purple-100/80 text-purple-800 font-extrabold'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-slate-100'
              }`}
            >
              Marketplace
            </button>
          </nav>

          {/* 3. Search Bar + User Tools */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            
            {/* Search Input Field */}
            <div className="relative">
              <div className="flex items-center bg-slate-100 hover:bg-slate-50 focus-within:bg-white border border-slate-200 focus-within:border-purple-400 rounded-xl px-2.5 py-1.5 transition-all shadow-2xs">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
                <input
                  id="navbar-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Buscar amigos, comunidades..."
                  className="w-28 sm:w-44 md:w-52 text-xs text-slate-800 placeholder:text-slate-400 outline-hidden bg-transparent"
                />
              </div>

              {/* Search Dropdown Results */}
              {isSearchOpen && searchQuery.trim() && (
                <div 
                  className="absolute right-0 top-10 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-2.5 z-50 text-slate-800 animate-in fade-in"
                  onMouseLeave={() => setIsSearchOpen(false)}
                >
                  <div className="text-[10px] font-extrabold text-purple-700 px-2 py-1 uppercase tracking-wider">
                    Pessoas
                  </div>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <button
                        key={user.id}
                        onClick={() => {
                          setViewingUserId(user.id);
                          setActiveTab('profile');
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-purple-50 text-left text-xs transition-colors cursor-pointer"
                      >
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-purple-200" />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 truncate">{user.name}</div>
                          <div className="text-[11px] text-slate-500">@{user.username} • {user.city}</div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 px-2 py-1">Nenhum perfil encontrado</div>
                  )}

                  <div className="text-[10px] font-extrabold text-purple-700 px-2 py-1 uppercase tracking-wider mt-2 border-t border-slate-100 pt-2">
                    Comunidades
                  </div>
                  {filteredCommunities.length > 0 ? (
                    filteredCommunities.map(comm => (
                      <button
                        key={comm.id}
                        onClick={() => {
                          setActiveTab('communities');
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-purple-50 text-left text-xs transition-colors cursor-pointer"
                      >
                        <img src={comm.logo} alt={comm.name} className="w-8 h-8 rounded-xl object-cover border border-purple-200" />
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 truncate">{comm.name}</div>
                          <div className="text-[11px] text-slate-500">{comm.membersCount.toLocaleString('pt-BR')} membros</div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 px-2 py-1">Nenhuma comunidade</div>
                  )}
                </div>
              )}
            </div>

            {/* Authenticated Actions */}
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                
                {/* Vibes Balance Chip */}
                <button
                  onClick={() => openWalletModal('balance')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border border-amber-200 text-amber-900 rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
                  title="Suas Vibes (Saldo)"
                >
                  <Coins className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
                  <span>{currentUser.vibesBalance} V$</span>
                </button>

                {/* Create post button */}
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="p-2 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
                  title="Criar publicação"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>

                {/* Messages button */}
                <button
                  onClick={() => setActiveTab('chat')}
                  className="relative p-2 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
                  title="Mensagens"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute 1 top-1 right-1 w-2 h-2 bg-pink-500 rounded-full ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {/* Notifications button */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-2 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
                    title="Notificações"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full ring-2 ring-white" />
                    )}
                  </button>
                  <NotificationsPanel 
                    isOpen={isNotificationsOpen}
                    onClose={() => setIsNotificationsOpen(false)}
                    isMobileFullscreen={typeof window !== 'undefined' && window.innerWidth < 640}
                  />
                </div>

                {/* User Avatar & Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-purple-400 transition-all cursor-pointer"
                  >
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-8 h-8 rounded-full object-cover border border-purple-200"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-11 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl p-1.5 z-50 text-slate-800 animate-in fade-in">
                      <div className="p-2 border-b border-slate-100">
                        <div className="font-extrabold text-xs text-slate-900 truncate">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">@{currentUser.username}</div>
                      </div>

                      <div className="py-1 space-y-0.5 text-xs font-semibold">
                        <button
                          onClick={() => {
                            setViewingUserId(currentUser.id);
                            setActiveTab('profile');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-colors text-left cursor-pointer"
                        >
                          <UserIcon className="w-4 h-4 text-purple-600" />
                          <span>Meu Perfil</span>
                        </button>

                        <button
                          onClick={() => {
                            openWalletModal('balance');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-colors text-left cursor-pointer"
                        >
                          <Wallet className="w-4 h-4 text-amber-500" />
                          <span>Carteira de Vibes ({currentUser.vibesBalance} V$)</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsPremiumModalOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-colors text-left cursor-pointer"
                        >
                          <Crown className="w-4 h-4 text-pink-500" />
                          <span>Vibe Clube VIP</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsSettingsModalOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-colors text-left cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-slate-500" />
                          <span>Configurações</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsHelpModalOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-colors text-left cursor-pointer"
                        >
                          <HelpCircle className="w-4 h-4 text-slate-500" />
                          <span>Ajuda & FAQ</span>
                        </button>

                        {(currentUser.role === 'admin' || currentUser.isAdmin) && (
                          <button
                            onClick={() => {
                              setIsAdminModalOpen(true);
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-colors text-left cursor-pointer"
                          >
                            <ShieldAlert className="w-4 h-4 text-purple-600" />
                            <span>Painel de Moderação</span>
                          </button>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-left font-bold text-xs cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sair da Conta</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-purple-700 cursor-pointer"
                >
                  Entrar
                </button>
                <button
                  onClick={() => { setAuthModalMode('signup'); setIsAuthModalOpen(true); }}
                  className="vibe-btn text-xs font-bold cursor-pointer"
                >
                  Cadastrar
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </header>
  );
};
