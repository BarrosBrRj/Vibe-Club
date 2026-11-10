// Catálogo oficial de Google Noto Animated Emojis com codepoints verificados
// Formato CDN: https://fonts.gstatic.com/s/e/notoemoji/latest/{codepoint}/512.gif

export interface AnimatedEmojiItem {
  char: string;
  code: string;
  name: string;
  category: EmojiCategory;
}

export type EmojiCategory = 
  | 'carinhas'
  | 'gestos'
  | 'coracoes'
  | 'animais'
  | 'comida'
  | 'festa';

export const EMOJI_CATEGORIES: { id: EmojiCategory; label: string; icon: string }[] = [
  { id: 'carinhas', label: 'Carinhas', icon: '😊' },
  { id: 'gestos', label: 'Gestos', icon: '👋' },
  { id: 'coracoes', label: 'Corações', icon: '❤️' },
  { id: 'animais', label: 'Animais', icon: '🐱' },
  { id: 'comida', label: 'Comida', icon: '🍕' },
  { id: 'festa', label: 'Festa', icon: '🎉' },
];

export const ANIMATED_EMOJIS: AnimatedEmojiItem[] = [
  // 1. CARINHAS (61 verificados)
  { char: '😀', code: '1f600', name: 'Risonho', category: 'carinhas' },
  { char: '😃', code: '1f603', name: 'Sorridente', category: 'carinhas' },
  { char: '😄', code: '1f604', name: 'Feliz', category: 'carinhas' },
  { char: '😁', code: '1f601', name: 'Radiante', category: 'carinhas' },
  { char: '😆', code: '1f606', name: 'Gargalhada', category: 'carinhas' },
  { char: '😅', code: '1f605', name: 'Suando de rir', category: 'carinhas' },
  { char: '🤣', code: '1f923', name: 'Rolando de rir', category: 'carinhas' },
  { char: '😂', code: '1f602', name: 'Chorando de rir', category: 'carinhas' },
  { char: '🙂', code: '1f642', name: 'Sorriso leve', category: 'carinhas' },
  { char: '🙃', code: '1f643', name: 'De ponta cabeça', category: 'carinhas' },
  { char: '😉', code: '1f609', name: 'Piscadela', category: 'carinhas' },
  { char: '😊', code: '1f60a', name: 'Tímido feliz', category: 'carinhas' },
  { char: '😇', code: '1f607', name: 'Anjinho inocente', category: 'carinhas' },
  { char: '🥰', code: '1f970', name: 'Apaixonado', category: 'carinhas' },
  { char: '😍', code: '1f60d', name: 'Olhos de coração', category: 'carinhas' },
  { char: '🤩', code: '1f929', name: 'Estrelas nos olhos', category: 'carinhas' },
  { char: '😘', code: '1f618', name: 'Beijo no coração', category: 'carinhas' },
  { char: '😋', code: '1f60b', name: 'Delícia gostoso', category: 'carinhas' },
  { char: '😛', code: '1f61b', name: 'Mostrando a língua', category: 'carinhas' },
  { char: '😜', code: '1f61c', name: 'Piscadela com língua', category: 'carinhas' },
  { char: '🤪', code: '1f92a', name: 'Maluquinho zoeira', category: 'carinhas' },
  { char: '😝', code: '1f61d', name: 'Zombando travesso', category: 'carinhas' },
  { char: '🤑', code: '1f911', name: 'Dinheiro na mente', category: 'carinhas' },
  { char: '🤗', code: '1f917', name: 'Abraço carinhoso', category: 'carinhas' },
  { char: '🤭', code: '1f92d', name: 'Ops risadinha', category: 'carinhas' },
  { char: '🤫', code: '1f92b', name: 'Segredo silêncio', category: 'carinhas' },
  { char: '🤔', code: '1f914', name: 'Pensativo pensando', category: 'carinhas' },
  { char: '🤐', code: '1f910', name: 'Boca fechada', category: 'carinhas' },
  { char: '🤨', code: '1f928', name: 'Desconfiado sobrancelha', category: 'carinhas' },
  { char: '😐', code: '1f610', name: 'Neutro sem reação', category: 'carinhas' },
  { char: '😏', code: '1f60f', name: 'Malandro sedutor', category: 'carinhas' },
  { char: '😒', code: '1f612', name: 'Desapontado desânimo', category: 'carinhas' },
  { char: '🙄', code: '1f644', name: 'Revirando os olhos', category: 'carinhas' },
  { char: '😬', code: '1f62c', name: 'Tenso vergonha alheia', category: 'carinhas' },
  { char: '😴', code: '1f634', name: 'Dormindo sono', category: 'carinhas' },
  { char: '😷', code: '1f637', name: 'Máscara dodói', category: 'carinhas' },
  { char: '🤒', code: '1f912', name: 'Febre termômetro', category: 'carinhas' },
  { char: '🤢', code: '1f922', name: 'Enjoado verde', category: 'carinhas' },
  { char: '🤮', code: '1f92e', name: 'Vomitando passando mal', category: 'carinhas' },
  { char: '🥵', code: '1f975', name: 'Calor sufoco quente', category: 'carinhas' },
  { char: '🥶', code: '1f976', name: 'Frio congelando gelo', category: 'carinhas' },
  { char: '🥴', code: '1f974', name: 'Tonto meio bêbado', category: 'carinhas' },
  { char: '😵', code: '1f635', name: 'Atordoado tonto', category: 'carinhas' },
  { char: '🤯', code: '1f92f', name: 'Mente explodindo choque', category: 'carinhas' },
  { char: '😎', code: '1f60e', name: 'Óculos escuros estiloso', category: 'carinhas' },
  { char: '🥳', code: '1f973', name: 'Festa comemoração', category: 'carinhas' },
  { char: '🥺', code: '1f97a', name: 'Olhar fofo pidão', category: 'carinhas' },
  { char: '😢', code: '1f622', name: 'Lágrima triste', category: 'carinhas' },
  { char: '😭', code: '1f62d', name: 'Chorando muito berreiro', category: 'carinhas' },
  { char: '😱', code: '1f631', name: 'Grito pânico medo', category: 'carinhas' },
  { char: '🥱', code: '1f971', name: 'Bocejando cansaço', category: 'carinhas' },
  { char: '😤', code: '1f624', name: 'Bufando triunfante', category: 'carinhas' },
  { char: '😡', code: '1f621', name: 'Vermelho de raiva fúria', category: 'carinhas' },
  { char: '🤬', code: '1f92c', name: 'Xingando palavrão', category: 'carinhas' },
  { char: '😈', code: '1f608', name: 'Diabinho travesso', category: 'carinhas' },
  { char: '💀', code: '1f480', name: 'Caveira morto de rir', category: 'carinhas' },
  { char: '💩', code: '1f4a9', name: 'Cocô zoeira', category: 'carinhas' },
  { char: '🤡', code: '1f921', name: 'Palhaço palhaçada', category: 'carinhas' },
  { char: '👻', code: '1f47b', name: 'Fantasma boo', category: 'carinhas' },
  { char: '👽', code: '1f47d', name: 'Alien extraterrestre', category: 'carinhas' },
  { char: '🤖', code: '1f916', name: 'Robô tech', category: 'carinhas' },

  // 2. GESTOS (26 verificados)
  { char: '👋', code: '1f44b', name: 'Aceno tchau oi', category: 'gestos' },
  { char: '🤚', code: '1f91a', name: 'Costas da mão', category: 'gestos' },
  { char: '✋', code: '270b', name: 'Mão aberta pare', category: 'gestos' },
  { char: '👌', code: '1f44c', name: 'OK perfeito beleza', category: 'gestos' },
  { char: '🤌', code: '1f90c', name: 'Mão italiana o que é isso', category: 'gestos' },
  { char: '🤏', code: '1f90f', name: 'Pouquinho quase nada', category: 'gestos' },
  { char: '✌️', code: '270c_fe0f', name: 'Paz e amor vitória', category: 'gestos' },
  { char: '🤞', code: '1f91e', name: 'Dedos cruzados sorte', category: 'gestos' },
  { char: '🫰', code: '1faf0', name: 'Coração coreano dedos', category: 'gestos' },
  { char: '🤟', code: '1f91f', name: 'Te amo sinal', category: 'gestos' },
  { char: '🤘', code: '1f918', name: 'Rock pauleira metal', category: 'gestos' },
  { char: '🤙', code: '1f919', name: 'Hang loose liga nois', category: 'gestos' },
  { char: '👈', code: '1f448', name: 'Apontando esquerda', category: 'gestos' },
  { char: '👉', code: '1f449', name: 'Apontando direita', category: 'gestos' },
  { char: '👆', code: '1f446', name: 'Apontando cima', category: 'gestos' },
  { char: '👇', code: '1f447', name: 'Apontando baixo', category: 'gestos' },
  { char: '👍', code: '1f44d', name: 'Joinha legal curtir', category: 'gestos' },
  { char: '👎', code: '1f44e', name: 'Descurtir polegar baixo', category: 'gestos' },
  { char: '✊', code: '270a', name: 'Punho erguido força', category: 'gestos' },
  { char: '👊', code: '1f44a', name: 'Soquinho parceria', category: 'gestos' },
  { char: '👏', code: '1f44f', name: 'Palmas parabéns aplausos', category: 'gestos' },
  { char: '🙌', code: '1f64c', name: 'Mãos pro alto amém glória', category: 'gestos' },
  { char: '👐', code: '1f450', name: 'Mãos abertas carinho', category: 'gestos' },
  { char: '🤝', code: '1f91d', name: 'Aperto de mãos acordo', category: 'gestos' },
  { char: '🙏', code: '1f64f', name: 'Oração gratidão por favor', category: 'gestos' },
  { char: '💪', code: '1f4aa', name: 'Músculo foco força treino', category: 'gestos' },

  // 3. CORAÇÕES (21 verificados)
  { char: '❤️', code: '2764_fe0f', name: 'Coração vermelho amor', category: 'coracoes' },
  { char: '🧡', code: '1f9e1', name: 'Coração laranja', category: 'coracoes' },
  { char: '💛', code: '1f49b', name: 'Coração amarelo amizade', category: 'coracoes' },
  { char: '💚', code: '1f49a', name: 'Coração verde esperança', category: 'coracoes' },
  { char: '💙', code: '1f499', name: 'Coração azul lealdade', category: 'coracoes' },
  { char: '💜', code: '1f49c', name: 'Coração roxo vibe', category: 'coracoes' },
  { char: '🤎', code: '1f90e', name: 'Coração marrom aconchego', category: 'coracoes' },
  { char: '🖤', code: '1f5a4', name: 'Coração preto gótico', category: 'coracoes' },
  { char: '🤍', code: '1f90d', name: 'Coração branco paz', category: 'coracoes' },
  { char: '💔', code: '1f494', name: 'Coração partido desilusão', category: 'coracoes' },
  { char: '❤️‍🔥', code: '2764_fe0f_200d_1f525', name: 'Coração em chamas paixão', category: 'coracoes' },
  { char: '💕', code: '1f495', name: 'Dois corações flutuando', category: 'coracoes' },
  { char: '💞', code: '1f49e', name: 'Corações girando carinho', category: 'coracoes' },
  { char: '💓', code: '1f493', name: 'Coração batendo forte', category: 'coracoes' },
  { char: '💗', code: '1f497', name: 'Coração pulsando emoção', category: 'coracoes' },
  { char: '💖', code: '1f496', name: 'Coração brilhante estrelas', category: 'coracoes' },
  { char: '💘', code: '1f498', name: 'Flecha do cupido amor', category: 'coracoes' },
  { char: '💝', code: '1f49d', name: 'Coração presente laço', category: 'coracoes' },
  { char: '💟', code: '1f49f', name: 'Decoração de coração lilás', category: 'coracoes' },
  { char: '💌', code: '1f48c', name: 'Carta de amor correio', category: 'coracoes' },
  { char: '💋', code: '1f48b', name: 'Marca de beijo batom', category: 'coracoes' },

  // 4. ANIMAIS (18 verificados + fallbacks)
  { char: '🐱', code: '1f431', name: 'Gatinho miau', category: 'animais' },
  { char: '🦊', code: '1f98a', name: 'Raposa esperta', category: 'animais' },
  { char: '🐻', code: '1f43b', name: 'Urso fofo', category: 'animais' },
  { char: '🐼', code: '1f43c', name: 'Panda dócil', category: 'animais' },
  { char: '🦁', code: '1f981', name: 'Leão rei selva', category: 'animais' },
  { char: '🐮', code: '1f42e', name: 'Vaquinha muuu', category: 'animais' },
  { char: '🐸', code: '1f438', name: 'Sapo pepe', category: 'animais' },
  { char: '🐧', code: '1f427', name: 'Pinguim gelado', category: 'animais' },
  { char: '🦉', code: '1f989', name: 'Coruja sabedoria', category: 'animais' },
  { char: '🦇', code: '1f987', name: 'Morcego noite', category: 'animais' },
  { char: '🐺', code: '1f43a', name: 'Lobo uivo lua', category: 'animais' },
  { char: '🦄', code: '1f984', name: 'Unicórnio mágico', category: 'animais' },
  { char: '🐝', code: '1f41d', name: 'Abelha mel zumbido', category: 'animais' },
  { char: '🦋', code: '1f98b', name: 'Borboleta asas', category: 'animais' },
  { char: '🐙', code: '1f419', name: 'Polvo tentáculos mar', category: 'animais' },
  { char: '🐬', code: '1f42c', name: 'Golfinho oceano', category: 'animais' },
  { char: '🐳', code: '1f433', name: 'Baleia borrifando', category: 'animais' },
  { char: '🦈', code: '1f988', name: 'Tubarão predador', category: 'animais' },
  { char: '🐶', code: '1f436', name: 'Cachorrinho au au', category: 'animais' },
  { char: '🐰', code: '1f430', name: 'Coelhinho orelhas', category: 'animais' },

  // 5. COMIDA (21 verificados)
  { char: '🍕', code: '1f355', name: 'Pizza fatia queijo', category: 'comida' },
  { char: '🍔', code: '1f354', name: 'Hambúrguer lanche burger', category: 'comida' },
  { char: '🌭', code: '1f32d', name: 'Cachorro-quente hotdog', category: 'comida' },
  { char: '🍿', code: '1f37f', name: 'Pipoca cinema filme', category: 'comida' },
  { char: '🥓', code: '1f953', name: 'Bacon crocante', category: 'comida' },
  { char: '🥞', code: '1f95e', name: 'Panquecas calda mel', category: 'comida' },
  { char: '🧀', code: '1f9c0', name: 'Queijo queijinho', category: 'comida' },
  { char: '🌮', code: '1f32e', name: 'Taco mexicano', category: 'comida' },
  { char: '🌯', code: '1f32f', name: 'Burrito comida mexicana', category: 'comida' },
  { char: '🍜', code: '1f35c', name: 'Lámen miojo tigela', category: 'comida' },
  { char: '🍝', code: '1f35d', name: 'Espaguete macarrão molho', category: 'comida' },
  { char: '🎂', code: '1f382', name: 'Bolo de aniversário parabéns', category: 'comida' },
  { char: '🍦', code: '1f366', name: 'Sorvete casquinha delícia', category: 'comida' },
  { char: '🍩', code: '1f369', name: 'Donut rosquinha doce', category: 'comida' },
  { char: '🍪', code: '1f36a', name: 'Cookie biscoito gotas chocolate', category: 'comida' },
  { char: '☕', code: '2615', name: 'Café quentinho bom dia', category: 'comida' },
  { char: '🧋', code: '1f9cb', name: 'Bubble tea chá de boba', category: 'comida' },
  { char: '🍻', code: '1f37b', name: 'Brinde de cerveja cheers sextou', category: 'comida' },
  { char: '🍷', code: '1f377', name: 'Taça de vinho tinto brinde', category: 'comida' },
  { char: '🍹', code: '1f379', name: 'Drinque tropical praia', category: 'comida' },
  { char: '🍾', code: '1f37e', name: 'Champanhe estouro réveillon', category: 'comida' },

  // 6. FESTA (20 verificados)
  { char: '🎉', code: '1f389', name: 'Festa celebração confete', category: 'festa' },
  { char: '🎊', code: '1f38a', name: 'Globo de confetes comemoração', category: 'festa' },
  { char: '🎈', code: '1f388', name: 'Balão bexiga colorido', category: 'festa' },
  { char: '🎁', code: '1f381', name: 'Presente embrulho surpresa', category: 'festa' },
  { char: '🎆', code: '1f386', name: 'Fogos de artifício réveillon', category: 'festa' },
  { char: '✨', code: '2728', name: 'Brilhos mágicos luz glitter', category: 'festa' },
  { char: '🌟', code: '1f31f', name: 'Estrela brilhante dourada', category: 'festa' },
  { char: '💫', code: '1f4ab', name: 'Tontura estelar vertigem', category: 'festa' },
  { char: '🔥', code: '1f525', name: 'Fogo chama quente hype vibe', category: 'festa' },
  { char: '💥', code: '1f4a5', name: 'Explosão boom pá', category: 'festa' },
  { char: '🎶', code: '1f3b6', name: 'Notas musicais som canção', category: 'festa' },
  { char: '🎸', code: '1f3b8', name: 'Guitarra solo rock', category: 'festa' },
  { char: '🥁', code: '1f941', name: 'Tambor ritmo batucada', category: 'festa' },
  { char: '🏆', code: '1f3c6', name: 'Troféu de ouro campeão vitória', category: 'festa' },
  { char: '🥇', code: '1f947', name: 'Medalha primeiro lugar 1', category: 'festa' },
  { char: '👑', code: '1f451', name: 'Coroa rei rainha líder vip', category: 'festa' },
  { char: '💎', code: '1f48e', name: 'Diamante jóia preciosa', category: 'festa' },
  { char: '🚀', code: '1f680', name: 'Foguete lua decolando voar', category: 'festa' },
  { char: '🛸', code: '1f6f8', name: 'Disco voador ovni espaço', category: 'festa' },
  { char: '🌈', code: '1f308', name: 'Arco-íris cores esperança', category: 'festa' }
];

// Mapa direto de caractere -> codepoint para substituição rápida em texto
export const EMOJI_TO_CODEPOINT_MAP: Record<string, string> = ANIMATED_EMOJIS.reduce(
  (acc, item) => {
    acc[item.char] = item.code;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Retorna a URL oficial do Noto Animated Emoji do Google
 */
export const getNotoAnimatedUrl = (codepoint: string): string => {
  return `https://fonts.gstatic.com/s/e/notoemoji/latest/${codepoint}/512.gif`;
};
