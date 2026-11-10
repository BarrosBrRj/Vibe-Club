import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { 
  ANIMATED_EMOJIS, 
  EMOJI_CATEGORIES, 
  EmojiCategory, 
  AnimatedEmojiItem 
} from '../../lib/animatedEmojis';
import { AnimatedEmoji } from '../common/AnimatedEmoji';

interface AnimatedEmojiPickerProps {
  onSelectEmoji: (char: string, codepoint: string) => void;
  onClose?: () => void;
  className?: string;
}

export const AnimatedEmojiPicker: React.FC<AnimatedEmojiPickerProps> = ({
  onSelectEmoji,
  onClose,
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EmojiCategory>('carinhas');
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtragem rápida por busca e categoria
  const filteredEmojis = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      return ANIMATED_EMOJIS.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.char.includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return ANIMATED_EMOJIS.filter(item => item.category === selectedCategory);
  }, [searchQuery, selectedCategory]);

  return (
    <div 
      ref={containerRef}
      className={`bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col w-full max-w-[360px] sm:w-88 transition-all animate-in fade-in zoom-in-95 duration-150 ${className}`}
      style={{ maxHeight: '380px' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Header & Search */}
      <div className="p-2.5 pb-2 border-b border-slate-100 bg-slate-50/80 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <span className="text-base">😀</span>
            <span>Emoticons Animados</span>
            <span className="text-[10px] font-semibold text-purple-600 bg-purple-100/70 px-1.5 py-0.5 rounded-md">
              Google Noto
            </span>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Input de Busca */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar emoticon (ex: coração, festa, rir)..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-white rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-400 outline-hidden transition-all text-slate-800 placeholder-slate-400"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Abas de Categoria (oculta durante busca ativa) */}
        {!searchQuery && (
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
            {EMOJI_CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-purple-600 text-white shadow-xs scale-102' 
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  <span className="text-xs">{cat.icon}</span>
                  <span className="text-[11px]">{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid de Emojis Animados */}
      <div className="flex-1 overflow-y-auto p-2.5 grid grid-cols-6 sm:grid-cols-7 gap-1.5 content-start">
        {filteredEmojis.length > 0 ? (
          filteredEmojis.map((item) => (
            <button
              key={`${item.code}-${item.char}`}
              type="button"
              onClick={() => onSelectEmoji(item.char, item.code)}
              title={item.name}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center hover:bg-purple-50 active:scale-90 hover:scale-110 transition-transform cursor-pointer group border border-transparent hover:border-purple-200"
            >
              <AnimatedEmoji
                char={item.char}
                codepoint={item.code}
                size="md"
                className="group-hover:scale-110"
              />
            </button>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-slate-400 space-y-1">
            <p className="text-xs font-semibold">Nenhum emoticon encontrado</p>
            <p className="text-[11px]">Tente buscar por outro termo ou categoria</p>
          </div>
        )}
      </div>

      {/* Footer Dica */}
      <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
        <span>Toque para inserir no texto</span>
        <span className="flex items-center gap-1 text-purple-600 font-semibold">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Animação automática
        </span>
      </div>
    </div>
  );
};
