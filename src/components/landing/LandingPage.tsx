import React from 'react';
import { 
  Sparkles, Users, Compass, Heart, Gamepad2, 
  Award, ShieldCheck, ArrowRight, CheckCircle2, 
  MessageSquare, Star, Flame, Eye, Lock, Globe 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GoogleIcon } from '../modals/GoogleAuthModal';

export const LandingPage: React.FC = () => {
  const { setIsAuthModalOpen, setAuthModalMode, openGoogleAuthModal, loginAsGuest } = useApp();

  const handleOpenSignup = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleOpenLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 w-full max-w-full overflow-x-hidden selection:bg-purple-500 selection:text-white m-0 p-0">
      
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 w-full max-w-full">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center p-1 border border-purple-500/40 shadow-lg shadow-purple-500/30 overflow-hidden shrink-0">
              <img src="/icon.svg" alt="Vibe Clube Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                VIBE CLUBE
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold text-slate-400 ml-2 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                Brasil 🇧🇷
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenLogin}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Já tenho conta
            </button>
            <button
              onClick={handleOpenSignup}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-purple-500/25 active:scale-95 transition-all cursor-pointer"
            >
              Criar Conta Grátis
            </button>
          </div>

        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        
        {/* Glow backdrop bubbles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/20 blur-[130px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-pink-600/15 blur-[120px] rounded-full -z-10 pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-bold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>A NOVA REDE SOCIAL BRASILEIRA</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
            Conecte-se. Faça amigos.{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              Viva a sua vibe.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Reunimos a sensação inesquecível de comunidade e nostalgia dos anos 2000 com um design moderno, seguro e autêntico.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openGoogleAuthModal('signup')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm sm:text-base border border-slate-200 shadow-xl shadow-white/5 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <GoogleIcon className="w-5 h-5" />
              <span>Criar Conta com o Google</span>
            </button>

            <button
              onClick={handleOpenSignup}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-sm sm:text-base shadow-xl shadow-purple-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Cadastro com E-mail</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={loginAsGuest}
              className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-purple-400" />
              <span>Visitante</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Gratuito</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sem algoritmos tóxicos</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Comunidades reais</span>
          </div>

        </div>

        {/* 3. Floating Nostalgic UI Interactive Preview Deck */}
        <div className="mt-14 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Perfil & Depoimentos */}
          <div className="p-5 rounded-3xl bg-slate-800/80 border border-purple-500/30 backdrop-blur-md shadow-2xl space-y-3">
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80" alt="Avatar" className="w-12 h-12 rounded-2xl object-cover border-2 border-pink-400" />
              <div>
                <div className="font-extrabold text-sm text-white">Camila Rocha</div>
                <div className="text-xs text-purple-300">@camilavibe • São Paulo</div>
              </div>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-pink-500/20 text-xs text-slate-300 italic">
              "💌 Depoimento: Amiga de infância incrível! O Vibe Clube me fez lembrar dos velhos tempos!"
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Nível 8 • 1.250 XP</span>
              <span className="text-pink-400 font-bold">Tema: Sunset Tropical</span>
            </div>
          </div>

          {/* Card 2: Comunidades & Fóruns */}
          <div className="p-5 rounded-3xl bg-slate-800/80 border border-purple-500/30 backdrop-blur-md shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase">
              <Compass className="w-4 h-4" />
              <span>Comunidade em Alta</span>
            </div>
            <h3 className="font-extrabold text-base text-white">🎸 Rock Nacional Anos 80, 90 & 2000</h3>
            <p className="text-xs text-slate-300">
              Fórum ativo com mais de 12.800 membros discutindo clássicos, vinis e shows inesquecíveis.
            </p>
            <div className="p-2.5 bg-slate-900/80 rounded-xl text-xs text-purple-200 border border-purple-500/20">
              📌 Tópico fixado: Qual o melhor álbum nacional de todos os tempos?
            </div>
          </div>

          {/* Card 3: Arcade & Encontros */}
          <div className="p-5 rounded-3xl bg-slate-800/80 border border-purple-500/30 backdrop-blur-md shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-pink-400 uppercase flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-pink-400" /> Vibe Encontros
              </span>
              <span className="text-[10px] bg-pink-500 text-white font-bold px-2 py-0.5 rounded-full">
                18+
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Conecte-se com pessoas com os mesmos gostos musicais e vibrações na sua cidade.
            </p>
            <div className="p-3 bg-indigo-950/60 rounded-2xl border border-indigo-500/30 flex items-center justify-between text-xs font-bold">
              <span className="text-indigo-200 flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-amber-400" /> Vibe Arcade
              </span>
              <span className="text-amber-400">🐍 Cobrinha & Jogos</span>
            </div>
          </div>

        </div>

      </section>

      {/* 4. Pillars / Features Section */}
      <section className="py-20 bg-slate-950 border-t border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-extrabold tracking-widest text-purple-400 uppercase">
              RECURSOS INCRÍVEIS
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              Tudo o que você sempre amou em uma rede social
            </h3>
            <p className="text-slate-400 text-sm sm:text-base">
              Desenvolvido com foco no afeto, nas conversas de verdade e na liberdade de ser você mesmo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-900/50 text-purple-400 flex items-center justify-center text-xl">
                💌
              </div>
              <h4 className="font-extrabold text-lg text-white">Depoimentos & Mural</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Deixe recados cheios de emojis no mural dos seus amigos e escreva depoimentos sinceros que só aparecem após aprovação.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-900/50 text-pink-400 flex items-center justify-center text-xl">
                🏘️
              </div>
              <h4 className="font-extrabold text-lg text-white">Comunidades & Fóruns</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Debates organizados por categorias como música, filmes, games e humor com tópicos, enquetes e respostas sem limite de caracteres.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-900/50 text-amber-400 flex items-center justify-center text-xl">
                🎨
              </div>
              <h4 className="font-extrabold text-lg text-white">Perfil 100% Personalizável</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Escolha temas de cores retrô (Nostalgia 2000, Sunset, Cyberpunk), molduras douradas para avatar, música favorita e biografia.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-900/50 text-rose-400 flex items-center justify-center text-xl">
                💘
              </div>
              <h4 className="font-extrabold text-lg text-white">Vibe Encontros (18+)</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Descubra pessoas interessantes com filtros por cidade, gostos e afinidades com respeito mútuo e segurança.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-900/50 text-indigo-400 flex items-center justify-center text-xl">
                🕹️
              </div>
              <h4 className="font-extrabold text-lg text-white">Vibe Arcade</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Jogue Cobrinha clássica, Jogo da Memória e desafie seus amigos no ranking nacional do clube.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/50 text-emerald-400 flex items-center justify-center text-xl">
                🏆
              </div>
              <h4 className="font-extrabold text-lg text-white">Gamificação & Moeda Vibes</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Ganhe XP a cada interação, suba de nível, ganhe medalhas raras e envie presentes virtuais com a moeda Vibes.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Call To Action Footer */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-800 via-pink-700 to-amber-600 text-white shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black">
            Pronto para encontrar a sua turma?
          </h2>
          <p className="text-sm sm:text-base text-purple-100 max-w-xl mx-auto leading-relaxed">
            Crie sua conta em menos de 1 minuto e comece a participar das maiores comunidades e amizades do Brasil.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => openGoogleAuthModal('signup')}
              className="w-full sm:w-auto px-7 py-4 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black text-sm sm:text-base shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <GoogleIcon className="w-5 h-5" />
              <span>Cadastrar com o Google</span>
            </button>
            <button
              onClick={handleOpenSignup}
              className="w-full sm:w-auto px-7 py-4 bg-purple-950/80 hover:bg-purple-950 text-white border border-purple-400/40 rounded-2xl font-bold text-sm sm:text-base active:scale-95 transition-transform cursor-pointer"
            >
              Criar Conta com E-mail 🚀
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500 space-y-2 pt-6">
          <p>© 2026 Vibe Clube • A Nova Rede Social Brasileira 🇧🇷 • Em conformidade com a LGPD</p>
          <p>Conecte-se. Faça amigos. Viva a sua vibe.</p>
        </div>
      </section>

    </div>
  );
};
