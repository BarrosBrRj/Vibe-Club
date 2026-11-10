import React, { useState, useRef, useEffect } from 'react';
import { Video, StopCircle, RefreshCw, Check, X, Camera, AlertCircle, Volume2, Upload, Film } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface VideoRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoRecorded: (file: File, thumbnailDataUrl: string, durationSec: number) => void;
}

export const VideoRecorderModal: React.FC<VideoRecorderModalProps> = ({
  isOpen,
  onClose,
  onVideoRecorded
}) => {
  const { showToast } = useApp();
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const nativeFileInputRef = useRef<HTMLInputElement | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [error, setError] = useState<string | null>(null);
  const [hasMicrophone, setHasMicrophone] = useState(true);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Iniciar câmera ao abrir modal
  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopEverything();
    }
    return () => {
      stopEverything();
    };
  }, [isOpen, facingMode]);

  const stopEverything = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
      setRecordedUrl('');
    }
    setRecordedBlob(null);
    setIsRecording(false);
    setTimerSeconds(0);
    setError(null);
    setIsStartingCamera(false);
  };

  const startCamera = async (mode: 'user' | 'environment') => {
    setError(null);
    setIsStartingCamera(true);

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Navegador não suporta acesso direto à câmera.');
      }

      let stream: MediaStream | null = null;
      let micAvailable = true;

      // Tier 1: Tentar vídeo com alta definição + áudio
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: mode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: true
        });
      } catch (err1: any) {
        console.warn('Tentativa 1 com áudio HD falhou, tentando fallback:', err1);

        // Tier 2: Tentar vídeo simples + áudio
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: mode },
            audio: true
          });
        } catch (err2: any) {
          console.warn('Tentativa 2 com áudio falhou, tentando apenas vídeo (sem áudio):', err2);

          // Tier 3: Tentar vídeo sem áudio (útil se o microfone estiver bloqueado pelo iframe ou indisponível)
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: mode },
              audio: false
            });
            micAvailable = false;
            showToast('Câmera conectada sem microfone (gravação sem áudio)', 'info');
          } catch (err3: any) {
            console.warn('Tentativa 3 com facingMode falhou, tentando qualquer câmera disponível:', err3);

            // Tier 4: Fallback absoluto para qualquer vídeo
            try {
              stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
              });
              micAvailable = false;
            } catch (err4: any) {
              throw err4; // Lançar erro para o catch principal
            }
          }
        }
      }

      setHasMicrophone(micAvailable);
      mediaStreamRef.current = stream;

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.muted = true;
        await videoPreviewRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Informação de câmera para vídeo (fallback disponível):', err);
      const isDenied = 
        err?.name === 'NotAllowedError' || 
        err?.name === 'PermissionDeniedError' || 
        err?.message?.toLowerCase().includes('permission denied') ||
        err?.message?.toLowerCase().includes('denied');

      if (isDenied) {
        setError('Permissão de câmera ou microfone foi negada no navegador. Você pode liberar a permissão ou escolher um vídeo do seu aparelho.');
      } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
        setError('Nenhuma câmera encontrada no dispositivo. Você pode enviar um vídeo pronto.');
      } else {
        setError('Não foi possível iniciar a câmera em tempo real. Use a opção de escolher um vídeo.');
      }
    } finally {
      setIsStartingCamera(false);
    }
  };

  const handleToggleFacingMode = () => {
    if (isRecording) return;
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  // Fallback para seleção de arquivo de vídeo ou gravação nativa do celular
  const handleNativeFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showToast('Por favor, selecione um arquivo de vídeo válido.', 'error');
      return;
    }

    // Parar stream ativo
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    const url = URL.createObjectURL(file);
    setRecordedBlob(file);
    setRecordedUrl(url);
    setIsRecording(false);
    setError(null);

    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
      videoPreviewRef.current.src = url;
      videoPreviewRef.current.muted = false;
      videoPreviewRef.current.controls = true;
      videoPreviewRef.current.onloadedmetadata = () => {
        const dur = Math.round(videoPreviewRef.current?.duration || 0);
        setTimerSeconds(dur > 0 ? dur : 1);
      };
      videoPreviewRef.current.play().catch(() => {});
    }

    showToast('Vídeo carregado com sucesso!', 'success');
  };

  const startRecording = () => {
    if (!mediaStreamRef.current) return;
    recordedChunksRef.current = [];
    setRecordedBlob(null);
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
      setRecordedUrl('');
    }

    try {
      // Prioridade para tipos suportados
      let mimeType = 'video/webm;codecs=vp8,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = '';
          }
        }
      }

      const options = mimeType ? { mimeType } : undefined;
      const recorder = new MediaRecorder(mediaStreamRef.current, options);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(recordedChunksRef.current, {
          type: recorder.mimeType || 'video/webm'
        });
        setRecordedBlob(finalBlob);
        const url = URL.createObjectURL(finalBlob);
        setRecordedUrl(url);

        // Se tínhamos stream de câmera, pausar preview ao vivo para mostrar vídeo gravado
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null;
          videoPreviewRef.current.src = url;
          videoPreviewRef.current.muted = false;
          videoPreviewRef.current.controls = true;
          videoPreviewRef.current.play().catch(() => {});
        }
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setTimerSeconds(0);

      // Timer com limite rígido de 60 segundos
      timerRef.current = window.setInterval(() => {
        setTimerSeconds(prev => {
          if (prev >= 59) {
            // Atingiu 60 segundos!
            stopRecording();
            showToast('Limite máximo de 60 segundos atingido para o vídeo!', 'info');
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Erro ao iniciar MediaRecorder:', err);
      showToast('Seu navegador não suporta gravação direta de vídeo. Use o envio de arquivo da galeria.', 'error');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleRetake = () => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
      setRecordedUrl('');
    }
    setRecordedBlob(null);
    setTimerSeconds(0);
    if (videoPreviewRef.current) {
      videoPreviewRef.current.src = '';
      videoPreviewRef.current.controls = false;
    }
    startCamera(facingMode);
  };

  const handleConfirmUseVideo = async () => {
    if (!recordedBlob) return;

    // Gerar thumbnail do blob gravado
    let thumb = '';
    try {
      const canvas = document.createElement('canvas');
      if (videoPreviewRef.current) {
        canvas.width = videoPreviewRef.current.videoWidth || 640;
        canvas.height = videoPreviewRef.current.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoPreviewRef.current, 0, 0, canvas.width, canvas.height);
          thumb = canvas.toDataURL('image/jpeg', 0.82);
        }
      }
    } catch (e) {
      console.warn('Erro ao gerar miniatura do vídeo gravado:', e);
    }

    const file = new File([recordedBlob], `gravacao_${Date.now()}.mp4`, {
      type: recordedBlob.type || 'video/mp4'
    });

    onVideoRecorded(file, thumb, timerSeconds || 1);
    stopEverything();
    onClose();
  };

  if (!isOpen) return null;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      {/* Input oculto para fallback de arquivo ou câmera nativa */}
      <input
        ref={nativeFileInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        onChange={handleNativeFileSelect}
        className="hidden"
      />

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-lg w-full relative flex flex-col max-h-[95dvh] shadow-2xl">
        
        {/* Header Bar */}
        <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm">Gravar Vídeo</span>
              <span className="block text-[10px] text-slate-400">
                Máx: 60s {!hasMicrophone && '• (Sem áudio)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isRecording && !recordedBlob && (
              <button
                type="button"
                onClick={() => nativeFileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Escolher vídeo salvo do dispositivo"
              >
                <Upload className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Carregar</span>
              </button>
            )}

            <button
              onClick={() => {
                stopEverything();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewfinder Viewport */}
        <div className="relative bg-black flex-1 min-h-[340px] max-h-[520px] flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-6 text-center text-slate-200 space-y-4 max-w-sm">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Acesso à Câmera Indisponível</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{error}</p>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  disabled={isStartingCamera}
                  className="w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isStartingCamera ? 'Tentando conectar...' : 'Tentar Novamente'}
                </button>
                <button
                  type="button"
                  onClick={() => nativeFileInputRef.current?.click()}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Escolher Vídeo ou Câmera do Celular</span>
                </button>
              </div>
            </div>
          ) : (
            <video
              ref={videoPreviewRef}
              playsInline
              autoPlay
              className="w-full h-full object-cover max-h-[520px]"
            />
          )}

          {/* Floating Recording Indicator & Timer */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
            {isRecording ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-600/90 text-white text-xs font-bold shadow-lg animate-pulse">
                <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                <span>REC {formatTimer(timerSeconds)} / 01:00</span>
              </div>
            ) : recordedBlob ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-bold shadow-lg">
                <Check className="w-3.5 h-3.5" />
                <span>Vídeo Pronto ({formatTimer(timerSeconds)})</span>
              </div>
            ) : (
              <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/80 text-xs font-semibold border border-white/10">
                00:00 / 01:00 máx
              </div>
            )}

            {/* Switch Camera Button (User/Environment) */}
            {!isRecording && !recordedBlob && !error && (
              <button
                onClick={handleToggleFacingMode}
                className="pointer-events-auto p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-transform active:scale-90 cursor-pointer"
                title="Trocar Câmera"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 60s Progress Bar (visual indicator) */}
          {isRecording && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
              <div
                className="h-full bg-rose-500 transition-all duration-300"
                style={{ width: `${(timerSeconds / 60) * 100}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-4 text-white">
          {!recordedBlob ? (
            isRecording ? (
              <button
                onClick={stopRecording}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95 transition-all cursor-pointer"
              >
                <StopCircle className="w-5 h-5 fill-white" />
                <span>Parar Gravação</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={startRecording}
                  disabled={Boolean(error) || isStartingCamera}
                  className="px-7 py-3.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl shadow-rose-600/40 active:scale-95 transition-all cursor-pointer group"
                >
                  <span className="w-3.5 h-3.5 bg-white rounded-full group-hover:scale-110 transition-transform"></span>
                  <span>Iniciar Gravação</span>
                </button>
              </div>
            )
          ) : (
            <div className="flex items-center gap-3 w-full justify-between">
              <button
                onClick={handleRetake}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Gravar Novamente</span>
              </button>
              <button
                onClick={handleConfirmUseVideo}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Usar este Vídeo</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
