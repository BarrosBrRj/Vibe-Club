import React, { useState, useMemo } from 'react';
import { 
  Search, Download, Star, Sparkles, Plus, CheckCircle2, 
  Smartphone, Filter, TrendingUp, Award, Flame, Layers, 
  ExternalLink, ArrowRight, ShieldCheck, Gamepad2, Radio, 
  Camera, Wrench, Palette, Briefcase, Share2, Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppItem } from '../../types';
import { AppDetailsModal } from './AppDetailsModal';
import { PublishAppModal } from './PublishAppModal';

export const AppsHub: React.FC = () => {
  const { 
    appsList, 
    selectedApp, 
    setSelectedApp, 
    isPublishAppModalOpen, 
    setIsPublishAppModalOpen, 
    installedAppIds, 
    installApp,
    showToast,
    currentUser
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [filterMode, setFilterMode] = useState<'all' | 'installed' | 'editors'>('all');

  const categories = [
    { id: 'Todos', name: 'Todos os Apps', icon: Layers },
    { id: 'Jogos', name: 'Jogos', icon: Gamepad2 },
    { id: 'Redes Sociais', name: 'Redes Sociais', icon: Radio },
    { id: 'Foto & Vídeo', name: 'Foto & Vídeo', icon: Camera },
    { id: 'Música & Áudio', name: 'Música & Áudio', icon: Flame },
    { id: 'Utilitários', name: 'Utilitários', icon: Wrench },
    { id: 'Personalização', name: 'Personalização', icon: Palette },
    { id: 'Produtividade', name: 'Produtividade', icon: Briefcase },
  ];

  // Filtered Apps
  const filteredApps = useMemo(() => {
    return appsList.filter((app) => {
      // Category filter
      if (selectedCategory !== 'Todos' && app.category !== selectedCategory) {
        return false;
      }
      // Filter mode
      if (filterMode === 'installed' && !installedAppIds.includes(app.id)) {
        return false;
      }
      if (filterMode === 'editors' && !app.editorsChoice) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          app.name.toLowerCase().includes(q) ||
          app.tagline.toLowerCase().includes(q) ||
          app.description.toLowerCase().includes(q) ||
          app.category.toLowerCase().includes(q) ||
          app.developer.name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [appsList, selectedCategory, filterMode, searchQuery, installedAppIds]);

  // Featured Apps
  const featuredApps = useMemo(() => {
    return appsList.filter(a => a.featured);
  }, [appsList]);

  // Top Charts
  const topDownloaded = useMemo(() => {
    return [...appsList].sort((a, b) => b.downloadsCount - a.downloadsCount).slice(0, 5);
  }, [appsList]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans">
      
      {/* Play Store Top Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background decorative shapes */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-pink-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
                <Smartphone className="w-3.5 h-3.5 text-pink-300" />
                Vibe Play Store • Brasil
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/30 text-emerald-200 text-xs font-bold rounded-full border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                Verificado
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Loja de Aplicativos & APKs
            </h1>

            <p className="text-purple-100 text-xs sm:text-sm leading-relaxed">
              Explore, baixe e publique seus aplicativos para celular. Jogos retrô, utilitários, temas e APKs feitos pela comunidade do Vibe Clube.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            {currentUser?.hasUnlimitedAppLicense ? (
              <div className="flex items-center gap-2 bg-emerald-500/25 border border-emerald-300/40 rounded-2xl px-3.5 py-2.5 text-xs text-white shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="font-extrabold">Licença Ilimitada Ativa</span>
              </div>
            ) : null}
            <button
              onClick={() => setIsPublishAppModalOpen(true)}
              id="btn-open-publish-app"
              className={`py-3 px-5 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                currentUser?.hasUnlimitedAppLicense
                  ? 'bg-white text-purple-900 hover:bg-purple-50'
                  : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {currentUser?.hasUnlimitedAppLicense ? (
                <>
                  <Plus className="w-4 h-4 text-purple-600" />
                  <span>Publicar Aplicativo / APK</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-slate-950 fill-current" />
                  <span>Liberar Postagens Ilimitadas (Taxa R$ 49,90)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar aplicativos, jogos, APKs ou desenvolvedores..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Quick Filter Modes */}
        <div className="flex items-center gap-1.5 self-center sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              filterMode === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterMode('editors')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              filterMode === 'editors' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Escolha dos Editores</span>
          </button>
          <button
            onClick={() => setFilterMode('installed')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              filterMode === 'installed' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-purple-500" />
            <span>Instalados ({installedAppIds.length})</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-purple-600'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* FEATURED SPOTLIGHT CAROUSEL (Show if not searching and on 'Todos') */}
      {!searchQuery && selectedCategory === 'Todos' && filterMode === 'all' && featuredApps.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Destaques da Semana</span>
            </h2>
            <span className="text-xs text-purple-700 font-bold">Recomendados pelo Vibe</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredApps.slice(0, 2).map((app) => {
              const isInst = installedAppIds.includes(app.id);
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="bg-gradient-to-br from-white to-purple-50/40 rounded-3xl border border-purple-100 p-5 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={app.iconUrl}
                      alt={app.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm group-hover:scale-105 transition-transform shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                          {app.category}
                        </span>
                        {app.editorsChoice && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            Escolha
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base mt-1 truncate group-hover:text-purple-700 transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {app.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100/80">
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                      <div className="flex items-center gap-1 text-slate-800 font-bold">
                        <span>{app.rating.toFixed(1)}</span>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      </div>
                      <span>•</span>
                      <span>{app.size}</span>
                      <span>•</span>
                      <span>{app.downloadsCount > 1000 ? `${(app.downloadsCount/1000).toFixed(0)}k downloads` : `${app.downloadsCount} downloads`}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        installApp(app.id);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isInst
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                      }`}
                    >
                      {isInst ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Abrir</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Instalar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TOP CHARTS: Mais Baixados */}
      {!searchQuery && selectedCategory === 'Todos' && filterMode === 'all' && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Mais Baixados do Brasil</span>
            </h2>
            <span className="text-xs text-slate-400">Atualizado hoje</span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-3 sm:p-4 shadow-xs">
            <div className="divide-y divide-slate-100">
              {topDownloaded.map((app, idx) => {
                const isInst = installedAppIds.includes(app.id);
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="py-3 px-2 flex items-center gap-3 sm:gap-4 hover:bg-purple-50/40 rounded-2xl transition-colors cursor-pointer group"
                  >
                    <span className="font-black text-sm sm:text-base text-slate-400 w-5 text-center shrink-0">
                      {idx + 1}
                    </span>

                    <img
                      src={app.iconUrl}
                      alt={app.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 truncate group-hover:text-purple-700 transition-colors">
                        {app.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="text-purple-700 font-semibold">{app.category}</span>
                        <span>•</span>
                        <div className="flex items-center gap-0.5 text-slate-700 font-bold">
                          <span>{app.rating.toFixed(1)}</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        </div>
                        <span>•</span>
                        <span>{app.size}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        installApp(app.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer shrink-0 ${
                        isInst
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 hover:bg-purple-600 hover:text-white text-slate-700'
                      }`}
                    >
                      {isInst ? 'Instalado' : 'Instalar'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ALL APPS EXPLORE GRID */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-600" />
            <span>
              {searchQuery
                ? `Resultados para "${searchQuery}" (${filteredApps.length})`
                : selectedCategory !== 'Todos'
                ? `Aplicativos de ${selectedCategory} (${filteredApps.length})`
                : filterMode === 'installed'
                ? `Seus Aplicativos Instalados (${filteredApps.length})`
                : filterMode === 'editors'
                ? `Escolha dos Editores (${filteredApps.length})`
                : `Todos os Aplicativos & Jogos (${filteredApps.length})`}
            </span>
          </h2>
        </div>

        {filteredApps.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center mx-auto">
              <Smartphone className="w-8 h-8" />
            </div>
            <div className="max-w-sm mx-auto">
              <h3 className="text-base font-bold text-slate-800">Nenhum aplicativo encontrado</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tente ajustar sua busca ou seja o primeiro a publicar um aplicativo nesta categoria!
              </p>
            </div>
            <button
              onClick={() => setIsPublishAppModalOpen(true)}
              className="py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Publicar Aplicativo Agora
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApps.map((app) => {
              const isInst = installedAppIds.includes(app.id);
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={app.iconUrl}
                      alt={app.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-extrabold uppercase text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded-md">
                          {app.category}
                        </span>
                        {app.editorsChoice && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                            Top
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-900 mt-1 truncate group-hover:text-purple-700 transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">
                        {app.developer.name}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-3 leading-relaxed">
                    {app.tagline}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                      <span>{app.rating.toFixed(1)}</span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-slate-300 font-normal">|</span>
                      <span className="text-slate-400 font-normal text-[11px]">{app.size}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        installApp(app.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                        isInst
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white'
                      }`}
                    >
                      {isInst ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Abrir</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Instalar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* App Details Modal */}
      <AppDetailsModal
        app={selectedApp}
        onClose={() => setSelectedApp(null)}
      />

      {/* Publish App Modal */}
      <PublishAppModal />

    </div>
  );
};
