import React, { useState } from 'react';
import { ShieldAlert, X, CheckCircle2, UserX, AlertTriangle, ArrowRight } from 'lucide-react';
import { ReportTarget, ReportReason } from '../../types/moderation';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: ReportTarget | null;
  onSubmitReport: (target: ReportTarget, reason: string, details: string) => void;
  onBlockUser?: (userId: string, userName?: string) => void;
  isBlocked?: boolean;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  target,
  onSubmitReport,
  onBlockUser,
  isBlocked = false
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('Conteúdo ofensivo/discurso de ódio');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasBlockedAuthor, setHasBlockedAuthor] = useState(isBlocked);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !target) return null;

  // Compute category-specific reasons
  const getReasons = (): string[] => {
    const generalReasons = [
      'Spam',
      'Conteúdo ofensivo/discurso de ódio',
      'Nudez ou conteúdo sexual',
      'Violência',
      'Golpe/fraude',
      'Informação falsa',
      'Outro'
    ];

    if (target.type === 'marketplace') {
      return [
        'Produto proibido',
        'Anúncio enganoso',
        'Preço abusivo',
        ...generalReasons
      ];
    }

    if (target.type === 'user') {
      return [
        'Perfil falso',
        'Assédio',
        ...generalReasons
      ];
    }

    return generalReasons;
  };

  const reasons = getReasons();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReason === 'Outro' && !details.trim()) {
      setErrorMsg('Por favor, descreva o motivo no campo de texto para a categoria "Outro".');
      return;
    }
    setErrorMsg('');
    onSubmitReport(target, selectedReason, details.trim());
    setIsSubmitted(true);
  };

  const handleBlockClick = () => {
    if (target.authorId && onBlockUser) {
      onBlockUser(target.authorId, target.authorName || 'este usuário');
      setHasBlockedAuthor(true);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setDetails('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                {isSubmitted ? 'Denúncia Registrada' : 'Denunciar Conteúdo'}
              </h3>
              <p className="text-xs text-slate-500">Central de Segurança Vibe Clube</p>
            </div>
          </div>
          <button 
            onClick={handleClose} 
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 flex items-center gap-3">
          {target.authorAvatar && (
            <img 
              src={target.authorAvatar} 
              alt={target.authorName || 'Autor'} 
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0" 
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="font-bold text-slate-900 truncate">
              {target.name || (target.authorName ? `Conteúdo de ${target.authorName}` : 'Item denunciado')}
            </div>
            {target.contentSnippet && (
              <p className="text-slate-500 truncate text-[11px] italic">
                "{target.contentSnippet}"
              </p>
            )}
          </div>
        </div>

        {/* Step 1: Form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-900 block mb-2">
                Por que você está denunciando isso?
              </label>
              
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {reasons.map((reason) => (
                  <label 
                    key={reason}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedReason === reason 
                        ? 'border-red-500 bg-red-50/70 text-red-950 font-semibold' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="report_reason"
                      checked={selectedReason === reason}
                      onChange={() => {
                        setSelectedReason(reason);
                        setErrorMsg('');
                      }}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Detalhes adicionais {selectedReason === 'Outro' ? <span className="text-red-500 font-bold">*</span> : <span className="text-slate-400 font-normal">(opcional)</span>}:
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => {
                  setDetails(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder={
                  selectedReason === 'Outro' 
                    ? 'Por favor, descreva a infração para que a moderação possa agir...'
                    : 'Explique o contexto para ajudar a equipe de moderação...'
                }
                className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-red-500 outline-hidden font-medium text-slate-800"
              />
              {errorMsg && (
                <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{errorMsg}</span>
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Enviar denúncia</span>
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: Immediate Confirmation & Instant Block Author */
          <div className="space-y-4 text-center py-2 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="font-extrabold text-base text-slate-900">
                Denúncia enviada com sucesso
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Nossa equipe de moderação vai analisar o conteúdo com base nas diretrizes da comunidade.
              </p>
            </div>

            {/* Option to block author directly */}
            {target.authorId && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2.5 mt-2">
                <div className="text-xs font-bold text-slate-800">
                  Deseja também bloquear este usuário?
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Ao bloquear, {target.authorName || 'o autor'} não poderá ver seu perfil, mandar mensagens nem interagir com suas postagens.
                </p>

                {hasBlockedAuthor ? (
                  <div className="p-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-purple-200">
                    <UserX className="w-4 h-4" />
                    <span>Usuário bloqueado com sucesso</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleBlockClick}
                    className="w-full py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <UserX className="w-4 h-4 text-red-400" />
                    <span>Bloquear {target.authorName || 'autor'}</span>
                  </button>
                )}
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
