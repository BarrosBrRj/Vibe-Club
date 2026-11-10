import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, Check, FlipHorizontal, AlertCircle, Sparkles, SwitchCamera } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);

  // Start Camera Stream
  const startCamera = async (mode: 'user' | 'environment') => {
    setIsStarting(true);
    setCameraError(null);
    setCapturedImage(null);

    // Stop existing stream if any
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Navegador não suporta captura direta de vídeo.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(
        'Não foi possível acessar a câmera diretamente. Você pode usar a câmera nativa do seu celular pelo botão abaixo.'
      );
    } finally {
      setIsStarting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      setCapturedImage(null);
      setCameraError(null);
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  // Take Snapshot
  const handleTakeSnapshot = () => {
    if (!videoRef.current) return;

    // Flash animation
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If front camera, mirror image
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);

    // Stop video stream to save battery
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  // Switch between front and back camera
  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
  };

  // Retake
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  // Confirm photo
  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  // Fallback native camera input
  const handleNativeCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onCapture(reader.result);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 text-white rounded-3xl border border-purple-500/30 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Tirar Foto com a Câmera</h3>
              <p className="text-[10px] text-slate-400">Capture sua vibe em tempo real</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder / Preview */}
        <div className="relative flex-1 bg-black min-h-[300px] sm:min-h-[360px] flex items-center justify-center overflow-hidden">
          
          {/* Flash screen effect */}
          {isFlashActive && (
            <div className="absolute inset-0 bg-white z-30 transition-opacity duration-200 pointer-events-none" />
          )}

          {/* Captured Image Result */}
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Foto Capturada"
              className="w-full h-full object-contain max-h-[360px]"
            />
          ) : cameraError ? (
            /* Error & Native Camera Fallback */
            <div className="p-6 text-center space-y-4 max-w-sm">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {cameraError}
              </p>
              <div>
                <button
                  onClick={() => nativeCameraInputRef.current?.click()}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-bold text-xs shadow-lg flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Abrir Câmera do Celular</span>
                </button>
              </div>
            </div>
          ) : (
            /* Live Video Stream */
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover max-h-[360px] ${
                  facingMode === 'user' ? 'scale-x-[-1]' : ''
                }`}
              />

              {/* Grid overlay for framing */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20 border border-white/30">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>
            </div>
          )}

          {/* Hidden Canvas & Native Camera Input */}
          <canvas ref={canvasRef} className="hidden" />
          <input
            ref={nativeCameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleNativeCameraChange}
          />
        </div>

        {/* Footer Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          {capturedImage ? (
            /* Confirm / Retake Actions */
            <div className="flex items-center justify-between w-full gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tirar Outra</span>
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Usar Esta Foto</span>
              </button>
            </div>
          ) : (
            /* Shutter & Camera Controls */
            <div className="flex items-center justify-between w-full">
              {/* Switch Front/Back */}
              <button
                type="button"
                onClick={handleToggleFacingMode}
                disabled={!!cameraError}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors cursor-pointer disabled:opacity-40"
                title="Trocar Câmera Frontal / Traseira"
              >
                <SwitchCamera className="w-5 h-5" />
              </button>

              {/* Shutter Button */}
              <button
                type="button"
                onClick={handleTakeSnapshot}
                disabled={!!cameraError}
                className="w-16 h-16 rounded-full bg-white p-1 shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
                title="Capturar Foto"
              >
                <div className="w-full h-full rounded-full border-4 border-slate-900 bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white">
                  <Camera className="w-6 h-6" />
                </div>
              </button>

              {/* Open Native Camera App fallback */}
              <button
                type="button"
                onClick={() => nativeCameraInputRef.current?.click()}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-full transition-colors cursor-pointer"
                title="Abrir Câmera do Sistema"
              >
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
