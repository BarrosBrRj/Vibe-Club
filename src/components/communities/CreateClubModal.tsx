import React, { useState, useRef } from 'react';
import { 
  Users, Compass, Building2, Camera, Upload, 
  X, Check, Lock, Globe, EyeOff, Sparkles, Image as ImageIcon
} from 'lucide-react';
import { CommunityType, GroupPrivacy } from '../../types';

interface CreateClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: CommunityType;
  onCreate: (data: {
    name: string;
    description: string;
    category: string;
    logo: string;
    coverImage: string;
    rules: string[];
    privacy: GroupPrivacy;
    type: CommunityType;
  }) => void;
}

const CATEGORIES = [
  'Amizade', 'Música', 'Games', 'Nostalgia 2000s', 'Cinema & TV', 
  'Tecnologia', 'Esportes', 'Cultura & Arte', 'Humor & Memes', 
  'Livros & Poesia', 'Animais & Pets', 'Culinária & Gastronomia', 
  'Negócios & Carreira', 'Viagens', 'Estilo de Vida'
];

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80'
];

const PRESET_LOGOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&auto=format&fit=crop&q=80'
];

export const CreateClubModal: React.FC<CreateClubModalProps> = ({
  isOpen,
  onClose,
  initialType = 'community',
  onCreate
}) => {
  // 1. Unified interface with 3 options at the top (chips / tabs)
  const [selectedType, setSelectedType] = useState<CommunityType>(initialType);

  // Sync selectedType when initialType or isOpen changes
  React.useEffect(() => {
    if (isOpen && initialType) {
      setSelectedType(initialType);
    }
  }, [isOpen, initialType]);

  // Common fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Amizade');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0]);
  const [logo, setLogo] = useState(PRESET_LOGOS[0]);
  const [privacy, setPrivacy] = useState<GroupPrivacy>('public');
  const [rulesText, setRulesText] = useState('Respeito mútuo entre todos os participantes.\nProibido spam e mensagens ofensivas.');

  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    const rules = rulesText
      .split('\n')
      .map(r => r.trim())
      .filter(Boolean);

    onCreate({
      name: name.trim(),
      description: description.trim(),
      category,
      logo,
      coverImage,
      rules,
      privacy,
      type: selectedType
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 font-sans backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-3.5 px-5 bg-gradient-to-r from-purple-50 via-pink-50 to-white border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-purple-600" />
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
              Criar Novo Espaço no Vibe Clube
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-600 cursor-pointer text-xs font-bold px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Fechar ✕
          </button>
        </div>

        {/* 1. TELA DE CRIAÇÃO: 3 OPÇÕES NO TOPO */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-100">
          <label className="text-xs font-bold text-slate-700 block mb-2">
            Tipo de espaço:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Opção 1: Criar Grupo */}
            <button
              type="button"
              onClick={() => {
                setSelectedType('group');
                setPrivacy('private'); // default recommended for groups
              }}
              className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedType === 'group'
                  ? 'border-purple-600 bg-purple-50 shadow-sm ring-2 ring-purple-200'
                  : 'border-slate-200 bg-white hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Users className={`w-4 h-4 ${selectedType === 'group' ? 'text-purple-600' : 'text-slate-500'}`} />
                <span className="font-extrabold text-xs text-slate-900">Criar Grupo</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Espaço fechado/privado entre membros com foco em conversas diretas.
              </p>
            </button>

            {/* Opção 2: Criar Comunidade */}
            <button
              type="button"
              onClick={() => {
                setSelectedType('community');
                setPrivacy('public');
              }}
              className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedType === 'community'
                  ? 'border-purple-600 bg-purple-50 shadow-sm ring-2 ring-purple-200'
                  : 'border-slate-200 bg-white hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Compass className={`w-4 h-4 ${selectedType === 'community' ? 'text-purple-600' : 'text-slate-500'}`} />
                <span className="font-extrabold text-xs text-slate-900">Criar Comunidade</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Espaço temático aberto do Vibe Clube com fórum de tópicos, enquetes e debates.
              </p>
            </button>

            {/* Opção 3: Criar Página */}
            <button
              type="button"
              onClick={() => {
                setSelectedType('page');
                setPrivacy('public');
              }}
              className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedType === 'page'
                  ? 'border-purple-600 bg-purple-50 shadow-sm ring-2 ring-purple-200'
                  : 'border-slate-200 bg-white hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Building2 className={`w-4 h-4 ${selectedType === 'page' ? 'text-purple-600' : 'text-slate-500'}`} />
                <span className="font-extrabold text-xs text-slate-900">Criar Página</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Perfil público para marcas, negócios ou artistas com seguidores.
              </p>
            </button>
          </div>
        </div>

        {/* 2. CAMPOS COMUNS DE CRIAÇÃO */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1">
          
          {/* Nome e Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nome {selectedType === 'group' ? 'do Grupo' : selectedType === 'page' ? 'da Página' : 'da Comunidade'}:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  selectedType === 'group'
                    ? 'Ex: Turma da Faculdade 2008'
                    : selectedType === 'page'
                    ? 'Ex: Banda Retrô Hits Brasil'
                    : 'Ex: Eu Odeio Acordar Cedo'
                }
                required
                className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Categoria / Tema:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Descrição:
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explique do que se trata este espaço, os objetivos e como interagir..."
              required
              className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-normal resize-none"
            />
          </div>

          {/* UPLOAD DE CAPA (Banner Largo) */}
          <div className="p-4 bg-purple-50/40 rounded-2xl border border-purple-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-purple-600" />
                <span>Foto de Capa (Banner Largo):</span>
              </label>
              <span className="text-[11px] text-purple-700 font-semibold">Capa com overlay suave</span>
            </div>

            {/* Banner preview with overlay */}
            <div className="relative h-28 sm:h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
              <img src={coverImage} alt="Capa" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-3 text-white text-xs font-bold drop-shadow-md">
                {name || 'Nome do Espaço'}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5 text-purple-600" />
                <span>Enviar Imagem</span>
              </button>

              <div className="flex items-center gap-1 overflow-x-auto py-1">
                {PRESET_COVERS.slice(0, 4).map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCoverImage(url)}
                    className={`w-12 h-8 rounded-lg overflow-hidden border-2 shrink-0 transition-transform ${
                      coverImage === url ? 'border-purple-600 scale-105 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* UPLOAD DE FOTO DE PERFIL / ÍCONE */}
          <div className="p-4 bg-purple-50/40 rounded-2xl border border-purple-100 space-y-2.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
              <span>Foto de Perfil / Ícone do Espaço:</span>
            </label>

            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt="Ícone"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-400 shadow-sm bg-white shrink-0"
              />
              <div className="space-y-2">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-purple-600" />
                  <span>Upload de Ícone</span>
                </button>
                <div className="flex gap-1.5">
                  {PRESET_LOGOS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLogo(url)}
                      className={`w-7 h-7 rounded-lg overflow-hidden border-2 ${
                        logo === url ? 'border-purple-600' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img src={url} alt="Preset logo" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PRIVACIDADE (Pública / Privada / Secreta estilo Facebook Groups) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Configuração de Privacidade:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Pública */}
              <button
                type="button"
                onClick={() => setPrivacy('public')}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  privacy === 'public'
                    ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 mb-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pública</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Qualquer pessoa pode encontrar o espaço, ver os membros e ler as publicações.
                </p>
              </button>

              {/* Privada */}
              <button
                type="button"
                onClick={() => setPrivacy('private')}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  privacy === 'private'
                    ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 mb-1">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Privada</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Qualquer um pode encontrar, mas apenas membros aprovados veem posts e interagem.
                </p>
              </button>

              {/* Secreta */}
              <button
                type="button"
                onClick={() => setPrivacy('secret')}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  privacy === 'secret'
                    ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 mb-1">
                  <EyeOff className="w-3.5 h-3.5 text-purple-600" />
                  <span>Secreta</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Apenas membros convidados podem encontrar o grupo e ver seu conteúdo.
                </p>
              </button>
            </div>
          </div>

          {/* Regras de Convivência */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Regras do Espaço (uma por linha):
            </label>
            <textarea
              rows={2}
              value={rulesText}
              onChange={(e) => setRulesText(e.target.value)}
              className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-normal resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 bg-slate-50/80 p-3.5 -mx-4 -mb-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:underline cursor-pointer font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !description.trim()}
              className="vibe-btn flex items-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs py-1.5 px-4"
            >
              <Check className="w-3.5 h-3.5" />
              <span>
                {selectedType === 'group' ? 'Criar Grupo' : selectedType === 'page' ? 'Criar Página' : 'Criar Comunidade'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
