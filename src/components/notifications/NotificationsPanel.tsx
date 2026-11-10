import React, { useState } from 'react';
import { 
  Bell, CheckCheck, Trash2, Settings, 
  Heart, ShoppingBag, Users, MessageSquare, Wallet, Globe,
  ArrowRight, Sparkles, Check, Flame, AlertCircle, Zap, ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationCategory, NotificationItem } from '../../types';
import { NotificationSettingsModal } from './NotificationSettingsModal';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isMobileFullscreen?: boolean;
}

type FilterTab = 'all' | 'unread' | NotificationCategory;

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ 
  isOpen, 
  onClose,
  isMobileFullscreen = false 
}) => {
  const { 
    notifications, 
    unreadNotificationsCount, 
    markNotificationsAsRead, 
    markNotificationAsRead, 
    deleteNotification, 
    clearAllNotifications,
    handleNotificationClick,
    triggerTestNotification,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  // Filter list
  const filteredNotifications = notifications.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !item.read;
    return item.category === activeTab;
  });

  const getCategoryBadge = (category: NotificationCategory, type: string) => {
    switch (category) {
      case 'social':
        return {
          icon: <Globe className="w-3 h-3 text-purple-600" />,
          color: 'bg-purple-100 text-purple-700 border-purple-200',
          label: 'Social'
        };
      case 'dating':
        return {
          icon: type === 'low_vibes' ? <AlertCircle className="w-3 h-3 text-amber-600" /> : <Heart className="w-3 h-3 text-pink-600 fill-pink-500" />,
          color: type === 'low_vibes' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-pink-100 text-pink-700 border-pink-200',
          label: 'Encontros 💕'
        };
      case 'marketplace':
        return {
          icon: type.includes('boost') ? <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> : <ShoppingBag className="w-3 h-3 text-emerald-600" />,
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          label: 'Marketplace'
        };
      case 'groups':
        return {
          icon: <Users className="w-3 h-3 text-indigo-600" />,
          color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
          label: 'Grupos'
        };
      case 'chat':
        return {
          icon: <MessageSquare className="w-3 h-3 text-sky-600" />,
          color: 'bg-sky-100 text-sky-700 border-sky-200',
          label: 'Chat'
        };
      case 'system':
        return {
          icon: <Wallet className="w-3 h-3 text-amber-600" />,
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          label: 'Carteira'
        };
      default:
        return {
          icon: <Bell className="w-3 h-3 text-slate-600" />,
          color: 'bg-slate-100 text-slate-700 border-slate-200',
          label: 'Alerta'
        };
    }
  };

  const tabs: { id: FilterTab; label: string; count?: number }[] = [
    { id: 'all', label: 'Todas', count: notifications.length },
    { id: 'unread', label: 'Não lidas', count: unreadNotificationsCount },
    { id: 'social', label: 'Social', count: notifications.filter(n => n.category === 'social').length },
    { id: 'dating', label: 'Encontros 💕', count: notifications.filter(n => n.category === 'dating').length },
    { id: 'marketplace', label: 'Marketplace 🛍️', count: notifications.filter(n => n.category === 'marketplace').length },
    { id: 'groups', label: 'Grupos 👥', count: notifications.filter(n => n.category === 'groups').length },
    { id: 'chat', label: 'Chat 💬', count: notifications.filter(n => n.category === 'chat').length },
    { id: 'system', label: 'Sistema 💳', count: notifications.filter(n => n.category === 'system').length }
  ];

  return (
    <>
      {/* Backdrop for click away on desktop and mobile modal */}
      <div 
        className={`fixed inset-0 z-40 ${isMobileFullscreen ? 'bg-black/60 backdrop-blur-xs' : 'bg-transparent'}`}
        onClick={onClose}
      />

      {/* Main Container: dropdown on desktop or full screen drawer on mobile */}
      <div 
        className={
          isMobileFullscreen
            ? "fixed inset-x-0 bottom-0 top-12 z-50 bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200 border-t border-slate-200"
            : "absolute right-0 top-14 w-[92vw] sm:w-[440px] max-w-[460px] bg-white rounded-3xl border border-slate-200 shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh]"
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-purple-50 via-pink-50/50 to-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                  Notificações
                </h3>
                {unreadNotificationsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-extrabold tracking-wide">
                    {unreadNotificationsCount} nova{unreadNotificationsCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Seu centro de avisos e novidades no Vibe Clube
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {unreadNotificationsCount > 0 && (
              <button
                onClick={() => {
                  markNotificationsAsRead();
                  showToast('Todas as notificações foram marcadas como lidas.', 'info');
                }}
                className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
                title="Marcar todas como lidas"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
              title="Configurações de Notificação"
            >
              <Settings className="w-4 h-4" />
            </button>

            {notifications.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(!showClearConfirm)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                title="Limpar histórico"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Real-time Interactive Test Triggers Bar */}
        <div className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-100/70 via-pink-100/50 to-indigo-100/70 border-b border-purple-200/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-purple-900 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span>Ao Vivo:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => triggerTestNotification('friend_request')}
              className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-700 hover:text-indigo-900 border border-indigo-200/80 rounded-xl text-[11px] font-black cursor-pointer shadow-xs active:scale-95 transition-all flex items-center gap-1 shrink-0"
              title="Disparar alerta em tempo real de pedido de amizade"
            >
              <span>🤝 Pedido</span>
            </button>
            <button
              type="button"
              onClick={() => triggerTestNotification('post_like')}
              className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-800 border border-rose-200/80 rounded-xl text-[11px] font-black cursor-pointer shadow-xs active:scale-95 transition-all flex items-center gap-1 shrink-0"
              title="Disparar alerta em tempo real de curtida em post"
            >
              <span>❤️ Curtida</span>
            </button>
            <button
              type="button"
              onClick={() => triggerTestNotification('community')}
              className="px-2.5 py-1 bg-white hover:bg-purple-50 text-purple-700 hover:text-purple-900 border border-purple-200/80 rounded-xl text-[11px] font-black cursor-pointer shadow-xs active:scale-95 transition-all flex items-center gap-1 shrink-0"
              title="Disparar alerta em tempo real de debate em comunidade"
            >
              <span>👥 Comunidade</span>
            </button>
          </div>
        </div>

        {/* Clear Confirmation Prompt */}
        {showClearConfirm && (
          <div className="p-3 bg-red-50 border-b border-red-200/60 flex items-center justify-between text-xs text-red-700 animate-in fade-in">
            <span>Deseja apagar todas as notificações?</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-2.5 py-1 text-slate-600 hover:bg-white rounded-lg font-medium cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  clearAllNotifications();
                  setShowClearConfirm(false);
                  showToast('Todas as notificações foram apagadas.', 'info');
                }}
                className="px-2.5 py-1 bg-red-600 text-white rounded-lg font-bold shadow-xs hover:bg-red-700 cursor-pointer"
              >
                Sim, limpar
              </button>
            </div>
          </div>
        )}

        {/* Filter Tabs Bar (Horizontal Scrollable) */}
        <div className="px-3 sm:px-4 py-2 border-b border-slate-100 bg-slate-50/70 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs shadow-purple-500/20'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive ? 'bg-white/30 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notifications List Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 sm:p-3 space-y-1">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 px-4 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
                <Sparkles className="w-7 h-7 text-purple-500" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-slate-800">
                  {activeTab === 'unread' 
                    ? 'Tudo em dia!' 
                    : 'Nenhuma notificação por aqui'}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  {activeTab === 'unread'
                    ? 'Você já visualizou todas as suas notificações pendentes.'
                    : 'Quando alguém interagir com seus posts, perfil ou compras, você verá aqui.'}
                </p>
              </div>
              {activeTab !== 'all' && (
                <button
                  onClick={() => setActiveTab('all')}
                  className="mt-2 text-xs font-bold text-purple-600 hover:text-purple-700 underline cursor-pointer"
                >
                  Ver todas as notificações
                </button>
              )}
            </div>
          ) : (
            filteredNotifications.map(item => {
              const badge = getCategoryBadge(item.category, item.type);
              return (
                <div
                  key={item.id}
                  className={`group relative p-3 rounded-2xl transition-all flex items-start gap-3 cursor-pointer ${
                    !item.read 
                      ? 'bg-purple-50/50 hover:bg-purple-50 border border-purple-100/80 shadow-xs' 
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                  onClick={() => handleNotificationClick(item)}
                >
                  {/* Unread dot indicator */}
                  {!item.read && (
                    <div className="absolute top-4 left-1.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-white" />
                  )}

                  {/* Actor Avatar with Category Icon Badge */}
                  <div className="relative shrink-0 ml-1">
                    <img
                      src={item.actorAvatar}
                      alt={item.actorName}
                      className="w-10 h-10 rounded-full object-cover border border-purple-200"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border shadow-xs ${badge.color}`}>
                      {badge.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.3 rounded-full border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.createdAt}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 leading-snug">
                      <span className="font-extrabold text-slate-900">{item.actorName} </span>
                      <span>{item.message}</span>
                    </div>

                    {/* Detail Snippet */}
                    {item.detailSnippet && (
                      <div className="mt-1.5 text-[11px] text-slate-600 bg-white/80 p-2 rounded-xl border border-slate-200/60 font-medium italic line-clamp-2">
                        {item.detailSnippet}
                      </div>
                    )}
                  </div>

                  {/* Right Side Quick Actions (Delete / Mark) */}
                  <div className="absolute right-2.5 top-3 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    {!item.read ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markNotificationAsRead(item.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                        title="Marcar como lida"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    ) : null}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(item.id);
                        showToast('Notificação excluída.', 'info');
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Excluir notificação"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="text-[11px]">
            {unreadNotificationsCount === 0 ? 'Tudo lido e atualizado' : `${unreadNotificationsCount} pendente${unreadNotificationsCount > 1 ? 's' : ''}`}
          </span>
          <button
            onClick={() => {
              setIsSettingsModalOpen(true);
            }}
            className="text-purple-600 hover:text-purple-700 font-bold flex items-center gap-1 cursor-pointer hover:underline text-[11px]"
          >
            <span>Preferências</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Nested Settings Modal */}
      <NotificationSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </>
  );
};
