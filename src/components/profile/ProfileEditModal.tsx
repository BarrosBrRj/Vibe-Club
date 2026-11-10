import React, { useState, useRef } from 'react';
import { 
  X, Check, User as UserIcon, Camera, Upload, 
  MapPin, Heart, Music, Film, BookOpen, Quote, 
  Sparkles, Tag, Smile
} from 'lucide-react';
import { User, RelationshipStatus } from '../../types';
import { compressImage } from '../../utils/imageCompressor';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedFields: Partial<User>) => void;
}

const RELATIONSHIP_OPTIONS: { value: RelationshipStatus; label: string }[] = [
  { value: 'single', label: 'Solteiro(a)' },
  { value: 'dating', label: 'Namorando' },
  { value: 'married', label: 'Casado(a)' },
  { value: 'complicated', label: 'É complicado' },
  { value: 'open', label: 'Relacionamento aberto' }
];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'orkut' | 'interests'>('basic');

  // Basic info
  const [name, setName] = useState(user.name || '');
  const [username, setUsername] = useState(user.username || '');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [coverImage, setCoverImage] = useState(user.coverImage || '');
  const [bio, setBio] = useState(user.bio || '');
  const [city, setCity] = useState(user.city || '');

  // Orkut fields
  const [whoAmI, setWhoAmI] = useState(user.orkutFields?.whoAmI || user.bio || '');
  const [hobbies, setHobbies] = useState(() => {
    const raw = user.orkutFields?.hobbies;
    if (Array.isArray(raw)) return raw.join(', ');
    return typeof raw === 'string' ? raw : '';
  });
  const [music, setMusic] = useState(user.orkutFields?.music || '');
  const [movies, setMovies] = useState(user.orkutFields?.movies || '');
  const [books, setBooks] = useState(user.orkutFields?.books || '');
  const [quote, setQuote] = useState(user.orkutFields?.quote || '');
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus>(
    (user.orkutFields?.relationshipStatus as RelationshipStatus) || 'single'
  );

  // Interests list
  const [interests, setInterests] = useState<string[]>(user.interests || []);
  const [newInterestInput, setNewInterestInput] = useState('');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImage(file, 360, 0.88);
      if (compressed) setAvatar(compressed);
    }
  };

  const handleCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImage(file, 800, 0.82);
      if (compressed) setCoverImage(compressed);
    }
  };

  const handleAddInterest = () => {
    const trimmed = newInterestInput.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setNewInterestInput('');
    }
  };

  const handleRemoveInterest = (item: string) => {
    setInterests(interests.filter(i => i !== item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim() || user.name,
      username: username.trim().replace(/[^a-zA-Z0-9_]/g, '') || user.username,
      avatar: avatar.trim() || user.avatar,
      coverImage: coverImage.trim() || user.coverImage,
      bio: bio.trim() || whoAmI.trim() || user.bio,
      city: city.trim() || user.city,
      interests,
      orkutFields: {
        whoAmI: whoAmI.trim() || bio.trim(),
        hobbies: hobbies.trim(),
        music: music.trim(),
        movies: movies.trim(),
        books: books.trim(),
        quote: quote.trim(),
        relationshipStatus
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-sans animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-3.5 px-5 bg-gradient-to-r from-purple-50 via-pink-50 to-white border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Editar Meu Perfil</h3>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-full">Vibe Clube</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer text-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-4 border-b border-slate-200 flex gap-1.5 pt-2 bg-slate-50/70">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'basic'
                ? 'bg-white text-purple-800 border-b-2 border-purple-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Dados Principais & Fotos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orkut')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'orkut'
                ? 'bg-white text-purple-800 border-b-2 border-purple-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Ficha Pessoal (Gostos & Sobre)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('interests')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'interests'
                ? 'bg-white text-purple-800 border-b-2 border-purple-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Interesses & Tags
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 space-y-4 flex-1">
          {activeTab === 'basic' && (
            <div className="space-y-4">
              {/* Fotos Preview & Upload */}
              <div className="p-4 bg-purple-50/40 rounded-2xl border border-purple-100 space-y-3">
                <span className="text-xs font-bold text-purple-900 block">Fotos de Exibição</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Avatar Upload */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 block">Foto de Perfil (Avatar Circular):</label>
                    <div className="flex items-center gap-3">
                      <img
                        src={avatar || user.avatar}
                        alt="Avatar preview"
                        className="w-14 h-14 rounded-full object-cover border-2 border-purple-400 shadow-xs"
                      />
                      <div className="flex-1">
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFile}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:border-purple-400 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5 text-purple-600" />
                          <span>Alterar Foto</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Cover Upload */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 block">Foto de Capa (Banner):</label>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shrink-0">
                        <img
                          src={coverImage || user.coverImage}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                          style={{ objectPosition: `center ${user.coverPositionY ?? 50}%` }}
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          ref={coverInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleCoverFile}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:border-purple-400 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Camera className="w-3.5 h-3.5 text-pink-600" />
                          <span>Alterar Capa</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Name and Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nome Completo:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nome de Usuário (@):</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                  />
                </div>
              </div>

              {/* Bio & City */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Biografia Resumida:</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Escreva uma frase marcante sobre você..."
                  className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Cidade / Região:</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-purple-600 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Curitiba, PR"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orkut' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-pink-50/60 rounded-xl border border-pink-100 flex items-center gap-2 text-pink-900 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-pink-600 shrink-0" />
                <span>Esta seção alimenta a sua ficha pessoal e aba Sobre no Vibe Clube!</span>
              </div>

              {/* Status de relacionamento */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Status de Relacionamento:</span>
                </label>
                <select
                  value={relationshipStatus}
                  onChange={(e) => setRelationshipStatus(e.target.value as RelationshipStatus)}
                  className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium cursor-pointer"
                >
                  {RELATIONSHIP_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Quem sou eu */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-purple-600" />
                  <span>Quem Sou Eu:</span>
                </label>
                <textarea
                  rows={3}
                  value={whoAmI}
                  onChange={(e) => setWhoAmI(e.target.value)}
                  placeholder="Descreva sua personalidade, estilo de vida e manias..."
                  className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden"
                />
              </div>

              {/* O que gosto de fazer */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">O Que Gosto de Fazer (Hobbies & Atividades):</label>
                <input
                  type="text"
                  value={hobbies}
                  onChange={(e) => setHobbies(e.target.value)}
                  placeholder="Ex: Tocar violão, andar de skate, fotografar, tomar café..."
                  className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                />
              </div>

              {/* Músicas favoritas */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-purple-600" />
                  <span>Músicas & Bandas Favoritas:</span>
                </label>
                <input
                  type="text"
                  value={music}
                  onChange={(e) => setMusic(e.target.value)}
                  placeholder="Ex: Charlie Brown Jr, Linkin Park, Pitty, Daft Punk..."
                  className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                />
              </div>

              {/* Filmes e Séries */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-purple-600" />
                  <span>Filmes & Séries Favoritos:</span>
                </label>
                <input
                  type="text"
                  value={movies}
                  onChange={(e) => setMovies(e.target.value)}
                  placeholder="Ex: Matrix, De Volta Para o Futuro, Lost, Friends..."
                  className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                />
              </div>

              {/* Livros */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                  <span>Livros & Leituras:</span>
                </label>
                <input
                  type="text"
                  value={books}
                  onChange={(e) => setBooks(e.target.value)}
                  placeholder="Ex: O Senhor dos Anéis, Harry Potter, 1984..."
                  className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                />
              </div>

              {/* Frase / Citação */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5 text-purple-600" />
                  <span>Frase Marcante / Filosofia de Vida:</span>
                </label>
                <input
                  type="text"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Ex: O segredo é ter fé em Deus..."
                  className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                />
              </div>
            </div>
          )}

          {activeTab === 'interests' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-purple-600" />
                  <span>Adicionar Novo Interesse:</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInterestInput}
                    onChange={(e) => setNewInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInterest();
                      }
                    }}
                    placeholder="Ex: Fotografia analógica, Games retrô, Animes..."
                    className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">Interesses Atuais ({interests.length}):</span>
                <div className="flex flex-wrap gap-2">
                  {interests.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full border border-purple-200 flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(item)}
                        className="w-3.5 h-3.5 rounded-full hover:bg-purple-200 text-purple-600 flex items-center justify-center cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Submit Action Bar */}
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/80 p-3.5 -mx-4 -mb-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:underline cursor-pointer font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="vibe-btn flex items-center gap-1.5 cursor-pointer text-xs py-1.5 px-4"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
