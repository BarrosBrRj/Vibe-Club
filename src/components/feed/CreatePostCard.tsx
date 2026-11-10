import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, BarChart2, Video, Flame, 
  Send, Sparkles, X, Plus, Compass, Camera, Upload, 
  RefreshCw, Check, Cloud, AlertCircle, Play, Pause, Smile
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CameraCaptureModal } from '../common/CameraCaptureModal';
import { VideoRecorderModal } from '../video/VideoRecorderModal';
import { CloudinaryConfigModal } from '../video/CloudinaryConfigModal';
import { AnimatedEmojiPicker } from '../emoji/AnimatedEmojiPicker';
import { GiphyModal } from '../gif/GiphyModal';
import { 
  generateVideoThumbnail, 
  uploadVideoToCloudinary, 
  uploadImageOrGifToCloudinary,
  hasCloudinaryConfig 
} from '../../lib/cloudinary';
import { compressImageFile } from '../../utils/imageCompressor';

export const CreatePostCard: React.FC<{ defaultCommunityId?: string }> = ({ defaultCommunityId }) => {
  const { currentUser, createPost, communities, showToast, addXP } = useApp();
  const [content, setContent] = useState('');
  const [activeMode, setActiveMode] = useState<'text' | 'media' | 'poll'>('text');
  
  // Media state
  const [mediaType, setMediaType] = useState<'none' | 'image' | 'video'>('none');
  const [mediaUrl, setMediaUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isGif, setIsGif] = useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState<string>('');
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [isVideoPlayingPreview, setIsVideoPlayingPreview] = useState(false);

  // Upload progress & abort controller
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Poll states
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>(defaultCommunityId || '');
  const [vibeTag, setVibeTag] = useState<string>(currentUser?.vibeOfTheDay?.label || '😎 Tranquilo');
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'only_me'>('public');
  
  // Modals & Panels
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isVideoRecorderOpen, setIsVideoRecorderOpen] = useState(false);
  const [isCloudinaryModalOpen, setIsCloudinaryModalOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isGiphyModalOpen, setIsGiphyModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoPreviewElementRef = useRef<HTMLVideoElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  if (!currentUser) return null;

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    } else {
      showToast('Máximo de 4 opções na enquete.', 'info');
    }
  };

  const handlePollOptionChange = (index: number, val: string) => {
    const updated = [...pollOptions];
    updated[index] = val;
    setPollOptions(updated);
  };

  // Inserir emoticon animado no texto do post
  const handleSelectEmoji = (char: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart ?? content.length;
      const end = textareaRef.current.selectionEnd ?? content.length;
      const newText = content.substring(0, start) + char + content.substring(end);
      setContent(newText);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const nextPos = start + char.length;
          textareaRef.current.setSelectionRange(nextPos, nextPos);
        }
      }, 10);
    } else {
      setContent(prev => prev + char);
    }
  };

  // Selecionar GIF do GIPHY
  const handleSelectGif = (gifUrl: string) => {
    handleClearMedia();
    setMediaUrl(gifUrl);
    setMediaType('image');
    setIsGif(true);
    setActiveMode('media');
    setIsGiphyModalOpen(false);
    showToast('GIF anexado ao post com sucesso! ✨', 'success');
  };

  // Limpar mídia selecionada
  const handleClearMedia = () => {
    if (isUploading && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (videoFile && mediaUrl && mediaUrl.startsWith('blob:')) {
      URL.revokeObjectURL(mediaUrl);
    }
    setMediaUrl('');
    setMediaType('none');
    setVideoFile(null);
    setImageFile(null);
    setIsGif(false);
    setVideoThumbnail('');
    setVideoDuration(0);
    setIsUploading(false);
    setUploadProgress(0);
    setIsVideoPlayingPreview(false);
  };

  // Processar arquivo selecionado (Foto, GIF ou Vídeo)
  const processFile = async (file: File) => {
    // 1. Processar Vídeo
    if (file.type.startsWith('video/') || /\.(mp4|mov|webm|m4v|mkv)$/i.test(file.name)) {
      // Limite 1: 50 MB
      const maxSizeBytes = 50 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        showToast(`⚠️ O vídeo tem ${sizeMb} MB. O limite máximo permitido é de 50 MB. Por favor, escolha um vídeo mais leve.`, 'error');
        return;
      }

      showToast('Processando vídeo e gerando miniatura...', 'info');

      // Limite 2: 60 segundos + Gerar miniatura
      try {
        const { thumbnailDataUrl, duration } = await generateVideoThumbnail(file);

        if (duration > 60.5) {
          const durationRounded = Math.round(duration);
          showToast(`⚠️ Este vídeo tem ${durationRounded} segundos. O limite máximo é de 60 segundos (1 minuto).`, 'error');
          return;
        }

        const objectUrl = URL.createObjectURL(file);
        handleClearMedia();
        setVideoFile(file);
        setMediaUrl(objectUrl);
        setMediaType('video');
        setVideoThumbnail(thumbnailDataUrl);
        setVideoDuration(duration);
        setActiveMode('media');
        showToast('Vídeo selecionado com sucesso! 🎬', 'success');
      } catch (err) {
        console.error('Erro ao inspecionar vídeo:', err);
        showToast('Não foi possível ler o arquivo de vídeo. Tente outro formato (MP4, MOV ou WebM).', 'error');
      }
      return;
    }

    // 2. Processar Imagem ou GIF
    if (file.type.startsWith('image/')) {
      if (file.size > 15 * 1024 * 1024) {
        showToast('A imagem ou GIF deve ter no máximo 15 MB.', 'error');
        return;
      }

      const isGifFile = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
      
      compressImageFile(file)
        .then((compressedUrl) => {
          if (compressedUrl) {
            handleClearMedia();
            setMediaUrl(compressedUrl);
            setMediaType('image');
            setImageFile(file);
            setIsGif(isGifFile);
            setActiveMode('media');
            showToast(isGifFile ? 'GIF selecionado com sucesso! 🎞️' : 'Foto selecionada com sucesso! 📸', 'success');
          }
        })
        .catch(() => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (typeof e.target?.result === 'string') {
              handleClearMedia();
              setMediaUrl(e.target.result);
              setMediaType('image');
              setImageFile(file);
              setIsGif(isGifFile);
              setActiveMode('media');
              showToast(isGifFile ? 'GIF selecionado com sucesso! 🎞️' : 'Foto selecionada com sucesso! 📸', 'success');
            }
          };
          reader.readAsDataURL(file);
        });
      return;
    }

    showToast('Formato não suportado. Selecione uma foto, GIF ou vídeo (MP4, MOV, WebM).', 'error');
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = '';
  };

  // Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Cancelar upload em andamento
  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsUploading(false);
    setUploadProgress(0);
    showToast('Envio do vídeo cancelado.', 'info');
  };

  // Enviar publicação
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && activeMode === 'text' && !mediaUrl) {
      showToast('Escreva algo ou adicione uma foto/vídeo para compartilhar sua vibe!', 'error');
      return;
    }

    // 1. Enquete
    if (activeMode === 'poll') {
      const validOptions = pollOptions.filter(o => o.trim().length > 0);
      if (!pollQuestion.trim() || validOptions.length < 2) {
        showToast('Preencha a pergunta e pelo menos 2 opções para a enquete.', 'error');
        return;
      }
      createPost({
        content: content.trim() || pollQuestion.trim(),
        mediaType: 'none',
        pollQuestion: pollQuestion.trim(),
        pollOptions: validOptions,
        communityId: selectedCommunityId || undefined,
        vibeTag,
        privacy
      });
      resetForm();
      return;
    }

    // 2. Vídeo (com upload Cloudinary)
    if (mediaType === 'video' && mediaUrl) {
      let finalVideoUrl = mediaUrl;
      let finalThumbUrl = videoThumbnail;

      // Se temos o arquivo de vídeo e o Cloudinary está configurado, faz upload unsigned
      if (videoFile && hasCloudinaryConfig()) {
        setIsUploading(true);
        setUploadProgress(0);
        abortControllerRef.current = new AbortController();

        try {
          const uploadResult = await uploadVideoToCloudinary(
            videoFile,
            (progress) => setUploadProgress(progress),
            abortControllerRef.current.signal
          );

          finalVideoUrl = uploadResult.url;
          if (uploadResult.thumbnailUrl) {
            finalThumbUrl = uploadResult.thumbnailUrl;
          }
          showToast('Vídeo enviado com sucesso para o Cloudinary! ☁️🎬', 'success');
        } catch (uploadErr: any) {
          if (uploadErr.message === 'UPLOAD_CANCELLED') {
            setIsUploading(false);
            return;
          }
          console.error('Erro no upload para Cloudinary:', uploadErr);
          showToast(`Aviso: ${uploadErr.message || 'Falha no Cloudinary'}. Publicando com visualização local.`, 'info');
        } finally {
          setIsUploading(false);
        }
      } else if (videoFile && !hasCloudinaryConfig()) {
        // Not configured Cloudinary: warn user nicely and allow posting or configuring
        showToast('Dica: Configure o Cloudinary no ícone de nuvem para hospedar vídeos permanentemente na web.', 'info');
      }

      createPost({
        content: content.trim(),
        mediaType: 'video',
        mediaUrl: finalVideoUrl,
        videoThumbnail: finalThumbUrl,
        duration: videoDuration,
        communityId: selectedCommunityId || undefined,
        vibeTag,
        privacy
      });
      resetForm();
      return;
    }

    // 3. Imagem ou GIF
    if (mediaType === 'image' && mediaUrl) {
      let finalImageUrl = mediaUrl;

      // Se temos o arquivo (da galeria, seja GIF ou foto) e o Cloudinary está configurado, faz upload unsigned
      if (imageFile && hasCloudinaryConfig()) {
        setIsUploading(true);
        setUploadProgress(0);
        abortControllerRef.current = new AbortController();

        try {
          const uploadResult = await uploadImageOrGifToCloudinary(
            imageFile,
            (progress) => setUploadProgress(progress),
            abortControllerRef.current.signal
          );
          finalImageUrl = uploadResult.url;
          showToast(isGif ? 'GIF enviado para o Cloudinary! ☁️🎞️' : 'Foto enviada para o Cloudinary! ☁️📸', 'success');
        } catch (uploadErr: any) {
          if (uploadErr.message === 'UPLOAD_CANCELLED') {
            setIsUploading(false);
            return;
          }
          console.warn('Falha no upload para Cloudinary:', uploadErr);
          showToast(`Aviso: ${uploadErr.message || 'Falha no Cloudinary'}. Publicando mídia.`, 'info');
        } finally {
          setIsUploading(false);
        }
      }

      createPost({
        content: content.trim(),
        mediaType: 'image',
        mediaUrl: finalImageUrl,
        communityId: selectedCommunityId || undefined,
        vibeTag,
        privacy
      });
      resetForm();
      return;
    }

    // 4. Texto puro
    createPost({
      content: content.trim(),
      mediaType: 'none',
      communityId: selectedCommunityId || undefined,
      vibeTag,
      privacy
    });
    resetForm();
  };

  const resetForm = () => {
    setContent('');
    handleClearMedia();
    setPollQuestion('');
    setPollOptions(['', '']);
    setActiveMode('text');
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div id="create-post-card" className="w-full max-w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 mb-4 scroll-mt-20 font-sans">
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-white text-slate-800 font-extrabold text-sm px-4 py-2.5 -mx-4 sm:-mx-5 -mt-4 sm:-mt-5 mb-3.5 border-b border-purple-100 flex items-center justify-between">
        <span className="font-extrabold text-slate-900">Mural de Recados & Atualizações</span>
        <span className="text-xs font-medium text-purple-700">Compartilhe uma novidade, foto ou recado</span>
      </div>
      <div className="flex items-start gap-3.5 w-full max-w-full min-w-0">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-12 h-12 rounded-full border-2 border-purple-200 object-cover shrink-0 shadow-xs"
        />
        <div className="flex-1 min-w-0 w-full max-w-full">
          <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-full min-w-0">
            <textarea
              ref={textareaRef}
              id="create-post-textarea"
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`No que você está pensando, ${currentUser.name.split(' ')[0]}? Deixe um recado...`}
              className="w-full p-3 bg-slate-50 text-sm sm:text-base border border-slate-200 rounded-xl outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-200 resize-none font-normal"
            />

            {/* Painel Emoticons Animados do Google Noto */}
            {isEmojiPickerOpen && (
              <div className="pt-1 pb-1 w-full max-w-full flex justify-start">
                <AnimatedEmojiPicker
                  onSelectEmoji={handleSelectEmoji}
                  onClose={() => setIsEmojiPickerOpen(false)}
                />
              </div>
            )}

            {/* Mídia: Painel Foto / Vídeo / Câmera */}
            {activeMode === 'media' && (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`p-3.5 sm:p-4 bg-purple-50/70 rounded-2xl border ${
                  isDragging ? 'border-purple-600 bg-purple-100/70' : 'border-purple-200'
                } space-y-3 animate-in fade-in transition-all w-full max-w-full overflow-hidden`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-purple-950">
                  <span className="flex items-center gap-1.5">
                    {mediaType === 'video' ? (
                      <Video className="w-4 h-4 text-rose-600" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-purple-600" />
                    )}
                    {mediaType === 'video' ? 'Vídeo Anexado' : mediaType === 'image' ? 'Foto Anexada' : 'Foto, Vídeo ou Câmera'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCloudinaryModalOpen(true)}
                      className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-lg border border-purple-200 cursor-pointer"
                      title="Configurar Cloudinary"
                    >
                      <Cloud className="w-3 h-3 text-sky-500" />
                      <span>{hasCloudinaryConfig() ? 'Cloudinary Ativo' : 'Configurar Nuvem'}</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        handleClearMedia();
                        setActiveMode('text');
                      }} 
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white/80 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* PRÉ-VISUALIZAÇÃO DO VÍDEO COM CONTROLES E BOTÃO CANCELAR */}
                {mediaType === 'video' && mediaUrl && (
                  <div className="space-y-3 w-full max-w-full">
                    <div className="relative rounded-2xl overflow-hidden border border-purple-200 bg-black group max-h-72 flex items-center justify-center">
                      <video
                        ref={videoPreviewElementRef}
                        src={mediaUrl}
                        poster={videoThumbnail}
                        playsInline
                        loop
                        className="w-full max-h-72 object-contain bg-black mx-auto"
                        onPlay={() => setIsVideoPlayingPreview(true)}
                        onPause={() => setIsVideoPlayingPreview(false)}
                      />

                      {/* Play/Pause Button Overlay */}
                      <button
                        type="button"
                        onClick={() => {
                          if (videoPreviewElementRef.current) {
                            if (videoPreviewElementRef.current.paused) {
                              videoPreviewElementRef.current.play().catch(() => {});
                            } else {
                              videoPreviewElementRef.current.pause();
                            }
                          }
                        }}
                        className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-transform active:scale-95"
                      >
                        {isVideoPlayingPreview ? (
                          <Pause className="w-6 h-6" />
                        ) : (
                          <Play className="w-6 h-6 fill-white translate-x-0.5" />
                        )}
                      </button>

                      {/* Duration & Size Badges */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-white font-mono text-[11px] font-bold">
                          ⏱️ {formatDuration(videoDuration)} / 01:00
                        </span>
                        {videoFile && (
                          <span className="px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-slate-200 text-[11px]">
                            📦 {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                          </span>
                        )}
                      </div>

                      {/* Botão Cancelar / Remover Prévia */}
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleClearMedia}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold backdrop-blur-md flex items-center gap-1 cursor-pointer transition-colors shadow-md"
                          title="Remover e cancelar vídeo"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancelar</span>
                        </button>
                      </div>

                      {/* Thumbnail generation indicator */}
                      {videoThumbnail && (
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-lg text-[10px] text-emerald-300 font-medium flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-400" /> Miniatura automática gerada
                        </div>
                      )}
                    </div>

                    {/* BARRA DE PROGRESSO DO ENVIO COM BOTÃO CANCELAR */}
                    {isUploading && (
                      <div className="p-3 bg-white rounded-2xl border border-indigo-200 shadow-xs space-y-2 animate-in fade-in">
                        <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                          <span className="flex items-center gap-1.5">
                            <Cloud className="w-4 h-4 text-sky-500 animate-pulse" />
                            Enviando vídeo para o Cloudinary ({uploadProgress}%)
                          </span>
                          <button
                            type="button"
                            onClick={handleCancelUpload}
                            className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                          >
                            Cancelar Envio
                          </button>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-sky-500 to-indigo-600 h-full rounded-full transition-all duration-200"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* PRÉ-VISUALIZAÇÃO DA FOTO OU GIF */}
                {mediaType === 'image' && mediaUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-purple-200 bg-slate-900 group max-w-full">
                    <img
                      src={mediaUrl}
                      alt="Preview"
                      className="w-full max-h-72 object-contain bg-black/40"
                    />

                    {/* Badge se for GIF */}
                    {(isGif || mediaUrl.includes('.gif') || mediaUrl.includes('giphy.com')) && (
                      <div className="absolute top-2 left-2 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md text-white font-black text-[10px] tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>GIF</span>
                        {mediaUrl.includes('giphy') && <span className="text-purple-300 font-bold">• GIPHY</span>}
                      </div>
                    )}

                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      {isGif && mediaUrl.includes('giphy') ? (
                        <button
                          type="button"
                          onClick={() => setIsGiphyModalOpen(true)}
                          className="px-2.5 py-1.5 bg-black/70 hover:bg-black/90 text-white rounded-xl text-xs font-bold backdrop-blur-md flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Trocar GIF</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1.5 bg-black/70 hover:bg-black/90 text-white rounded-xl text-xs font-bold backdrop-blur-md flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Trocar</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleClearMedia}
                        className="px-2.5 py-1.5 bg-red-600/85 hover:bg-red-600 text-white rounded-xl text-xs font-bold backdrop-blur-md flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                        title="Remover mídia do post"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Remover</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* SE NENHUMA MÍDIA ESTIVER ANEXADA: BOTÕES DE SELEÇÃO */}
                {!mediaUrl && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      
                      {/* Botão 1: Gravar Vídeo na Hora (60s) */}
                      <button
                        type="button"
                        id="btn-record-video-now"
                        onClick={() => setIsVideoRecorderOpen(true)}
                        className="py-3 px-3 rounded-2xl bg-white hover:bg-rose-50 border-2 border-rose-200 hover:border-rose-400 text-rose-950 font-bold text-xs flex items-center gap-2.5 shadow-xs transition-all cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Video className="w-4 h-4" />
                        </div>
                        <div className="text-left min-w-0">
                          <div className="font-extrabold text-xs text-rose-950 truncate">Gravar Vídeo</div>
                          <div className="text-[10px] text-rose-600 font-medium">Até 60 segundos</div>
                        </div>
                      </button>

                      {/* Botão 2: Tirar Foto (Câmera) */}
                      <button
                        type="button"
                        id="btn-take-photo-camera"
                        onClick={() => setIsCameraModalOpen(true)}
                        className="py-3 px-3 rounded-2xl bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400 text-purple-950 font-bold text-xs flex items-center gap-2.5 shadow-xs transition-all cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Camera className="w-4 h-4" />
                        </div>
                        <div className="text-left min-w-0">
                          <div className="font-extrabold text-xs text-purple-950 truncate">Tirar Foto</div>
                          <div className="text-[10px] text-purple-600 font-medium">Câmera fotográfica</div>
                        </div>
                      </button>

                      {/* Botão 3: Buscar na Galeria (Fotos ou Vídeos) */}
                      <button
                        type="button"
                        id="btn-choose-from-gallery"
                        onClick={() => fileInputRef.current?.click()}
                        className="py-3 px-3 rounded-2xl bg-white hover:bg-sky-50 border-2 border-sky-200 hover:border-sky-400 text-sky-950 font-bold text-xs flex items-center gap-2.5 shadow-xs transition-all cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div className="text-left min-w-0">
                          <div className="font-extrabold text-xs text-sky-950 truncate">Galeria / Arquivo</div>
                          <div className="text-[10px] text-sky-600 font-medium">MP4, MOV, WebM, Fotos</div>
                        </div>
                      </button>

                    </div>

                    {/* Dica de limites amigável */}
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-purple-100 text-[11px] text-purple-900 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span>Limites de vídeo: máximo <strong>60 segundos</strong> e até <strong>50 MB</strong>. Miniatura gerada automaticamente!</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hidden Input for Local Files (Images & Videos) */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/mp4,video/quicktime,video/webm,video/x-m4v,video/*"
              className="hidden"
              onChange={handleFileInputChange}
            />

            {/* Poll Panel */}
            {activeMode === 'poll' && (
              <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-purple-950">
                  <span className="flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4 text-amber-500" />
                    Criar Enquete
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setActiveMode('text')} 
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="Qual é a pergunta da enquete?"
                  className="w-full p-2.5 bg-white text-xs rounded-xl border border-purple-200 outline-hidden font-semibold"
                />

                <div className="space-y-1.5">
                  {pollOptions.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      value={opt}
                      onChange={(e) => handlePollOptionChange(i, e.target.value)}
                      placeholder={`Opção ${i + 1}`}
                      className="w-full p-2 bg-white text-xs rounded-xl border border-slate-200 outline-hidden"
                    />
                  ))}
                </div>

                {pollOptions.length < 4 && (
                  <button
                    type="button"
                    onClick={handleAddPollOption}
                    className="text-xs text-purple-700 font-bold hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar mais uma opção
                  </button>
                )}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 w-full max-w-full">
              
              {/* Type Selectors */}
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto max-w-full min-w-0">
                
                {/* 1. Botão Foto / Vídeo / Câmera */}
                <button
                  type="button"
                  id="create-post-photo-btn"
                  onClick={() => setActiveMode(activeMode === 'media' ? 'text' : 'media')}
                  className={`shrink-0 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeMode === 'media' 
                      ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-300' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-emerald-500" />
                    <Video className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                  <span className="whitespace-nowrap">Foto / Vídeo / Câmera</span>
                </button>

                {/* 2. Botão Emoticons Animados 😀 */}
                <button
                  type="button"
                  id="create-post-emoji-btn"
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  className={`shrink-0 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isEmojiPickerOpen 
                      ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Emoticons animados do Google Noto"
                >
                  <span className="text-sm">😀</span>
                  <span className="whitespace-nowrap">Emoticons</span>
                </button>

                {/* 3. Botão GIF */}
                <button
                  type="button"
                  id="create-post-gif-btn"
                  onClick={() => setIsGiphyModalOpen(true)}
                  className={`shrink-0 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isGif && mediaUrl
                      ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-300' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Pesquisar e adicionar GIFs do GIPHY"
                >
                  <span className="px-1.5 py-0.5 rounded-md bg-purple-600 text-white font-black text-[10px] tracking-wide">
                    GIF
                  </span>
                  <span className="whitespace-nowrap">GIFs</span>
                </button>

                {/* 4. Botão Enquete */}
                <button
                  type="button"
                  id="create-post-poll-btn"
                  onClick={() => setActiveMode(activeMode === 'poll' ? 'text' : 'poll')}
                  className={`shrink-0 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeMode === 'poll' ? 'bg-purple-100 text-purple-700' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <BarChart2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Enquete</span>
                </button>

                {/* Seletor Feed Geral */}
                <div className="relative max-w-full min-w-0">
                  <select
                    value={selectedCommunityId}
                    onChange={(e) => setSelectedCommunityId(e.target.value)}
                    className="w-full max-w-full text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-2.5 rounded-xl border-none outline-hidden cursor-pointer truncate"
                  >
                    <option value="">🏠 Feed Geral</option>
                    {communities.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Seletor de Privacidade */}
                <div className="relative max-w-full min-w-0">
                  <select
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value as 'public' | 'friends' | 'only_me')}
                    className="w-full max-w-full text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-2.5 rounded-xl border-none outline-hidden cursor-pointer truncate"
                    title="Quem pode ver esta publicação"
                  >
                    <option value="public">🌍 Público</option>
                    <option value="friends">👥 Amigos</option>
                    <option value="only_me">🔒 Só eu</option>
                  </select>
                </div>
              </div>

              {/* Botão Publicar */}
              <button
                type="submit"
                id="create-post-submit-btn"
                disabled={isUploading}
                className="vibe-btn flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50 text-sm py-2 px-5"
              >
                {isUploading ? (
                  <>
                    <Cloud className="w-3.5 h-3.5 animate-pulse" />
                    <span>Enviando {uploadProgress}%</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Publicar</span>
                  </>
                )}
              </button>

            </div>
          </form>
        </div>
      </div>

      {/* Live Camera Viewfinder Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={(imgData) => {
          handleClearMedia();
          setMediaUrl(imgData);
          setMediaType('image');
          setActiveMode('media');
          showToast('Foto capturada pela câmera! 📸', 'success');
        }}
      />

      {/* Live Video Recorder Modal (Até 60s) */}
      <VideoRecorderModal
        isOpen={isVideoRecorderOpen}
        onClose={() => setIsVideoRecorderOpen(false)}
        onVideoRecorded={(file, thumb, dur) => {
          handleClearMedia();
          const objectUrl = URL.createObjectURL(file);
          setVideoFile(file);
          setMediaUrl(objectUrl);
          setMediaType('video');
          setVideoThumbnail(thumb);
          setVideoDuration(dur);
          setActiveMode('media');
          showToast('Vídeo gravado com sucesso! Pronto para publicar. 🎬', 'success');
        }}
      />

      {/* Cloudinary Settings Modal */}
      <CloudinaryConfigModal
        isOpen={isCloudinaryModalOpen}
        onClose={() => setIsCloudinaryModalOpen(false)}
      />

      {/* GIPHY Search & Trending Modal */}
      <GiphyModal
        isOpen={isGiphyModalOpen}
        onClose={() => setIsGiphyModalOpen(false)}
        onSelectGif={handleSelectGif}
      />

    </div>
  );
};
