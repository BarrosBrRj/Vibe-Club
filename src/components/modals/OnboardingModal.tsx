import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Sparkles, X, Mail, Lock, User as UserIcon, 
  MapPin, Calendar, Check, ArrowRight, ArrowLeft,
  ShieldCheck, Heart, Camera, Upload, Users, UserPlus,
  Coins, CheckCircle2, AlertCircle, Eye, EyeOff, RefreshCw,
  Search, Smartphone, Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { GoogleIcon } from './GoogleAuthModal';
import { User, Community } from '../../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

// Pre-defined interest categories
const INTEREST_CATEGORIES = [
  { id: 'musica', label: 'Música', icon: '🎵' },
  { id: 'games', label: 'Games', icon: '🎮' },
  { id: 'esportes', label: 'Esportes & Fitness', icon: '⚽' },
  { id: 'cinema', label: 'Cinema & Séries', icon: '🍿' },
  { id: 'moda', label: 'Moda & Estilo', icon: '👗' },
  { id: 'tecnologia', label: 'Tecnologia & Inovação', icon: '💻' },
  { id: 'culinaria', label: 'Culinária & Gastronomia', icon: '🍕' },
  { id: 'viagem', label: 'Viagens & Aventuras', icon: '✈️' },
  { id: 'livros', label: 'Livros & HQs', icon: '📚' },
  { id: 'arte', label: 'Arte & Design', icon: '🎨' },
  { id: 'animais', label: 'Animais & Pets', icon: '🐶' },
  { id: 'rock', label: 'Rock Nacional & Clássico', icon: '🎸' },
  { id: 'anos2000', label: 'Nostalgia & Anos 2000', icon: '⭐' },
  { id: 'fotografia', label: 'Fotografia', icon: '📸' },
  { id: 'negocios', label: 'Negócios & Empreendedorismo', icon: '💡' },
  { id: 'saude', label: 'Saúde & Bem-Estar', icon: '🧘' },
  { id: 'memes', label: 'Memes & Humor', icon: '🎭' },
  { id: 'natureza', label: 'Natureza & Praia', icon: '🌿' }
];

const MONTHS = [
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' }
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin
}) => {
  const { 
    allUsers, 
    communities, 
    joinCommunity, 
    sendFriendRequest,
    signup, 
    openGoogleAuthModal, 
    showToast,
    setActiveTab
  } = useApp();

  // Current Step: 1 to 8
  // 1: Welcome
  // 2: Basic Data
  // 3: Profile Photo
  // 4: Interests
  // 5: Activate Dating
  // 6: Communities Suggestion
  // 7: Friends/Contacts Suggestion
  // 8: Final Screen
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 2: Basic Data state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Birth date selects
  const currentYear = new Date().getFullYear();
  const [birthDay, setBirthDay] = useState('15');
  const [birthMonth, setBirthMonth] = useState('06');
  const [birthYear, setBirthYear] = useState('2000');
  const [ageError, setAgeError] = useState<string | null>(null);

  // Email verification simulation
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('742819');

  // Step 3: Profile Photo state
  const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
  const [avatarPreview, setAvatarPreview] = useState<string>(defaultAvatar);
  const [hasCustomAvatar, setHasCustomAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Step 4: Interests state
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['🎵 Música', '🎮 Games', '⭐ Nostalgia & Anos 2000']);

  // Step 5: Dating state
  const [enableDating, setEnableDating] = useState(false);
  const [datingGender, setDatingGender] = useState<'Homem' | 'Mulher' | 'Não-binário' | 'Outro'>('Mulher');
  const [datingPreference, setDatingPreference] = useState<'Homens' | 'Mulheres' | 'Todos'>('Homens');
  const [datingCity, setDatingCity] = useState('São Paulo, SP');

  // Step 6: Joined communities during onboarding
  const [joinedCommunityIds, setJoinedCommunityIds] = useState<string[]>([]);

  // Step 7: Synced contacts simulation
  const [hasSyncedContacts, setHasSyncedContacts] = useState(false);
  const [isSyncingContacts, setIsSyncingContacts] = useState(false);
  const [addedContactUserIds, setAddedContactUserIds] = useState<string[]>([]);

  // Calculate age helper
  const calculateAge = (day: string, month: string, year: string): number => {
    const birth = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { level: 0, label: 'Vazia', color: 'bg-slate-200' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { level: 1, label: 'Fraca', color: 'bg-rose-500' };
    if (score <= 4) return { level: 2, label: 'Média', color: 'bg-amber-500' };
    return { level: 3, label: 'Forte & Segura', color: 'bg-emerald-500' };
  }, [password]);

  // Suggested communities matching selected interests
  const suggestedCommunities = useMemo(() => {
    const interestKeywords = selectedInterests.map(i => i.toLowerCase().replace(/[^a-z0-9]/g, ''));
    
    // Sort communities by keyword matches
    const matched = [...communities].sort((a, b) => {
      const aMatches = interestKeywords.some(kw => a.name.toLowerCase().includes(kw) || a.category.toLowerCase().includes(kw));
      const bMatches = interestKeywords.some(kw => b.name.toLowerCase().includes(kw) || b.category.toLowerCase().includes(kw));
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return b.membersCount - a.membersCount;
    });

    return matched.slice(0, 6);
  }, [communities, selectedInterests]);

  // Mock contacts that use the app
  const simulatedContacts = useMemo(() => {
    return allUsers.filter(u => ['user_mariana', 'user_felipe', 'user_beatriz', 'user_rodrigo'].includes(u.id));
  }, [allUsers]);

  if (!isOpen) return null;

  // Handle Photo selection from device
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarPreview(event.target.result as string);
        setHasCustomAvatar(true);
        showToast('Foto selecionada com sucesso!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Toggle interest chip
  const toggleInterest = (interestName: string) => {
    if (selectedInterests.includes(interestName)) {
      if (selectedInterests.length <= 3) {
        showToast('Selecione pelo menos 3 interesses.', 'info');
        return;
      }
      setSelectedInterests(prev => prev.filter(i => i !== interestName));
    } else {
      setSelectedInterests(prev => [...prev, interestName]);
    }
  };

  // Validate step 2
  const handleValidateStep2 = () => {
    if (!fullName.trim()) {
      showToast('Por favor, informe seu nome completo.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showToast('Por favor, insira um e-mail válido.', 'error');
      return;
    }

    // Check email uniqueness
    const emailExists = allUsers.some(u => u.email?.toLowerCase() === email.trim().toLowerCase());
    if (emailExists) {
      showToast('Este e-mail já está cadastrado. Faça login ou use outro.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('A senha deve ter no mínimo 6 caracteres.', 'error');
      return;
    }

    if (password !== passwordConfirm) {
      showToast('As senhas digitadas não coincidem!', 'error');
      return;
    }

    // Age validation (Minimum 18 years)
    const age = calculateAge(birthDay, birthMonth, birthYear);
    if (age < 18) {
      setAgeError('É necessário ter no mínimo 18 anos para criar conta no Vibe Clube.');
      showToast('Idade mínima de 18 anos exigida.', 'error');
      return;
    }
    setAgeError(null);

    // If email not yet verified, show verification simulation
    if (!emailVerified) {
      setIsVerifyingEmail(true);
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setVerificationCode(code); // Pre-filled for effortless UX in demo
      return;
    }

    setCurrentStep(3);
  };

  // Confirm email verification
  const handleConfirmEmailCode = () => {
    if (verificationCode === generatedCode || verificationCode.length === 6) {
      setEmailVerified(true);
      setIsVerifyingEmail(false);
      showToast('E-mail verificado com sucesso! ✓', 'success');
      setCurrentStep(3);
    } else {
      showToast('Código inválido. Verifique e tente novamente.', 'error');
    }
  };

  // Toggle community join
  const handleToggleCommunity = (commId: string) => {
    if (joinedCommunityIds.includes(commId)) {
      setJoinedCommunityIds(prev => prev.filter(id => id !== commId));
    } else {
      setJoinedCommunityIds(prev => [...prev, commId]);
      joinCommunity(commId);
      showToast('Entrou na comunidade!', 'success');
    }
  };

  // Simulate contact sync
  const handleSyncContacts = () => {
    setIsSyncingContacts(true);
    setTimeout(() => {
      setIsSyncingContacts(false);
      setHasSyncedContacts(true);
      showToast('4 contatos da sua agenda encontrados no Vibe Clube!', 'vibe');
    }, 1200);
  };

  // Send friend request to contact
  const handleAddContact = (targetUser: User) => {
    sendFriendRequest(targetUser.id);
    setAddedContactUserIds(prev => [...prev, targetUser.id]);
    showToast(`Solicitação de amizade enviada para ${targetUser.name}!`, 'success');
  };

  // Finalize Registration and Login
  const handleFinishOnboarding = () => {
    const formattedBirthDate = `${birthYear}-${birthMonth}-${birthDay}`;
    const generatedUsername = fullName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '_')
      .slice(0, 20);

    const userPayload: Partial<User> = {
      name: fullName.trim(),
      username: generatedUsername || 'viber',
      email: email.trim().toLowerCase(),
      birthDate: formattedBirthDate,
      city: enableDating ? datingCity.trim() : 'São Paulo, SP',
      avatar: hasCustomAvatar ? avatarPreview : defaultAvatar,
      interests: selectedInterests,
      isAdult: true,
      isDatingOptIn: enableDating,
      datingPreferences: enableDating ? {
        minAge: 18,
        maxAge: 45,
        distanceKm: 50,
        gender: datingGender,
        genderPreference: datingPreference,
        location: datingCity
      } : undefined,
      vibesBalance: 50 // 50 Welcome gift vibes as specified!
    };

    signup(userPayload);
    onClose();
    setActiveTab('home');
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    showToast(`Bem-vindo ao Vibe Clube, ${fullName}! Suas 50 Vibes de boas-vindas já estão na sua conta. 🪙✨`, 'vibe');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative my-6 animate-in fade-in zoom-in-95">
        
        {/* Header with Close and Progress Indicator (steps 2 to 7) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
          {currentStep > 1 && currentStep < 8 ? (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-black tracking-widest text-purple-700 uppercase">Vibe Clube</span>
            </div>
          )}

          {currentStep > 1 && currentStep < 8 && (
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                Etapa {currentStep} de 8
              </span>
            </div>
          )}

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 1. TELA DE BOAS-VINDAS */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="text-center space-y-6 py-2 animate-in fade-in">
            {/* Centered Logo with Header Gradient */}
            <div className="space-y-3">
              <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 flex items-center justify-center text-white mx-auto shadow-xl shadow-purple-500/25 transform hover:scale-105 transition-transform">
                <Sparkles className="w-9 h-9 text-amber-200 fill-amber-200" />
              </div>
              <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                VIBE CLUBE
              </h1>
              <p className="text-sm font-semibold text-slate-600 max-w-xs mx-auto">
                Reencontre a vibe de se conectar.
              </p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Amigos, comunidades nostálgicas, recados especiais e conexões reais em um só lugar.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                id="onboarding-create-account-btn"
                onClick={() => setCurrentStep(2)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-pink-700 text-white font-black text-sm sm:text-base shadow-lg shadow-purple-500/25 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Criar conta
              </button>

              <button
                id="onboarding-already-have-account-btn"
                onClick={onSwitchToLogin}
                className="w-full py-3.5 rounded-2xl border-2 border-slate-200 hover:border-purple-300 text-slate-700 font-extrabold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Já tenho conta
              </button>

              {/* Fast Google Option */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => openGoogleAuthModal('signup')}
                  className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span>Ou cadastre-se direto com Google</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. DADOS BÁSICOS */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-slate-900">Seus dados básicos</h2>
              <p className="text-xs text-slate-500">Crie seu perfil e defina sua senha de acesso.</p>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              {/* Nome Completo */}
              <div className="space-y-1">
                <label>Nome completo *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Matheus Oliveira"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* E-mail */}
              <div className="space-y-1">
                <label>E-mail *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Senha e Confirmação */}
              <div className="space-y-1">
                <label>Senha *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">Força da senha:</span>
                      <span className="font-extrabold text-slate-700">{passwordStrength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${(passwordStrength.level / 3) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmação de Senha */}
              <div className="space-y-1">
                <label>Confirmar senha *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Repita sua senha"
                    value={passwordConfirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && passwordConfirm && password !== passwordConfirm && (
                  <span className="text-[11px] text-rose-600 font-normal">As senhas não coincidem.</span>
                )}
              </div>

              {/* Data de Nascimento com 3 selects (Dia, Mês, Ano) */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>Data de nascimento *</span>
                  </label>
                  <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full">
                    Mínimo 18 anos
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Dia */}
                  <select
                    value={birthDay}
                    onChange={e => setBirthDay(e.target.value)}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    {Array.from({ length: 31 }, (_, i) => {
                      const d = (i + 1).toString().padStart(2, '0');
                      return <option key={d} value={d}>{d}</option>;
                    })}
                  </select>

                  {/* Mês */}
                  <select
                    value={birthMonth}
                    onChange={e => setBirthMonth(e.target.value)}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    {MONTHS.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>

                  {/* Ano */}
                  <select
                    value={birthYear}
                    onChange={e => setBirthYear(e.target.value)}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    {Array.from({ length: 80 }, (_, i) => {
                      const y = (currentYear - 18 - i).toString();
                      return <option key={y} value={y}>{y}</option>;
                    })}
                  </select>
                </div>

                {ageError && (
                  <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{ageError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Verification Code Simulation Sub-Modal */}
            {isVerifyingEmail && (
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2 text-purple-900 font-extrabold text-xs">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span>Confirmação de E-mail enviada</span>
                </div>
                <p className="text-[11px] text-purple-700 leading-relaxed">
                  Enviamos um código de 6 dígitos para <strong className="font-bold">{email}</strong>. Digite o código abaixo para validar sua conta:
                </p>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value)}
                    placeholder="742819"
                    className="w-full text-center tracking-widest text-lg font-black py-2 bg-white border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleConfirmEmailCode}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer shadow-xs"
                  >
                    Validar
                  </button>
                </div>
                <div className="text-[10px] text-slate-500">
                  Código pré-preenchido para simulação rápida. Clique em Validar.
                </div>
              </div>
            )}

            {!isVerifyingEmail && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleValidateStep2}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. FOTO DE PERFIL */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6 text-center animate-in fade-in py-2">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900">Foto de Perfil</h2>
              <p className="text-xs text-slate-500">
                Mostre sua vibe! Escolha uma foto do seu dispositivo para seu perfil.
              </p>
            </div>

            {/* Circular preview with signature gradient ring */}
            <div className="relative mx-auto w-36 h-36">
              <div className="w-full h-full p-1.5 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 shadow-xl flex items-center justify-center">
                <img
                  src={avatarPreview}
                  alt="Preview do avatar"
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>

              {/* Camera Icon Overlay button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg border-2 border-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                title="Trocar Foto"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />

            {/* Action buttons */}
            <div className="space-y-2 pt-2 max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 rounded-xl border-2 border-purple-200 hover:border-purple-400 bg-purple-50/50 hover:bg-purple-50 text-purple-900 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-purple-600" />
                <span>{hasCustomAvatar ? 'Escolher outra foto' : 'Carregar foto do dispositivo'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {hasCustomAvatar ? 'Continuar com essa foto' : 'Continuar'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAvatarPreview(defaultAvatar);
                  setHasCustomAvatar(false);
                  setCurrentStep(4);
                }}
                className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                Pular por enquanto (usar avatar padrão)
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. INTERESSES (Grid de chips, mínimo 3) */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Seus Interesses</h2>
                <p className="text-xs text-slate-500">Escolha pelo menos 3 tópicos que combinam com você.</p>
              </div>
              <div className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                selectedInterests.length >= 3 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800'
              }`}>
                {selectedInterests.length}/3 mínimo
              </div>
            </div>

            {/* Chips Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1 py-1">
              {INTEREST_CATEGORIES.map(category => {
                const isSelected = selectedInterests.includes(`${category.icon} ${category.label}`);
                const fullLabel = `${category.icon} ${category.label}`;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleInterest(fullLabel)}
                    className={`p-2.5 rounded-2xl text-xs font-extrabold text-left transition-all flex items-center gap-2 cursor-pointer border ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600 shadow-xs scale-102'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="text-base">{category.icon}</span>
                    <span className="truncate">{category.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={selectedInterests.length < 3}
                onClick={() => setCurrentStep(5)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. ATIVAR ENCONTROS? (Opcional) */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-slate-900">Ativar Vibe Encontros?</h2>
              <p className="text-xs text-slate-500">Conecte-se com pessoas solteiras e com afinidades na sua região.</p>
            </div>

            {/* Main Explanatory Card with Toggle */}
            <div className={`p-4 rounded-3xl border transition-all ${
              enableDating 
                ? 'bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 border-pink-300 ring-2 ring-pink-400/20' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-md shadow-pink-500/30">
                    <Heart className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">Quero participar dos Encontros</div>
                    <div className="text-[11px] text-slate-500">Exclusivo para maiores de 18 anos</div>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableDating}
                    onChange={e => setEnableDating(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                </label>
              </div>

              {/* Extended fields if dating is enabled */}
              {enableDating ? (
                <div className="mt-4 pt-3 border-t border-pink-200/80 space-y-3 text-xs font-bold text-slate-700 animate-in fade-in">
                  {/* Gênero */}
                  <div className="space-y-1">
                    <label>Qual é o seu gênero?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['Mulher', 'Homem', 'Não-binário', 'Outro'] as const).map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setDatingGender(g)}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            datingGender === g 
                              ? 'bg-pink-600 text-white border-pink-600 shadow-xs' 
                              : 'bg-white hover:bg-pink-50 text-slate-700 border-pink-200'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orientação de Interesse */}
                  <div className="space-y-1">
                    <label>Quem você quer conhecer?</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Homens', 'Mulheres', 'Todos'] as const).map(pref => (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => setDatingPreference(pref)}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            datingPreference === pref 
                              ? 'bg-purple-600 text-white border-purple-600 shadow-xs' 
                              : 'bg-white hover:bg-purple-50 text-slate-700 border-purple-200'
                          }`}
                        >
                          {pref}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Localização */}
                  <div className="space-y-1">
                    <label>Sua Cidade / Localização (para raio de alcance)</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-pink-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={datingCity}
                        onChange={e => setDatingCity(e.target.value)}
                        placeholder="Ex: São Paulo, SP"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-pink-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-slate-200/60 text-[11px] text-slate-500">
                  A aba Encontros ficará desativada no seu perfil. Você poderá ativá-la quando quiser nas Configurações.
                </div>
              )}
            </div>

            {/* Next button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(6)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. SUGESTÃO DE COMUNIDADES */}
        {/* ========================================================================= */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Comunidades Sugeridas</h2>
                <p className="text-xs text-slate-500">Baseado nos interesses que você escolheu:</p>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                {joinedCommunityIds.length} adicionada(s)
              </span>
            </div>

            {/* Communities list */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {suggestedCommunities.map(comm => {
                const isJoined = joinedCommunityIds.includes(comm.id);

                return (
                  <div
                    key={comm.id}
                    className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white flex items-center justify-between gap-3 transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={comm.logo || comm.coverImage}
                        alt={comm.name}
                        className="w-12 h-12 rounded-xl object-cover border border-purple-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs text-slate-900 truncate">{comm.name}</h4>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <span>{comm.category}</span>
                          <span>•</span>
                          <span>{comm.membersCount} membros</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleCommunity(comm.id)}
                      className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition-all shrink-0 cursor-pointer ${
                        isJoined 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                      }`}
                    >
                      {isJoined ? 'Participando ✓' : 'Participar'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(7)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Pular
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(7)}
                className="flex-2 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xs shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. SUGESTÃO DE AMIGOS / CONTATOS (Opcional) */}
        {/* ========================================================================= */}
        {currentStep === 7 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-slate-900">Encontre seus Amigos</h2>
              <p className="text-xs text-slate-500">Sincronize sua lista de contatos para ver quem já está na rede.</p>
            </div>

            {/* Sync trigger button if not synced yet */}
            {!hasSyncedContacts ? (
              <div className="p-6 rounded-3xl border-2 border-dashed border-purple-200 bg-purple-50/40 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-purple-950">Sincronizar Contatos do Celular</h4>
                  <p className="text-xs text-purple-700 max-w-xs mx-auto mt-1">
                    Conecte sua agenda para encontrar pessoas que você já conhece no Vibe Clube.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isSyncingContacts}
                  onClick={handleSyncContacts}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer disabled:opacity-60 inline-flex items-center gap-2"
                >
                  {isSyncingContacts ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Buscando contatos...</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4" />
                      <span>Sincronizar Agora</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 animate-in fade-in">
                <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>4 contatos encontrados no Vibe Clube:</span>
                </div>

                {simulatedContacts.map(contact => {
                  const isAdded = addedContactUserIds.includes(contact.id);

                  return (
                    <div
                      key={contact.id}
                      className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                        />
                        <div>
                          <div className="font-extrabold text-xs text-slate-900">{contact.name}</div>
                          <div className="text-[10px] text-slate-500">@{contact.username} • {contact.city}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddContact(contact)}
                        disabled={isAdded}
                        className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-100 text-emerald-800 cursor-default'
                            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                        }`}
                      >
                        {isAdded ? 'Adicionado ✓' : '+ Adicionar'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(8)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Pular esta etapa
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(8)}
                className="flex-2 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xs shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Concluir</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 8. TELA FINAL ("Tudo pronto!" com confetes e 50 Vibes de presente) */}
        {/* ========================================================================= */}
        {currentStep === 8 && (
          <div className="space-y-6 text-center py-2 animate-in fade-in">
            <div className="space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Tudo pronto!</h2>
              <p className="text-xs text-slate-600">Sua conta no Vibe Clube foi configurada com sucesso.</p>
            </div>

            {/* Welcome User Card with Vibes Reward */}
            <div className="p-4 rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-pink-500/10 space-y-3 shadow-sm">
              <div className="flex items-center justify-center gap-3">
                <div className="p-1 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500">
                  <img
                    src={avatarPreview}
                    alt={fullName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                  />
                </div>
                <div className="text-left">
                  <div className="font-extrabold text-sm text-slate-900">{fullName}</div>
                  <div className="text-[11px] text-purple-700 font-bold">Membro Oficial do Vibe Clube</div>
                </div>
              </div>

              {/* 50 Vibes Bonus Badge */}
              <div className="p-3 bg-white/90 rounded-2xl border border-amber-200 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-black">
                    🪙
                  </div>
                  <div className="text-left">
                    <div className="font-black text-xs text-amber-950">Presente de Boas-Vindas!</div>
                    <div className="text-[11px] text-amber-800">Você ganhou 50 Vibes para usar no app</div>
                  </div>
                </div>
                <span className="font-black text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                  +50 Vibes
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="p-2 bg-white/70 rounded-xl border border-slate-200/60 text-slate-700">
                  <span className="font-bold block text-purple-700">{selectedInterests.length} Interesses</span>
                  <span>no seu feed</span>
                </div>
                <div className="p-2 bg-white/70 rounded-xl border border-slate-200/60 text-slate-700">
                  <span className="font-bold block text-pink-600">{enableDating ? 'Encontros Ativado' : 'Encontros Oculto'}</span>
                  <span>no seu perfil</span>
                </div>
              </div>
            </div>

            {/* Enter Feed Button */}
            <div className="pt-2">
              <button
                id="onboarding-enter-vibeclube-btn"
                type="button"
                onClick={handleFinishOnboarding}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-pink-700 text-white font-black text-base shadow-xl shadow-purple-500/25 hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Entrar no Vibe Clube
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
