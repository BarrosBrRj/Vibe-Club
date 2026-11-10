import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Upload, Link as LinkIcon, Image as ImageIcon, X, Check, 
  Sparkles, Move, RotateCcw, RotateCw, ZoomIn, ZoomOut, Maximize2,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight
} from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';

interface CoverUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCover: string;
  currentPositionY?: number;
  currentPositionX?: number;
  currentZoom?: number;
  currentRotation?: number;
  onSaveCover: (
    newCoverUrl: string, 
    positionY?: number, 
    positionX?: number, 
    zoom?: number, 
    rotation?: number
  ) => void;
  title?: string;
}

const PRESET_COVERS = [
  {
    id: 'retro_gradient',
    title: 'Gradiente Oficial Vibe Clube',
    category: 'Vibe Club',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1400&auto=format&fit=crop&q=80'
  },
  {
    id: 'cyber_neon',
    title: 'Neon & Synthwave',
    category: 'Cyber',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1400&auto=format&fit=crop&q=80'
  },
  {
    id: 'nostalgia_sunset',
    title: 'Pôr do Sol Dourado',
    category: 'Natureza',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&auto=format&fit=crop&q=80'
  },
  {
    id: 'indie_music',
    title: 'Fitas K7 & Rock Clássico',
    category: 'Música',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1400&auto=format&fit=crop&q=80'
  },
  {
    id: 'cosmic_night',
    title: 'Universo Estrelado & Galáxia',
    category: 'Aesthetic',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1400&auto=format&fit=crop&q=80'
  },
  {
    id: 'vintage_record',
    title: 'Discos de Vinil & Retrô',
    category: 'Retrô',
    url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1400&auto=format&fit=crop&q=80'
  }
];

export const CoverUploadModal: React.FC<CoverUploadModalProps> = ({
  isOpen,
  onClose,
  currentCover,
  currentPositionY = 50,
  currentPositionX = 50,
  currentZoom = 1,
  currentRotation = 0,
  onSaveCover,
  title = 'Alterar Foto de Capa'
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [selectedUrl, setSelectedUrl] = useState<string>(currentCover);
  const [positionY, setPositionY] = useState<number>(currentPositionY ?? 50);
  const [positionX, setPositionX] = useState<number>(currentPositionX ?? 50);
  const [zoom, setZoom] = useState<number>(currentZoom ?? 1);
  const [rotation, setRotation] = useState<number>(currentRotation ?? 0);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Track dragging coordinates
  const dragStartXRef = useRef<number>(0);
  const dragStartYRef = useRef<number>(0);
  const startPosXRef = useRef<number>(50);
  const startPosYRef = useRef<number>(50);

  // Sync initial state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedUrl(currentCover);
      setPositionY(typeof currentPositionY === 'number' ? currentPositionY : 50);
      setPositionX(typeof currentPositionX === 'number' ? currentPositionX : 50);
      setZoom(typeof currentZoom === 'number' ? currentZoom : 1);
      setRotation(typeof currentRotation === 'number' ? currentRotation : 0);
    }
  }, [isOpen, currentCover, currentPositionY, currentPositionX, currentZoom, currentRotation]);

  // CRITICAL: Block native page/modal scroll on touch so ONLY the photo moves inside the frame
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;

    const onTouchPrevent = (e: TouchEvent) => {
      // Prevent browser from scrolling the modal or screen while user is dragging the image
      e.preventDefault();
      e.stopPropagation();
    };

    el.addEventListener('touchstart', onTouchPrevent, { passive: false });
    el.addEventListener('touchmove', onTouchPrevent, { passive: false });

    return () => {
      el.removeEventListener('touchstart', onTouchPrevent);
      el.removeEventListener('touchmove', onTouchPrevent);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Touch and mouse drag handlers: moves ONLY the photo inside the frame
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartXRef.current = clientX;
    dragStartYRef.current = clientY;
    startPosXRef.current = positionX;
    startPosYRef.current = positionY;
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || !previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const width = rect.width || 300;
    const height = rect.height || 160;

    // Moving mouse/finger changes photo focal point:
    // Dragging right pulls left part into view (decreases positionX)
    // Dragging down pulls top part into view (decreases positionY)
    const deltaX = clientX - dragStartXRef.current;
    const deltaY = clientY - dragStartYRef.current;

    const deltaPercentX = (deltaX / width) * 100;
    const deltaPercentY = (deltaY / height) * 100;

    const newX = Math.min(100, Math.max(0, startPosXRef.current - deltaPercentX));
    const newY = Math.min(100, Math.max(0, startPosYRef.current - deltaPercentY));

    setPositionX(Math.round(newX));
    setPositionY(Math.round(newY));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleDragStart(e.clientX, e.clientY);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      handleDragMove(e.clientX, e.clientY);
    }
  };

  // Touch events for mobile phones/tablets
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length > 0) {
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressed = await compressImage(file, 1280, 0.85);
        if (compressed) {
          setSelectedUrl(compressed);
          setPositionX(50);
          setPositionY(50);
          setZoom(1);
          setRotation(0);
        }
      } catch (err) {
        console.error('Failed to compress cover image', err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const rotate90 = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const resetPosition = () => {
    setPositionX(50);
    setPositionY(50);
    setZoom(1);
    setRotation(0);
  };

  const handleApply = () => {
    if (selectedUrl) {
      onSaveCover(selectedUrl, positionY, positionX, zoom, rotation);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-sans animate-in fade-in">
      <div 
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[94vh]"
        onMouseUp={handleDragEnd}
        onTouchEnd={handleDragEnd}
      >
        {/* Header */}
        <div className="p-3.5 px-5 bg-gradient-to-r from-purple-50 via-pink-50 to-white border-b border-purple-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-purple-600" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fixed Bounding Frame - ONLY THE PHOTO MOVES INSIDE */}
        <div className="p-4 pb-2 bg-slate-50/70 shrink-0">
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <span>Mova a foto para escolher o ângulo certo:</span>
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200/60 px-2 py-0.5 rounded-md">
              <span>X: {positionX}%</span>
              <span>•</span>
              <span>Y: {positionY}%</span>
              {rotation > 0 && <span>• {rotation}°</span>}
            </div>
          </div>

          {/* Draggable Viewport: touch-action none isolates movement strictly to the photo */}
          <div
            ref={previewRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            style={{ touchAction: 'none' }}
            className={`relative h-36 sm:h-48 rounded-2xl border-2 border-purple-400 bg-slate-950 overflow-hidden shadow-inner select-none transition-shadow ${
              isDragging ? 'cursor-grabbing ring-4 ring-purple-500/30' : 'cursor-grab hover:border-purple-500'
            }`}
            title="Arraste a foto com o dedo ou mouse para escolher o ângulo perfeito"
          >
            {/* The photo that moves smoothly inside the fixed frame */}
            <img
              src={selectedUrl || currentCover}
              alt="Foto de Capa"
              className="w-full h-full object-cover pointer-events-none select-none transition-transform duration-75"
              style={{ 
                objectPosition: `${positionX}% ${positionY}%`,
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: `${positionX}% ${positionY}%`
              }}
              draggable={false}
            />

            {/* Visual Guide Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2.5 bg-black/10">
              <div className="self-center bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-white/20">
                <Move className="w-3 h-3 text-pink-300 animate-pulse" />
                <span>Mova só a foto para enquadrar</span>
              </div>
              <div className="self-end text-[10px] text-white/90 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                {isDragging ? 'Movendo foto...' : 'Arraste em qualquer direção'}
              </div>
            </div>
          </div>

          {/* Quick Angle, Zoom & Position Controls */}
          <div className="mt-2.5 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
            
            {/* Sliders: Zoom & Angle */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
              
              {/* Zoom Control */}
              <div className="flex items-center gap-2 flex-1">
                <span className="text-[11px] font-bold text-slate-600 shrink-0 flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5 text-purple-600" />
                  Zoom:
                </span>
                <input
                  type="range"
                  min="1"
                  max="2.2"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-purple-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
                />
                <span className="text-[11px] font-semibold text-slate-500 w-9 text-right">
                  {zoom.toFixed(1)}x
                </span>
              </div>

              {/* Action Buttons: Rotate angle & Reset */}
              <div className="flex items-center gap-1.5 shrink-0 justify-end">
                <button
                  type="button"
                  onClick={rotate90}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  title="Girar foto em 90 graus para acertar o ângulo"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Girar Ângulo</span>
                </button>

                <button
                  type="button"
                  onClick={resetPosition}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  title="Restaurar posição original"
                >
                  Centralizar
                </button>
              </div>
            </div>

            {/* Vertical & Horizontal Quick Presets */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              <span className="font-semibold text-slate-600">Enquadramento rápido:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => { setPositionX(50); setPositionY(0); }}
                  className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 hover:bg-purple-100 hover:text-purple-700 font-semibold cursor-pointer"
                >
                  Topo
                </button>
                <button
                  type="button"
                  onClick={() => { setPositionX(50); setPositionY(50); }}
                  className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 hover:bg-purple-100 hover:text-purple-700 font-semibold cursor-pointer"
                >
                  Centro
                </button>
                <button
                  type="button"
                  onClick={() => { setPositionX(50); setPositionY(100); }}
                  className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 hover:bg-purple-100 hover:text-purple-700 font-semibold cursor-pointer"
                >
                  Fundo
                </button>
                <button
                  type="button"
                  onClick={() => { setPositionX(0); setPositionY(50); }}
                  className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 hover:bg-purple-100 hover:text-purple-700 font-semibold cursor-pointer"
                >
                  Esquerda
                </button>
                <button
                  type="button"
                  onClick={() => { setPositionX(100); setPositionY(50); }}
                  className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 hover:bg-purple-100 hover:text-purple-700 font-semibold cursor-pointer"
                >
                  Direita
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Source Tabs */}
        <div className="px-4 border-b border-slate-200 flex gap-2 pt-2 bg-slate-50/70 shrink-0">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-white text-purple-700 border-b-2 border-purple-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Capas Prontas
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-purple-700 border-b-2 border-purple-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Enviar do Dispositivo
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'bg-white text-purple-700 border-b-2 border-purple-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Colar Link (URL)
          </button>
        </div>

        {/* Tab content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          {activeTab === 'presets' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRESET_COVERS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => {
                    setSelectedUrl(preset.url);
                    setPositionX(50);
                    setPositionY(50);
                    setZoom(1);
                    setRotation(0);
                  }}
                  className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-video ${
                    selectedUrl === preset.url
                      ? 'border-purple-600 ring-2 ring-purple-300 shadow-md scale-102'
                      : 'border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end">
                    <span className="text-[11px] font-bold text-white truncate">{preset.title}</span>
                    <span className="text-[9px] text-purple-200">{preset.category}</span>
                  </div>
                  {selectedUrl === preset.url && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4 text-center py-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 rounded-2xl p-6 sm:p-8 cursor-pointer transition-colors flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    {isCompressing ? 'Otimizando imagem...' : 'Clique para selecionar uma foto da galeria ou computador'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Formatos: JPG, PNG, WEBP (a imagem será carregada no quadro para você ajustar o ângulo)
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-3 py-2">
              <label className="text-xs font-bold text-slate-700 block">Insira a URL direta da imagem:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://exemplo.com/minha-capa.jpg"
                  className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (urlInput.trim()) {
                      setSelectedUrl(urlInput.trim());
                      setPositionX(50);
                      setPositionY(50);
                      setZoom(1);
                      setRotation(0);
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shrink-0"
                >
                  Carregar
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Após carregar, arraste a foto na caixa acima para escolher o enquadramento e o ângulo ideal.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-slate-600 hover:underline cursor-pointer font-medium"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="vibe-btn flex items-center gap-1.5 cursor-pointer text-xs py-2 px-4 shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Salvar Foto e Ângulo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
