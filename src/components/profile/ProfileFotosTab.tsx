import React, { useState, useRef } from 'react';
import { Camera, Plus, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Album, User } from '../../types';

interface ProfileFotosTabProps {
  albums: Album[];
  user: User;
  isOwnProfile: boolean;
  onAddPhotoToAlbum?: (albumId: string, photoUrl: string, caption?: string) => void;
  onCreateAlbum?: (title: string, description: string, coverPhoto: string) => void;
}

export const ProfileFotosTab: React.FC<ProfileFotosTabProps> = ({
  albums,
  user,
  isOwnProfile,
  onAddPhotoToAlbum,
  onCreateAlbum
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; caption?: string } | null>(null);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allPhotos: { url: string; caption?: string; albumTitle?: string }[] = [];

  albums.forEach(album => {
    album.photos.forEach(photo => {
      allPhotos.push({
        url: photo.url,
        caption: photo.caption,
        albumTitle: album.title
      });
    });
  });

  if (allPhotos.length === 0) {
    if (user.coverImage) allPhotos.push({ url: user.coverImage, caption: 'Foto de Capa' });
    if (user.avatar) allPhotos.push({ url: user.avatar, caption: 'Foto de Perfil' });
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (!newPhotoUrl) return;
    if (albums.length > 0 && onAddPhotoToAlbum) {
      onAddPhotoToAlbum(albums[0].id, newPhotoUrl, newPhotoCaption);
    } else if (onCreateAlbum) {
      onCreateAlbum('Álbum Geral', 'Fotos do meu perfil', newPhotoUrl);
    }
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setShowAddPhotoModal(false);
  };

  return (
    <div className="space-y-3 font-sans">
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-white px-4 py-2.5 border-b border-purple-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-extrabold text-slate-900">
            <ImageIcon className="w-4 h-4 text-purple-600" />
            <span>Álbum de Fotos de {user.name} ({allPhotos.length})</span>
          </div>
          {isOwnProfile && (
            <button
              onClick={() => setShowAddPhotoModal(true)}
              className="vibe-btn text-xs py-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar foto</span>
            </button>
          )}
        </div>

        {/* Photos Grid */}
        <div className="p-4">
          {allPhotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {allPhotos.map((photo, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(photo)}
                  className="bg-white rounded-xl border border-slate-200/90 p-2 hover:border-purple-300 hover:shadow-xs transition-all cursor-pointer group flex flex-col items-center"
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-100 mb-2 relative">
                    <img
                      src={photo.url}
                      alt={photo.caption || `Foto ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="w-full text-center">
                    <p className="text-xs text-slate-800 font-bold truncate group-hover:text-purple-700">
                      {photo.caption || `Foto #${idx + 1}`}
                    </p>
                    {photo.albumTitle && (
                      <span className="text-[10px] text-slate-400 block truncate">
                        {photo.albumTitle}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-500">
              Nenhuma foto cadastrada ainda.
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10"
          >
            <div className="p-3 px-4 bg-slate-950 flex items-center justify-between text-xs font-bold text-white">
              <span>Visualizar foto</span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 bg-black flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={selectedPhoto.url}
                alt="Foto ampliada"
                className="max-w-full max-h-[65vh] object-contain"
              />
            </div>
            {selectedPhoto.caption && (
              <div className="p-3 bg-slate-950 text-xs text-slate-300 border-t border-white/10">
                <strong>Legenda:</strong> {selectedPhoto.caption}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="p-3.5 px-4 bg-gradient-to-r from-purple-50 via-pink-50 to-white border-b border-purple-100 flex items-center justify-between text-xs font-extrabold text-slate-900">
              <span>Adicionar foto ao álbum</span>
              <button
                onClick={() => setShowAddPhotoModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3.5 text-xs">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/40 rounded-xl p-5 text-center cursor-pointer transition-colors"
              >
                <Camera className="w-6 h-6 text-purple-600 mx-auto mb-1.5" />
                <p className="font-bold text-slate-800">Clique para escolher do seu dispositivo</p>
                <span className="text-[11px] text-slate-400">JPG, PNG ou WebP</span>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Ou cole uma URL da foto:</label>
                <input
                  type="text"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Legenda da foto:</label>
                <input
                  type="text"
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  placeholder="Ex: Passeio de fim de semana com os amigos!"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-purple-500 focus:bg-white"
                />
              </div>

              {newPhotoUrl && (
                <div className="h-32 rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img src={newPhotoUrl} alt="Preview" className="h-full object-cover" />
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddPhotoModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:underline cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSavePhoto}
                disabled={!newPhotoUrl}
                className="vibe-btn"
              >
                Salvar foto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
