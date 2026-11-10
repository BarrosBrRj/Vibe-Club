import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, 
  Send, Sparkles, Flag, CheckCircle, Flame, ExternalLink, Eye, Smile,
  Rocket, Clock, UserX, Pencil, Pin, Globe, Users, Lock, Trash2, 
  MessageSquareOff, UserCheck, UserPlus, Copy, X, Check
} from 'lucide-react';
import { Post } from '../../types';
import { useApp } from '../../context/AppContext';
import { VideoPlayer } from '../video/VideoPlayer';
import { AnimatedText } from '../common/AnimatedText';
import { AnimatedEmojiPicker } from '../emoji/AnimatedEmojiPicker';

export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const { 
    currentUser, 
    likePost, 
    addComment, 
    deleteComment,
    votePoll, 
    toggleSavePost, 
    setViewingUserId, 
    setActiveTab, 
    showToast,
    openReportModal,
    openShareModal,
    blockUser,
    deletePost,
    editPost,
    updatePostPrivacy,
    togglePostComments,
    pinPost,
    openPostMenuId,
    setOpenPostMenuId,
    toggleFollowUser,
    isFollowingUser,
    openBoostModalForPost
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isLikedAnim, setIsLikedAnim] = useState(false);
  const [isCommentEmojiOpen, setIsCommentEmojiOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [selectedPrivacy, setSelectedPrivacy] = useState<'public' | 'friends' | 'only_me'>(post.privacy || 'public');
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const isMenuOpen = openPostMenuId === post.id;

  // Verificação precisa de autoria: compara ID, e como contingência compara username ou nome (tratando prefixos e maiúsculas/minúsculas)
  const isOwner = Boolean(
    currentUser && (
      (post.authorId && currentUser.id && post.authorId === currentUser.id) ||
      (post.authorUsername && currentUser.username && post.authorUsername.toLowerCase().replace(/^@/, '').trim() === currentUser.username.toLowerCase().replace(/^@/, '').trim()) ||
      (post.authorName && currentUser.name && post.authorName.trim().toLowerCase() === currentUser.name.trim().toLowerCase())
    )
  );

  const closeMenu = () => {
    setOpenPostMenuId(null);
  };

  // Fecha o menu ao pressionar ESC ou clicar fora
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isMenuOpen]);

  const handleLike = () => {
    setIsLikedAnim(true);
    likePost(post.id);
    setTimeout(() => setIsLikedAnim(false), 600);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim());
    setCommentText('');
    setIsCommentEmojiOpen(false);
    setShowComments(true);
  };

  const handleInsertCommentEmoji = (char: string) => {
    if (commentInputRef.current) {
      const start = commentInputRef.current.selectionStart ?? commentText.length;
      const end = commentInputRef.current.selectionEnd ?? commentText.length;
      const newText = commentText.substring(0, start) + char + commentText.substring(end);
      setCommentText(newText);
      setTimeout(() => {
        if (commentInputRef.current) {
          commentInputRef.current.focus();
          const nextPos = start + char.length;
          commentInputRef.current.setSelectionRange(nextPos, nextPos);
        }
      }, 10);
    } else {
      setCommentText(prev => prev + char);
    }
  };

  const handleShare = () => {
    openShareModal({
      title: `Publicação de ${post.authorName} no Vibe Clube`,
      text: post.content.substring(0, 100),
      url: `${window.location.origin}?tab=post&id=${post.id}`
    });
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}?tab=post&id=${post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    showToast('Link da publicação copiado! 🔗', 'info');
    closeMenu();
  };

  const handleReport = () => {
    openReportModal({
      type: 'post',
      id: post.id,
      name: `Publicação de ${post.authorName}`,
      authorId: post.authorId,
      authorName: post.authorName,
      authorAvatar: post.authorAvatar,
      contentSnippet: post.content,
      imageUrl: post.mediaUrl
    });
    closeMenu();
  };

  const isGifMedia = post.mediaUrl && (
    post.mediaUrl.includes('.gif') || 
    post.mediaUrl.includes('giphy.com') || 
    post.mediaUrl.startsWith('data:image/gif')
  );

  return (
    <article className="w-full max-w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-purple-200 transition-all p-4 mb-3.5 overflow-hidden relative font-sans">
      
      {/* Header: Author Info */}
      <div className="flex items-center justify-between gap-2.5 mb-2.5">
        <div 
          onClick={() => {
            setViewingUserId(post.authorId);
            setActiveTab('profile');
          }}
          className="flex items-center gap-2.5 cursor-pointer group flex-1 min-w-0"
        >
          <img
            src={post.authorAvatar}
            alt={post.authorName}
            className="w-11 h-11 rounded-full border border-purple-200 object-cover shrink-0 shadow-xs"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-purple-700 truncate transition-colors">
                {post.authorName}
              </span>
              {post.authorBadge && (
                <span className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold px-2 py-0.5 rounded-md">
                  {post.authorBadge}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap font-medium">
              <span>@{post.authorUsername}</span>
              <span>•</span>
              <span>{post.createdAt}</span>

              {post.isEdited && (
                <span className="text-xs text-slate-400 italic">(editado)</span>
              )}

              {post.privacy === 'friends' && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-semibold" title="Visível apenas para Amigos">
                  <Users className="w-3 h-3 text-purple-600" /> Amigos
                </span>
              )}

              {post.privacy === 'only_me' && (
                <span className="inline-flex items-center gap-1 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-semibold" title="Visível somente para você">
                  <Lock className="w-3 h-3 text-amber-600" /> Só eu
                </span>
              )}

              {post.isPinned && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-purple-700 bg-purple-100 border border-purple-200 px-1.5 py-0.5 rounded-md" title="Fixado no Perfil">
                  <Pin className="w-2.5 h-2.5 fill-purple-600 text-purple-600" /> Fixado
                </span>
              )}

              {post.communityName && (
                <>
                  <span>•</span>
                  <span className="text-purple-600 font-semibold truncate hover:underline">
                    {post.communityName}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right tags & Options */}
        <div className="flex items-center gap-2 shrink-0">
          {post.vibeTag && (
            <span className="hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
              {post.vibeTag}
            </span>
          )}

          <div className="relative">
            <button
              id={`post-menu-btn-${post.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setOpenPostMenuId(prev => prev === post.id ? null : post.id);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Mais opções"
              aria-expanded={isMenuOpen}
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {isMenuOpen && (
              <>
                {/* Overlay transparente cobrindo a tela toda para fechar com clique ou toque fora */}
                <div
                  className="fixed inset-0 z-40 bg-transparent cursor-default"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeMenu();
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    closeMenu();
                  }}
                  aria-hidden="true"
                />

                <div 
                  ref={menuRef}
                  id={`post-menu-dropdown-${post.id}`}
                  className="absolute right-0 mt-1 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in space-y-0.5 text-xs font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* OWNER OPTIONS */}
                  {isOwner ? (
                    <>
                      <button
                        id={`post-edit-btn-${post.id}`}
                        onClick={() => {
                          setIsEditing(true);
                          setEditedContent(post.content);
                          closeMenu();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl text-left transition-colors cursor-pointer"
                      >
                        <Pencil className="w-4 h-4 text-purple-600" />
                        <span>Editar Publicação</span>
                      </button>

                      <button
                        id={`post-pin-btn-${post.id}`}
                        onClick={() => {
                          pinPost(post.id);
                          closeMenu();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl text-left transition-colors cursor-pointer"
                      >
                        <Pin className={`w-4 h-4 ${post.isPinned ? 'fill-purple-600 text-purple-600' : 'text-slate-500'}`} />
                        <span>{post.isPinned ? 'Desafixar do Perfil' : 'Fixar no Perfil'}</span>
                      </button>

                      <button
                        id={`post-privacy-btn-${post.id}`}
                        onClick={() => {
                          setSelectedPrivacy(post.privacy || 'public');
                          setIsPrivacyModalOpen(true);
                          closeMenu();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl text-left transition-colors cursor-pointer"
                      >
                        <Globe className="w-4 h-4 text-slate-500" />
                        <span>Alterar Privacidade</span>
                      </button>

                      <button
                        id={`post-toggle-comments-btn-${post.id}`}
                        onClick={() => {
                          togglePostComments(post.id);
                          closeMenu();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl text-left transition-colors cursor-pointer"
                      >
                        {post.commentsDisabled ? (
                          <MessageSquare className="w-4 h-4 text-purple-600" />
                        ) : (
                          <MessageSquareOff className="w-4 h-4 text-slate-500" />
                        )}
                        <span>{post.commentsDisabled ? 'Ativar Comentários' : 'Desativar Comentários'}</span>
                      </button>

                      <div className="my-1 border-t border-slate-100" />

                      <button
                        id={`post-delete-btn-${post.id}`}
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          closeMenu();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl text-left font-semibold transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                        <span>Excluir Publicação</span>
                      </button>
                    </>
                  ) : (
                    /* VISITOR OPTIONS */
                    <>
                      <button
                        id={`post-save-btn-${post.id}`}
                        onClick={() => {
                          toggleSavePost(post.id);
                          closeMenu();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl text-left transition-colors cursor-pointer"
                      >
                        <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-purple-600 text-purple-600' : 'text-slate-500'}`} />
                        <span>{post.isSaved ? 'Remover dos Salvos' : 'Salvar Publicação'}</span>
                      </button>

                      {currentUser && !isOwner && (
                        <button
                          id={`post-follow-btn-${post.id}`}
                          onClick={() => {
                            toggleFollowUser(post.authorId, post.authorName);
                            closeMenu();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl text-left transition-colors cursor-pointer"
                        >
                          {isFollowingUser(post.authorId) ? (
                            <>
                              <UserCheck className="w-4 h-4 text-emerald-600" />
                              <span>Deixar de seguir @{post.authorUsername}</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 text-purple-600" />
                              <span>Seguir @{post.authorUsername}</span>
                            </>
                          )}
                        </button>
                      )}

                      <button
                        id={`post-copylink-btn-${post.id}`}
                        onClick={() => {
                          handleCopyLink();
                          closeMenu();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl text-left transition-colors cursor-pointer"
                      >
                        <Copy className="w-4 h-4 text-slate-500" />
                        <span>Copiar link</span>
                      </button>

                      <button
                        id={`post-share-btn-${post.id}`}
                        onClick={() => {
                          handleShare();
                          closeMenu();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl text-left transition-colors cursor-pointer"
                      >
                        <Share2 className="w-4 h-4 text-slate-500" />
                        <span>Compartilhar</span>
                      </button>

                      <div className="my-1 border-t border-slate-100" />

                      <button
                        id={`post-report-btn-${post.id}`}
                        onClick={() => {
                          handleReport();
                          closeMenu();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl text-left font-semibold transition-colors cursor-pointer"
                      >
                        <Flag className="w-4 h-4 text-red-600" />
                        <span>Denunciar Post</span>
                      </button>

                      {currentUser && !isOwner && (
                        <button
                          id={`post-block-btn-${post.id}`}
                          onClick={() => {
                            blockUser(post.authorId, post.authorName);
                            closeMenu();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-amber-700 hover:bg-amber-50 rounded-xl text-left font-semibold transition-colors cursor-pointer"
                        >
                          <UserX className="w-4 h-4 text-amber-700" />
                          <span>Bloquear Usuário</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sponsored Ad Badge */}
      {post.isBoosted && post.boostStatus === 'active' && (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-transparent border border-purple-200 text-purple-700 text-xs font-black tracking-wide w-fit mb-2.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
          <span>PATROCINADO • 🚀 IMPULSIONADO</span>
        </div>
      )}

      {/* Content Text (or Inline Editor) */}
      {isEditing ? (
        <div className="mb-3 p-3.5 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-2.5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-900 flex items-center gap-1.5">
              <Pencil className="w-3.5 h-3.5 text-purple-600" />
              <span>Editar Publicação</span>
            </span>
            <span className="text-[11px] text-slate-400">
              {editedContent.length} caracteres
            </span>
          </div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={3}
            className="w-full p-2.5 bg-white text-xs sm:text-sm text-slate-900 rounded-xl border border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-400/20 outline-hidden resize-y min-h-[80px]"
            placeholder="Edite o texto da sua publicação..."
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditedContent(post.content);
              }}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!editedContent.trim()}
              onClick={() => {
                editPost(post.id, editedContent);
                setIsEditing(false);
              }}
              className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-slate-800 text-sm sm:text-base leading-relaxed mb-3 break-words">
          <AnimatedText text={post.content} />
        </div>
      )}

      {/* Poll Component */}
      {post.poll && (
        <div className="my-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2.5">
          <div className="font-bold text-xs sm:text-sm text-slate-800 flex items-center justify-between">
            <span>📊 {post.poll.question}</span>
            <span className="text-xs text-slate-500 font-normal">
              {post.poll.totalVotes} votos
            </span>
          </div>

          <div className="space-y-2">
            {post.poll.options.map((option) => {
              const total = post.poll?.totalVotes || 0;
              const percent = total > 0 ? Math.round((option.votes / total) * 100) : 0;
              const hasVoted = post.poll?.userVotedOptionId === option.id;
              const canVote = !post.poll?.userVotedOptionId;

              return (
                <div
                  key={option.id}
                  onClick={() => canVote && votePoll(post.id, option.id)}
                  className={`relative overflow-hidden p-2.5 rounded-xl border transition-all ${
                    canVote 
                      ? 'cursor-pointer hover:border-purple-300 hover:bg-purple-50/40 bg-white' 
                      : 'bg-white/80'
                  } ${hasVoted ? 'border-purple-500 ring-1 ring-purple-400' : 'border-slate-200'}`}
                >
                  {/* Progress fill */}
                  {!canVote && (
                    <div
                      className="absolute inset-0 bg-purple-100/70 -z-0 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  )}
                  <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      {hasVoted && <CheckCircle className="w-3.5 h-3.5 text-purple-600" />}
                      {option.text}
                    </span>
                    {!canVote && <span className="text-purple-700 font-bold">{percent}%</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Media Image / GIF */}
      {post.mediaType === 'image' && post.mediaUrl && (
        <div className="relative my-3 rounded-2xl overflow-hidden border border-slate-200 max-h-[480px] bg-slate-900 flex items-center justify-center w-full max-w-full">
          <img
            src={post.mediaUrl}
            alt="Publicação"
            className="w-full max-w-full h-auto max-h-[480px] object-cover hover:scale-101 transition-transform"
            loading="lazy"
          />
          {isGifMedia && (
            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md text-white font-black text-[10px] tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>GIF</span>
              {post.mediaUrl.includes('giphy') && <span className="text-purple-300 font-bold">• GIPHY</span>}
            </div>
          )}
        </div>
      )}

      {/* Media Video */}
      {post.mediaType === 'video' && post.mediaUrl && (
        <div className="my-3 rounded-2xl overflow-hidden border border-slate-200 w-full max-w-full">
          <VideoPlayer
            src={post.mediaUrl}
            thumbnailUrl={post.videoThumbnail}
            postId={post.id}
            viewsCount={post.viewsCount || Math.max(1, (post.likesCount * 3) + 7)}
          />
        </div>
      )}

      {/* Sponsored Ad CTA for Other Users */}
      {post.isBoosted && post.boostStatus === 'active' && currentUser?.id !== post.authorId && (
        <div className="my-2.5 p-2.5 sm:p-3 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-2xl border border-purple-200/80 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-purple-900 block truncate">Interessado neste anúncio?</span>
            <span className="text-[11px] text-purple-700 block truncate">Fale diretamente com {post.authorName}</span>
          </div>
          <button
            onClick={() => {
              setViewingUserId(post.authorId);
              showToast(`Iniciando contato com ${post.authorName}... 💬`, 'success');
              setActiveTab('profile');
            }}
            className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-purple-500/20 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Conversar</span>
          </button>
        </div>
      )}

      {/* Post Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs sm:text-sm font-semibold text-slate-500 gap-1 flex-wrap sm:flex-nowrap">
        
        {/* Left cluster: Like, Comment, Share */}
        <div className="flex items-center gap-1">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              post.isLiked
                ? 'text-pink-600 bg-pink-50'
                : 'hover:bg-slate-100 hover:text-pink-600'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                post.isLiked ? 'fill-pink-500 text-pink-500' : ''
              } ${isLikedAnim ? 'scale-125' : ''}`}
            />
            <span>{post.likesCount}</span>
            <span className="hidden sm:inline">Curtidas</span>
          </button>

          {/* Comment Accordion Trigger */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-slate-100 hover:text-purple-600 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.commentsCount || post.comments?.length || 0}</span>
            <span className="hidden sm:inline">Comentários</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Compartilhar</span>
          </button>
        </div>

        {/* Right cluster: Impulsionar (Dono) & Save */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Botão Impulsionar visível apenas para o dono do post */}
          {currentUser?.id === post.authorId && (
            !post.isBoosted || post.boostStatus === 'completed' ? (
              <button
                onClick={() => openBoostModalForPost(post)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xs uppercase tracking-wider shadow-xs hover:shadow-purple-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
                title="Impulsionar anúncio com Pix"
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>Impulsionar</span>
              </button>
            ) : post.boostStatus === 'active' ? (
              <button
                onClick={() => {
                  setActiveTab('profile');
                  showToast('Visualizando estatísticas do anúncio ativo 🚀', 'info');
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs hover:bg-emerald-100 transition-colors cursor-pointer shrink-0"
                title="Ver métricas da campanha"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>🚀 Ativo</span>
              </button>
            ) : post.boostStatus === 'in_review' ? (
              <button
                onClick={() => {
                  setActiveTab('profile');
                  showToast('Anúncio na fila de moderação 🛡️', 'info');
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 font-bold text-xs hover:bg-amber-100 transition-colors cursor-pointer shrink-0"
                title="Anúncio em análise pela moderação"
              >
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>🛡️ Em análise</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setActiveTab('profile');
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
                title="Anúncio pausado"
              >
                <span>⏸️ Pausado</span>
              </button>
            )
          )}

          {/* Save Post */}
          <button
            onClick={() => toggleSavePost(post.id)}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              post.isSaved ? 'text-purple-600 bg-purple-50' : 'hover:bg-slate-100'
            }`}
            title="Salvar"
          >
            <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-purple-600' : ''}`} />
          </button>
        </div>

      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-3 animate-in fade-in">
          
          {/* Comments Disabled Notice OR Add Comment Input */}
          {post.commentsDisabled ? (
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <MessageSquareOff className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Os comentários foram desativados pelo autor nesta publicação.</span>
            </div>
          ) : (
            currentUser && (
              <div className="space-y-2">
                <form onSubmit={handleCommentSubmit} className="w-full flex items-center gap-1.5 sm:gap-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-purple-300 shrink-0"
                  />
                  <div className="flex-1 min-w-0 relative flex items-center">
                    <input
                      ref={commentInputRef}
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Escreva um comentário amigável..."
                      className="w-full min-w-0 pl-3 pr-8 py-2 bg-slate-50 focus:bg-white text-xs rounded-xl border border-slate-200 focus:border-purple-500 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCommentEmojiOpen(!isCommentEmojiOpen)}
                      className="absolute right-2 text-slate-400 hover:text-amber-500 transition-colors text-sm cursor-pointer p-0.5"
                      title="Inserir emoticon animado"
                      aria-label="Inserir emoji"
                    >
                      😀
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="w-9 h-9 min-w-[36px] min-h-[36px] sm:w-10 sm:h-10 sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center bg-purple-600 text-white rounded-xl disabled:opacity-40 hover:bg-purple-700 transition-colors cursor-pointer shrink-0"
                    title="Enviar comentário"
                    aria-label="Enviar comentário"
                  >
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  </button>
                </form>

                {/* Emoji Picker dropdown for comments */}
                {isCommentEmojiOpen && (
                  <div className="pt-1">
                    <AnimatedEmojiPicker
                      onSelectEmoji={handleInsertCommentEmoji}
                      onClose={() => setIsCommentEmojiOpen(false)}
                    />
                  </div>
                )}
              </div>
            )
          )}

          {/* Comments List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map(c => (
                <div key={c.id} className="flex items-start gap-2.5 p-2 bg-slate-50/70 rounded-xl text-xs group/comment">
                  <img
                    src={c.authorAvatar}
                    alt={c.authorName}
                    onClick={() => {
                      setViewingUserId(c.authorId);
                      setActiveTab('profile');
                    }}
                    className="w-6 h-6 rounded-full object-cover shrink-0 cursor-pointer border border-purple-200 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span 
                        onClick={() => {
                          setViewingUserId(c.authorId);
                          setActiveTab('profile');
                        }}
                        className="font-bold text-slate-900 cursor-pointer hover:text-purple-600"
                      >
                        {c.authorName}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                        {(currentUser?.id === c.authorId || isOwner) ? (
                          <button
                            type="button"
                            onClick={() => deleteComment(post.id, c.id)}
                            className="text-slate-400 hover:text-red-600 p-0.5 rounded transition-colors cursor-pointer"
                            title="Excluir comentário"
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openReportModal({
                              type: 'comment',
                              id: c.id,
                              name: `Comentário de ${c.authorName}`,
                              authorId: c.authorId,
                              authorName: c.authorName,
                              authorAvatar: c.authorAvatar,
                              contentSnippet: c.content
                            })}
                            className="text-slate-300 hover:text-red-500 p-0.5 rounded transition-colors cursor-pointer"
                            title="Denunciar comentário"
                          >
                            <Flag className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="text-slate-700 mt-0.5 leading-relaxed break-words">
                      <AnimatedText text={c.content} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-3 text-xs text-slate-400">
                Seja o primeiro a deixar um comentário carinhoso! 💬
              </div>
            )}
          </div>

        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div id={`delete-modal-${post.id}`} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="font-extrabold text-base text-slate-900">Excluir Publicação?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tem certeza que deseja excluir esta publicação? Essa ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                id={`cancel-delete-post-${post.id}`}
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                id={`confirm-delete-post-${post.id}`}
                type="button"
                onClick={() => {
                  deletePost(post.id);
                  setIsDeleteModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alterar Privacidade Modal */}
      {isPrivacyModalOpen && (
        <div id={`privacy-modal-${post.id}`} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-600" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Alterar Privacidade</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Escolha quem pode visualizar esta publicação:
            </p>

            <div className="space-y-2">
              {[
                { id: 'public', label: 'Público', desc: 'Qualquer pessoa no Vibe Clube pode ver', icon: Globe },
                { id: 'friends', label: 'Amigos', desc: 'Apenas seus amigos conectados podem ver', icon: Users },
                { id: 'only_me', label: 'Só eu', desc: 'Visível exclusivamente para você', icon: Lock }
              ].map((opt) => {
                const isSelected = selectedPrivacy === opt.id;
                const IconComp = opt.icon;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedPrivacy(opt.id as 'public' | 'friends' | 'only_me')}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 ring-1 ring-purple-400/40'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{opt.label}</div>
                        <div className="text-[10px] text-slate-500">{opt.desc}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-purple-600 shrink-0" />}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                id={`cancel-privacy-${post.id}`}
                type="button"
                onClick={() => setIsPrivacyModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                id={`confirm-privacy-${post.id}`}
                type="button"
                onClick={() => {
                  updatePostPrivacy(post.id, selectedPrivacy);
                  setIsPrivacyModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

    </article>
  );
};
