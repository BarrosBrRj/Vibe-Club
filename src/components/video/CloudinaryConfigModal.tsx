import React, { useState, useEffect } from 'react';
import { Cloud, CheckCircle2, AlertCircle, X, ExternalLink, KeyRound, ShieldCheck } from 'lucide-react';
import { getCloudinaryConfig, setCloudinaryConfig } from '../../lib/cloudinary';
import { useApp } from '../../context/AppContext';

interface CloudinaryConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved?: () => void;
}

export const CloudinaryConfigModal: React.FC<CloudinaryConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved
}) => {
  const { showToast } = useApp();
  const [cloudName, setCloudName] = useState('');
  const [uploadPreset, setUploadPreset] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getCloudinaryConfig();
      setCloudName(current.cloudName);
      setUploadPreset(current.uploadPreset);
      setIsSaved(Boolean(current.cloudName && current.uploadPreset));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudName.trim() || !uploadPreset.trim()) {
      showToast('Por favor, preencha o Cloud Name e o Upload Preset.', 'error');
      return;
    }

    setCloudinaryConfig({
      cloudName: cloudName.trim(),
      uploadPreset: uploadPreset.trim()
    });

    setIsSaved(true);
    showToast('Configurações do Cloudinary salvas com sucesso! ☁️', 'success');
    if (onConfigSaved) onConfigSaved();
    onClose();
  };

  const handleClear = () => {
    setCloudName('');
    setUploadPreset('');
    setCloudinaryConfig({ cloudName: '', uploadPreset: '' });
    setIsSaved(false);
    showToast('Configurações removidas.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 max-h-[92dvh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                Armazenamento de Vídeos (Cloudinary)
              </h3>
              <p className="text-xs text-slate-500">
                Hospedagem 100% gratuita, sem Firebase Blaze
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status banner */}
        {isSaved ? (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Cloudinary configurado!</strong> Seus uploads de vídeo serão enviados diretamente para a sua nuvem gratuita.
            </span>
          </div>
        ) : (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Configuração necessária para vídeos:</strong> Informe seu <strong>Cloud Name</strong> e <strong>Upload Preset (Unsigned)</strong> para habilitar publicação ilimitada de vídeos curtos.
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Cloud Name</span>
              <span className="text-[10px] text-slate-400 font-normal">Ex: meu-usuario-cloud</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={cloudName}
                onChange={(e) => setCloudName(e.target.value)}
                placeholder="Digite seu Cloud Name"
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden font-medium text-slate-800 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Upload Preset (Modo Unsigned)</span>
              <span className="text-[10px] text-slate-400 font-normal">Ex: vibe_clube_preset</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={uploadPreset}
                onChange={(e) => setUploadPreset(e.target.value)}
                placeholder="Digite o nome do Upload Preset"
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden font-medium text-slate-800 transition-all"
                required
              />
            </div>
          </div>

          {/* Quick Guide */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-600">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Como obter seus dados em 1 minuto:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed text-slate-600">
              <li>Crie uma conta gratuita em <strong>cloudinary.com</strong> (sem cartão).</li>
              <li>No painel principal, copie o <strong>Cloud name</strong>.</li>
              <li>Vá em <strong>Settings (ícone de engrenagem)</strong> &gt; <strong>Upload</strong>.</li>
              <li>Role até <strong>Upload presets</strong> e clique em <strong>Add upload preset</strong>.</li>
              <li>Mude o <strong>Signing Mode</strong> de "Signed" para <strong>"Unsigned"</strong> e salve.</li>
              <li>Copie o nome do preset gerado e cole no campo acima!</li>
            </ol>
            <a
              href="https://cloudinary.com/users/register_free"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-bold mt-1"
            >
              <span>Abrir Cloudinary em nova aba</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            {isSaved && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                Limpar Dados
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
            >
              Salvar Configuração
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
