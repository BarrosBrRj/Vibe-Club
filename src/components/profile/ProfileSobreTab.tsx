import React from 'react';
import { Edit3, UserCheck, Sparkles, Briefcase, Heart } from 'lucide-react';
import { User } from '../../types';

interface ProfileSobreTabProps {
  user: User;
  isOwnProfile: boolean;
  onOpenEditModal: () => void;
  subCategory?: 'social' | 'professional' | 'personal';
}

const RELATIONSHIP_LABELS: Record<string, string> = {
  single: 'Solteiro(a)',
  dating: 'Namorando',
  married: 'Casado(a)',
  complicated: 'É complicado',
  open: 'Relacionamento aberto'
};

export const ProfileSobreTab: React.FC<ProfileSobreTabProps> = ({
  user,
  isOwnProfile,
  onOpenEditModal,
  subCategory = 'social'
}) => {
  const fields = user.orkutFields;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-white px-4 py-2.5 border-b border-purple-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {subCategory === 'social' ? (
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          ) : subCategory === 'professional' ? (
            <Briefcase className="w-3.5 h-3.5 text-purple-600" />
          ) : (
            <Heart className="w-3.5 h-3.5 text-pink-600" />
          )}
          <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
            Ficha Pessoal ({subCategory === 'social' ? 'Social & Gostos' : subCategory === 'professional' ? 'Profissional' : 'Pessoal'})
          </span>
        </div>
        {isOwnProfile && (
          <button
            onClick={onOpenEditModal}
            className="text-purple-700 hover:text-purple-900 text-xs font-bold cursor-pointer flex items-center gap-1.5 hover:underline"
          >
            <Edit3 className="w-3 h-3" />
            <span>Editar informações</span>
          </button>
        )}
      </div>

      {/* Two-Column Definition Table */}
      <div className="p-4 sm:p-6 text-sm sm:text-base text-slate-800 space-y-2">
        
        {/* SOCIAL VIEW */}
        {subCategory === 'social' && (
          <table className="w-full border-collapse">
            <tbody>
              
              <tr className="align-top border-b border-slate-50">
                <td className="w-36 sm:w-44 pr-4 py-2 text-right font-bold text-slate-500 whitespace-nowrap">
                  Status de relacionamento:
                </td>
                <td className="py-2 text-slate-900 font-semibold">
                  {fields?.relationshipStatus ? RELATIONSHIP_LABELS[fields.relationshipStatus] || fields.relationshipStatus : 'Solteiro(a)'}
                </td>
              </tr>

              <tr className="align-top border-b border-slate-50">
                <td className="pr-4 py-2 text-right font-bold text-slate-500 whitespace-nowrap">
                  Aqui para:
                </td>
                <td className="py-2 text-slate-800 font-normal">
                  Fazer novos amigos, paquerar e trocar ideias no Vibe Clube
                </td>
              </tr>

              <tr className="align-top border-b border-slate-50">
                <td className="pr-4 py-2 text-right font-bold text-slate-500 whitespace-nowrap">
                  Quem sou eu:
                </td>
                <td className="py-2 text-slate-800 font-normal leading-relaxed whitespace-pre-line">
                  {fields?.whoAmI || user.bio || 'Adoro conhecer pessoas incríveis, ouvir boas músicas e curtir a melhor vibe com os amigos!'}
                </td>
              </tr>

              <tr className="align-top border-b border-slate-50">
                <td className="pr-4 py-2 text-right font-bold text-slate-500 whitespace-nowrap">
                  Cidade natal:
                </td>
                <td className="py-2 text-purple-700 font-semibold">
                  {user.city || 'Brasil'}
                </td>
              </tr>

              <tr className="align-top border-b border-slate-50">
                <td className="pr-4 py-2 text-right font-bold text-slate-500 whitespace-nowrap">
                  Página web:
                </td>
                <td className="py-2 text-purple-700">
                  <span className="font-semibold hover:underline">https://vibeclube.app/@{user.username}</span>
                </td>
              </tr>

              <tr className="align-top border-b border-slate-50">
                <td className="pr-4 py-2 text-right font-bold text-slate-500 whitespace-nowrap">
                  Paixões & hobbies:
                </td>
                <td className="py-2 text-purple-700 font-medium">
                  {fields?.passions || fields?.hobbies || (
                    <span>Música, fotografia, cinema, jogos e bater papo com a galera</span>
                  )}
                </td>
              </tr>

              <tr className="align-top border-b border-slate-50">
                <td className="pr-4 py-2 text-right font-bold text-slate-500 whitespace-nowrap">
                  Músicas favoritas:
                </td>
                <td className="py-2 text-slate-800">
                  {fields?.music || fields?.favoriteMusic || 'MPB, Rock nacional, Pop, Indie e Eletrônica'}
                </td>
              </tr>

              <tr className="align-top border-b border-slate-50">
                <td className="pr-4 py-2 text-right font-bold text-slate-500 whitespace-nowrap">
                  Filmes favoritos:
                </td>
                <td className="py-2 text-slate-800">
                  {fields?.movies || fields?.favoriteMovies || 'Interestelar, Matrix, O Auto da Compadecida'}
                </td>
              </tr>

              <tr className="align-top border-b border-slate-50">
                <td className="pr-4 py-2 text-right font-bold text-slate-500 whitespace-nowrap">
                  Livros:
                </td>
                <td className="py-2 text-slate-800">
                  {fields?.books || fields?.favoriteBooks || 'Ficção científica, fantasia e biografias'}
                </td>
              </tr>

              <tr className="align-top border-b border-slate-50">
                <td className="pr-4 py-2 text-right font-bold text-slate-500 whitespace-nowrap">
                  Frase marcante:
                </td>
                <td className="py-2 text-slate-700 italic">
                  "{fields?.quote || fields?.favoriteQuotes || 'Viver e não ter a vergonha de ser feliz!'}"
                </td>
              </tr>

              <tr className="align-top border-b border-slate-50">
                <td className="pr-4 py-2 text-right font-bold text-slate-500 whitespace-nowrap">
                  Comidas favoritas:
                </td>
                <td className="py-2 text-slate-800">
                  Pizza, churrasco, pastel de feira e comida caseira
                </td>
              </tr>

              <tr className="align-top">
                <td className="pr-4 py-2 text-right font-bold text-slate-500 whitespace-nowrap">
                  Membro do clube desde:
                </td>
                <td className="py-2 text-slate-500">
                  {user.createdAt}
                </td>
              </tr>

            </tbody>
          </table>
        )}

        {/* PROFESSIONAL VIEW */}
        {subCategory === 'professional' && (
          <table className="w-full border-collapse">
            <tbody>
              <tr className="align-top border-b border-slate-50">
                <td className="w-36 sm:w-44 pr-4 py-2 text-right font-bold text-slate-500 whitespace-nowrap">
                  Ocupação:
                </td>
                <td className="py-2 text-slate-900 font-semibold">
                  Criativo(a) digital, profissional de internet & tecnologia
                </td>
              </tr>
              <tr className="align-top border-b border-slate-50">
                <td className="pr-4 py-2 text-right font-bold text-slate-500 whitespace-nowrap">
                  Formação:
                </td>
                <td className="py-2 text-slate-800 font-normal">
                  Ensino Superior / Em andamento
                </td>
              </tr>
              <tr className="align-top">
                <td className="pr-4 py-2 text-right font-bold text-slate-500 whitespace-nowrap">
                  Habilidades:
                </td>
                <td className="py-2 text-purple-700 font-semibold">
                  Comunicação, Redes Sociais, Design, Fotografia e Criatividade
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {/* PERSONAL VIEW */}
        {subCategory === 'personal' && (
          <table className="w-full border-collapse">
            <tbody>
              <tr className="align-top border-b border-slate-50">
                <td className="w-36 sm:w-44 pr-4 py-2 text-right font-bold text-slate-500 whitespace-nowrap">
                  Estilo de vida:
                </td>
                <td className="py-2 text-slate-800 font-normal">
                  Amigável, descontraído(a), fã de viagens e encontros com amigos
                </td>
              </tr>
              <tr className="align-top">
                <td className="pr-4 py-2 text-right font-bold text-slate-500 whitespace-nowrap">
                  Interesses & Tags:
                </td>
                <td className="py-2 text-purple-700 font-semibold">
                  {user.interests.join(', ')}
                </td>
              </tr>
            </tbody>
          </table>
        )}

      </div>

    </div>
  );
};
