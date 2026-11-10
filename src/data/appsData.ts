import { AppItem } from '../types';

export const INITIAL_APPS: AppItem[] = [
  {
    id: 'app_vibe_messenger',
    name: 'Vibe Messenger Retrô',
    packageName: 'com.vibeclube.messenger',
    tagline: 'O mensageiro com sons clássicos, emojis animados e modo MSN',
    description: 'Conecte-se com seus amigos do Vibe Clube em tempo real com sons nostálgicos (chamou a atenção!), emoticons animados clássicos dos anos 2000, chamadas de áudio e status personalizados com música.',
    category: 'Redes Sociais',
    developer: {
      id: 'dev_vibelabs',
      name: 'Vibe Mobile Studios',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      verified: true,
      email: 'apps@vibeclube.com'
    },
    iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    ratingsCount: 1420,
    downloadsCount: 58400,
    size: '32.4 MB',
    version: 'v2.4.0',
    minAndroid: 'Android 8.0+',
    apkUrl: 'https://vibeclube.com/apks/vibe-messenger-v2.4.0.apk',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.vibeclube.messenger',
    changelog: '• Adicionado som clássico de chamar atenção\n• Suporte a temas personalizados\n• Menor consumo de bateria e conexão ultra rápida',
    featured: true,
    editorsChoice: true,
    ageRating: 'Livre',
    createdAt: '2026-08-15',
    comments: [
      {
        id: 'rev_1',
        userId: 'user_1',
        userName: 'Camila Ferreira',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        title: 'Sensacional, pura nostalgia!',
        comment: 'O melhor aplicativo de mensagens. Adorei os emoticons animados e a integração perfeita com o perfil do Vibe Clube.',
        createdAt: 'Hoje',
        likesCount: 28,
        isLiked: true
      },
      {
        id: 'rev_2',
        userId: 'user_2',
        userName: 'Felipe Santos',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        title: 'Muito leve e rápido no meu celular',
        comment: 'Roda liso até em aparelhos mais antigos. Parabéns aos desenvolvedores!',
        createdAt: 'Ontem',
        likesCount: 14
      }
    ]
  },
  {
    id: 'app_pixel_runner',
    name: 'Pixel Runner Brasil 2000',
    packageName: 'com.pixelbr.runner',
    tagline: 'Jogo retrô de corrida infinita nas ruas de SP e Rio',
    description: 'Corra, pule obstáculos, colete moedas Vibe e desbloqueie personagens icônicos da cultura pop brasileira com trilha sonora chiptune inspirada nos clássicos dos 16-bits!',
    category: 'Jogos',
    developer: {
      id: 'dev_pixelgames',
      name: 'Pixel BR Games',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80',
      verified: true,
      email: 'contato@pixelbr.com'
    },
    iconUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=256&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    ratingsCount: 890,
    downloadsCount: 34100,
    size: '48.1 MB',
    version: 'v1.8.3',
    minAndroid: 'Android 7.0+',
    apkUrl: 'https://vibeclube.com/apks/pixel-runner-br.apk',
    changelog: '• Novo mapa do Pelourinho (Salvador)\n• 3 novos personagens retrô\n• Modo torneio semanal com prêmios em Vibes',
    featured: true,
    editorsChoice: true,
    ageRating: 'Livre',
    createdAt: '2026-08-10',
    comments: [
      {
        id: 'rev_3',
        userId: 'user_3',
        userName: 'Bruna Lima',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        title: 'Viciante demais!',
        comment: 'A trilha sonora é incrível, me lembra os velhos tempos do Super Nintendo.',
        createdAt: '3 dias atrás',
        likesCount: 19
      }
    ]
  },
  {
    id: 'app_vibe_cam',
    name: 'Vibe Cam: Filtros Y2K & VHS',
    packageName: 'com.vibecam.y2k',
    tagline: 'Câmera com filtros retrô anos 2000, efeito Cyberpunk e Cyber Glow',
    description: 'Transforme suas fotos e stories com efeitos vintage autênticos: carimbo de data analógico, efeito granulado de filme 35mm, distorção VHS glitch e molduras com glitter dos anos 2000.',
    category: 'Foto & Vídeo',
    developer: {
      id: 'dev_retrocreative',
      name: 'Retro Creative Lab',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      verified: true
    },
    iconUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=256&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.7,
    ratingsCount: 650,
    downloadsCount: 22800,
    size: '26.8 MB',
    version: 'v3.1.2',
    minAndroid: 'Android 9.0+',
    apkUrl: 'https://vibeclube.com/apks/vibecam-y2k.apk',
    changelog: '• Novos filtros Cyber Sunset e Neon Hearts\n• Exportação em 4K ultra nítido sem perda de qualidade',
    featured: false,
    editorsChoice: true,
    ageRating: 'Livre',
    createdAt: '2026-08-01',
    comments: []
  },
  {
    id: 'app_lofi_player',
    name: 'Vibe Beat: Lofi & Som Ambiente',
    packageName: 'com.vibeclube.beats',
    tagline: 'Músicas Lofi relaxantes para estudar, trabalhar e relaxar',
    description: 'Rádio 24 horas de lofi hip hop, sons de chuva, ondas do mar e sintetizadores relaxantes para aumentar seu foco ou relaxar após um dia corrido.',
    category: 'Música & Áudio',
    developer: {
      id: 'dev_vibelabs',
      name: 'Vibe Mobile Studios',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      verified: true
    },
    iconUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=256&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    ratingsCount: 420,
    downloadsCount: 19500,
    size: '18.3 MB',
    version: 'v1.2.0',
    minAndroid: 'Android 8.0+',
    apkUrl: 'https://vibeclube.com/apks/vibe-beat-lofi.apk',
    changelog: '• Timer de desligamento automático para dormir\n• Modo offline com download de playlists',
    featured: false,
    editorsChoice: false,
    ageRating: 'Livre',
    createdAt: '2026-07-28',
    comments: []
  },
  {
    id: 'app_financas_facil',
    name: 'Controle de Gastos & Pix Brasil',
    packageName: 'com.financas.pixbr',
    tagline: 'Organize seu dinheiro, controle de faturas de cartão e metas Pix',
    description: 'O gerenciador financeiro mais simples do Brasil. Registre receitas, despesas, categorize seus gastos com gráficos automáticos e nunca mais esqueça de pagar uma conta.',
    category: 'Utilitários',
    developer: {
      id: 'dev_fintechbr',
      name: 'Brasil FinTech Apps',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      verified: true
    },
    iconUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=256&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    ratingsCount: 512,
    downloadsCount: 41200,
    size: '14.2 MB',
    version: 'v4.0.1',
    minAndroid: 'Android 8.0+',
    apkUrl: 'https://vibeclube.com/apks/financas-pix-br.apk',
    changelog: '• Suporte a categorias automáticas de Pix\n• Backup na nuvem criptografado',
    featured: false,
    editorsChoice: true,
    ageRating: 'Livre',
    createdAt: '2026-07-15',
    comments: []
  },
  {
    id: 'app_launcher_retro',
    name: 'Vibe Launcher: Tema Anos 2000',
    packageName: 'com.vibelauncher.theme',
    tagline: 'Personalize sua tela inicial com ícones retrô, widgets e efeitos 3D',
    description: 'Deixe seu smartphone Android com a cara dos anos 2000! Mais de 1.000 ícones temáticos, widgets com relógio digital retrô, efeitos de transição nostálgicos e papel de parede animado.',
    category: 'Personalização',
    developer: {
      id: 'dev_vibelabs',
      name: 'Vibe Mobile Studios',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      verified: true
    },
    iconUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=256&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80'
    ],
    rating: 4.6,
    ratingsCount: 310,
    downloadsCount: 16400,
    size: '22.9 MB',
    version: 'v1.5.0',
    minAndroid: 'Android 9.0+',
    apkUrl: 'https://vibeclube.com/apks/vibe-launcher.apk',
    changelog: '• Suporte a novos pacotes de ícones neon\n• Melhor desempenho de bateria',
    featured: false,
    editorsChoice: false,
    ageRating: 'Livre',
    createdAt: '2026-06-20',
    comments: []
  }
];
