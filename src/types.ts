export * from './types/moderation';

export type ActiveTab = 
  | 'home'
  | 'feed'
  | 'videos'
  | 'friends'
  | 'communities'
  | 'community_detail'
  | 'pages'
  | 'page_detail'
  | 'apps'
  | 'discover'
  | 'profile'
  | 'photos'
  | 'encontros'
  | 'arcade'
  | 'achievements'
  | 'vibes_store'
  | 'premium'
  | 'business'
  | 'admin'
  | 'help'
  | 'ads'
  | 'marketplace'
  | 'chat'
  | 'landing';

export type RelationshipStatus = 'single' | 'dating' | 'married' | 'complicated' | 'open';

export interface OrkutProfileFields {
  whoAmI?: string;
  whatILikeToDo?: string;
  relationshipStatus?: RelationshipStatus | string;
  favoriteMusic?: string;
  favoriteMovies?: string;
  favoriteBooks?: string;
  favoriteQuotes?: string;
  music?: string;
  movies?: string;
  books?: string;
  quote?: string;
  hobbies?: string | string[];
  passions?: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  birthDate?: string;
  city: string;
  avatar: string;
  coverImage: string;
  coverPositionY?: number; // 0 to 100 percentage for object-position Y
  coverPositionX?: number; // 0 to 100 percentage for object-position X
  coverZoom?: number; // 1 to 2.5 scale
  coverRotation?: number; // 0, 90, 180, 270 degrees
  bio: string;
  interests: string[];
  orkutFields?: OrkutProfileFields;
  vibeOfTheDay?: {
    emoji: string;
    label: string;
    updatedAt: string;
  };
  vibesBalance: number;
  xp: number;
  level: number;
  isAdult: boolean;
  isDatingOptIn: boolean;
  datingPreferences?: {
    minAge: number;
    maxAge: number;
    distanceKm: number;
    gender?: string;
    genderPreference?: string;
    location?: string;
  };
  profileTheme: 'default' | 'sunset' | 'cyberpunk' | 'nostalgia2000' | 'emerald' | 'darkmode';
  profileBorder: 'none' | 'gold' | 'neon' | 'rainbow' | 'retro_hearts';
  isPremium: boolean;
  isOnline?: boolean;
  createdAt: string;
  friendsCount: number;
  communitiesCount: number;
  testimonialsCount: number;
  photosCount: number;
  authProvider?: 'google' | 'email';
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    allowScraps: 'all' | 'friends' | 'none';
    allowMessages: 'all' | 'friends';
    showCity: boolean;
  };
  blockedUserIds?: string[];
  isSuspended?: boolean;
  suspensionUntil?: string;
  suspensionReason?: string;
  role?: 'admin' | 'moderator' | 'user';
  isAdmin?: boolean;
  hasUnlimitedAppLicense?: boolean;
  appLicensePaidAt?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorBadge?: string;
  content: string;
  mediaUrl?: string;
  mediaType: 'none' | 'image' | 'video';
  videoThumbnail?: string;
  viewsCount?: number;
  duration?: number;
  poll?: Poll;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  communityId?: string;
  communityName?: string;
  pageId?: string;
  pageName?: string;
  pageAvatar?: string;
  isPagePost?: boolean;
  isPinned?: boolean;
  vibeTag?: string;
  isBoosted?: boolean;
  boostStatus?: AdStatus;
  boostCampaignId?: string;
  comments?: Comment[];
  privacy?: 'public' | 'friends' | 'only_me';
  commentsDisabled?: boolean;
  isEdited?: boolean;
  autoHidden?: boolean;
}

export interface ScrapReply {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface Scrap {
  id: string;
  toUserId: string;
  fromUserId: string;
  fromUserName: string;
  fromUserUsername: string;
  fromUserAvatar: string;
  content: string;
  emoji?: string;
  isPrivate?: boolean;
  createdAt: string;
  replies?: ScrapReply[];
}

export interface Testimonial {
  id: string;
  toUserId: string;
  fromUserId: string;
  fromUserName: string;
  fromUserUsername: string;
  fromUserAvatar: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface PhotoItem {
  id: string;
  url: string;
  caption?: string;
  likes: number;
  comments: number;
  createdAt: string;
  isLiked?: boolean;
}

export interface Album {
  id: string;
  userId: string;
  title: string;
  description: string;
  coverUrl: string;
  privacy: 'public' | 'friends' | 'private';
  photos: PhotoItem[];
  createdAt: string;
}

export interface CommunityTopic {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  isPinned?: boolean;
  isLocked?: boolean;
  repliesCount: number;
  viewsCount: number;
  likesCount: number;
  isLiked?: boolean;
  createdAt: string;
  lastActivityAt: string;
  replies?: TopicReply[];
}

export interface TopicReply {
  id: string;
  topicId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export type GroupPrivacy = 'public' | 'private' | 'secret';
export type GroupRole = 'owner' | 'admin' | 'moderator' | 'member';

export interface GroupMember {
  userId: string;
  userName: string;
  userUsername: string;
  userAvatar: string;
  role: GroupRole;
  joinedAt: string;
}

export interface GroupJoinRequest {
  userId: string;
  userName: string;
  userUsername: string;
  userAvatar: string;
  requestedAt: string;
}

export type CommunityType = 'community' | 'group' | 'page';

export interface Community {
  id: string;
  name: string;
  slug: string;
  type?: CommunityType;
  description: string;
  category: string;
  logo: string;
  coverImage: string;
  coverPositionY?: number; // 0 to 100 percentage
  coverPositionX?: number; // 0 to 100 percentage
  coverZoom?: number;
  coverRotation?: number;
  creatorId: string;
  creatorName: string;
  membersCount: number;
  isMember?: boolean;
  isPrivate?: boolean;
  privacy?: GroupPrivacy;
  isModerated?: boolean;
  rules: string[];
  topicsCount: number;
  pollsCount: number;
  createdAt: string;
  // Group extensions
  members?: GroupMember[];
  pendingRequests?: GroupJoinRequest[];
  currentUserRole?: GroupRole | null;
  isMuted?: boolean;
  pinnedPostId?: string;
  photos?: string[];
}

export type PageCategory = 'marca' | 'loja' | 'artista' | 'criador' | 'comunidade' | 'outros';

export interface VibePage {
  id: string;
  name: string;
  slug: string;
  category: PageCategory;
  avatar: string;
  coverImage: string;
  bio: string;
  ownerId: string;
  ownerName: string;
  admins: string[]; // userIds
  followersCount: number;
  isFollowing?: boolean;
  email?: string;
  phone?: string;
  website?: string;
  whatsapp?: string;
  createdAt: string;
  verified?: boolean;
}

export interface DatingCandidate {
  userId: string;
  name: string;
  age: number;
  city: string;
  bio: string;
  photos: string[];
  interests: string[];
  commonInterests: string[];
  commonCommunities: string[];
  distanceKm: number;
  isDatingOptIn: boolean;
}

export type DatingProfile = DatingCandidate;
export type PhotoAlbum = Album;


export interface DatingMatch {
  id: string;
  user: User;
  matchedAt: string;
  lastMessage?: string;
  unreadCount?: number;
}

export interface ArcadeGame {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  category: string;
  topScore: number;
  myScore?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  category: 'social' | 'community' | 'arcade' | 'profile';
}

export interface VirtualGift {
  id: string;
  name: string;
  emoji: string;
  costVibes: number;
  description: string;
}

export interface SentGift {
  id: string;
  giftId: string;
  giftName: string;
  giftEmoji: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  message?: string;
  sentAt: string;
}

export type NotificationCategory = 'social' | 'dating' | 'marketplace' | 'groups' | 'chat' | 'system';

export type NotificationType = 
  // Social (Feed/Perfil)
  | 'scrap'
  | 'testimonial'
  | 'like'
  | 'comment'
  | 'friend_request'
  | 'friend_accepted'
  | 'mention'
  // Encontros 💕
  | 'match'
  | 'dating_message'
  | 'low_vibes'
  | 'superlike'
  | 'gift'
  // Marketplace 🛍️
  | 'item_approved'
  | 'item_rejected'
  | 'ad_boost_started'
  | 'ad_boost_ended'
  | 'item_lead'
  | 'item_favorited'
  // Grupos / Comunidades
  | 'group_join_request'
  | 'group_join_approved'
  | 'group_new_post'
  | 'group_role_promoted'
  | 'community'
  | 'community_reply'
  | 'community_topic'
  | 'post_like'
  // Chat
  | 'chat_message'
  // Sistema / Carteira
  | 'payment_pix_confirmed'
  | 'welcome_vibes'
  | 'achievement'
  | 'system_alert'
  // Moderação & Segurança 🛡️
  | 'content_removed'
  | 'moderation_warning'
  | 'account_suspended';

export interface NotificationItem {
  id: string;
  userId: string;
  category: NotificationCategory;
  type: NotificationType;
  actorId: string;
  actorName: string;
  actorAvatar: string;
  message: string;
  detailSnippet?: string;
  read: boolean;
  createdAt: string;
  timestamp?: number;
  targetType?: 'profile_scraps' | 'profile_testimonials' | 'post' | 'chat' | 'dating' | 'marketplace' | 'group' | 'wallet' | 'system';
  targetId?: string;
  meta?: Record<string, any>;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  mutePushKeepInternal: boolean;
  soundEnabled?: boolean;
  realtimeAlerts?: boolean;
  liveSimulation?: boolean;
  categories: {
    social: boolean;
    dating: boolean;
    marketplace: boolean;
    groups: boolean;
    chat: boolean;
    system: boolean;
  };
}

export interface FriendRequest {
  id: string;
  fromUser: User;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface MessageItem {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'text' | 'image' | 'audio';
  audioDuration?: number;
  contextType?: 'direct' | 'dating' | 'marketplace';
  contextData?: {
    marketplaceItemId?: string;
    marketplaceItemTitle?: string;
    marketplaceItemPrice?: number;
    marketplaceItemImage?: string;
  };
  createdAt: string;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  userId: string;
  user: User;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  isOnline: boolean;
  contextType?: 'direct' | 'dating' | 'marketplace';
  contextTitle?: string;
}

export type MarketplaceCategory = 
  | 'Todas'
  | 'Eletrônicos' 
  | 'Games' 
  | 'Móveis & Decoração' 
  | 'Roupas & Moda' 
  | 'Instrumentos Musicais' 
  | 'Veículos' 
  | 'Livros & Colecionáveis'
  | 'Outros';

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  description: string;
  category: MarketplaceCategory;
  condition: 'Novo' | 'Seminovo' | 'Usado';
  city: string;
  state?: string;
  imageUrl: string;
  additionalImages?: string[];
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerVerified?: boolean;
  sellerWhatsapp?: string;
  createdAt: string;
  isBoosted?: boolean;
  boostExpiry?: string;
  status: 'available' | 'sold';
  viewsCount?: number;
}

export interface PricingConfig {
  datingUnlimited24hPrice: number;
  premiumMonthlyPrice: number;
  superLikePackagePrice: number;
  boostPrice: number;
  maxDailyDatingLikes: number;
  vibesPackages: {
    id: string;
    amount: number;
    price: number;
    popular?: boolean;
    bonus?: number;
  }[];
}

export interface AppReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface AppItem {
  id: string;
  name: string;
  packageName: string;
  tagline: string;
  description: string;
  category: 'Jogos' | 'Redes Sociais' | 'Utilitários' | 'Música & Áudio' | 'Foto & Vídeo' | 'Produtividade' | 'Personalização';
  developer: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    email?: string;
  };
  iconUrl: string;
  screenshots: string[];
  bannerUrl?: string;
  rating: number;
  ratingsCount: number;
  downloadsCount: number;
  size: string;
  version: string;
  minAndroid: string;
  apkUrl?: string;
  playStoreUrl?: string;
  changelog?: string;
  featured?: boolean;
  editorsChoice?: boolean;
  ageRating: 'Livre' | '10+' | '12+' | '14+' | '16+' | '18+';
  createdAt: string;
  comments: AppReview[];
}

export type AdObjective = 'views' | 'messages' | 'clicks';
export type BillingModel = 'CPM' | 'CPC';
export type AudienceScope = 'all' | 'groups';
export type AdStatus = 'in_review' | 'active' | 'paused' | 'completed';

export interface AdAudience {
  scope: AudienceScope;
  targetGroupIds?: string[];
  city?: string;
  state?: string;
  ageMin?: number;
  ageMax?: number;
}

export interface BoostCampaign {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  objective: AdObjective;
  billingModel: BillingModel;
  audience: AdAudience;
  budget: number; // R$ 10 a R$ 500
  durationDays: number; // 1, 3, 7, 14
  dailyBudget: number;
  estimatedReachMin: number;
  estimatedReachMax: number;
  status: AdStatus;
  createdAt: string;
  startDate: string;
  endDate: string;
  paidWithPix: boolean;
  pixTransactionId?: string;
  pixCopyPaste?: string;
  // Metrics
  impressions: number;
  clicks: number;
  messages: number;
  amountSpent: number;
  daysRemaining: number;
  // Post snapshot for fast rendering
  postSnippet: {
    id: string;
    content: string;
    mediaUrl?: string;
    mediaType: string;
    authorName: string;
    authorAvatar: string;
    createdAt: string;
  };
}

export type WalletTab = 'balance' | 'packages' | 'vibes_statement' | 'ads_spend' | 'payment_methods';

export interface VibesTransaction {
  id: string;
  type: 'purchase' | 'spend' | 'reward';
  amount: number; // positive for income, negative for expense
  description: string;
  category: 'encontros' | 'store' | 'bonus' | 'superlike' | 'chat_unlock' | 'arcade' | 'gift' | 'other';
  date: string;
  timestamp: number;
  referenceId?: string;
}

export interface MarketplaceAdSpend {
  id: string;
  itemId?: string;
  itemTitle: string;
  itemImage?: string;
  amountBrl: number;
  durationDays: number;
  dailyBudget: number;
  status: 'active' | 'completed';
  startDate: string;
  endDate: string;
  createdAt: string;
  timestamp: number;
  paymentMethod: 'pix' | 'cartao';
}

export interface SavedPaymentMethod {
  id: string;
  type: 'pix' | 'credit_card';
  label: string;
  details: string;
  isDefault: boolean;
  brand?: 'mastercard' | 'visa' | 'elo' | 'pix' | 'other';
  pixKeyType?: 'cpf' | 'email' | 'phone' | 'random';
}


