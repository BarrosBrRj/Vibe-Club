import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, X, Key, ExternalLink, ShieldCheck, 
  Sparkles, RefreshCw, AlertCircle, CheckCircle2, ChevronDown 
} from 'lucide-react';
import { 
  GiphyGif, 
  fetchTrendingGifs, 
  searchGifs, 
  getGiphyApiKey, 
  setGiphyApiKey, 
  hasGiphyApiKey,
  getGiphyRating,
  setGiphyRating
} from '../../lib/giphy';

interface GiphyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGif: (gifUrl: string, gif: GiphyGif) => void;
}

const QUICK_TOPICS = [
  { label: 'Em Alta 🔥', query: '' },
  { label: 'Reações 😂', query: 'reaction' },
  { label: 'Dança 💃', query: 'dance party' },
  { label: 'Vibe ✨', query: 'positive vibes' },
  { label: 'Comemoração 🎉', query: 'celebration yay' },
  { label: 'Gamer 🎮', query: 'gaming win' },
  { label: 'Memes 🤣', query: 'funny meme' },
  { label: 'Amor ❤️', query: 'love heart' }
];

export const GiphyModal: React.FC<GiphyModalProps> = ({
  isOpen,
  onClose,
  onSelectGif
}) => {
  const [query, setQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState('Em Alta 🔥');
  const [gifs, setGifs] = useState<GiphyGif[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  
  // Rating safe search (default: 'g')
  const [rating, setRating] = useState<'g' | 'pg'>(getGiphyRating());

  // Configuração da chave GIPHY
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [inputKey, setInputKey] = useState(getGiphyApiKey());
  const [keySavedToast, setKeySavedToast] = useState(false);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Carrega lista inicial
  const loadGifs = useCallback(async (searchQuery: string, currentOffset = 0, isAppend = false) => {
    if (isAppend) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setErrorStatus(null);

    try {
      const result = searchQuery.trim()
        ? await searchGifs(searchQuery, currentOffset, 18, rating)
        : await fetchTrendingGifs(currentOffset, 18, rating);

      setIsFallbackMode(Boolean(result.isFallback));
      setTotalCount(result.totalCount);

      if (isAppend) {
        setGifs(prev => [...prev, ...result.gifs]);
      } else {
        setGifs(result.gifs);
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      }
      setOffset(currentOffset + result.gifs.length);
    } catch (err: any) {
      if (err.message === 'INVALID_KEY') {
        setErrorStatus('INVALID_KEY');
      } else if (err.message === 'RATE_LIMIT') {
        setErrorStatus('RATE_LIMIT');
      } else {
        setErrorStatus('ERROR');
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [rating]);

  // Efeito ao abrir o modal ou mudar rating
  useEffect(() => {
    if (isOpen) {
      setInputKey(getGiphyApiKey());
      loadGifs(query, 0, false);
    }
  }, [isOpen, rating]);

  // Busca com debounce de digitação
  const handleQueryChange = (val: string) => {
    setQuery(val);
    setActiveTopic('');
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      loadGifs(val, 0, false);
    }, 450);
  };

  const handleSelectTopic = (label: string, topicQuery: string) => {
    setActiveTopic(label);
    setQuery(topicQuery);
    loadGifs(topicQuery, 0, false);
  };

  const handleSaveKey = () => {
    setGiphyApiKey(inputKey);
    setKeySavedToast(true);
    setTimeout(() => {
      setKeySavedToast(false);
      setShowKeyConfig(false);
      loadGifs(query, 0, false);
    }, 900);
  };

  const handleToggleRating = (newRating: 'g' | 'pg') => {
    setRating(newRating);
    setGiphyRating(newRating);
    loadGifs(query, 0, false);
  };

  const handleLoadMore = () => {
    if (!isLoading && !isLoadingMore && gifs.length < totalCount) {
      loadGifs(query, offset, true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full sm:max-w-xl max-h-[90vh] sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 text-slate-800 animate-in slide-in-from-bottom duration-200 max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/90 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
              GIF
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight flex items-center gap-1.5">
                <span>Escolha um GIF</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  {rating === 'g' ? 'Safe: Livre' : 'Safe: PG'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">Milhões de reações e animações em alta</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                showKeyConfig || !hasGiphyApiKey()
                  ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
              title="Configurar chave do GIPHY"
            >
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Chave API</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Painel de Configuração da Chave GIPHY */}
        {showKeyConfig && (
          <div className="p-3 sm:p-4 bg-amber-50/90 border-b border-amber-200 text-xs text-amber-950 space-y-2 animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <span className="font-bold flex items-center gap-1 text-amber-900">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  Chave de API do GIPHY (Gratuita)
                </span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Para pesquisar qualquer termo sem restrições, insira sua chave da API GIPHY. Ela fica salva com segurança apenas no seu navegador.
                </p>
              </div>
              <a
                href="https://developers.giphy.com/"
                target="_blank"
                rel="noreferrer"
                className="shrink-0 text-[11px] font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors"
              >
                <span>Criar Chave</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Cole sua API Key do GIPHY aqui..."
                className="flex-1 px-3 py-1.5 bg-white rounded-xl border border-amber-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-500 text-xs outline-hidden text-slate-800 placeholder-slate-400"
              />
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1"
              >
                {keySavedToast ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>Salva!</span>
                  </>
                ) : (
                  <span>Salvar</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Barra de Busca e Filtros */}
        <div className="p-3 border-b border-slate-100 bg-white space-y-2 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Pesquise por reações, filmes, memes, vibes..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-400 outline-hidden transition-all text-slate-800 placeholder-slate-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  loadGifs('', 0, false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Chips de Categorias e Filtro Safe Search */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar pt-0.5">
            <div className="flex items-center gap-1 shrink-0">
              {QUICK_TOPICS.map(topic => {
                const isActive = activeTopic === topic.label;
                return (
                  <button
                    key={topic.label}
                    type="button"
                    onClick={() => handleSelectTopic(topic.label, topic.query)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {topic.label}
                  </button>
                );
              })}
            </div>

            {/* Alternador de Classificação Safe */}
            <div className="shrink-0 flex items-center bg-slate-100 p-0.5 rounded-full text-[10px] font-bold text-slate-600">
              <button
                type="button"
                onClick={() => handleToggleRating('g')}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  rating === 'g' ? 'bg-white text-emerald-700 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Classificação G: Conteúdo estritamente livre para todos"
              >
                G (Livre)
              </button>
              <button
                type="button"
                onClick={() => handleToggleRating('pg')}
                className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  rating === 'pg' ? 'bg-white text-purple-700 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Classificação PG: Orientação parental leve"
              >
                PG
              </button>
            </div>
          </div>
        </div>

        {/* Mensagens de Alerta Amigáveis */}
        {errorStatus === 'INVALID_KEY' && (
          <div className="mx-3 my-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-0.5">
              <p className="font-bold">Chave de API do GIPHY inválida</p>
              <p className="text-[11px] leading-relaxed">
                Verifique se copiou a chave correta no painel de configuração acima.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowKeyConfig(true)}
              className="text-[11px] font-bold underline text-rose-900 cursor-pointer"
            >
              Editar Chave
            </button>
          </div>
        )}

        {errorStatus === 'RATE_LIMIT' && (
          <div className="mx-3 my-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-0.5">
              <p className="font-bold">Limite gratuito do GIPHY atingido temporariamente</p>
              <p className="text-[11px] leading-relaxed">
                O limite de requisições da sua chave expirou no momento. Tente novamente em alguns minutos ou use os GIFs em alta selecionados.
              </p>
            </div>
          </div>
        )}

        {isFallbackMode && !hasGiphyApiKey() && (
          <div className="mx-3 mt-2 p-2 bg-purple-50/80 border border-purple-200/80 rounded-xl text-[11px] text-purple-900 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>Exibindo GIFs em alta curados. Cole sua chave para busca ilimitada!</span>
            </div>
            <button
              type="button"
              onClick={() => setShowKeyConfig(true)}
              className="font-bold underline text-purple-700 hover:text-purple-900 shrink-0 cursor-pointer"
            >
              Configurar
            </button>
          </div>
        )}

        {/* Grid de GIFs com Rolagem / Rolagem Infinita */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 min-h-[260px] max-w-full"
        >
          {isLoading ? (
            <div className="col-span-full py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
              <p className="text-xs font-semibold text-slate-600">Buscando GIFs no GIPHY...</p>
            </div>
          ) : gifs.length > 0 ? (
            <>
              {gifs.map((gif) => (
                <button
                  key={gif.id}
                  type="button"
                  onClick={() => onSelectGif(gif.url, gif)}
                  className="relative group rounded-2xl overflow-hidden bg-slate-900 aspect-4/3 sm:aspect-square flex items-center justify-center hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border border-slate-100 shadow-2xs"
                >
                  <img
                    src={gif.previewUrl}
                    alt={gif.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-[10px] font-bold text-white truncate drop-shadow-xs">
                      {gif.title || 'Usar este GIF'}
                    </span>
                  </div>
                </button>
              ))}

              {/* Botão / Trigger de Carregar Mais */}
              <div className="col-span-full py-3 flex justify-center">
                {isLoadingMore ? (
                  <div className="flex items-center gap-1.5 text-xs text-purple-600 font-bold">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Carregando mais GIFs...</span>
                  </div>
                ) : (
                  gifs.length < totalCount && (
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      className="px-4 py-2 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronDown className="w-4 h-4" />
                      <span>Carregar mais GIFs</span>
                    </button>
                  )
                )}
              </div>
            </>
          ) : (
            <div className="col-span-full py-14 text-center text-slate-400 space-y-1">
              <p className="text-sm font-bold text-slate-700">Nenhum GIF encontrado</p>
              <p className="text-xs">Tente pesquisar com outras palavras-chave ou confira as abas sugeridas.</p>
            </div>
          )}
        </div>

        {/* Footer com Powered by GIPHY obrigatório e seguro */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2">
            {/* Logo e badge oficial Powered by GIPHY */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black text-white font-black text-[10px] tracking-wider uppercase shadow-2xs">
              <span className="text-emerald-400">G</span>
              <span className="text-cyan-400">I</span>
              <span className="text-purple-400">P</span>
              <span className="text-pink-400">H</span>
              <span className="text-amber-400">Y</span>
            </div>
            <span className="text-[11px] font-bold text-slate-600">
              Powered by GIPHY
            </span>
          </div>

          <span className="text-[10px] text-slate-400 hidden sm:inline">
            Toque para anexar ao post
          </span>
        </div>
      </div>
    </div>
  );
};
