import React, { useEffect } from 'react';
import { 
  Heart, UserPlus, Users, MessageSquare, X, Check, 
  ExternalLink, Sparkles, Bell
} from 'lucide-react';
import { NotificationItem } from '../../types';
import { useApp } from '../../context/AppContext';

interface RealtimeNotificationAlertProps {
  alerts: NotificationItem[];
  onDismiss: (id: string) => void;
  onActionClick: (notif: NotificationItem) => void;
}

export const RealtimeNotificationAlert: React.FC<RealtimeNotificationAlertProps> = ({
  alerts,
  onDismiss,
  onActionClick
}) => {
  const { acceptFriendRequest } = useApp();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-18 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none font-sans">
      {alerts.map((item) => {
        const isLike = item.type === 'like' || item.type === 'post_like';
        const isFriendRequest = item.type === 'friend_request';
        const isCommunity = item.type === 'community' || item.type === 'community_reply' || item.type === 'community_topic' || item.type === 'group_new_post';

        let badgeBg = 'bg-purple-600 text-white';
        let badgeIcon = <Bell className="w-3 h-3" />;
        let borderColor = 'border-purple-200';
        let accentGlow = 'from-purple-50 via-white to-pink-50';

        if (isLike) {
          badgeBg = 'bg-rose-500 text-white';
          badgeIcon = <Heart className="w-3 h-3 fill-white" />;
          borderColor = 'border-rose-200';
          accentGlow = 'from-rose-50 via-white to-pink-50';
        } else if (isFriendRequest) {
          badgeBg = 'bg-indigo-600 text-white';
          badgeIcon = <UserPlus className="w-3 h-3" />;
          borderColor = 'border-indigo-200';
          accentGlow = 'from-indigo-50 via-white to-purple-50';
        } else if (isCommunity) {
          badgeBg = 'bg-purple-600 text-white';
          badgeIcon = <Users className="w-3 h-3" />;
          borderColor = 'border-purple-200';
          accentGlow = 'from-purple-50 via-white to-amber-50';
        }

        return (
          <div
            key={item.id}
            className={`pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl border ${borderColor} shadow-xl p-3.5 sm:p-4 animate-in slide-in-from-top-4 duration-300 transition-all hover:scale-102 flex flex-col gap-2.5 bg-gradient-to-r ${accentGlow}`}
          >
            {/* Top row: Avatar + Actor Name + Action description + Dismiss */}
            <div className="flex items-start gap-3">
              {/* Avatar with floating badge */}
              <div className="relative shrink-0">
                <img
                  src={item.actorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=vibe'}
                  alt={item.actorName}
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-md bg-slate-100"
                />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${badgeBg} flex items-center justify-center shadow-xs ring-2 ring-white`}>
                  {badgeIcon}
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-black text-slate-900 truncate">
                    {item.actorName}
                  </h4>
                  <span className="text-[10px] text-purple-700 font-extrabold uppercase tracking-wider bg-purple-100/60 px-1.5 py-0.2 rounded-md shrink-0">
                    Ao Vivo
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-snug mt-0.5">
                  {item.message}
                </p>

                {item.detailSnippet && (
                  <p className="text-[11px] text-slate-500 italic truncate mt-1 bg-white/60 px-2 py-0.5 rounded-lg border border-slate-100">
                    "{item.detailSnippet}"
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => onDismiss(item.id)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100/80 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100/80">
              {isFriendRequest ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      if (acceptFriendRequest && item.actorId) {
                        acceptFriendRequest(item.actorId);
                      }
                      onDismiss(item.id);
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1 transition-all active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Aceitar Amizade</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onActionClick(item);
                      onDismiss(item.id);
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    Ver Perfil
                  </button>
                </>
              ) : isLike ? (
                <button
                  type="button"
                  onClick={() => {
                    onActionClick(item);
                    onDismiss(item.id);
                  }}
                  className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Ver Publicação</span>
                </button>
              ) : isCommunity ? (
                <button
                  type="button"
                  onClick={() => {
                    onActionClick(item);
                    onDismiss(item.id);
                  }}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Ver na Comunidade</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onActionClick(item);
                    onDismiss(item.id);
                  }}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <span>Ver Detalhes</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
