import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Search, Send, Image as ImageIcon, 
  Smile, Mic, MicOff, MoreVertical, ArrowLeft, Check, 
  CheckCheck, Sparkles, Heart, ShoppingBag, Phone, Video,
  Paperclip, Plus, X, User as UserIcon, ShieldCheck,
  ShieldAlert, UserX, Flag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatConversation, MessageItem, User } from '../../types';

export const ChatView: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    chatConversations, 
    chatMessages, 
    activeChatUserId, 
    setActiveChatUserId, 
    sendChatMessage, 
    openChatWithUser,
    setActiveTab,
    showToast,
    openReportModal,
    isUserBlocked,
    blockUser,
    unblockUser
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'direct' | 'dating' | 'marketplace'>('all');
  const [messageInput, setMessageInput] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);

  // Quick photo upload modal/popover
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioTimerRef = useRef<any>(null);

  // Active user data
  const activeConversation = chatConversations.find(c => c.userId === activeChatUserId);
  const activeUser = allUsers.find(u => u.id === activeChatUserId) || activeConversation?.user;
  const currentMessages = activeChatUserId ? (chatMessages[activeChatUserId] || []) : [];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isTyping]);

  // Audio recording timer simulation
  useEffect(() => {
    if (isRecordingAudio) {
      setRecordingSeconds(0);
      audioTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
    };
  }, [isRecordingAudio]);

  // Handle typing state when demo users reply
  useEffect(() => {
    if (currentMessages.length > 0) {
      const lastMsg = currentMessages[currentMessages.length - 1];
      if (lastMsg.senderId === (currentUser?.id || 'user_me')) {
        // Show typing indicator for 1.8 seconds
        setIsTyping(true);
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, 1800);
        return () => clearTimeout(timer);
      }
    }
  }, [currentMessages.length]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeChatUserId || !messageInput.trim()) return;

    sendChatMessage(activeChatUserId, messageInput.trim(), 'text');
    setMessageInput('');
    setIsEmojiPickerOpen(false);
  };

  const handleSendPhoto = (url: string) => {
    if (!activeChatUserId || !url.trim()) return;
    sendChatMessage(activeChatUserId, 'Enviou uma foto', 'image', url.trim());
    setPhotoUrlInput('');
    setIsPhotoModalOpen(false);
  };

  const handleSendAudio = () => {
    if (!activeChatUserId) return;
    setIsRecordingAudio(false);
    sendChatMessage(
      activeChatUserId, 
      `Mensagem de áudio (${recordingSeconds || 3}s)`, 
      'audio'
    );
    showToast('Áudio enviado com sucesso! 🎙️', 'success');
  };

  // Filtered conversations
  const filteredConversations = chatConversations.filter(c => {
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'dating' && c.contextType === 'dating') ||
      (activeFilter === 'marketplace' && c.contextType === 'marketplace') ||
      (activeFilter === 'direct' && (!c.contextType || c.contextType === 'direct'));

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      c.user.name.toLowerCase().includes(q) || 
      (c.lastMessage && c.lastMessage.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  const popularEmojis = ['😎', '☕', '❤️', '🔥', '✨', '🎮', '🍕', '👾', '🌹', '👍', '😂', '🎉'];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-140px)] min-h-[550px] max-h-[750px] flex flex-col md:flex-row">
      
      {/* LEFT COLUMN: CONVERSATION LIST */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50 ${
        activeChatUserId ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <span>Mensagens</span>
            </h2>
            <div className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold text-xs">
              {chatConversations.length} conversas
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar conversas..."
              className="w-full pl-9 pr-3 py-2 bg-slate-100 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto scrollbar-none">
            {(['all', 'direct', 'dating', 'marketplace'] as const).map(tabKey => {
              const labels = {
                all: 'Todas',
                direct: 'Amigos',
                dating: 'Encontros 💕',
                marketplace: 'Mercado 🛍️'
              };
              const isSelected = activeFilter === tabKey;
              return (
                <button
                  key={tabKey}
                  onClick={() => setActiveFilter(tabKey)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected 
                      ? 'bg-purple-600 text-white shadow-2xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {labels[tabKey]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs space-y-2">
              <div className="text-2xl">💬</div>
              <p className="font-semibold">Nenhuma conversa encontrada</p>
              <p className="text-[11px] text-slate-400">Inicie uma conversa pelos perfis de amigos ou anúncios do Marketplace.</p>
            </div>
          ) : (
            filteredConversations.map(conv => {
              const isSelected = activeChatUserId === conv.userId;
              return (
                <div
                  key={conv.userId}
                  id={`chat-conv-${conv.userId}`}
                  onClick={() => setActiveChatUserId(conv.userId)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-purple-50/80 border-l-4 border-purple-600' : 'hover:bg-slate-100/80'
                  }`}
                >
                  {/* Avatar + Online Indicator */}
                  <div className="relative shrink-0">
                    <img
                      src={conv.user.avatar}
                      alt={conv.user.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200"
                    />
                    {conv.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-slate-900 truncate">
                        {conv.user.name}
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                        {conv.lastMessageAt || 'Hoje'}
                      </span>
                    </div>

                    {/* Context tag if marketplace or dating */}
                    {conv.contextType === 'marketplace' && (
                      <div className="flex items-center gap-1 text-[10px] text-purple-700 font-bold">
                        <ShoppingBag className="w-3 h-3" />
                        <span className="truncate">{conv.contextTitle || 'Marketplace'}</span>
                      </div>
                    )}
                    {conv.contextType === 'dating' && (
                      <div className="flex items-center gap-1 text-[10px] text-pink-600 font-bold">
                        <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                        <span>Match em Encontros</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-slate-500 truncate">
                        {conv.lastMessage || 'Conversa iniciada'}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="shrink-0 ml-2 px-1.5 py-0.2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-[10px] font-black">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: ACTIVE CHAT CONVERSATION */}
      {activeChatUserId && activeUser ? (
        <div className="flex-1 flex flex-col bg-white h-full min-w-0">
          
          {/* Chat Header */}
          <div className="p-3.5 px-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {/* Back button on mobile */}
              <button
                onClick={() => setActiveChatUserId(null)}
                className="md:hidden p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 mr-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative shrink-0">
                <img
                  src={activeUser.avatar}
                  alt={activeUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-purple-300"
                />
                {activeConversation?.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                )}
              </div>

              <div className="min-w-0">
                <div className="font-bold text-sm text-slate-900 flex items-center gap-1 truncate">
                  <span>{activeUser.name}</span>
                  {activeUser.isPremium && (
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Online agora</span>
                  <span className="text-slate-300">•</span>
                  <span>@{activeUser.username}</span>
                </div>
              </div>
            </div>

            {/* Header action buttons */}
            <div className="flex items-center gap-1 text-slate-500 relative">
              <button
                onClick={() => showToast(`Iniciando chamada com ${activeUser.name}... 📞`, 'info')}
                className="p-2 rounded-xl hover:bg-slate-100 hover:text-purple-600 transition-colors cursor-pointer"
                title="Chamada de Voz"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => showToast(`Iniciando chamada de vídeo com ${activeUser.name}... 📹`, 'info')}
                className="p-2 rounded-xl hover:bg-slate-100 hover:text-purple-600 transition-colors cursor-pointer"
                title="Chamada de Vídeo"
              >
                <Video className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowChatMenu(!showChatMenu)}
                className="p-2 rounded-xl hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                title="Opções da conversa"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showChatMenu && (
                <div 
                  className="absolute right-0 top-10 w-48 bg-white rounded-xl border border-slate-200 shadow-xl p-1.5 z-40 animate-in fade-in"
                  onMouseLeave={() => setShowChatMenu(false)}
                >
                  <button
                    onClick={() => {
                      openReportModal({
                        type: 'user',
                        id: activeUser.id,
                        name: `Usuário @${activeUser.username}`,
                        authorId: activeUser.id,
                        authorName: activeUser.name,
                        authorAvatar: activeUser.avatar,
                        contentSnippet: 'Conversa privada no Chat'
                      });
                      setShowChatMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg text-left font-medium cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Denunciar Usuário</span>
                  </button>

                  {isUserBlocked(activeUser.id) ? (
                    <button
                      onClick={() => {
                        unblockUser(activeUser.id);
                        setShowChatMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg text-left font-medium cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Desbloquear Usuário</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        blockUser(activeUser.id, activeUser.name);
                        setShowChatMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 rounded-lg text-left font-medium cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Bloquear Usuário</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Blocked User Warning Banner */}
          {isUserBlocked(activeUser.id) && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs text-amber-900 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate">Este usuário está bloqueado por você. Novas mensagens não serão enviadas.</span>
              </div>
              <button
                onClick={() => unblockUser(activeUser.id)}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] shrink-0 ml-2 cursor-pointer"
              >
                Desbloquear
              </button>
            </div>
          )}

          {/* Context Snippet Banner (Marketplace or Dating) */}
          {activeConversation?.contextType === 'marketplace' && (
            <div className="bg-purple-50/80 border-b border-purple-100 px-4 py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <ShoppingBag className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="text-slate-600 font-medium truncate">
                  Negociação iniciada no Vibe Marketplace: <strong className="text-purple-900">{activeConversation.contextTitle || 'Produto'}</strong>
                </span>
              </div>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="shrink-0 font-bold text-purple-700 hover:text-purple-900 underline ml-2"
              >
                Ver Anúncios
              </button>
            </div>
          )}
          {activeConversation?.contextType === 'dating' && (
            <div className="bg-pink-50/80 border-b border-pink-100 px-4 py-2 flex items-center gap-2 text-xs text-pink-900">
              <Heart className="w-4 h-4 fill-pink-500 text-pink-500 shrink-0" />
              <span>Vocês deram match no Vibe Encontros 💕 Troquem uma ideia e vejam se a vibe bate!</span>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
            {currentMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-2xl">
                  👋
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Diga oi para {activeUser.name}!</h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  Envie uma mensagem amigável para quebrar o gelo e iniciar uma conversa no clube.
                </p>
              </div>
            ) : (
              currentMessages.map(msg => {
                const isMine = msg.senderId === (currentUser?.id || 'user_me');
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    {/* Marketplace Card Attachment if present */}
                    {msg.contextData?.marketplaceItemTitle && (
                      <div className="mb-1.5 p-2.5 bg-white rounded-2xl border border-purple-200 shadow-2xs max-w-xs flex items-center gap-2.5">
                        {msg.contextData.marketplaceItemImage && (
                          <img
                            src={msg.contextData.marketplaceItemImage}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                        )}
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-slate-800 line-clamp-1">
                            {msg.contextData.marketplaceItemTitle}
                          </div>
                          {msg.contextData.marketplaceItemPrice && (
                            <div className="text-xs font-black text-purple-700">
                              R$ {msg.contextData.marketplaceItemPrice.toLocaleString('pt-BR')}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Image Attachment */}
                    {msg.mediaType === 'image' && msg.mediaUrl && (
                      <div className="mb-1.5 max-w-xs rounded-2xl overflow-hidden shadow-xs border border-slate-200">
                        <img
                          src={msg.mediaUrl}
                          alt="Foto no chat"
                          className="w-full max-h-60 object-cover"
                        />
                      </div>
                    )}

                    {/* Audio Attachment Player */}
                    {msg.mediaType === 'audio' ? (
                      <div className={`p-3 rounded-2xl max-w-xs flex items-center gap-3 shadow-2xs ${
                        isMine 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-xs' 
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                      }`}>
                        <button 
                          onClick={() => showToast('Reproduzindo áudio... 🎵', 'info')}
                          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold shrink-0 hover:scale-105"
                        >
                          ▶️
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="h-1.5 bg-white/40 rounded-full overflow-hidden">
                            <div className="h-full bg-white w-2/3"></div>
                          </div>
                          <div className="text-[10px] mt-1 opacity-80">Áudio gravado • 0:04</div>
                        </div>
                      </div>
                    ) : (
                      /* Text Message Bubble */
                      <div
                        className={`px-4 py-2.5 rounded-2xl max-w-[80%] sm:max-w-md text-sm leading-relaxed break-words shadow-2xs ${
                          isMine
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-xs'
                            : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                        }`}
                      >
                        {msg.content}
                      </div>
                    )}

                    {/* Message Status & Time */}
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
                      <span>{msg.createdAt}</span>
                      {isMine && (
                        <CheckCheck className="w-3 h-3 text-purple-600" />
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* "Typing..." Animated Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs animate-in fade-in">
                <div className="bg-slate-100 px-3.5 py-2 rounded-2xl rounded-bl-xs flex items-center gap-1 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span className="text-[11px] text-slate-400">{activeUser.name} está digitando...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Emoji Picker Popover */}
          {isEmojiPickerOpen && (
            <div className="p-3 border-t border-slate-200 bg-white flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2">
              {popularEmojis.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setMessageInput(prev => prev + emoji);
                    setIsEmojiPickerOpen(false);
                  }}
                  className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-lg transition-transform hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Audio Recording State Overlay */}
          {isUserBlocked(activeUser.id) ? (
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-center text-xs text-slate-500 font-medium flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4 text-slate-400" />
              <span>Você bloqueou {activeUser.name}. Desbloqueie para poder enviar mensagens.</span>
            </div>
          ) : isRecordingAudio ? (
            <div className="w-full px-3 py-2.5 border-t border-slate-200 bg-rose-50 flex items-center justify-between gap-2 shrink-0 animate-pulse">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs min-w-0 truncate">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0"></div>
                <span className="truncate">Gravando áudio: {recordingSeconds}s</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsRecordingAudio(false)}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-600 text-xs font-bold active:scale-95 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSendAudio}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 shrink-0" />
                  <span>Enviar</span>
                </button>
              </div>
            </div>
          ) : (
            /* Standard Message Input Bar */
            <form onSubmit={handleSendMessage} className="w-full max-w-full px-2 sm:px-3.5 py-2 sm:py-3 border-t border-slate-200 bg-white flex items-center gap-1 sm:gap-2 shrink-0 box-border overflow-hidden">
              {/* Attachment Button */}
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] shrink-0 flex items-center justify-center rounded-xl text-slate-400 hover:text-purple-600 hover:bg-slate-100 active:scale-95 transition-colors cursor-pointer"
                title="Enviar Foto / Imagem"
                aria-label="Enviar Foto / Imagem"
              >
                <ImageIcon className="w-5 h-5 shrink-0" />
              </button>

              {/* Emoji Button */}
              <button
                type="button"
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                className="w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] shrink-0 flex items-center justify-center rounded-xl text-slate-400 hover:text-purple-600 hover:bg-slate-100 active:scale-95 transition-colors cursor-pointer"
                title="Inserir Emoji"
                aria-label="Inserir Emoji"
              >
                <Smile className="w-5 h-5 shrink-0" />
              </button>

              {/* Audio Mic Button */}
              <button
                type="button"
                onClick={() => setIsRecordingAudio(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 min-w-[36px] min-h-[36px] shrink-0 flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 active:scale-95 transition-colors cursor-pointer"
                title="Gravar Mensagem de Voz"
                aria-label="Gravar Mensagem de Voz"
              >
                <Mic className="w-5 h-5 shrink-0" />
              </button>

              {/* Text Input */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  id="chat-message-input"
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  placeholder={`Mensagem para ${activeUser.name}...`}
                  className="w-full min-w-0 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-100 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all"
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                id="chat-send-button"
                disabled={!messageInput.trim()}
                className={`w-11 h-11 min-w-[44px] min-h-[44px] shrink-0 rounded-2xl flex items-center justify-center transition-all ${
                  messageInput.trim()
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md hover:scale-105 active:scale-95 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
                title="Enviar Mensagem"
                aria-label="Enviar Mensagem"
              >
                <Send className="w-5 h-5 shrink-0" />
              </button>
            </form>
          )}

        </div>
      ) : (
        /* Empty State when no conversation is selected on desktop */
        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-8 bg-slate-50/50 space-y-3">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-2xl shadow-xs">
            💬
          </div>
          <h3 className="font-extrabold text-lg text-slate-800">Suas Conversas no Vibe Clube</h3>
          <p className="text-sm text-slate-500 max-w-sm">
            Selecione uma conversa ao lado para responder mensagens, enviar fotos, áudios ou negociar produtos.
          </p>
        </div>
      )}

      {/* SEND PHOTO MODAL */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <span>Enviar Foto no Chat</span>
              </h4>
              <button onClick={() => setIsPhotoModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600">URL da Imagem ou GIF</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={photoUrlInput}
                onChange={e => setPhotoUrlInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPhotoUrlInput('https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80')}
                  className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-semibold text-slate-600 hover:bg-slate-200"
                >
                  Exemplo 1 (Amigos)
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoUrlInput('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80')}
                  className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-semibold text-slate-600 hover:bg-slate-200"
                >
                  Exemplo 2 (Praia)
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleSendPhoto(photoUrlInput)}
                disabled={!photoUrlInput.trim()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
              >
                Enviar Foto
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
