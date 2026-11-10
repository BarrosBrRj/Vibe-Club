import React, { useState } from 'react';
import { getNotoAnimatedUrl } from '../../lib/animatedEmojis';

interface AnimatedEmojiProps {
  char: string;
  codepoint?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AnimatedEmoji: React.FC<AnimatedEmojiProps> = ({
  char,
  codepoint,
  size = 'md',
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);

  // Tamanhos calibrados para texto e botões
  const sizeClasses = {
    sm: 'w-4 h-4 min-w-4 max-w-4 inline-block',
    md: 'w-6 h-6 min-w-6 max-w-6 inline-block',
    lg: 'w-8 h-8 min-w-8 max-w-8 inline-block',
    xl: 'w-11 h-11 min-w-11 max-w-11 inline-block'
  };

  // Se não temos codepoint ou se a imagem falhar, mostramos o emoji padrão do sistema
  if (!codepoint || hasError) {
    return (
      <span 
        className={`inline-block select-none align-middle ${className}`}
        style={{ fontSize: size === 'xl' ? '2.2rem' : size === 'lg' ? '1.75rem' : size === 'md' ? '1.25rem' : '0.95rem' }}
        title={char}
      >
        {char}
      </span>
    );
  }

  const imageUrl = getNotoAnimatedUrl(codepoint);

  return (
    <img
      src={imageUrl}
      alt={char}
      title={char}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`${sizeClasses[size]} object-contain align-middle select-none max-w-full inline-block mx-0.5 pointer-events-none transition-transform ${className}`}
    />
  );
};
