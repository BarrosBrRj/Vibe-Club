import { 
  User, Community, Post, Scrap, Testimonial, Album, Achievement, 
  VirtualGift, ArcadeGame, PricingConfig, CommunityTopic, DatingCandidate, 
  VibePage, BoostCampaign, VibesTransaction, MarketplaceAdSpend, SavedPaymentMethod,
  NotificationItem, NotificationSettings
} from '../types';

export const INITIAL_PRICING_CONFIG: PricingConfig = {
  datingUnlimited24hPrice: 5.90,
  premiumMonthlyPrice: 19.90,
  superLikePackagePrice: 9.90,
  boostPrice: 7.90,
  maxDailyDatingLikes: 50,
  vibesPackages: [
    { id: 'pkg_50', amount: 50, price: 4.90 },
    { id: 'pkg_150', amount: 150, price: 12.90, bonus: 10 },
    { id: 'pkg_400', amount: 400, price: 29.90, popular: true, bonus: 40 },
    { id: 'pkg_1000', amount: 1000, price: 59.90, bonus: 150 }
  ]
};

export const INITIAL_GIFTS: VirtualGift[] = [
  { id: 'gift_rose', name: 'Rosa Encantada', emoji: '🌹', costVibes: 15, description: 'Um gesto clássico de carinho e amizade' },
  { id: 'gift_heart', name: 'Coração de Ouro', emoji: '❤️', costVibes: 25, description: 'Demonstre seu amor e admiração sincera' },
  { id: 'gift_fire', name: 'Chama Vibe', emoji: '🔥', costVibes: 30, description: 'Para aquela vibe contagiante e cheia de energia' },
  { id: 'gift_star', name: 'Estrela Brilhante', emoji: '⭐', costVibes: 40, description: 'Você é um destaque no meu Vibe Clube' },
  { id: 'gift_box', name: 'Presente Surpresa', emoji: '🎁', costVibes: 50, description: 'Uma caixinha de boas vibrações' },
  { id: 'gift_trophy', name: 'Troféu Campeão', emoji: '🏆', costVibes: 100, description: 'Reconhecimento máximo para o melhor amigo' }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach_first_friend', title: 'Primeiro Amigo', description: 'Conectou-se com seu primeiro amigo no Vibe Clube', icon: '🤝', xpReward: 50, isUnlocked: true, unlockedAt: '2026-08-01', category: 'social' },
  { id: 'ach_10_friends', title: '10 Amigos', description: 'Sua roda de amigos está crescendo', icon: '👥', xpReward: 150, isUnlocked: true, unlockedAt: '2026-08-10', category: 'social' },
  { id: 'ach_100_friends', title: '100 Amigos', description: 'Uma verdadeira celebridade social', icon: '🌟', xpReward: 500, isUnlocked: false, category: 'social' },
  { id: 'ach_first_comm', title: 'Primeira Comunidade', description: 'Entrou na sua primeira comunidade do coração', icon: '🏘️', xpReward: 50, isUnlocked: true, unlockedAt: '2026-08-02', category: 'community' },
  { id: 'ach_first_depoimento', title: 'Primeiro Depoimento', description: 'Recebeu e aprovou um depoimento emocionante', icon: '💌', xpReward: 100, isUnlocked: true, unlockedAt: '2026-08-05', category: 'social' },
  { id: 'ach_first_match', title: 'Primeiro Match', description: 'A vibe bateu no Vibe Encontros!', icon: '💞', xpReward: 100, isUnlocked: false, category: 'social' },
  { id: 'ach_first_record', title: 'Primeiro Recorde', description: 'Fez sua primeira pontuação no Vibe Arcade', icon: '🕹️', xpReward: 75, isUnlocked: true, unlockedAt: '2026-08-12', category: 'arcade' },
  { id: 'ach_arcade_master', title: 'Mestre do Arcade', description: 'Alcançou top 3 em qualquer jogo do Arcade', icon: '👾', xpReward: 300, isUnlocked: false, category: 'arcade' },
  { id: 'ach_profile_full', title: 'Perfil Completo', description: 'Preencheu biografia, foto, capa e 5 interesses', icon: '✨', xpReward: 100, isUnlocked: true, unlockedAt: '2026-08-01', category: 'profile' },
  { id: 'ach_veteran', title: 'Usuário Veterano', description: 'Ativo por mais de 30 dias contínuos', icon: '🏅', xpReward: 250, isUnlocked: false, category: 'social' }
];

export const INITIAL_ARCADE_GAMES: ArcadeGame[] = [
  {
    id: 'game_snake',
    name: 'Snake Clássica',
    slug: 'snake',
    icon: '🐍',
    description: 'A clássica cobrinha com gráficos retrô iluminados e velocidade progressiva!',
    category: 'Clássicos',
    topScore: 240,
    myScore: 180
  },
  {
    id: 'game_memory',
    name: 'Jogo da Memória',
    slug: 'memory',
    icon: '🃏',
    description: 'Encontre todos os pares de emojis nostálgicos no menor tempo possível!',
    category: 'Raciocínio',
    topScore: 1200,
    myScore: 950
  },
  {
    id: 'game_space',
    name: 'Space Shooter BR',
    slug: 'space',
    icon: '👾',
    description: 'Defenda a galáxia dos invasores alienígenas em combates espaciais!',
    category: 'Ação',
    topScore: 3500,
    myScore: 2100
  },
  {
    id: 'game_pong',
    name: 'Pong Retro Neon',
    slug: 'pong',
    icon: '🏓',
    description: 'Dispute partidas rápidas contra a máquina e faça rallies incríveis!',
    category: 'Esportes',
    topScore: 15,
    myScore: 9
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user_mariana',
    name: 'Mariana Rios',
    username: 'mari_rios',
    email: 'mariana@exemplo.com.br',
    birthDate: '1999-11-20',
    city: 'Rio de Janeiro, RJ',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    bio: 'Fotógrafa de praias, devoradora de livros e fã incondicional de MPB. Deixe um recado legal no meu mural! 🌊📖',
    interests: ['🎵 Música', '📸 Fotografia', '📚 Livros', '✈️ Viagens', '☕ Café'],
    vibeOfTheDay: { emoji: '😎', label: 'Tranquila no litoral', updatedAt: 'Hoje, 10:15' },
    vibesBalance: 150,
    xp: 2100,
    level: 6,
    isAdult: true,
    isDatingOptIn: true,
    profileTheme: 'sunset',
    profileBorder: 'rainbow',
    isPremium: true,
    isOnline: true,
    createdAt: '2026-02-01',
    friendsCount: 42,
    communitiesCount: 8,
    testimonialsCount: 15,
    photosCount: 26,
    privacy: { profileVisibility: 'public', allowScraps: 'all', allowMessages: 'all', showCity: true }
  },
  {
    id: 'user_felipe',
    name: 'Felipe Santos',
    username: 'felipao_games',
    email: 'felipe@exemplo.com.br',
    birthDate: '1996-03-08',
    city: 'Curitiba, PR',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
    bio: 'Desenvolvedor indie e viciado em bater recordes no Arcade. Se me desafiar no Snake, vai perder! 👾💻',
    interests: ['🎮 Games', '💻 Tecnologia', '🚗 Carros', '🍕 Gastronomia'],
    vibeOfTheDay: { emoji: '🎮', label: 'Modo Gamer Ativado', updatedAt: 'Hoje, 08:40' },
    vibesBalance: 80,
    xp: 3400,
    level: 8,
    isAdult: true,
    isDatingOptIn: false,
    profileTheme: 'cyberpunk',
    profileBorder: 'neon',
    isPremium: false,
    isOnline: true,
    createdAt: '2026-01-20',
    friendsCount: 65,
    communitiesCount: 12,
    testimonialsCount: 19,
    photosCount: 18,
    privacy: { profileVisibility: 'public', allowScraps: 'all', allowMessages: 'all', showCity: true }
  },
  {
    id: 'user_beatriz',
    name: 'Beatriz Lima',
    username: 'biacine',
    email: 'beatriz@exemplo.com.br',
    birthDate: '2000-08-19',
    city: 'Belo Horizonte, MG',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
    bio: 'Crítica amadora de cinema cult e comédias brasileiras. Coleciono vinis e histórias nostálgicas. 🎬🍿',
    interests: ['🎬 Cinema', '🎵 Música', '🎨 Arte', '🐶 Animais', '❤️ Amizade'],
    vibeOfTheDay: { emoji: '❤️', label: 'Romântica & Nostálgica', updatedAt: 'Ontem, 20:10' },
    vibesBalance: 210,
    xp: 1800,
    level: 5,
    isAdult: true,
    isDatingOptIn: true,
    profileTheme: 'emerald',
    profileBorder: 'retro_hearts',
    isPremium: false,
    isOnline: false,
    createdAt: '2026-02-10',
    friendsCount: 29,
    communitiesCount: 7,
    testimonialsCount: 11,
    photosCount: 31,
    privacy: { profileVisibility: 'public', allowScraps: 'friends', allowMessages: 'all', showCity: true }
  },
  {
    id: 'user_rodrigo',
    name: 'Rodrigo Costa',
    username: 'rodrigocosta_ba',
    email: 'rodrigo@exemplo.com.br',
    birthDate: '1995-12-03',
    city: 'Salvador, BA',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&auto=format&fit=crop&q=80',
    bio: 'Capoeirista, chef de final de semana e apaixonado por axé e percussão. Salvador é meu quintal! ☀️🥁',
    interests: ['⚽ Futebol', '🍳 Gastronomia', '🎵 Música', '✈️ Viagens', '🏋️ Esportes'],
    vibeOfTheDay: { emoji: '🔥', label: 'Pura energia baiana', updatedAt: 'Hoje, 11:00' },
    vibesBalance: 50,
    xp: 1200,
    level: 3,
    isAdult: true,
    isDatingOptIn: true,
    profileTheme: 'sunset',
    profileBorder: 'none',
    isPremium: false,
    isOnline: true,
    createdAt: '2026-02-15',
    friendsCount: 35,
    communitiesCount: 5,
    testimonialsCount: 7,
    photosCount: 12,
    privacy: { profileVisibility: 'public', allowScraps: 'all', allowMessages: 'all', showCity: true }
  },
  {
    id: 'user_camila',
    name: 'Camila Duarte',
    username: 'camiladev',
    email: 'camila@exemplo.com.br',
    birthDate: '1997-07-25',
    city: 'Recife, PE',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    bio: 'Software engineer no Porto Digital, apaixonada por UI retrô e cafés especiais. 💻☕🌵',
    interests: ['💻 Tecnologia', '🎨 Arte', '🎮 Games', '📚 Livros', '☕ Café'],
    vibeOfTheDay: { emoji: '😎', label: 'Codando no groove', updatedAt: 'Hoje, 09:00' },
    vibesBalance: 400,
    xp: 2900,
    level: 7,
    isAdult: true,
    isDatingOptIn: true,
    profileTheme: 'nostalgia2000',
    profileBorder: 'gold',
    isPremium: true,
    isOnline: true,
    createdAt: '2026-01-10',
    friendsCount: 51,
    communitiesCount: 11,
    testimonialsCount: 22,
    photosCount: 19,
    privacy: { profileVisibility: 'public', allowScraps: 'all', allowMessages: 'all', showCity: true }
  }
];

export const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'comm_rock_brasil',
    name: '🎸 Rock Brasil dos Anos 80 & 2000',
    slug: 'rock-brasil',
    description: 'O espaço sagrado para quem cresceu ouvindo Charlie Brown Jr, CPM 22, Legião Urbana, Pitty, Titãs e Raimundos! Compartilhe cifras, memórias e discos.',
    category: 'Música',
    logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
    creatorId: 'user_mariana',
    creatorName: 'Mariana Rios',
    membersCount: 4280,
    isMember: true,
    isPrivate: false,
    rules: [
      'Respeito mútuo entre todos os gêneros do rock nacional.',
      'Permitido compartilhar gravações autorais e bandas independentes.',
      'Proibido spam e links comerciais sem autorização.'
    ],
    topicsCount: 154,
    pollsCount: 28,
    createdAt: '2026-01-10'
  },
  {
    id: 'comm_gamers_br',
    name: '🎮 Gamers Brasil & Nostalgia',
    slug: 'gamers-br',
    description: 'Comunidade de quem assoprou fita de SNES, alugava jogos no final de semana na locadora e agora domina o Vibe Arcade e jogos modernos!',
    category: 'Games',
    logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
    creatorId: 'user_felipe',
    creatorName: 'Felipe Santos',
    membersCount: 6890,
    isMember: true,
    isPrivate: false,
    rules: [
      'Proibida a guerra de consoles; respeitamos todas as plataformas.',
      'Torneios semanais do Arcade são moderados pelos líderes.',
      'Compartilhe dicas e setups sem toxicidade.'
    ],
    topicsCount: 312,
    pollsCount: 45,
    createdAt: '2026-01-12'
  },
  {
    id: 'comm_memes_br',
    name: '😂 Memes Brasil Raiz',
    slug: 'memes-brasil',
    description: 'O melhor do humor brasileiro: das correntes clássicas aos memes fresquinhos de hoje. O riso é livre e obrigatório!',
    category: 'Humor',
    logo: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=1200&auto=format&fit=crop&q=80',
    creatorId: 'user_beatriz',
    creatorName: 'Beatriz Lima',
    membersCount: 8940,
    isMember: true,
    isPrivate: false,
    rules: [
      'Humor leve e sem ataques pessoais ou preconceitos.',
      'Memes originais ganham destaque no feed principal.'
    ],
    topicsCount: 520,
    pollsCount: 78,
    createdAt: '2026-01-05'
  },
  {
    id: 'comm_animais_br',
    name: '🐶 Amantes de Animais & Pets',
    slug: 'amantes-de-animais',
    description: 'Poste fotos do seu doguinho, gatinho ou bichinho de estimação. Dicas de cuidados, adoção responsável e muito amor peludo.',
    category: 'Animais',
    logo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&auto=format&fit=crop&q=80',
    creatorId: 'user_mariana',
    creatorName: 'Mariana Rios',
    membersCount: 3750,
    isMember: true,
    isPrivate: false,
    rules: [
      'Apenas amor e respeito aos animais.',
      'Incentivamos postagens de feiras de adoção verificadas.'
    ],
    topicsCount: 98,
    pollsCount: 16,
    createdAt: '2026-01-18'
  },
  {
    id: 'comm_cinema_cult',
    name: '🎬 Cinema, Séries & TV Nostalgia',
    slug: 'cinema-series',
    description: 'Debates cinéfilos, teorias malucas, filmes da Sessão da Tarde e recomendações imperdíveis de lançamentos.',
    category: 'Cinema',
    logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
    creatorId: 'user_beatriz',
    creatorName: 'Beatriz Lima',
    membersCount: 2940,
    isMember: false,
    isPrivate: false,
    rules: ['Avisar sempre com tag de spoiler!'],
    topicsCount: 142,
    pollsCount: 31,
    createdAt: '2026-01-22'
  },
  {
    id: 'comm_tech_br',
    name: '💻 Tecnologia & Desenvolvedores BR',
    slug: 'tech-devs-br',
    description: 'Café, código, startups brasileiras, open-source e novidades tech. De iniciantes a sêniores!',
    category: 'Tecnologia',
    logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    creatorId: 'user_camila',
    creatorName: 'Camila Duarte',
    membersCount: 5120,
    isMember: true,
    isPrivate: false,
    rules: ['Ajude quem está começando.', 'Compartilhe artigos e projetos reais.'],
    topicsCount: 230,
    pollsCount: 39,
    createdAt: '2026-01-08'
  },
  {
    id: 'comm_amizades_brasil',
    name: '❤️ Amizades & Novas Conexões',
    slug: 'amizades-brasil',
    description: 'Para quem quer bater papo, trocar ideias sinceras, deixar recados no mural e fazer amigos de verdade por todo o Brasil.',
    category: 'Amizade',
    logo: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&auto=format&fit=crop&q=80',
    creatorId: 'user_mariana',
    creatorName: 'Mariana Rios',
    membersCount: 7650,
    isMember: true,
    isPrivate: false,
    privacy: 'public',
    rules: ['Respeito e cordialidade são fundamentais.'],
    topicsCount: 410,
    pollsCount: 62,
    createdAt: '2026-01-02'
  },
  {
    id: 'comm_vip_criadores',
    name: '🔒 Clube VIP dos Criadores Vibe',
    slug: 'vip-criadores',
    description: 'Grupo exclusivo e privado para criadores de conteúdo, streamers e influenciadores do Vibe Clube trocarem parcerias e estratégias.',
    category: 'Tecnologia',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    creatorId: 'user_me',
    creatorName: 'Você (Lucas)',
    membersCount: 142,
    isMember: true,
    isPrivate: true,
    privacy: 'private',
    currentUserRole: 'owner',
    rules: [
      'Acesso somente mediante aprovação dos administradores.',
      'Conteúdo e bate-papos estritamente confidenciais.',
      'Troca colaborativa de experiências e mídia kit.'
    ],
    topicsCount: 58,
    pollsCount: 12,
    createdAt: '2026-01-20',
    members: [
      {
        userId: 'user_me',
        userName: 'Lucas Silva (Você)',
        userUsername: 'lucasvibe',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        role: 'owner',
        joinedAt: '2026-01-20'
      },
      {
        userId: 'user_mariana',
        userName: 'Mariana Rios',
        userUsername: 'marianarios',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
        role: 'admin',
        joinedAt: '2026-01-21'
      },
      {
        userId: 'user_felipe',
        userName: 'Felipe Santos',
        userUsername: 'felipesantos_sp',
        userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
        role: 'moderator',
        joinedAt: '2026-01-22'
      }
    ],
    pendingRequests: [
      {
        userId: 'user_beatriz',
        userName: 'Beatriz Lima',
        userUsername: 'bialima',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        requestedAt: 'Hoje às 10:15'
      },
      {
        userId: 'user_rodrigo',
        userName: 'Rodrigo Costa',
        userUsername: 'rodrigocosta_ba',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        requestedAt: 'Ontem às 18:40'
      }
    ]
  }
];

export const INITIAL_PAGES: VibePage[] = [
  {
    id: 'page_vibe_oficial',
    name: 'VIBE CLUBE Oficial',
    slug: 'vibe-clube-oficial',
    category: 'marca',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    bio: 'Página oficial da rede social mais vibrante do Brasil! Fique por dentro de atualizações, novas features e dicas da nossa equipe.',
    ownerId: 'user_me',
    ownerName: 'Você (Lucas)',
    admins: ['user_me', 'user_mariana'],
    followersCount: 14850,
    isFollowing: true,
    email: 'contato@vibeclube.com.br',
    phone: '(11) 98765-4321',
    website: 'https://vibeclube.com.br',
    whatsapp: '5511987654321',
    createdAt: '2026-01-01',
    verified: true
  },
  {
    id: 'page_arcade_retro',
    name: 'Nostalgia Games & Retrô',
    slug: 'nostalgia-games',
    category: 'criador',
    avatar: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
    bio: 'Tudo sobre games dos anos 90 e 2000, fliperamas, campeonatos de fliperama e consoles clássicos! Conteúdo diário e nostalgia garantida.',
    ownerId: 'user_felipe',
    ownerName: 'Felipe Santos',
    admins: ['user_felipe'],
    followersCount: 3820,
    isFollowing: false,
    website: 'https://nostalgiagames.com.br',
    whatsapp: '5521998876543',
    createdAt: '2026-01-15',
    verified: true
  },
  {
    id: 'page_rock_garage',
    name: 'Garage Rock Brasil',
    slug: 'garage-rock-brasil',
    category: 'artista',
    avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
    bio: 'Canal de divulgação oficial de bandas de garagem e rock independente no Brasil. Mande sua música para nosso WhatsApp!',
    ownerId: 'user_mariana',
    ownerName: 'Mariana Rios',
    admins: ['user_mariana'],
    followersCount: 8710,
    isFollowing: true,
    email: 'bandas@garagerock.com.br',
    whatsapp: '5531976543210',
    createdAt: '2026-01-20',
    verified: true
  },
  {
    id: 'page_cafe_cultura',
    name: 'Café & Leituras Artesanais',
    slug: 'cafe-leituras',
    category: 'loja',
    avatar: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    bio: 'Cafeteria premiada com grãos especiais brasileiros e livraria independente. Faça seu pedido com frete grátis direto pelo WhatsApp!',
    ownerId: 'user_camila',
    ownerName: 'Camila Duarte',
    admins: ['user_camila'],
    followersCount: 2340,
    isFollowing: false,
    phone: '(81) 98123-4567',
    whatsapp: '5581981234567',
    createdAt: '2026-02-01',
    verified: false
  }
];

export const INITIAL_TOPICS: CommunityTopic[] = [
  {
    id: 'top_1',
    communityId: 'comm_rock_brasil',
    authorId: 'user_mariana',
    authorName: 'Mariana Rios',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    title: '📌 [OFICIAL] Qual o melhor disco de Rock Brasileiro dos anos 2000?',
    content: 'Galera, vamos fazer uma votação nostálgica! Para vocês, qual álbum marcou mais aquela época de ouro das rádios e clipes na TV? Deixem suas faixas favoritas!',
    isPinned: true,
    repliesCount: 34,
    viewsCount: 1420,
    likesCount: 88,
    isLiked: true,
    createdAt: '2026-08-20',
    lastActivityAt: 'Há 15 minutos',
    replies: [
      {
        id: 'rep_1',
        topicId: 'top_1',
        authorId: 'user_mariana',
        authorName: 'Mariana Rios',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
        content: '"Admirável Chip Novo" da Pitty ou "Chegou a Hora de Recomeçar" do CPM 22! Difícil escolher, ouvia no Discman todo santo dia voltando da escola.',
        createdAt: 'Há 2 horas',
        likesCount: 14,
        isLiked: true
      },
      {
        id: 'rep_2',
        topicId: 'top_1',
        authorId: 'user_felipe',
        authorName: 'Felipe Santos',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        content: 'Acústico MTV Charlie Brown Jr sem dúvidas. A energia do Chorão tocando ao vivo é insuperável até hoje!',
        createdAt: 'Há 45 minutos',
        likesCount: 19,
        isLiked: false
      }
    ]
  },
  {
    id: 'top_2',
    communityId: 'comm_gamers_br',
    authorId: 'user_felipe',
    authorName: 'Felipe Santos',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    title: '🔥 Dicas para passar de 2.000 pontos no Space Shooter do Arcade!',
    content: 'Percebi que se você focar nos chefes laterais primeiro, a barra de combo multiplica por 3x. Quem aqui já tentou essa estratégia?',
    isPinned: false,
    repliesCount: 18,
    viewsCount: 890,
    likesCount: 42,
    createdAt: '2026-08-25',
    lastActivityAt: 'Há 1 hora',
    replies: [
      {
        id: 'rep_3',
        topicId: 'top_2',
        authorId: 'user_camila',
        authorName: 'Camila Duarte',
        authorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
        content: 'Boa sacada Felipe! Testei aqui e bati meu recorde pessoal em 5 minutos. Agora vou disputar o top do ranking!',
        createdAt: 'Há 30 minutos',
        likesCount: 7
      }
    ]
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_boosted_guitar',
    authorId: 'user_me',
    authorName: 'Lucas Silva',
    authorUsername: 'lucas_silva',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    authorBadge: '💎 Premium',
    content: '🎸 [ANÚNCIO] Vendo Guitarra Vintage Tagima Special Edition ano 2004 em perfeito estado! Blindada, regulada com cordas Elixir 0.10 e case acolchoado incluso. Envio para todo o Brasil ou retirada em SP. Aceito Pix! Envie mensagem inbox para negociar.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1000&auto=format&fit=crop&q=80',
    likesCount: 89,
    commentsCount: 24,
    sharesCount: 11,
    isLiked: false,
    createdAt: 'Ontem às 14:20',
    vibeTag: '🛒 Anúncio / Venda',
    isBoosted: true,
    boostStatus: 'active',
    boostCampaignId: 'camp_demo_guitar',
    comments: [
      {
        id: 'c_guitar_1',
        postId: 'post_boosted_guitar',
        authorId: 'user_thiago',
        authorName: 'Thiago Martins',
        authorUsername: 'thiago_martins',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        content: 'Qual o captador do braço, irmão? Bela peça!',
        createdAt: 'Ontem às 15:10',
        likesCount: 2
      }
    ]
  },
  {
    id: 'post_market_gamer',
    authorId: 'user_me',
    authorName: 'Lucas Silva',
    authorUsername: 'lucas_silva',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    authorBadge: '💎 Premium',
    content: '⌨️ [CLASSIFICADO GRÁTIS] Teclado Mecânico Custom RGB Hot-swappable Switch Red lubrificado. Apenas 3 meses de uso leve, sem nenhum detalhe. Motivo da venda: upgrade para modelo sem fio. Valor: R$ 220 à vista no Pix! 🕹️⚡',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    likesCount: 38,
    commentsCount: 9,
    sharesCount: 3,
    isLiked: true,
    createdAt: 'Hoje, 11:15',
    vibeTag: '🛒 Classificado',
    isBoosted: false,
    comments: []
  },
  {
    id: 'post_page_vibe_welcome',
    authorId: 'user_me',
    authorName: 'VIBE CLUBE Oficial',
    authorUsername: 'vibeclube',
    authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    authorBadge: 'OFICIAL',
    content: '🎉 Sejam bem-vindos às novidades do VIBE CLUBE! Agora você pode criar e gerenciar GRUPOS com níveis de permissão (Donos, Admins e Moderadores) e PÁGINAS públicas para marcas, criadores e lojas com botão direto do WhatsApp! 🚀✨',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    likesCount: 184,
    commentsCount: 32,
    sharesCount: 19,
    isLiked: true,
    createdAt: 'Hoje, 09:30',
    pageId: 'page_vibe_oficial',
    pageName: 'VIBE CLUBE Oficial',
    pageAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    isPagePost: true,
    isPinned: true,
    vibeTag: '✨ Novidade',
    comments: [
      {
        id: 'c_welcome_1',
        postId: 'post_page_vibe_welcome',
        authorId: 'user_mariana',
        authorName: 'Mariana Rios',
        authorUsername: 'mari_rios',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
        content: 'Ficou sensacional essa separação de Grupos e Páginas! Já divulguei a minha! 💖👏',
        createdAt: 'Há 15 minutos',
        likesCount: 5,
        isLiked: true
      }
    ]
  },
  {
    id: 'post_1',
    authorId: 'user_mariana',
    authorName: 'Mariana Rios',
    authorUsername: 'mari_rios',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    authorBadge: '💎 Premium',
    content: 'Bom dia pessoal do Vibe Clube! ☀️ Nada como começar a sexta-feira com um café fresquinho e ouvindo os clássicos no talo. Como está a vibe de vocês hoje?',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    likesCount: 24,
    commentsCount: 6,
    sharesCount: 3,
    isLiked: true,
    isSaved: false,
    createdAt: 'Há 25 minutos',
    vibeTag: '😎 Tranquila',
    comments: [
      {
        id: 'c1',
        postId: 'post_1',
        authorId: 'user_thiago',
        authorName: 'Thiago Martins',
        authorUsername: 'thiago_martins',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        content: 'Vibe lá em cima! Já deixei um recado no seu mural Mari!',
        createdAt: 'Há 18 minutos',
        likesCount: 2,
        isLiked: true
      },
      {
        id: 'c2',
        postId: 'post_1',
        authorId: 'user_rodrigo',
        authorName: 'Rodrigo Costa',
        authorUsername: 'rodrigocosta_ba',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        content: 'Aqui em Salvador o sol tá brilhando forte! Ótima sexta!',
        createdAt: 'Há 10 minutos',
        likesCount: 1
      }
    ]
  },
  {
    id: 'post_2',
    authorId: 'user_felipe',
    authorName: 'Felipe Santos',
    authorUsername: 'felipao_games',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    content: 'Enquete rápida para a galera gamer: qual desses jogos você passava mais horas jogando nos anos 2000?',
    mediaType: 'none',
    poll: {
      id: 'poll_games_retro',
      question: 'Qual jogo marcou mais a sua infância nos anos 2000?',
      totalVotes: 184,
      userVotedOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'GTA San Andreas', votes: 82 },
        { id: 'opt_2', text: 'Need for Speed Underground 2', votes: 56 },
        { id: 'opt_3', text: 'Counter-Strike 1.6 na Lan House', votes: 34 },
        { id: 'opt_4', text: 'Tibia / Ragnarök Online', votes: 12 }
      ]
    },
    communityId: 'comm_gamers_br',
    communityName: '🎮 Gamers Brasil & Nostalgia',
    likesCount: 45,
    commentsCount: 12,
    sharesCount: 8,
    isLiked: false,
    isSaved: true,
    createdAt: 'Há 2 horas',
    vibeTag: '🎮 Gamer'
  },
  {
    id: 'post_3',
    authorId: 'user_camila',
    authorName: 'Camila Duarte',
    authorUsername: 'camiladev',
    authorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    authorBadge: '💎 Premium',
    content: 'Gente, criei meu álbum de fotos das férias em Porto de Galinhas! Dá uma olhada no meu perfil. Adorando essa sensação de rede social onde as pessoas conversam de verdade no mural e nas fotos! 💖',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    likesCount: 38,
    commentsCount: 4,
    sharesCount: 1,
    isLiked: true,
    createdAt: 'Há 4 horas',
    vibeTag: '🔥 Animada'
  },
  {
    id: 'post_video_1',
    authorId: 'user_rodrigo',
    authorName: 'Rodrigo Costa',
    authorUsername: 'rodrigocosta_ba',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    content: 'Pôr do sol cinematográfico hoje na orla de Salvador! A energia daqui é inexplicável. Dá o play pra sentir a vibe! ☀️🌊🥁',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80',
    duration: 15,
    viewsCount: 1420,
    likesCount: 92,
    commentsCount: 14,
    sharesCount: 18,
    isLiked: false,
    isSaved: false,
    createdAt: 'Há 1 hora',
    vibeTag: '🔥 Energia Baiana'
  },
  {
    id: 'post_video_2',
    authorId: 'user_felipe',
    authorName: 'Felipe Santos',
    authorUsername: 'felipao_games',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    content: 'Gravação rápida da gameplay de ontem no Arcade! Treinando os reflexos pra liderar o ranking semanal do Vibe Clube. Quem topa o desafio? 🕹️👾',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    videoThumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    duration: 15,
    viewsCount: 2890,
    likesCount: 148,
    commentsCount: 26,
    sharesCount: 31,
    isLiked: true,
    isSaved: true,
    createdAt: 'Há 3 horas',
    vibeTag: '🎮 Modo Gamer'
  }
];

export const INITIAL_SCRAPS: Scrap[] = [
  {
    id: 'scrap_1',
    toUserId: 'user_me',
    fromUserId: 'user_mariana',
    fromUserName: 'Mariana Rios',
    fromUserUsername: 'mari_rios',
    fromUserAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    content: 'Passando para deixar um beijo e desejar uma semana cheia de boas energias! Não esquece de dar uma olhada no tópico novo da comunidade de Rock! 🎸✨',
    emoji: '⭐',
    createdAt: 'Hoje às 10:30'
  },
  {
    id: 'scrap_2',
    toUserId: 'user_me',
    fromUserId: 'user_felipe',
    fromUserName: 'Felipe Santos',
    fromUserUsername: 'felipao_games',
    fromUserAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    content: 'Vi que você passou meu recorde no Snake ontem à noite... a revanche já está marcada hoje no torneio! Haha abraço man!',
    emoji: '🐍',
    createdAt: 'Ontem às 21:15'
  },
  {
    id: 'scrap_3',
    toUserId: 'user_me',
    fromUserId: 'user_camila',
    fromUserName: 'Camila Duarte',
    fromUserUsername: 'camiladev',
    fromUserAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    content: 'Adorei o tema nostálgico do seu perfil Lucas! Ficou a cara dos anos 2000 mas muito refinado.',
    emoji: '💖',
    createdAt: '25/08/2026'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'depo_1',
    toUserId: 'user_me',
    fromUserId: 'user_mariana',
    fromUserName: 'Mariana Rios',
    fromUserUsername: 'mari_rios',
    fromUserAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    content: 'O que dizer desse amigo incrível? O Lucas é aquela pessoa que anima qualquer roda de conversa, entende tudo de música e está sempre pronto para ajudar. Ter você como amigo no Vibe Clube é um privilégio! Conta comigo sempre! S2',
    status: 'approved',
    createdAt: '15/08/2026'
  },
  {
    id: 'depo_2',
    toUserId: 'user_me',
    fromUserId: 'user_felipe',
    fromUserName: 'Felipe Santos',
    fromUserUsername: 'felipao_games',
    fromUserAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    content: 'Parceiro de jogatina de longa data! Honestidade, risadas garantidas e um competidor leal no Arcade. Valeu por todas as noites de nostalgia e conversas boas.',
    status: 'approved',
    createdAt: '10/08/2026'
  },
  {
    id: 'depo_3',
    toUserId: 'user_me',
    fromUserId: 'user_beatriz',
    fromUserName: 'Beatriz Lima',
    fromUserUsername: 'biacine',
    fromUserAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    content: 'Lucas, passando para deixar registrado que sua playlist de rock clássico salvou meu fim de semana! Adoro trocar ideias de cinema e arte com você. Não aceita se não for sincero! ;) 🎬✨',
    status: 'pending',
    createdAt: 'Hoje às 11:20'
  }
];

export const INITIAL_ALBUMS: Album[] = [
  {
    id: 'alb_1',
    userId: 'user_me',
    title: '🎸 Shows & Festivais Inesquecíveis',
    description: 'Registros dos melhores festivais e momentos com guitarras e amigos.',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    privacy: 'public',
    createdAt: '2026-07-15',
    photos: [
      {
        id: 'ph_1',
        url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
        caption: 'Noite histórica no festival!',
        likes: 18,
        comments: 4,
        createdAt: '2026-07-15'
      },
      {
        id: 'ph_2',
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        caption: 'Passagem de som com a galera',
        likes: 12,
        comments: 2,
        createdAt: '2026-07-16'
      }
    ]
  },
  {
    id: 'alb_2',
    userId: 'user_me',
    title: '☕ Viagens & Momentos SP',
    description: 'Cantinhos favoritos, cafés e vistas da cidade de São Paulo.',
    coverUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&auto=format&fit=crop&q=80',
    privacy: 'friends',
    createdAt: '2026-08-01',
    photos: [
      {
        id: 'ph_3',
        url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&auto=format&fit=crop&q=80',
        caption: 'Tarde no centro histórico',
        likes: 24,
        comments: 5,
        createdAt: '2026-08-01'
      }
    ]
  }
];

export const INITIAL_DATING_CANDIDATES: DatingCandidate[] = [
  {
    userId: 'user_mariana',
    name: 'Mariana Rios',
    age: 26,
    city: 'Rio de Janeiro, RJ (Aprox. 400km)',
    bio: 'Fotógrafa de praias, apaixonada por MPB, vinis e conversas sinceras até de madrugada. Busco alguém com boa energia e que ame música! 🌊☕',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'
    ],
    interests: ['🎵 Música', '📸 Fotografia', '📚 Livros', '✈️ Viagens', '☕ Café'],
    commonInterests: ['🎵 Música', '☕ Café'],
    commonCommunities: ['🎸 Rock Brasil dos Anos 80 & 2000', '❤️ Amizades & Novas Conexões'],
    distanceKm: 420,
    isDatingOptIn: true
  },
  {
    userId: 'user_beatriz',
    name: 'Beatriz Lima',
    age: 25,
    city: 'Belo Horizonte, MG (Aprox. 500km)',
    bio: 'Amante de cinema cult, festivais indie e uma boa gastronomia mineira com café e queijo. Vamos trocar recomendações de filmes? 🎬🍿',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80'
    ],
    interests: ['🎬 Cinema', '🎵 Música', '🎨 Arte', '🐶 Animais', '❤️ Amizade'],
    commonInterests: ['🎬 Cinema', '🎵 Música', '🐶 Animais'],
    commonCommunities: ['🎸 Rock Brasil dos Anos 80 & 2000', '😂 Memes Brasil Raiz'],
    distanceKm: 510,
    isDatingOptIn: true
  },
  {
    userId: 'user_camila',
    name: 'Camila Duarte',
    age: 28,
    city: 'Recife, PE (Aprox. 2000km)',
    bio: 'Tech lead, apaixonada por inovação, games retrô, praia no final de semana e muito frevo no coração. 💻🏖️',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
    ],
    interests: ['💻 Tecnologia', '🎨 Arte', '🎮 Games', '📚 Livros', '☕ Café'],
    commonInterests: ['💻 Tecnologia', '🎮 Games', '☕ Café'],
    commonCommunities: ['🎮 Gamers Brasil & Nostalgia', '💻 Tecnologia & Desenvolvedores BR'],
    distanceKm: 2100,
    isDatingOptIn: true
  }
];

export const INITIAL_CAMPAIGNS: BoostCampaign[] = [
  {
    id: 'camp_demo_guitar',
    postId: 'post_boosted_guitar',
    userId: 'user_me',
    userName: 'Lucas Silva',
    objective: 'messages',
    billingModel: 'CPC',
    audience: {
      scope: 'all',
      state: 'SP',
      city: 'São Paulo',
      ageMin: 18,
      ageMax: 45
    },
    budget: 50,
    durationDays: 7,
    dailyBudget: 7.14,
    estimatedReachMin: 3300,
    estimatedReachMax: 5000,
    status: 'active',
    createdAt: 'Ontem',
    startDate: 'Ontem',
    endDate: 'Daqui a 6 dias',
    paidWithPix: true,
    pixTransactionId: 'PIX-MP-839210-VB',
    pixCopyPaste: '00020126580014br.gov.bcb.pix0136e053a479-7df1-4a2a-9e12-3f81e3a9c72b520400005303986540550.005802BR5916VIBE CLUBE ADS6009SAO PAULO62070503***6304A1B2',
    impressions: 3420,
    clicks: 142,
    messages: 38,
    amountSpent: 28.50,
    daysRemaining: 6,
    postSnippet: {
      id: 'post_boosted_guitar',
      content: '🎸 [ANÚNCIO] Vendo Guitarra Vintage Tagima Special Edition ano 2004 em perfeito estado! Blindada, regulada com cordas Elixir...',
      mediaUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1000&auto=format&fit=crop&q=80',
      mediaType: 'image',
      authorName: 'Lucas Silva',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      createdAt: 'Ontem às 14:20'
    }
  }
];

const now = Date.now();
const ONE_DAY = 24 * 60 * 60 * 1000;

export const INITIAL_VIBES_TRANSACTIONS: VibesTransaction[] = [
  {
    id: 'vtx_1',
    type: 'purchase',
    amount: 150,
    description: 'Compra de Pacote 150 Vibes (Pix Mercado Pago)',
    category: 'store',
    date: 'Hoje às 11:15',
    timestamp: now - 3 * 60 * 60 * 1000 // 3 hours ago
  },
  {
    id: 'vtx_2',
    type: 'spend',
    amount: -20,
    description: 'Desbloqueio de conversa direta com Mariana Rios',
    category: 'chat_unlock',
    date: 'Ontem às 19:40',
    timestamp: now - 1 * ONE_DAY
  },
  {
    id: 'vtx_3',
    type: 'spend',
    amount: -15,
    description: 'Super Like enviado no Vibe Encontros para Beatriz Lima',
    category: 'superlike',
    date: 'Há 3 dias às 16:20',
    timestamp: now - 3 * ONE_DAY
  },
  {
    id: 'vtx_4',
    type: 'spend',
    amount: -15,
    description: 'Presente Virtual 🌹 Rosa Encantada enviado no perfil',
    category: 'encontros',
    date: 'Há 5 dias às 21:05',
    timestamp: now - 5 * ONE_DAY
  },
  {
    id: 'vtx_5',
    type: 'purchase',
    amount: 100,
    description: 'Recarga promocional de Vibes (Pix)',
    category: 'store',
    date: 'Há 12 dias às 14:30',
    timestamp: now - 12 * ONE_DAY
  },
  {
    id: 'vtx_6',
    type: 'reward',
    amount: 50,
    description: 'Bônus de Boas-Vindas da Comunidade Vibe Clube',
    category: 'bonus',
    date: 'Há 24 dias às 10:00',
    timestamp: now - 24 * ONE_DAY
  }
];

export const INITIAL_AD_SPENDS: MarketplaceAdSpend[] = [
  {
    id: 'ad_spend_1',
    itemId: 'item_guitar_1',
    itemTitle: 'Guitarra Vintage Tagima Special Edition 2004',
    itemImage: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&auto=format&fit=crop&q=80',
    amountBrl: 50.00,
    durationDays: 7,
    dailyBudget: 7.14,
    status: 'active',
    startDate: 'Ontem às 14:20',
    endDate: 'Daqui a 6 dias',
    createdAt: 'Ontem às 14:20',
    timestamp: now - 1 * ONE_DAY,
    paymentMethod: 'pix'
  },
  {
    id: 'ad_spend_2',
    itemId: 'item_keyboard_1',
    itemTitle: 'Teclado Mecânico Custom RGB Hot-swappable Switch Red',
    itemImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80',
    amountBrl: 35.00,
    durationDays: 5,
    dailyBudget: 7.00,
    status: 'active',
    startDate: 'Há 3 dias às 09:10',
    endDate: 'Daqui a 2 dias',
    createdAt: 'Há 3 dias às 09:10',
    timestamp: now - 3 * ONE_DAY,
    paymentMethod: 'pix'
  },
  {
    id: 'ad_spend_3',
    itemId: 'item_ps5_1',
    itemTitle: 'PlayStation 5 Edição Digital com 2 Controles DualSense',
    itemImage: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&auto=format&fit=crop&q=80',
    amountBrl: 25.00,
    durationDays: 3,
    dailyBudget: 8.33,
    status: 'completed',
    startDate: 'Há 18 dias às 18:00',
    endDate: 'Há 15 dias',
    createdAt: 'Há 18 dias às 18:00',
    timestamp: now - 18 * ONE_DAY,
    paymentMethod: 'cartao'
  }
];

export const INITIAL_PAYMENT_METHODS: SavedPaymentMethod[] = [
  {
    id: 'pay_pix_default',
    type: 'pix',
    label: 'Chave Pix E-mail',
    details: 'lucas.silva***@gmail.com',
    isDefault: true,
    brand: 'pix',
    pixKeyType: 'email'
  },
  {
    id: 'pay_card_master',
    type: 'credit_card',
    label: 'Mastercard Nubank',
    details: '•••• 4821 - Validade 08/29',
    isDefault: false,
    brand: 'mastercard'
  }
];

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  pushEnabled: true,
  mutePushKeepInternal: false,
  soundEnabled: true,
  realtimeAlerts: true,
  liveSimulation: true,
  categories: {
    social: true,
    dating: true,
    marketplace: true,
    groups: true,
    chat: true,
    system: true
  }
};

export const INITIAL_NOTIFICATION_ITEMS: NotificationItem[] = [
  // 1. SOCIAL
  {
    id: 'notif_soc_1',
    userId: 'user_me',
    category: 'social',
    type: 'scrap',
    actorId: 'user_mariana',
    actorName: 'Mariana Rios',
    actorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    message: 'deixou um novo recado carinhoso no seu mural',
    detailSnippet: '"Passando para desejar uma semana com muita música boa e boas vibrações! 🎸✨"',
    read: false,
    createdAt: 'Há 5 min',
    timestamp: now - 5 * 60 * 1000,
    targetType: 'profile_scraps',
    targetId: 'user_me'
  },
  {
    id: 'notif_soc_2',
    userId: 'user_me',
    category: 'social',
    type: 'testimonial',
    actorId: 'user_beatriz',
    actorName: 'Beatriz Lima',
    actorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    message: 'escreveu um depoimento para você',
    detailSnippet: 'Aguardando sua aprovação para exibir no seu perfil',
    read: false,
    createdAt: 'Há 45 min',
    timestamp: now - 45 * 60 * 1000,
    targetType: 'profile_testimonials',
    targetId: 'user_me'
  },
  {
    id: 'notif_soc_3',
    userId: 'user_me',
    category: 'social',
    type: 'like',
    actorId: 'user_felipe',
    actorName: 'Felipe Santos',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    message: 'curtiu sua foto no álbum "Shows & Festivais Inesquecíveis"',
    read: false,
    createdAt: 'Há 2 horas',
    timestamp: now - 2 * 60 * 60 * 1000,
    targetType: 'post',
    targetId: 'post_boosted_guitar'
  },
  {
    id: 'notif_soc_4',
    userId: 'user_me',
    category: 'social',
    type: 'mention',
    actorId: 'user_camila',
    actorName: 'Camila Duarte',
    actorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    message: 'mencionou você em um comentário: "@lucas_silva dá uma olhada no projeto!"',
    read: true,
    createdAt: 'Ontem',
    timestamp: now - 1 * ONE_DAY,
    targetType: 'post',
    targetId: 'post_3'
  },
  {
    id: 'notif_soc_5',
    userId: 'user_me',
    category: 'social',
    type: 'friend_request',
    actorId: 'user_thiago',
    actorName: 'Thiago Martins',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    message: 'enviou uma solicitação de amizade para você',
    read: true,
    createdAt: 'Ontem',
    timestamp: now - 1 * ONE_DAY - 2 * 60 * 60 * 1000,
    targetType: 'profile_scraps',
    targetId: 'user_thiago'
  },

  // 2. ENCONTROS 💕
  {
    id: 'notif_dat_1',
    userId: 'user_me',
    category: 'dating',
    type: 'match',
    actorId: 'user_juliana',
    actorName: 'Juliana Paes',
    actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    message: 'É um Match! Vocês combinaram no Vibe Encontros 💕',
    detailSnippet: 'Que tal iniciar a conversa com uma saudação calorosa?',
    read: false,
    createdAt: 'Há 15 min',
    timestamp: now - 15 * 60 * 1000,
    targetType: 'dating'
  },
  {
    id: 'notif_dat_2',
    userId: 'user_me',
    category: 'dating',
    type: 'dating_message',
    actorId: 'user_juliana',
    actorName: 'Juliana Paes',
    actorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    message: 'enviou uma nova mensagem no chat de Encontros',
    detailSnippet: '"Oi Lucas! Vi que você também curte rock e café..."',
    read: false,
    createdAt: 'Há 12 min',
    timestamp: now - 12 * 60 * 1000,
    targetType: 'chat',
    targetId: 'user_juliana'
  },
  {
    id: 'notif_dat_3',
    userId: 'user_me',
    category: 'dating',
    type: 'low_vibes',
    actorId: 'system_vibes',
    actorName: 'Vibe Encontros',
    actorAvatar: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&auto=format&fit=crop&q=80',
    message: 'Alerta preventivo: Saldo de Vibes baixo no Encontros',
    detailSnippet: 'Seu saldo está em menos de 50 Vibes. Recarregue para não interromper conversas durante matches!',
    read: false,
    createdAt: 'Há 1 hora',
    timestamp: now - 60 * 60 * 1000,
    targetType: 'wallet'
  },

  // 3. MARKETPLACE 🛍️
  {
    id: 'notif_mkt_1',
    userId: 'user_me',
    category: 'marketplace',
    type: 'item_approved',
    actorId: 'system_mkt',
    actorName: 'Vibe Marketplace',
    actorAvatar: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&auto=format&fit=crop&q=80',
    message: 'Seu anúncio foi aprovado pela moderação! 🎉',
    detailSnippet: '"Guitarra Vintage Tagima Special Edition 2004" já está visível para milhares de compradores.',
    read: false,
    createdAt: 'Há 3 horas',
    timestamp: now - 3 * 60 * 60 * 1000,
    targetType: 'marketplace',
    targetId: 'item_guitar_1'
  },
  {
    id: 'notif_mkt_2',
    userId: 'user_me',
    category: 'marketplace',
    type: 'ad_boost_started',
    actorId: 'system_mkt',
    actorName: 'Vibe Anúncios',
    actorAvatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&auto=format&fit=crop&q=80',
    message: 'Impulsionamento iniciado no topo por 7 dias! ⚡',
    detailSnippet: 'Alcance estimado de 6.000 a 14.000 compradores em potencial.',
    read: false,
    createdAt: 'Há 4 horas',
    timestamp: now - 4 * 60 * 60 * 1000,
    targetType: 'marketplace',
    targetId: 'item_guitar_1'
  },
  {
    id: 'notif_mkt_3',
    userId: 'user_me',
    category: 'marketplace',
    type: 'item_lead',
    actorId: 'user_rodrigo',
    actorName: 'Rodrigo Costa',
    actorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    message: 'demonstrou interesse no seu anúncio de Guitarra',
    detailSnippet: '"Olá! Aceita proposta para retirar pessoalmente em mãos amanhã?"',
    read: true,
    createdAt: 'Ontem',
    timestamp: now - 1 * ONE_DAY + 3 * 60 * 60 * 1000,
    targetType: 'chat',
    targetId: 'user_rodrigo'
  },
  {
    id: 'notif_mkt_4',
    userId: 'user_me',
    category: 'marketplace',
    type: 'item_favorited',
    actorId: 'system_mkt',
    actorName: 'Vibe Marketplace',
    actorAvatar: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&auto=format&fit=crop&q=80',
    message: '4 usuários salvaram seu produto nos favoritos hoje',
    detailSnippet: 'Seu produto está ganhando tração e relevância no ranking local.',
    read: true,
    createdAt: 'Ontem',
    timestamp: now - 1 * ONE_DAY - 4 * 60 * 60 * 1000,
    targetType: 'marketplace',
    targetId: 'item_guitar_1'
  },

  // 4. GRUPOS / COMUNIDADES / PÁGINAS 👥
  {
    id: 'notif_grp_1',
    userId: 'user_me',
    category: 'groups',
    type: 'group_join_request',
    actorId: 'user_felipe',
    actorName: 'Felipe Santos',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    message: 'solicitou entrada no grupo "💻 Tecnologia & Devs BR"',
    detailSnippet: 'Como moderador, você pode aprovar ou recusar a solicitação.',
    read: false,
    createdAt: 'Há 30 min',
    timestamp: now - 30 * 60 * 1000,
    targetType: 'group',
    targetId: 'comm_tech_br'
  },
  {
    id: 'notif_grp_2',
    userId: 'user_me',
    category: 'groups',
    type: 'group_join_approved',
    actorId: 'user_mariana',
    actorName: 'Mariana Rios',
    actorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    message: 'aprovou sua entrada no grupo "🎸 Rock & Nostalgia Anos 2000"',
    detailSnippet: 'Agora você pode criar tópicos, votar em enquetes e participar dos debates.',
    read: false,
    createdAt: 'Há 3 horas',
    timestamp: now - 3 * 60 * 60 * 1000,
    targetType: 'group',
    targetId: 'comm_rock_anos_2000'
  },
  {
    id: 'notif_grp_3',
    userId: 'user_me',
    category: 'groups',
    type: 'group_new_post',
    actorId: 'comm_gamers_br',
    actorName: '🎮 Gamers Brasil',
    actorAvatar: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
    message: 'Novo tópico em destaque: "Qual o melhor jogo dos anos 2000?"',
    read: true,
    createdAt: 'Ontem',
    timestamp: now - 1 * ONE_DAY,
    targetType: 'group',
    targetId: 'comm_gamers_br'
  },
  {
    id: 'notif_grp_4',
    userId: 'user_me',
    category: 'groups',
    type: 'group_role_promoted',
    actorId: 'user_camila',
    actorName: 'Camila Duarte',
    actorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    message: 'promoveu você a Moderador da comunidade "💻 Tecnologia & Devs BR"',
    read: true,
    createdAt: 'Há 3 dias',
    timestamp: now - 3 * ONE_DAY,
    targetType: 'group',
    targetId: 'comm_tech_br'
  },

  // 5. CHAT 💬
  {
    id: 'notif_cht_1',
    userId: 'user_me',
    category: 'chat',
    type: 'chat_message',
    actorId: 'user_felipe',
    actorName: 'Felipe Santos',
    actorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    message: 'enviou uma nova mensagem no chat',
    detailSnippet: '"Bora marcar aquela revanche no Arcade hoje à noite? Tô no pique!"',
    read: false,
    createdAt: 'Há 20 min',
    timestamp: now - 20 * 60 * 1000,
    targetType: 'chat',
    targetId: 'user_felipe'
  },

  // 6. SISTEMA / CARTEIRA 💳
  {
    id: 'notif_sys_1',
    userId: 'user_me',
    category: 'system',
    type: 'payment_pix_confirmed',
    actorId: 'system_pay',
    actorName: 'Vibe Carteira',
    actorAvatar: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&auto=format&fit=crop&q=80',
    message: 'Pagamento Pix confirmado! R$ 29,90 recebido via Mercado Pago',
    detailSnippet: '+400 Vibes (+40 bônus) creditadas imediatamente no seu saldo.',
    read: false,
    createdAt: 'Há 50 min',
    timestamp: now - 50 * 60 * 1000,
    targetType: 'wallet'
  },
  {
    id: 'notif_sys_2',
    userId: 'user_me',
    category: 'system',
    type: 'welcome_vibes',
    actorId: 'system_vibe',
    actorName: 'Vibe Clube',
    actorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    message: 'Boas-vindas ao Vibe Clube! Suas primeiras 50 Vibes gratuitas foram creditadas 🎉',
    detailSnippet: 'Explore o Vibe Encontros, participe de comunidades e aproveite a nostalgia.',
    read: true,
    createdAt: 'Há 2 dias',
    timestamp: now - 2 * ONE_DAY,
    targetType: 'wallet'
  }
];

export const INITIAL_REPORTS: import('../types/moderation').ReportItem[] = [
  {
    id: 'rep_1',
    targetType: 'post',
    targetId: 'post_boosted_guitar',
    targetName: 'Publicação de Lucas Silva',
    targetAuthorId: 'user_me',
    targetAuthorName: 'Lucas Silva',
    targetAuthorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    targetContentSnippet: '🎸 [ANÚNCIO] Vendo Guitarra Vintage Tagima Special Edition ano 2004...',
    targetImageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1000&auto=format&fit=crop&q=80',
    reasons: ['Spam', 'Preço abusivo'],
    details: ['Venda repetida múltiplas vezes no feed'],
    reportCount: 2,
    reporterIds: ['user_carlos', 'user_mariana'],
    latestReporterName: 'Mariana Costa',
    status: 'pending',
    autoHidden: false,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'rep_2',
    targetType: 'marketplace',
    targetId: 'item_bot_fake',
    targetName: 'iPhone 15 Pro Max por R$ 500 (Urgentíssimo)',
    targetAuthorId: 'user_suspicious_seller',
    targetAuthorName: 'Vendedor Express',
    targetAuthorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    targetContentSnippet: 'Envie Pix antecipado para frete grátis antes de esgotar!',
    targetImageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    reasons: ['Golpe/fraude', 'Produto proibido', 'Anúncio enganoso'],
    details: ['Golpe do Pix antecipado', 'Conta falsa criada hoje'],
    reportCount: 5,
    reporterIds: ['user_felipe', 'user_camila', 'user_rodrigo', 'user_beatriz', 'user_thiago'],
    latestReporterName: 'Felipe Santos',
    status: 'pending',
    autoHidden: true, // auto-ocultado por atingir 5 denúncias
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: 'rep_3',
    targetType: 'user',
    targetId: 'user_impostor_99',
    targetName: 'Perfil de Suporte Vibe Oficial (Fake)',
    targetAuthorId: 'user_impostor_99',
    targetAuthorName: 'Suporte Vibe Oficial',
    targetAuthorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
    targetContentSnippet: 'Mande sua senha por mensagem privada para validar seu selo de verificação.',
    reasons: ['Perfil falso', 'Golpe/fraude'],
    details: ['Se passando pela equipe oficial do Vibe Clube'],
    reportCount: 3,
    reporterIds: ['user_mariana', 'user_me', 'user_camila'],
    latestReporterName: 'Camila Duarte',
    status: 'pending',
    autoHidden: false,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

export const INITIAL_AUDIT_LOG: import('../types/moderation').ModerationAuditAction[] = [
  {
    id: 'aud_1',
    moderatorId: 'mod_admin',
    moderatorName: 'Moderação Vibe',
    actionType: 'remove_content',
    targetType: 'post',
    targetId: 'post_hate_sample',
    targetAuthorId: 'user_troll_01',
    targetAuthorName: 'Usuário Troll',
    reason: 'Violação de discurso de ódio e termos de uso',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'aud_2',
    moderatorId: 'mod_admin',
    moderatorName: 'Moderação Vibe',
    actionType: 'suspend_user',
    targetType: 'user',
    targetId: 'user_troll_01',
    targetAuthorId: 'user_troll_01',
    targetAuthorName: 'Usuário Troll',
    reason: 'Reincidência em ataques e spam no feed',
    duration: '7_dias',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];


