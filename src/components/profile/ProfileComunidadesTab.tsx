import React from 'react';
import { Users, Compass, ChevronRight } from 'lucide-react';
import { Community, User } from '../../types';

interface ProfileComunidadesTabProps {
  user: User;
  allCommunities: Community[];
  isOwnProfile: boolean;
  onSelectCommunity: (communityId: string) => void;
  onExploreCommunities: () => void;
}

export const ProfileComunidadesTab: React.FC<ProfileComunidadesTabProps> = ({
  user,
  allCommunities,
  isOwnProfile,
  onSelectCommunity,
  onExploreCommunities
}) => {
  const userCommunities = allCommunities.filter(
    (c) => c.isMember || c.creatorId === user.id
  );

  return (
    <div className="space-y-3 font-sans">
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-white px-4 py-2.5 border-b border-purple-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-extrabold text-slate-900">
            <Compass className="w-4 h-4 text-purple-600" />
            <span>Comunidades de {user.name} ({userCommunities.length})</span>
          </div>
          <button
            onClick={onExploreCommunities}
            className="vibe-btn text-xs py-1"
          >
            <span>Explorar mais</span>
          </button>
        </div>

        {/* Communities Grid */}
        <div className="p-4">
          {userCommunities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userCommunities.map((community) => (
                <div
                  key={community.id}
                  onClick={() => onSelectCommunity(community.id)}
                  className="bg-white hover:bg-purple-50/20 border border-slate-200/90 hover:border-purple-300 rounded-2xl overflow-hidden transition-all cursor-pointer flex flex-col group shadow-2xs"
                >
                  {/* Imagem Grande no Topo */}
                  <div className="w-full aspect-[16/9] sm:h-36 bg-slate-100 overflow-hidden relative">
                    <img
                      src={community.coverImage || community.logo}
                      alt={community.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      style={{ objectPosition: `center ${community.coverPositionY ?? 50}%` }}
                      onError={(e) => {
                        if (community.logo && (e.currentTarget as HTMLImageElement).src !== community.logo) {
                          (e.currentTarget as HTMLImageElement).src = community.logo;
                        }
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-black/65 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                        {community.membersCount.toLocaleString('pt-BR')} membros
                      </span>
                    </div>
                  </div>

                  {/* Título e Detalhes Embaixo da Imagem */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-1 leading-snug">
                        {community.name}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                        {community.description}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-purple-700 font-bold group-hover:underline">Acessar comunidade →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-500">
              Nenhuma comunidade encontrada. Que tal explorar e participar de algumas?
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 text-center">
          <button
            onClick={onExploreCommunities}
            className="text-xs text-purple-700 font-extrabold hover:underline cursor-pointer inline-flex items-center gap-1"
          >
            <span>Ver todas as comunidades do Vibe Clube</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
