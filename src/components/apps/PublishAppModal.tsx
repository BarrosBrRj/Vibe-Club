import React, { useState, useRef } from 'react';
import { 
  X, Upload, Sparkles, Smartphone, ShieldCheck, Check, 
  Image as ImageIcon, HelpCircle, HardDrive, Tag, Layers, FileCode,
  Camera, Trash2, CheckCircle2, RefreshCw, QrCode, Copy, CreditCard,
  Lock, Zap, ArrowRight, Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppItem } from '../../types';
import { CameraCaptureModal } from '../common/CameraCaptureModal';

export const PublishAppModal: React.FC = () => {
  const { 
    isPublishAppModalOpen, 
    setIsPublishAppModalOpen, 
    publishApp, 
    unlockUnlimitedAppLicense,
    showToast,
    currentUser 
  } = useApp();

  // License state
  const isLicensed = Boolean(currentUser?.hasUnlimitedAppLicense);
  const [paymentTab, setPaymentTab] = useState<'pix' | 'card'>('pix');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AppItem['category']>('Utilitários');
  const [packageName, setPackageName] = useState('');
  const [version, setVersion] = useState('v1.0.0');
  const [size, setSize] = useState('18.5 MB');
  const [minAndroid, setMinAndroid] = useState('Android 8.0+');
  const [iconUrl, setIconUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&auto=format&fit=crop&q=80');
  const [screenshot1, setScreenshot1] = useState('https://images.unsplash.com/photo-1616469829941-c7200edec809?w=600&auto=format&fit=crop&q=80');
  const [screenshot2, setScreenshot2] = useState('https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&auto=format&fit=crop&q=80');
  const [apkUrl, setApkUrl] = useState('');
  const [playStoreUrl, setPlayStoreUrl] = useState('');
  const [changelog, setChangelog] = useState('• Lançamento oficial no Vibe Play Store!');
  const [ageRating, setAgeRating] = useState<AppItem['ageRating']>('Livre');

  // Image Upload refs and state
  const iconInputRef = useRef<HTMLInputElement | null>(null);
  const screenshot1InputRef = useRef<HTMLInputElement | null>(null);
  const screenshot2InputRef = useRef<HTMLInputElement | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<'icon' | 'screenshot1' | 'screenshot2'>('icon');
  const [isIconDragging, setIsIconDragging] = useState(false);

  const pixKey = '00020126580014BR.GOV.BCB.PIX0136vibeclube-licenca-dev-4990-app520400005303986540549.905802BR';

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(pixKey);
    setCopiedPix(true);
    showToast('Código PIX Copia e Cola copiado com sucesso! 📋', 'success');
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleConfirmLicensePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      unlockUnlimitedAppLicense();
      setIsProcessingPayment(false);
    }, 600);
  };

  if (!isPublishAppModalOpen) return null;

  const presetIcons = [
    { label: 'Roxo Moderno', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&auto=format&fit=crop&q=80' },
    { label: 'Retro Gaming', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=256&auto=format&fit=crop&q=80' },
    { label: 'Câmera Neon', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=256&auto=format&fit=crop&q=80' },
    { label: 'Lofi Audio', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=256&auto=format&fit=crop&q=80' },
    { label: 'Finanças / Gráfico', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=256&auto=format&fit=crop&q=80' },
    { label: 'Cyber / Code', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=256&auto=format&fit=crop&q=80' }
  ];

  const handleProcessImage = (file: File, target: 'icon' | 'screenshot1' | 'screenshot2') => {
    if (!file.type.startsWith('image/')) {
      showToast('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WEBP, GIF).', 'error');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      showToast('A imagem não pode ultrapassar 15MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        const result = e.target.result;
        if (target === 'icon') {
          setIconUrl(result);
          showToast('Logo do app carregada com sucesso da sua galeria! 🖼️✨', 'success');
        } else if (target === 'screenshot1') {
          setScreenshot1(result);
          showToast('Screenshot 1 adicionada da galeria! 📸', 'success');
        } else if (target === 'screenshot2') {
          setScreenshot2(result);
          showToast('Screenshot 2 adicionada da galeria! 📸', 'success');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (dataUrl: string) => {
    if (cameraTarget === 'icon') {
      setIconUrl(dataUrl);
      showToast('Foto capturada e definida como Logo do app! 📸', 'success');
    } else if (cameraTarget === 'screenshot1') {
      setScreenshot1(dataUrl);
      showToast('Screenshot 1 capturada com a câmera! 📸', 'success');
    } else if (cameraTarget === 'screenshot2') {
      setScreenshot2(dataUrl);
      showToast('Screenshot 2 capturada com a câmera! 📸', 'success');
    }
    setIsCameraOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Por favor, informe o nome do aplicativo.', 'error');
      return;
    }
    if (!description.trim()) {
      showToast('Por favor, descreva as funcionalidades do aplicativo.', 'error');
      return;
    }

    const screenshots = [screenshot1.trim(), screenshot2.trim()].filter(Boolean);

    publishApp({
      name: name.trim(),
      packageName: packageName.trim() || `com.vibe.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      tagline: tagline.trim() || 'Aplicativo oficial publicado na Vibe Play Store',
      description: description.trim(),
      category,
      iconUrl: iconUrl.trim() || presetIcons[0].url,
      screenshots: screenshots.length > 0 ? screenshots : [presetIcons[0].url],
      size: size.trim() || '15.0 MB',
      version: version.trim() || 'v1.0.0',
      minAndroid: minAndroid.trim() || 'Android 8.0+',
      apkUrl: apkUrl.trim() || undefined,
      playStoreUrl: playStoreUrl.trim() || undefined,
      changelog: changelog.trim(),
      ageRating
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 my-auto">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Publicar Aplicativo no Vibe Play
                </h2>
                <p className="text-xs text-slate-500">
                  Compartilhe seus apps, jogos e APKs com toda a comunidade
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsPublishAppModalOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isLicensed ? (
            /* Developer License Fee Screen (R$ 49,90) */
            <div className="p-5 sm:p-7 overflow-y-auto space-y-5 flex-1">
              
              {/* Highlight Banner */}
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-white/20 backdrop-blur-md text-amber-200 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Taxa Única de Desenvolvedor
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                  Libere Publicações Ilimitadas no Vibe Play
                </h3>
                
                <p className="text-purple-100 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  Para liberar para as pessoas postarem ilimitadamente seus aplicativos, jogos e APKs na nossa loja, cobramos uma taxa única de ativação.
                </p>

                {/* Price Display */}
                <div className="mt-4 pt-4 border-t border-white/20 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white">R$ 49,90</span>
                  <span className="text-xs text-purple-200 font-semibold">/ taxa única para acesso vitalício ilimitado</span>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-black">
                    ♾️
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900">Postagens Ilimitadas</h4>
                    <p className="text-slate-500 mt-0.5 leading-snug">Publique quantos aplicativos, jogos e APKs desejar sem limite de envios.</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-black">
                    🚀
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900">Downloads Diretos</h4>
                    <p className="text-slate-500 mt-0.5 leading-snug">Disponibilize APKs diretos e links da Play Store para todos os membros.</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center shrink-0 font-black">
                    🛡️
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900">Selo Oficial de Dev</h4>
                    <p className="text-slate-500 mt-0.5 leading-snug">Receba o selo oficial de desenvolvedor verificado no seu perfil.</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-black">
                    🔄
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900">Atualizações Sem Fim</h4>
                    <p className="text-slate-500 mt-0.5 leading-snug">Atualize suas versões, envie changelogs e melhorias a qualquer momento.</p>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                <div className="flex border-b border-slate-200 bg-slate-50/80">
                  <button
                    type="button"
                    onClick={() => setPaymentTab('pix')}
                    className={`flex-1 py-3 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      paymentTab === 'pix'
                        ? 'bg-white text-emerald-700 border-b-2 border-emerald-600 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Pagar com PIX (R$ 49,90)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentTab('card')}
                    className={`flex-1 py-3 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      paymentTab === 'card'
                        ? 'bg-white text-purple-700 border-b-2 border-purple-600 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Cartão de Crédito</span>
                  </button>
                </div>

                <div className="p-4 sm:p-5">
                  {paymentTab === 'pix' ? (
                    <div className="space-y-4 text-center">
                      <div className="max-w-xs mx-auto p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex flex-col items-center justify-center gap-2">
                        <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-md border border-slate-200 flex items-center justify-center">
                          <img 
                            src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=00020126580014BR.GOV.BCB.PIX0136vibeclube-licenca-dev-4990-app520400005303986540549.905802BR" 
                            alt="QR Code PIX R$ 49,90"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-xs font-extrabold text-emerald-900">
                          Taxa Única: R$ 49,90
                        </span>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-bold text-slate-600 block">Chave PIX Copia e Cola:</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={pixKey}
                            className="flex-1 p-2.5 bg-slate-50 text-[11px] font-mono rounded-xl border border-slate-200 select-all"
                          />
                          <button
                            type="button"
                            onClick={handleCopyPix}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0 shadow-xs"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleConfirmLicensePayment}
                        disabled={isProcessingPayment}
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isProcessingPayment ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Confirmando pagamento de R$ 49,90...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Confirmar Pagamento de R$ 49,90 e Liberar Postagens Ilimitadas</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Número do Cartão</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="0000 0000 0000 0000"
                          className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Validade</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/AA"
                            className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">CVV</label>
                          <input
                            type="text"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="123"
                            maxLength={4}
                            className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 font-medium"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Nome no Cartão</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="Nome impresso no cartão"
                          className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 font-medium"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleConfirmLicensePayment}
                        disabled={isProcessingPayment}
                        className="w-full mt-2 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-purple-600/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isProcessingPayment ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Processando pagamento...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Pagar Taxa de R$ 49,90 e Liberar Ilimitado</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            /* Scrollable Form when Licensed */
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
              
              {/* Active Unlimited License Banner */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900 shadow-2xs">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Licença Ilimitada Ativa — Taxa de R$ 49,90 confirmada! Você pode publicar apps sem restrições.</span>
                </div>
                <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                  Verificado
                </span>
              </div>

              {/* Main Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                  <span>Informações Básicas do App</span>
                </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nome do Aplicativo *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!packageName) {
                        setPackageName(`com.vibe.${e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')}`);
                      }
                    }}
                    placeholder="Ex: Super Game Retro"
                    className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Categoria *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AppItem['category'])}
                    className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-semibold text-slate-800"
                  >
                    <option value="Jogos">Jogos</option>
                    <option value="Redes Sociais">Redes Sociais</option>
                    <option value="Utilitários">Utilitários</option>
                    <option value="Música & Áudio">Música & Áudio</option>
                    <option value="Foto & Vídeo">Foto & Vídeo</option>
                    <option value="Produtividade">Produtividade</option>
                    <option value="Personalização">Personalização</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Frase de Destaque / Tagline *</label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Ex: O melhor app de fotos retrô com filtros dos anos 2000"
                  className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Descrição Completa *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explique detalhadamente como o app funciona, recursos principais e diferenciais..."
                  className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium text-slate-900 resize-none"
                />
              </div>
            </div>

            {/* Icon & Screenshots Section */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-pink-700">
                  <ImageIcon className="w-4 h-4" />
                  <span>Logo do Aplicativo & Galeria</span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">PNG, JPG, WEBP, GIF</span>
              </h3>

              {/* LOGO DO APP COM ESCOLHA DIRETA DA GALERIA */}
              <div className="p-4 rounded-2xl bg-purple-50/50 border-2 border-purple-200 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* Visual Preview */}
                    <div className="relative group shrink-0">
                      <img
                        src={iconUrl}
                        alt="Logo do Aplicativo"
                        className="w-18 h-18 rounded-2xl object-cover border-2 border-purple-500 shadow-md group-hover:scale-102 transition-transform bg-white"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white rounded-full p-1 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">Logo / Ícone do App</h4>
                      <p className="text-xs text-slate-500 max-w-xs">
                        Abra sua galeria para escolher a imagem da logo ou tire uma foto agora.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons for Icon */}
                  <div className="flex flex-wrap sm:flex-col gap-2 w-full sm:w-auto">
                    {/* Hidden File Input for Icon */}
                    <input
                      ref={iconInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleProcessImage(file, 'icon');
                      }}
                    />

                    {/* Open Gallery Button */}
                    <button
                      type="button"
                      id="btn-app-logo-gallery"
                      onClick={() => iconInputRef.current?.click()}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer hover:shadow-md"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Abrir Galeria de Fotos</span>
                    </button>

                    {/* Take Photo Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setCameraTarget('icon');
                        setIsCameraOpen(true);
                      }}
                      className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-white hover:bg-purple-100/80 text-purple-900 border border-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-purple-600" />
                      <span>Tirar Foto</span>
                    </button>
                  </div>
                </div>

                {/* Drag and Drop Zone & URL input */}
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsIconDragging(true); }}
                  onDragLeave={() => setIsIconDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsIconDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleProcessImage(file, 'icon');
                  }}
                  className={`border-2 border-dashed rounded-xl p-2.5 transition-all text-center ${
                    isIconDragging 
                      ? 'border-purple-600 bg-purple-100 text-purple-900 font-bold' 
                      : 'border-slate-300 bg-white/70 hover:border-purple-400 text-slate-500'
                  }`}
                >
                  <p className="text-[11px]">
                    💡 Ou arraste uma imagem aqui, ou digite a URL da logo:
                  </p>
                  <input
                    type="url"
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                    placeholder="https://... URL da logo se preferir"
                    className="w-full mt-1.5 p-2 bg-slate-50 text-[11px] rounded-lg border border-slate-200 focus:border-purple-500 outline-hidden font-mono"
                  />
                </div>

                {/* Presets */}
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase">Modelos Rápidos de Logos:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {presetIcons.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setIconUrl(preset.url)}
                        className="px-2.5 py-1 text-[10px] font-bold bg-white hover:bg-purple-100 hover:text-purple-700 border border-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Screenshots inputs with gallery support */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Screenshots / Imagens de Demonstração</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Screenshot 1 */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Screenshot 1</span>
                      <input
                        ref={screenshot1InputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleProcessImage(file, 'screenshot1');
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => screenshot1InputRef.current?.click()}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center gap-1 border border-indigo-200 cursor-pointer"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>Galeria</span>
                      </button>
                    </div>
                    {screenshot1 && (
                      <img src={screenshot1} alt="Screenshot 1" className="w-full h-24 rounded-xl object-cover border border-slate-200" />
                    )}
                    <input
                      type="url"
                      value={screenshot1}
                      onChange={(e) => setScreenshot1(e.target.value)}
                      placeholder="URL ou carregado da galeria"
                      className="w-full p-1.5 bg-white text-[11px] rounded-lg border border-slate-200 outline-hidden font-mono"
                    />
                  </div>

                  {/* Screenshot 2 */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Screenshot 2</span>
                      <input
                        ref={screenshot2InputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleProcessImage(file, 'screenshot2');
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => screenshot2InputRef.current?.click()}
                        className="px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 text-[10px] font-bold flex items-center gap-1 border border-pink-200 cursor-pointer"
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>Galeria</span>
                      </button>
                    </div>
                    {screenshot2 && (
                      <img src={screenshot2} alt="Screenshot 2" className="w-full h-24 rounded-xl object-cover border border-slate-200" />
                    )}
                    <input
                      type="url"
                      value={screenshot2}
                      onChange={(e) => setScreenshot2(e.target.value)}
                      placeholder="URL ou carregado da galeria"
                      className="w-full p-1.5 bg-white text-[11px] rounded-lg border border-slate-200 outline-hidden font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Technical & Package Info */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-indigo-600" />
                <span>Pacote Android & Versão</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Pacote (Package ID)</label>
                  <input
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    placeholder="com.empresa.app"
                    className="w-full p-2 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Versão</label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="v1.0.0"
                    className="w-full p-2 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Tamanho APK</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="15.2 MB"
                    className="w-full p-2 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Classificação</label>
                  <select
                    value={ageRating}
                    onChange={(e) => setAgeRating(e.target.value as AppItem['ageRating'])}
                    className="w-full p-2 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-bold"
                  >
                    <option value="Livre">Livre</option>
                    <option value="10+">10+</option>
                    <option value="12+">12+</option>
                    <option value="14+">14+</option>
                    <option value="16+">16+</option>
                    <option value="18+">18+</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Requisito Android Mínimo</label>
                  <input
                    type="text"
                    value={minAndroid}
                    onChange={(e) => setMinAndroid(e.target.value)}
                    placeholder="Ex: Android 8.0+ ou superior"
                    className="w-full p-2 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Link do APK ou Google Play</label>
                  <input
                    type="url"
                    value={apkUrl}
                    onChange={(e) => setApkUrl(e.target.value)}
                    placeholder="https://exemplo.com/meu-app.apk"
                    className="w-full p-2 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Changelog */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block">O que há de novo nesta versão? (Changelog)</label>
              <textarea
                rows={2}
                value={changelog}
                onChange={(e) => setChangelog(e.target.value)}
                placeholder="• Adicionado novos recursos..."
                className="w-full p-2 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium resize-none text-slate-900"
              />
            </div>

            {/* Rewards Callout */}
            <div className="p-3.5 bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-2xl border border-purple-100 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-slate-800">Recompensa de Desenvolvedor: </span>
                <span className="text-purple-700 font-bold">+150 XP e Selo de Desenvolvedor Vibe</span> ao publicar!
              </div>
            </div>

            {/* Submit buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPublishAppModalOpen(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                id="btn-confirm-publish-app"
                className="flex-2 py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md shadow-purple-600/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Publicar no Vibe Play Store</span>
              </button>
            </div>

          </form>
        )}

        </div>
      </div>

      {/* Live Camera Modal */}
      {isCameraOpen && (
        <CameraCaptureModal
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleCameraCapture}
        />
      )}
    </>
  );
};

