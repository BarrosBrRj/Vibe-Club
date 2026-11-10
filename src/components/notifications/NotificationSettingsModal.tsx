import React from 'react';
import { 
  X, Bell, Smartphone, Check, 
  RotateCcw, Sparkles, Heart, ShoppingBag, Users, MessageSquare, Wallet, Globe,
  Volume2, VolumeX, Radio, Zap, UserPlus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationCategory } from '../../types';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    notificationSettings, 
    updateNotificationSettings, 
    addNotification,
    triggerTestNotification,
    showToast,
    currentUser 
  } = useApp();

  if (!isOpen) return null;

  const categoriesConfig: {
    id: NotificationCategory;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'social',
      title: 'Social (Feed & Perfil)',
      description: 'Recados no mural, depoimentos, curtidas, menções e amizades',
      icon: <Globe className="w-4 h-4 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    },
    {
      id: 'dating',
      title: 'Encontros 💕',
      description: 'Novos matches, mensagens românticas e avisos de saldo de Vibes',
      icon: <Heart className="w-4 h-4 text-pink-600 fill-pink-500" />,
      color: 'bg-pink-50 border-pink-200 text-pink-700'
    },
    {
      id: 'marketplace',
      title: 'Marketplace 🛍️',
      description: 'Status de aprovação, impulsionamento ativo e interessados',
      icon: <ShoppingBag className="w-4 h-4 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700'
    },
    {
      id: 'groups',
      title: 'Grupos & Comunidades 👥',
      description: 'Aprovações de entrada, novos debates e cargos de moderação',
      icon: <Users className="w-4 h-4 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-200 text-indigo-700'
    },
    {
      id: 'chat',
      title: 'Chat & Mensagens 💬',
      description: 'Mensagens diretas privadas e avisos de bate-papo',
      icon: <MessageSquare className="w-4 h-4 text-sky-600" />,
      color: 'bg-sky-50 border-sky-200 text-sky-700'
    },
    {
      id: 'system',
      title: 'Sistema & Carteira 💳',
      description: 'Confirmação de Pix, recargas de Vibes e alertas de segurança',
      icon: <Wallet className="w-4 h-4 text-amber-600" />,
      color: 'bg-amber-50 border-amber-200 text-amber-700'
    }
  ];

  const handleToggleCategory = (category: NotificationCategory) => {
    const currentValue = notificationSettings.categories[category] ?? true;
    updateNotificationSettings({
      categories: {
        ...notificationSettings.categories,
        [category]: !currentValue
      }
    });
    showToast(`Notificações de ${category} ${!currentValue ? 'ativadas' : 'desativadas'}.`, 'info');
  };

  const handleTestNotification = () => {
    addNotification({
      userId: currentUser?.id || 'user_me',
      category: 'social',
      type: 'like',
      actorId: 'user_mariana',
      actorName: 'Mariana Rios',
      actorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      message: 'testou o sistema de notificações com você!',
      detailSnippet: 'Tudo funcionando perfeitamente no seu Vibe Clube ✨',
      targetType: 'profile_scraps'
    });
    showToast('Notificação de teste enviada! Veja no sininho.', 'vibe');
  };

  const handleResetDefaults = () => {
    updateNotificationSettings({
      pushEnabled: true,
      mutePushKeepInternal: false,
      categories: {
        social: true,
        dating: true,
        marketplace: true,
        groups: true,
        chat: true,
        system: true
      }
    });
    showToast('Preferências de notificação restauradas!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-pink-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                Configurações de Notificação
              </h3>
              <p className="text-xs text-slate-500">
                Personalize o que você deseja receber no Vibe Clube
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 divide-y divide-slate-100">
          {/* Push Notifications General Switches */}
          <div className="space-y-3 pt-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Modo de Entrega & Som em Tempo Real</span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-3">
              {/* Sound / Chime Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">Sons & Chimes de Alerta</div>
                    <div className="text-xs text-slate-500">Tons agradáveis sintetizados em tempo real</div>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notificationSettings.soundEnabled !== false}
                  onClick={() => updateNotificationSettings({ soundEnabled: notificationSettings.soundEnabled === false ? true : false })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    notificationSettings.soundEnabled !== false ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      notificationSettings.soundEnabled !== false ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Floating Real-time Cards */}
              <div className="border-t border-slate-200/60 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">Cards Flutuantes Ao Vivo</div>
                    <div className="text-xs text-slate-500">Notificação pop-up com avatar e botões interativos</div>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notificationSettings.realtimeAlerts !== false}
                  onClick={() => updateNotificationSettings({ realtimeAlerts: notificationSettings.realtimeAlerts === false ? true : false })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    notificationSettings.realtimeAlerts !== false ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      notificationSettings.realtimeAlerts !== false ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Live Simulation */}
              <div className="border-t border-slate-200/60 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">Simulação Automática de Atividade</div>
                    <div className="text-xs text-slate-500">Receber alertas de amigos e comunidades a cada ~45s</div>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notificationSettings.liveSimulation !== false}
                  onClick={() => updateNotificationSettings({ liveSimulation: notificationSettings.liveSimulation === false ? true : false })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    notificationSettings.liveSimulation !== false ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      notificationSettings.liveSimulation !== false ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Mute Push / Internal only */}
              <div className="border-t border-slate-200/60 pt-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-800">Silenciar Popups Visuais</div>
                  <div className="text-xs text-slate-500">Guardar apenas no sininho de notificações</div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={notificationSettings.mutePushKeepInternal}
                  onClick={() => updateNotificationSettings({ mutePushKeepInternal: !notificationSettings.mutePushKeepInternal })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    notificationSettings.mutePushKeepInternal ? 'bg-purple-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      notificationSettings.mutePushKeepInternal ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Categories Granular Switches */}
          <div className="space-y-3 pt-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Categorias de Notificação</span>
              <span className="text-[11px] font-semibold text-purple-600">6 ativas</span>
            </div>

            <div className="space-y-2">
              {categoriesConfig.map(cat => {
                const isEnabled = notificationSettings.categories[cat.id] ?? true;
                return (
                  <div 
                    key={cat.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isEnabled 
                        ? 'bg-white border-slate-200 shadow-xs' 
                        : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${cat.color} shrink-0`}>
                        {cat.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                          {cat.title}
                          {isEnabled && (
                            <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                              <Check className="w-2.5 h-2.5" /> Ativo
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{cat.description}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={isEnabled}
                      onClick={() => handleToggleCategory(cat.id)}
                      className={`relative ml-3 inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        isEnabled ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Real-Time Test Actions */}
          <div className="pt-4 space-y-2.5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Testar Alertas em Tempo Real</span>
              <span className="text-[10px] text-purple-600 font-extrabold">Disparo Imediato</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerTestNotification('friend_request');
                  showToast('Disparado alerta de Pedido de Amizade!', 'vibe');
                }}
                className="p-2.5 bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200/80 rounded-2xl text-left transition-all cursor-pointer active:scale-95 group"
              >
                <div className="flex items-center gap-2 text-indigo-700 font-black text-xs mb-0.5">
                  <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Pedido de Amizade</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">Card com botão "Aceitar Amizade"</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerTestNotification('post_like');
                  showToast('Disparado alerta de Curtida em Post!', 'vibe');
                }}
                className="p-2.5 bg-rose-50/70 hover:bg-rose-100/80 border border-rose-200/80 rounded-2xl text-left transition-all cursor-pointer active:scale-95 group"
              >
                <div className="flex items-center gap-2 text-rose-700 font-black text-xs mb-0.5">
                  <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
                  <span>Curtida em Post</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">Card com "Ver Publicação"</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerTestNotification('community');
                  showToast('Disparado alerta de Comunidade!', 'vibe');
                }}
                className="p-2.5 bg-purple-50/70 hover:bg-purple-100/80 border border-purple-200/80 rounded-2xl text-left transition-all cursor-pointer active:scale-95 group"
              >
                <div className="flex items-center gap-2 text-purple-700 font-black text-xs mb-0.5">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  <span>Comunidades</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">Card com "Ver na Comunidade"</p>
              </button>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleResetDefaults}
                className="px-3 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer rounded-xl"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Padrão</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/20 active:scale-95 transition-all cursor-pointer"
          >
            Pronto
          </button>
        </div>
      </div>
    </div>
  );
};
