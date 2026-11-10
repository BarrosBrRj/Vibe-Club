import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, Plus, Heart, MessageSquare, 
  Lock, Globe, Users, X, ArrowLeft, Send, Camera, Upload, 
  RefreshCw, Check, Link as LinkIcon 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PhotoAlbum, PhotoItem } from '../../types';
import { CameraCaptureModal } from '../common/CameraCaptureModal';

export const PhotosView: React.FC = () => {
  const { albums, addPhotoToAlbum, currentUser, showToast } = useApp();
  const [selectedAlbum, setSelectedAlbum] = useState<PhotoAlbum | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoItem | null>(null);

  // Upload photo form
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);

  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);

  const samplePhotoPresets = [
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&auto=format&fit=crop&q=80'
  ];

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Por favor, selecione um arquivo de imagem válido.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setPhotoUrl(e.target.result);
        showToast('Foto selecionada com sucesso!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
    e.target.value = '';
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlbum) return;
    if (!photoUrl.trim()) {
      showToast('Escolha ou tire uma foto para adicionar ao álbum!', 'error');
      return;
    }

    addPhotoToAlbum(selectedAlbum.id, photoUrl.trim(), photoCaption.trim());
    setShowUploadModal(false);
    setPhotoUrl('');
    setPhotoCaption('');
    setShowUrlField(false);

    // Update selected album reference
    const updated = albums.find(a => a.id === selectedAlbum.id);
    if (updated) setSelectedAlbum(updated);
  };

  // If an album is opened
  if (selectedAlbum) {
    return (
      <div className="max-w-4xl mx-auto w-full space-y-5">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedAlbum(null)}
            className="flex items-center gap-2 text-xs font-bold text-purple-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs hover:bg-purple-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Todos os Álbuns</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Nova Foto</span>
          </button>
        </div>

        {/* Album Cover & Meta */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{selectedAlbum.title}</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">{selectedAlbum.description}</p>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                <span>{selectedAlbum.photos.length} fotos</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  {selectedAlbum.privacy === 'public' && <><Globe className="w-3.5 h-3.5" /> Público</>}
                  {selectedAlbum.privacy === 'friends' && <><Users className="w-3.5 h-3.5" /> Somente Amigos</>}
                  {selectedAlbum.privacy === 'private' && <><Lock className="w-3.5 h-3.5" /> Privado</>}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {selectedAlbum.photos.map(photo => (
            <div
              key={photo.id}
              onClick={() => setLightboxPhoto(photo)}
              className="group relative aspect-square bg-slate-900 rounded-2xl overflow-hidden cursor-pointer shadow-xs border border-slate-200"
            >
              <img
                src={photo.url}
                alt={photo.caption || 'Foto'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end text-white">
                <div className="text-xs font-semibold truncate">{photo.caption || 'Ver foto'}</div>
                <div className="flex items-center gap-2 text-[10px] text-slate-300 mt-0.5">
                  <span className="flex items-center gap-0.5"><Heart className="w-3 h-3 text-pink-400 fill-pink-400" /> {photo.likes}</span>
                  <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" /> {photo.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Photo Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-600" />
                  <span>Adicionar Foto ao Álbum</span>
                </h3>
                <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-3">
                {/* Photo Preview or Selection options */}
                {photoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-purple-200 bg-slate-900">
                    <img
                      src={photoUrl}
                      alt="Preview"
                      className="w-full max-h-56 object-contain bg-black/50"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="px-2.5 py-1.5 bg-black/70 hover:bg-black/90 text-white rounded-xl text-xs font-bold backdrop-blur-md flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Trocar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        className="p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-xl text-xs backdrop-blur-md cursor-pointer transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] text-white font-medium flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" /> Foto Pronta
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Tirar Foto */}
                      <button
                        type="button"
                        onClick={() => setIsCameraModalOpen(true)}
                        className="py-3.5 px-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-extrabold text-xs flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                          <Camera className="w-4 h-4" />
                        </div>
                        <span>Tirar Foto</span>
                      </button>

                      {/* Buscar na Galeria */}
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="py-3.5 px-3 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-900 font-extrabold text-xs flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-xl bg-pink-600 text-white flex items-center justify-center shadow-xs">
                          <Upload className="w-4 h-4" />
                        </div>
                        <span>Buscar na Galeria</span>
                      </button>
                    </div>

                    {/* Toggle Web Link */}
                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => setShowUrlField(!showUrlField)}
                        className="text-[11px] text-purple-700 font-bold flex items-center justify-center gap-1 mx-auto cursor-pointer"
                      >
                        <LinkIcon className="w-3 h-3" />
                        <span>{showUrlField ? 'Ocultar URL' : 'Ou colar link da web'}</span>
                      </button>
                    </div>

                    {showUrlField && (
                      <div className="space-y-2 pt-1">
                        <input
                          type="url"
                          value={photoUrl}
                          onChange={(e) => setPhotoUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden"
                        />
                        <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                          <span className="text-[10px] text-purple-700 font-bold shrink-0">Sugestões:</span>
                          {samplePhotoPresets.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="Preset"
                              onClick={() => setPhotoUrl(img)}
                              className={`w-10 h-10 rounded-lg object-cover cursor-pointer border-2 transition-all shrink-0 ${
                                photoUrl === img ? 'border-purple-600 scale-105' : 'border-transparent hover:opacity-80'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Hidden gallery file input */}
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryInput}
                  className="hidden"
                />

                {/* Hidden native camera file input */}
                <input
                  ref={nativeCameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleGalleryInput}
                  className="hidden"
                />

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Legenda / Memória:</label>
                  <input
                    type="text"
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder="Descreva este momento especial..."
                    className="w-full p-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-3.5 py-2 text-xs text-slate-500 font-semibold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Salvar no Álbum
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Camera Modal */}
        <CameraCaptureModal
          isOpen={isCameraModalOpen}
          onClose={() => setIsCameraModalOpen(false)}
          onCapture={(img) => {
            setPhotoUrl(img);
            showToast('Foto capturada pela câmera!', 'success');
          }}
        />

        {/* Lightbox Modal */}
        {lightboxPhoto && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-3xl w-full bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] flex items-center justify-center bg-black">
                <img src={lightboxPhoto.url} alt={lightboxPhoto.caption} className="max-h-[70vh] w-auto object-contain" />
              </div>

              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{lightboxPhoto.caption || 'Foto do Álbum'}</p>
                  <span className="text-[10px] text-slate-400">{lightboxPhoto.createdAt}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-pink-400 font-bold text-xs">
                    <Heart className="w-4 h-4 fill-pink-400" /> {lightboxPhoto.likes}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // Albums Directory
  return (
    <div className="max-w-4xl mx-auto w-full space-y-5">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-600 text-white rounded-3xl p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-pink-300">
            <ImageIcon className="w-4 h-4" />
            <span>ÁLBUNS DE FOTOS & RECORDAÇÕES</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-0.5">
            Suas melhores memórias organizadas com carinho
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-xl">
            Crie álbuns temáticos, defina quem pode ver e colecione momentos inesquecíveis.
          </p>
        </div>
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {albums.map(album => (
          <div
            key={album.id}
            onClick={() => setSelectedAlbum(album)}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="h-44 bg-slate-800 relative overflow-hidden">
                <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-md">
                  {album.photos.length} fotos
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                  {album.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {album.description}
                </p>
              </div>
            </div>

            <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-slate-50 text-xs text-slate-400">
              <span>{album.photos.length} imagens</span>
              <span className="text-purple-600 font-semibold group-hover:underline">Abrir Álbum →</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
