import { ChatConversation, MessageItem } from '../types';
import { INITIAL_USERS } from './mockData';

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv_mariana',
    userId: 'user_mariana',
    user: INITIAL_USERS[0],
    lastMessage: 'Adorei a sua vibe no clube! Quando sai aquele café? ☕✨',
    lastMessageAt: '10:42',
    unreadCount: 1,
    isOnline: true,
    contextType: 'dating',
    contextTitle: 'Match no Vibe Encontros 💕'
  },
  {
    id: 'conv_felipe',
    userId: 'user_felipe',
    user: INITIAL_USERS[1],
    lastMessage: 'O PS5 tá disponível sim! Posso enviar fotos no detalhe ou negociar o frete.',
    lastMessageAt: 'Ontem',
    unreadCount: 0,
    isOnline: true,
    contextType: 'marketplace',
    contextTitle: 'Anúncio: PlayStation 5 Disc Edition 🎮'
  },
  {
    id: 'conv_beatriz',
    userId: 'user_beatriz',
    user: INITIAL_USERS[2] || INITIAL_USERS[0],
    lastMessage: 'Você viu a nova comunidade de nostalgia dos anos 2000? Entrei hoje!',
    lastMessageAt: 'Sex',
    unreadCount: 0,
    isOnline: false,
    contextType: 'direct'
  }
];

export const INITIAL_MESSAGES: Record<string, MessageItem[]> = {
  user_mariana: [
    {
      id: 'msg_m1',
      senderId: 'user_mariana',
      receiverId: 'user_me',
      content: 'Oi! Vi que você curte fotografia de praia e MPB clássica também! 🌊🎵',
      createdAt: '10:30',
      read: true,
      contextType: 'dating'
    },
    {
      id: 'msg_m2',
      senderId: 'user_me',
      receiverId: 'user_mariana',
      content: 'Oi Mariana! Sim, adoro aquele som vintage dos anos 80 e 90. Suas fotos do Rio ficaram incríveis!',
      createdAt: '10:35',
      read: true
    },
    {
      id: 'msg_m3',
      senderId: 'user_mariana',
      receiverId: 'user_me',
      content: 'Adorei a sua vibe no clube! Quando sai aquele café? ☕✨',
      createdAt: '10:42',
      read: false
    }
  ],
  user_felipe: [
    {
      id: 'msg_f1',
      senderId: 'user_me',
      receiverId: 'user_felipe',
      content: 'Olá Felipe! Vi seu anúncio do PlayStation 5 no Vibe Marketplace. Ainda está disponível para retirada?',
      createdAt: 'Ontem, 16:15',
      read: true,
      contextType: 'marketplace',
      contextData: {
        marketplaceItemId: 'item_ps5',
        marketplaceItemTitle: 'PlayStation 5 Disc Edition + 2 Controles DualSense',
        marketplaceItemPrice: 3100,
        marketplaceItemImage: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80'
      }
    },
    {
      id: 'msg_f2',
      senderId: 'user_felipe',
      receiverId: 'user_me',
      content: 'Fala amigo! O PS5 tá disponível sim! Posso enviar fotos no detalhe ou negociar o frete.',
      createdAt: 'Ontem, 16:40',
      read: true
    }
  ],
  user_beatriz: [
    {
      id: 'msg_b1',
      senderId: 'user_beatriz',
      receiverId: 'user_me',
      content: 'Você viu a nova comunidade de nostalgia dos anos 2000? Entrei hoje!',
      createdAt: 'Sex, 14:20',
      read: true
    }
  ]
};
