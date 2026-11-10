import React from 'react';
import { EMOJI_TO_CODEPOINT_MAP } from '../../lib/animatedEmojis';
import { AnimatedEmoji } from './AnimatedEmoji';

interface AnimatedTextProps {
  text: string;
  className?: string;
  allowLargeSingleEmoji?: boolean;
}

// Ordenar as chaves de emojis por tamanho decrescente para garantir que emojis compostos
// (ex: ❤️‍🔥 ou ✌️) sejam combinados antes dos emojis de caractere único.
const sortedEmojiKeys = Object.keys(EMOJI_TO_CODEPOINT_MAP).sort(
  (a, b) => b.length - a.length
);

// Escapar caracteres especiais para a expressão regular
const escapedKeys = sortedEmojiKeys.map(k => k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
const emojiRegex = new RegExp(`(${escapedKeys.join('|')})`, 'g');

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  allowLargeSingleEmoji = true
}) => {
  if (!text) return null;

  const trimmed = text.trim();

  // Verificar se o texto contém exclusivamente de 1 a 3 emojis animados
  if (allowLargeSingleEmoji) {
    const matches = trimmed.match(emojiRegex);
    if (matches && matches.length >= 1 && matches.length <= 3) {
      // Se removendo os emojis restar apenas espaços, podemos exibir em destaque grande!
      const withoutEmojis = trimmed.replace(emojiRegex, '').trim();
      if (withoutEmojis.length === 0) {
        return (
          <div className={`flex items-center flex-wrap gap-2.5 py-1.5 select-none ${className}`}>
            {matches.map((emojiChar, idx) => (
              <AnimatedEmoji
                key={`${emojiChar}-${idx}`}
                char={emojiChar}
                codepoint={EMOJI_TO_CODEPOINT_MAP[emojiChar]}
                size="xl"
              />
            ))}
          </div>
        );
      }
    }
  }

  // Divide o texto intercalando com os emojis encontrados
  const parts = text.split(emojiRegex);

  return (
    <span className={`break-words ${className}`}>
      {parts.map((part, index) => {
        const codepoint = EMOJI_TO_CODEPOINT_MAP[part];
        if (codepoint) {
          return (
            <AnimatedEmoji
              key={`emoji-${part}-${index}`}
              char={part}
              codepoint={codepoint}
              size="md"
            />
          );
        }
        return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>;
      })}
    </span>
  );
};
