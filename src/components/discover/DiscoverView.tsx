import React, { useState } from 'react';
import { 
  Search, Compass, Users, Flame, Heart, 
  Gamepad2, TrendingUp, Sparkles, MapPin, Check 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DiscoverView: React.FC = () => {
  const { 
    allUsers, 
    communities, 
    posts, 
    setViewingUserId, 
    setActiveTab, 
    sendFriendRequest, 
    joinCommunity 
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'people' | 'communities' | 'trending'>('all');

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(query.toLowerCase()) || 
    u.city.toLowerCase().includes(query.toLowerCase()) ||
    u.interests.some(i => i.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.description.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const trendingTags = [
    { tag: '#Nostalgia2000', posts: '1.4k posts' },
    { tag: '#RockNacional', posts: '980 posts' },
    { tag: '#VibeClube', posts: '3.2k posts' },
    { tag: '#GamesRetro', posts: '750 posts' },
    { tag: '#AmizadeVerdadeira', posts: '1.1k posts' },
    { tag: '#SextouNoClube', posts: '620 posts' }
  ];

  return (
    <div className="max-w-4xl mx-auto w-full space-y-5">
      
      {/* Header Search Section */}
      <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-amber-500 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-amber-300">
          <Compass className="w-4 h-4" />
          <span>RADAR DE DESCOBERTA & TENDÊNCIAS</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black">
          Descubra pessoas incríveis, comunidades ativas e vibes do momento
        </h1>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar por pessoas, cidades, gostos musicais, comunidades..."
            className="w-full pl-11 pr-4 py-3 bg-white text-slate-800 text-xs sm:text-sm rounded-2xl border-none outline-hidden shadow-md placeholder:text-slate-400"
          />
          <Search className="w-5 h-5 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Trending Hashtags */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900 mb-3">
          <TrendingUp className="w-4 h-4 text-purple-600" />
          <span>Assuntos do Momento no Brasil 🇧🇷</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {trendingTags.map((t, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(t.tag.replace('#', ''))}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 text-xs font-semibold text-slate-700 hover:text-purple-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="font-bold text-purple-600">{t.tag}</span>
              <span className="text-[10px] text-slate-400">({t.posts})</span>
            </button>
          ))}
        </div>
      </div>

      {/* People Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span>Pessoas com Vibes Próximas</span>
          </h3>
          <button 
            onClick={() => setActiveTab('friends')}
            className="text-xs font-semibold text-purple-600 hover:underline"
          >
            Ver todos
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between"
            >
              <div 
                onClick={() => {
                  setViewingUserId(user.id);
                  setActiveTab('profile');
                }}
                className="cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-full object-cover border border-purple-300" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-purple-700 truncate">
                      {user.name}
                    </h4>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-500" />
                      <span>{user.city}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-2 leading-relaxed">
                  {user.bio}
                </p>
              </div>

              <button
                onClick={() => sendFriendRequest(user.id)}
                className="w-full py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Conectar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Communities Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-purple-600" />
            <span>Comunidades Recomendadas</span>
          </h3>
          <button 
            onClick={() => setActiveTab('communities')}
            className="text-xs font-semibold text-purple-600 hover:underline"
          >
            Explorar todas
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredCommunities.map(comm => (
            <div
              key={comm.id}
              onClick={() => setActiveTab('communities')}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-purple-300 transition-all flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <img src={comm.logo} alt={comm.name} className="w-12 h-12 rounded-xl object-cover border border-purple-200 shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-purple-700 truncate">
                    {comm.name}
                  </h4>
                  <div className="text-[11px] text-slate-400">
                    {comm.membersCount.toLocaleString('pt-BR')} membros • {comm.category}
                  </div>
                </div>
              </div>

              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-xl shrink-0">
                Ver
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
