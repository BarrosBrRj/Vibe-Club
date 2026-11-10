import React, { useState } from 'react';
import { 
  Sparkles, X, Mail, Lock, User as UserIcon, 
  MapPin, Calendar, Check, ArrowRight, ShieldCheck, Heart 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GoogleIcon } from './GoogleAuthModal';
import { OnboardingModal } from './OnboardingModal';

export const AuthModals: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    login, 
    openGoogleAuthModal,
    showToast 
  } = useApp();

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  if (!isAuthModalOpen) return null;

  // If in signup mode, render the 8-step Onboarding / Cadastro flow
  if (authModalMode === 'signup') {
    return (
      <OnboardingModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSwitchToLogin={() => setAuthModalMode('login')}
      />
    );
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      showToast('Preencha seu e-mail e senha.', 'error');
      return;
    }
    login(loginEmail.trim(), loginPassword);
  };

  const handleDemoLogin = (emailPreset: string) => {
    login(emailPreset, '123456');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative my-8 animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center p-1.5 mx-auto border border-purple-500/30 shadow-md shadow-purple-500/20 overflow-hidden">
            <img src="/icon.svg" alt="Vibe Clube Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Bem-vindo de volta!
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Entre na sua conta para acessar seus recados, comunidades e amizades.
          </p>
        </div>

        {/* LOGIN FORM */}
        <div className="space-y-4">
          {/* Google Login Button */}
          <button
            type="button"
            onClick={() => openGoogleAuthModal('login')}
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs sm:text-sm rounded-2xl border-2 border-slate-200 hover:border-purple-300 shadow-xs flex items-center justify-center gap-3 transition-all active:scale-98 cursor-pointer group"
          >
            <GoogleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Continuar com o Google</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="shrink mx-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              ou acesse com e-mail
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">E-mail ou Usuário</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="usuario@vibeclube.com ou @carlos"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Senha</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Sua senha secreta"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-purple-500/25 active:scale-95 transition-all cursor-pointer"
            >
              Entrar no Vibe Clube ✨
            </button>

            {/* Quick Demo Logins */}
            <div className="pt-2 border-t border-slate-100 text-center space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Ou acesse instantaneamente com perfis de teste:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('carlos@vibeclube.com')}
                  className="flex-1 p-2 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80" alt="Carlos" className="w-6 h-6 rounded-full object-cover" />
                  <span className="truncate">Carlos (São Paulo)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('camila@vibeclube.com')}
                  className="flex-1 p-2 bg-pink-50 hover:bg-pink-100 text-pink-800 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" alt="Camila" className="w-6 h-6 rounded-full object-cover" />
                  <span className="truncate">Camila (Curitiba)</span>
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthModalMode('signup')}
                className="text-xs text-purple-700 font-bold hover:underline cursor-pointer"
              >
                Ainda não tem conta? Crie agora mesmo
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

