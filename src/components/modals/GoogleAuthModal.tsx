import React, { useState, useEffect } from 'react';
import { 
  X, Shield, Loader2, Sparkles, ArrowRight, CheckCircle2, 
  Mail, Lock, User as UserIcon, Plus, Trash2, Check, ExternalLink,
  Flame, Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { loginWithFirebaseGoogle } from '../../lib/firebase';

export const GoogleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export interface SavedGoogleAccount {
  id: string;
  email: string;
  name: string;
  avatar: string;
  lastLogin?: string;
}

export const GoogleAuthModal: React.FC = () => {
  const { 
    isGoogleAuthModalOpen, 
    setIsGoogleAuthModalOpen, 
    loginWithGoogle,
    showToast,
    currentUser
  } = useApp();

  const [savedAccounts, setSavedAccounts] = useState<SavedGoogleAccount[]>(() => {
    try {
      const stored = localStorage.getItem('vibe_google_accounts_list');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Conectando ao Firebase e Google...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('vibe_google_accounts_list', JSON.stringify(savedAccounts));
    } catch {
      // ignore
    }
  }, [savedAccounts]);

  if (!isGoogleAuthModalOpen) return null;

  const handleFirebaseSignIn = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    setLoadingMsg('Abrindo popup oficial do Google (Firebase Authentication)...');

    try {
      const firebaseUser = await loginWithFirebaseGoogle();

      if (firebaseUser && firebaseUser.email) {
        const derivedName = firebaseUser.displayName || firebaseUser.email.split('@')[0];
        const newAvatar = firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(firebaseUser.email)}`;

        const newAcc: SavedGoogleAccount = {
          id: 'g_' + firebaseUser.uid,
          email: firebaseUser.email,
          name: derivedName,
          avatar: newAvatar,
          lastLogin: 'Autenticado via Firebase'
        };

        setSavedAccounts(prev => {
          const filtered = prev.filter(a => a.email.toLowerCase() !== firebaseUser.email!.toLowerCase());
          return [newAcc, ...filtered];
        });

        loginWithGoogle({
          name: derivedName,
          email: firebaseUser.email,
          avatar: newAvatar
        });

        setIsGoogleAuthModalOpen(false);
        showToast(`Bem-vindo, ${derivedName}! Login efetuado com sucesso via Firebase. ✨`, 'success');
      }
    } catch (err: any) {
      console.error('Erro na autenticação Firebase:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMessage('A janela de login do Google foi fechada antes da conclusão.');
      } else if (err?.code === 'auth/popup-blocked') {
        setErrorMessage('O navegador bloqueou o pop-up do Google. Por favor, permita pop-ups para este site.');
      } else if (err?.code === 'auth/cancelled-popup-request') {
        setErrorMessage('A solicitação de login foi cancelada.');
      } else {
        setErrorMessage(err?.message || 'Falha ao autenticar com o Firebase.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSavedAccount = (account: SavedGoogleAccount) => {
    setErrorMessage(null);
    setIsLoading(true);
    setLoadingMsg(`Entrando como ${account.name} (${account.email})...`);

    setTimeout(() => {
      loginWithGoogle({
        name: account.name,
        email: account.email,
        avatar: account.avatar
      });
      setIsLoading(false);
      setIsGoogleAuthModalOpen(false);
      showToast(`Conectado como ${account.name}! 🌟`, 'success');
    }, 400);
  };

  const handleRemoveAccount = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedAccounts(prev => prev.filter(a => a.id !== id));
    showToast('Conta removida do histórico do dispositivo.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-7 relative my-8 animate-in fade-in zoom-in-95 font-sans">
        
        {/* Close Button */}
        {!isLoading && (
          <button
            onClick={() => {
              setIsGoogleAuthModalOpen(false);
              setErrorMessage(null);
            }}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-md border border-slate-100 flex items-center justify-center mx-auto">
            <GoogleIcon className="w-7 h-7" />
          </div>
          
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Fazer login com o Google
          </h2>
          
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Autenticação direta e segura via Firebase Authentication
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <span>⚠️ Atenção:</span>
            </p>
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="py-8 text-center space-y-4">
            <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
              <GoogleIcon className="w-5 h-5 absolute" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-800">{loadingMsg}</p>
              <p className="text-xs text-slate-400 mt-1">Firebase GoogleAuthProvider • SSL/TLS Criptografado</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Primary Firebase Sign-In Button */}
            <button
              type="button"
              id="btn-firebase-google-signin"
              onClick={handleFirebaseSignIn}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <GoogleIcon className="w-5 h-5 bg-white p-0.5 rounded-full" />
              <span>Entrar com o Google (Popup Oficial)</span>
            </button>

            {/* List of previously logged-in accounts on this device */}
            {savedAccounts.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  Contas autenticadas recentemente:
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {savedAccounts.map((account) => {
                    const isCurrentActive = currentUser?.email.toLowerCase() === account.email.toLowerCase();
                    return (
                      <div
                        key={account.id}
                        onClick={() => handleSelectSavedAccount(account)}
                        className="w-full p-3 rounded-2xl border-2 border-slate-200 hover:border-purple-500 bg-white hover:bg-purple-50/40 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="relative shrink-0">
                            <img
                              src={account.avatar}
                              alt={account.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-purple-400 shadow-xs group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-xs">
                              <GoogleIcon className="w-2.5 h-2.5" />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1 text-left">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-slate-900 group-hover:text-purple-900 truncate">
                                {account.name}
                              </span>
                              {isCurrentActive && (
                                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md shrink-0">
                                  Ativa
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate font-medium">
                              {account.email}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="p-1.5 rounded-xl bg-purple-600 group-hover:bg-purple-700 text-white shadow-xs">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveAccount(account.id, e)}
                            className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                            title="Remover do histórico"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Privacy & Security Note */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Segurança Firebase & Google Auth</span>
              </div>
              <p className="leading-relaxed">
                Suas credenciais são gerenciadas diretamente pelos servidores do Google através do Firebase SDK.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
