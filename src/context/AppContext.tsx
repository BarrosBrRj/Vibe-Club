import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, Community, Post, Scrap, Testimonial, Album, Achievement, 
  VirtualGift, PricingConfig, CommunityTopic, DatingCandidate, 
  DatingMatch, NotificationItem, NotificationSettings, NotificationCategory, ActiveTab, PollOption, AppItem, AppReview,
  GroupPrivacy, GroupRole, GroupMember, GroupJoinRequest, VibePage, PageCategory,
  BoostCampaign, AdObjective, BillingModel, AdAudience, AdStatus,
  CommunityType, MarketplaceItem, MessageItem, ChatConversation,
  WalletTab, VibesTransaction, MarketplaceAdSpend, SavedPaymentMethod,
  ReportItem, ReportTarget, ModerationAuditAction, ShareTarget
} from '../types';
import { 
  INITIAL_USERS, INITIAL_COMMUNITIES, 
  INITIAL_POSTS, INITIAL_SCRAPS, INITIAL_TESTIMONIALS, 
  INITIAL_ALBUMS, INITIAL_ACHIEVEMENTS, INITIAL_ARCADE_GAMES, 
  INITIAL_PRICING_CONFIG, INITIAL_TOPICS, INITIAL_GIFTS, 
  INITIAL_DATING_CANDIDATES, INITIAL_PAGES, INITIAL_CAMPAIGNS,
  INITIAL_VIBES_TRANSACTIONS, INITIAL_AD_SPENDS, INITIAL_PAYMENT_METHODS,
  DEFAULT_NOTIFICATION_SETTINGS, INITIAL_NOTIFICATION_ITEMS,
  INITIAL_REPORTS, INITIAL_AUDIT_LOG
} from '../data/mockData';
import { INITIAL_APPS } from '../data/appsData';
import { INITIAL_MARKETPLACE_ITEMS } from '../data/marketplaceData';
import { INITIAL_CONVERSATIONS, INITIAL_MESSAGES } from '../data/chatData';
import { logoutFromFirebase, subscribeToFirebaseAuthState } from '../lib/firebase';
import { safeStorage } from '../utils/safeStorage';
import { notificationAudio } from '../utils/notificationSound';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'vibe';
}

export interface FriendRequestItem {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserUsername: string;
  fromUserAvatar: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface AppContextType {
  currentUser: User | null;
  allUsers: User[];
  isAuthenticated: boolean;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab, targetElementId?: string) => void;
  viewingUserId: string;
  setViewingUserId: (id: string) => void;
  viewingCommunityId: string | null;
  setViewingCommunityId: (id: string | null) => void;
  viewingTopicId: string | null;
  setViewingTopicId: (id: string | null) => void;

  posts: Post[];
  communities: Community[];
  topics: CommunityTopic[];
  scraps: Scrap[];
  testimonials: Testimonial[];
  albums: Album[];
  achievements: Achievement[];
  gifts: VirtualGift[];
  pricingConfig: PricingConfig;
  
  datingCandidates: DatingCandidate[];
  datingMatches: DatingMatch[];
  datingLikesUsed: number;
  hasUnlimitedDating: boolean;

  notifications: NotificationItem[];
  notificationSettings: NotificationSettings;
  unreadNotificationsCount: number;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  markNotificationsAsRead: () => void;
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'createdAt' | 'timestamp' | 'read'>) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  handleNotificationClick: (notif: NotificationItem) => void;
  activeLiveAlerts: NotificationItem[];
  dismissLiveAlert: (id: string) => void;
  triggerTestNotification: (type: 'friend_request' | 'post_like' | 'community') => void;

  toasts: ToastItem[];
  toast?: ToastItem | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error' | 'vibe') => void;

  // Auth & Onboarding
  login: (email: string, pass: string) => boolean;
  loginAsGuest: () => void;
  signup: (userData: Partial<User>) => void;
  loginWithGoogle: (data: { name: string; email: string; avatar?: string; username?: string; birthDate?: string; city?: string }) => void;
  logout: () => void;
  completeOnboarding: (interests: string[], selectedCommunities: string[], enableDating: boolean) => void;
  openGoogleAuthModal: (mode?: 'signup' | 'login') => void;
  
  // Profile Actions
  updateProfile: (fields: Partial<User>) => void;
  setVibeOfTheDay: (emoji: string, label: string) => void;
  
  // Social Actions
  createPost: (data: { content: string; mediaUrl?: string; mediaType: 'none' | 'image' | 'video'; pollQuestion?: string; pollOptions?: string[]; communityId?: string; vibeTag?: string; pageId?: string; privacy?: 'public' | 'friends' | 'only_me'; videoThumbnail?: string; duration?: number }) => void;
  deletePost: (postId: string) => void;
  editPost: (postId: string, newContent: string) => void;
  updatePostPrivacy: (postId: string, privacy: 'public' | 'friends' | 'only_me') => void;
  togglePostComments: (postId: string) => void;
  pinPost: (postId: string) => void;
  openPostMenuId: string | null;
  setOpenPostMenuId: React.Dispatch<React.SetStateAction<string | null>>;
  likePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  editComment: (postId: string, commentId: string, newContent: string) => void;
  votePoll: (postId: string, optionId: string) => void;
  toggleSavePost: (postId: string) => void;
  createScrap: (toUserId: string, content: string, emoji?: string, isPrivate?: boolean) => void;
  replyScrap: (scrapId: string, content: string) => void;
  deleteScrap: (scrapId: string) => void;
  createTestimonial: (toUserId: string, content: string) => void;
  approveTestimonial: (testimonialId: string) => void;
  rejectTestimonial: (testimonialId: string) => void;
  deleteTestimonial: (testimonialId: string) => void;

  // Communities & Groups
  joinCommunity: (communityId: string) => void;
  leaveCommunity: (communityId: string) => void;
  createCommunity: (data: { name: string; description: string; category: string; logo: string; coverImage: string; rules: string[]; privacy?: GroupPrivacy; type?: Community['type'] }) => void;
  updateCommunityCover: (communityId: string, coverImage: string) => void;
  updateCommunity: (communityId: string, fields: Partial<Community>) => void;
  addCommunityPhoto: (communityId: string, photoUrl: string) => void;
  createTopic: (communityId: string, title: string, content: string) => void;
  replyTopic: (topicId: string, content: string) => void;
  likeTopic: (topicId: string) => void;
  requestJoinGroup: (groupId: string) => void;
  approveJoinRequest: (groupId: string, userId: string) => void;
  rejectJoinRequest: (groupId: string, userId: string) => void;
  removeGroupMember: (groupId: string, userId: string) => void;
  changeMemberRole: (groupId: string, userId: string, newRole: GroupRole) => void;
  toggleMuteGroup: (groupId: string) => void;
  pinGroupPost: (groupId: string, postId: string) => void;
  deleteGroupPost: (groupId: string, postId: string) => void;
  inviteFriendsToGroup: (groupId: string, friendIds: string[]) => void;

  // Pages
  pages: VibePage[];
  activePageId: string | null;
  setActivePageId: (id: string | null) => void;
  createPage: (data: { name: string; category: PageCategory; avatar: string; coverImage: string; bio: string; email?: string; phone?: string; website?: string; whatsapp?: string; }) => void;
  followPage: (pageId: string) => void;
  unfollowPage: (pageId: string) => void;
  updatePage: (pageId: string, fields: Partial<VibePage>) => void;
  deletePage: (pageId: string) => void;
  userAdminPages: VibePage[];

  // Photos & Albums
  createAlbum: (title: string, description: string, privacy: 'public' | 'friends' | 'private', coverUrl: string) => void;
  addPhotoToAlbum: (albumId: string, url: string, caption?: string) => void;

  // Dating / Encontros
  swipeDating: (candidateId: string, action: 'like' | 'pass' | 'superlike') => void;
  buyDatingUnlimited: () => void;
  setDatingOptIn: (optIn: boolean) => void;

  // Arcade
  saveArcadeScore: (gameId: string, score: number) => void;

  // Economy & Gifts
  buyVibesPackage: (packageId: string) => void;
  sendGift: (toUserId: string, giftId: string, message?: string) => boolean;
  buyPremiumSubscription: () => void;

  // Friendship & Follow
  friendRequests: FriendRequestItem[];
  sendFriendRequest: (userId: string) => void;
  acceptFriendRequest: (requestIdOrUserId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  removeFriend: (userId: string) => void;
  followedUserIds: string[];
  toggleFollowUser: (userId: string, userName?: string) => void;
  isFollowingUser: (userId: string) => boolean;

  // Gamification
  addXP: (amount: number, reason?: string) => void;

  // Modals state
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'signup' | 'forgot') => void;
  isGoogleAuthModalOpen: boolean;
  setIsGoogleAuthModalOpen: (open: boolean) => void;
  googleAuthMode: 'signup' | 'login';
  setGoogleAuthMode: (mode: 'signup' | 'login') => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isVibesModalOpen: boolean;
  setIsVibesModalOpen: (open: boolean) => void;
  isPremiumModalOpen: boolean;
  setIsPremiumModalOpen: (open: boolean) => void;
  isGiftModalOpen: boolean;
  setIsGiftModalOpen: (open: boolean) => void;
  giftTargetUser: User | null;
  setGiftTargetUser: (user: User | null) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  reportTarget: ReportTarget | null;
  setReportTarget: (target: ReportTarget | null) => void;
  openReportModal: (target: ReportTarget) => void;
  reports: ReportItem[];
  auditLog: ModerationAuditAction[];
  submitReport: (target: ReportTarget, reason: string, details: string) => void;
  removeReportedContent: (reportId: string, justification: string) => void;
  warnUser: (reportId: string, targetAuthorId: string, message: string) => void;
  suspendUser: (reportId: string, targetAuthorId: string, duration: '1_dia' | '7_dias' | 'permanente', reason: string) => void;
  dismissReport: (reportId: string) => void;
  
  // User Blocking
  blockedUserIds: string[];
  blockUser: (userId: string, userName?: string) => void;
  unblockUser: (userId: string) => void;
  isUserBlocked: (userId: string) => boolean;
  isCurrentUserSuspended: () => boolean;

  // Share
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  shareTarget: ShareTarget | null;
  openShareModal: (target: ShareTarget) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (open: boolean) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isMatchModalOpen: boolean;
  setIsMatchModalOpen: (open: boolean) => void;
  latestMatch: DatingMatch | null;
  isLGPDModalOpen: boolean;
  setIsLGPDModalOpen: (open: boolean) => void;

  // Wallet / Carteira
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
  walletActiveTab: WalletTab;
  setWalletActiveTab: (tab: WalletTab) => void;
  openWalletModal: (initialTab?: WalletTab) => void;
  vibesTransactions: VibesTransaction[];
  addVibesTransaction: (tx: Omit<VibesTransaction, 'id' | 'timestamp'>) => void;
  marketplaceAdSpends: MarketplaceAdSpend[];
  addMarketplaceAdSpend: (spend: Omit<MarketplaceAdSpend, 'id' | 'timestamp'>) => void;
  savedPaymentMethods: SavedPaymentMethod[];
  addSavedPaymentMethod: (method: Omit<SavedPaymentMethod, 'id'>) => void;
  removeSavedPaymentMethod: (id: string) => void;
  setDefaultSavedPaymentMethod: (id: string) => void;
  buyVibesWithPix: (packageId: string) => void;

  // Apps Store (Vibe Play)
  appsList: AppItem[];
  selectedApp: AppItem | null;
  setSelectedApp: (app: AppItem | null) => void;
  isPublishAppModalOpen: boolean;
  setIsPublishAppModalOpen: (open: boolean) => void;
  installedAppIds: string[];
  publishApp: (appData: {
    name: string;
    packageName: string;
    tagline: string;
    description: string;
    category: AppItem['category'];
    iconUrl: string;
    screenshots: string[];
    bannerUrl?: string;
    size: string;
    version: string;
    minAndroid: string;
    apkUrl?: string;
    playStoreUrl?: string;
    changelog?: string;
    ageRating?: AppItem['ageRating'];
  }) => void;
  unlockUnlimitedAppLicense: () => void;
  installApp: (appId: string) => void;
  rateApp: (appId: string, rating: number, title: string, comment: string) => void;
  likeAppReview: (appId: string, reviewId: string) => void;

  // Ads & Boost Campaigns
  campaigns: BoostCampaign[];
  isBoostModalOpen: boolean;
  setIsBoostModalOpen: (open: boolean) => void;
  boostTargetPost: Post | null;
  setBoostTargetPost: (post: Post | null) => void;
  isAdsManagerOpen: boolean;
  setIsAdsManagerOpen: (open: boolean) => void;
  openBoostModalForPost: (post: Post) => void;
  createBoostCampaign: (data: {
    postId: string;
    objective: AdObjective;
    audience: AdAudience;
    budget: number;
    durationDays: number;
  }) => BoostCampaign;
  confirmPixPayment: (campaignId: string) => void;
  pauseCampaign: (campaignId: string) => void;
  resumeCampaign: (campaignId: string) => void;
  updateCampaignBudget: (campaignId: string, additionalBudget: number, additionalDays?: number) => void;
  simulateModerationApproval: (campaignId: string) => void;

  // Create Club / Group / Page Access
  isCreateClubModalOpen: boolean;
  setIsCreateClubModalOpen: (open: boolean) => void;
  createClubInitialType: CommunityType;
  setCreateClubInitialType: (type: CommunityType) => void;
  openCreateClubModal: (type?: CommunityType) => void;

  // Marketplace
  marketplaceItems: MarketplaceItem[];
  createMarketplaceItem: (itemData: Omit<MarketplaceItem, 'id' | 'createdAt' | 'viewsCount' | 'status'>) => MarketplaceItem;
  boostMarketplaceItem: (itemId: string, durationDays?: number) => boolean;
  markMarketplaceItemSold: (itemId: string) => void;
  deleteMarketplaceItem: (itemId: string) => void;

  // Chat / Messenger
  chatConversations: ChatConversation[];
  chatMessages: Record<string, MessageItem[]>;
  activeChatUserId: string | null;
  setActiveChatUserId: (userId: string | null) => void;
  unreadMessagesCount: number;
  openChatWithUser: (
    user: User | { id: string; name: string; avatar: string },
    initialMessage?: string,
    contextData?: {
      marketplaceItemId?: string;
      marketplaceItemTitle?: string;
      marketplaceItemPrice?: number;
      marketplaceItemImage?: string;
      contextType?: 'direct' | 'dating' | 'marketplace';
    }
  ) => void;
  sendChatMessage: (
    receiverId: string,
    content: string,
    mediaType?: 'text' | 'image' | 'audio',
    mediaUrl?: string,
    contextData?: {
      marketplaceItemId?: string;
      marketplaceItemTitle?: string;
      marketplaceItemPrice?: number;
      marketplaceItemImage?: string;
    }
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user & auth
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return safeStorage.getItem<User | null>('vibe_current_user', null);
  });
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return safeStorage.getString('vibe_auth') === 'true' && Boolean(safeStorage.getItem('vibe_current_user', null));
    } catch {
      return false;
    }
  });

  // Navigation
  const [activeTab, setActiveTabState] = useState<ActiveTab>('home');
  const setActiveTab = (tab: ActiveTab, targetElementId?: string) => {
    setActiveTabState(tab);
    setTimeout(() => {
      if (targetElementId) {
        const el = document.getElementById(targetElementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 40);
  };
  const [viewingUserId, setViewingUserId] = useState<string>(currentUser?.id || 'user_me');
  const [viewingCommunityId, setViewingCommunityId] = useState<string | null>(null);
  const [viewingTopicId, setViewingTopicId] = useState<string | null>(null);

  // Entities
  const [posts, setPosts] = useState<Post[]>(() => {
    return safeStorage.getItem<Post[]>('vibe_posts', INITIAL_POSTS);
  });
  const [communities, setCommunities] = useState<Community[]>(() => {
    return safeStorage.getItem<Community[]>('vibe_communities', INITIAL_COMMUNITIES);
  });
  const [pages, setPages] = useState<VibePage[]>(() => {
    return safeStorage.getItem<VibePage[]>('vibe_pages', INITIAL_PAGES);
  });
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [topics, setTopics] = useState<CommunityTopic[]>(INITIAL_TOPICS);
  const [scraps, setScraps] = useState<Scrap[]>(INITIAL_SCRAPS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [albums, setAlbums] = useState<Album[]>(INITIAL_ALBUMS);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [gifts] = useState<VirtualGift[]>(INITIAL_GIFTS);
  const [pricingConfig] = useState<PricingConfig>(INITIAL_PRICING_CONFIG);

  // Dating state
  const [datingCandidates, setDatingCandidates] = useState<DatingCandidate[]>(INITIAL_DATING_CANDIDATES);
  const [datingMatches, setDatingMatches] = useState<DatingMatch[]>([]);
  const [datingLikesUsed, setDatingLikesUsed] = useState<number>(12);
  const [hasUnlimitedDating, setHasUnlimitedDating] = useState<boolean>(false);

  // Notifications & Toasts
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return safeStorage.getItem<NotificationItem[]>('vibe_notifications', INITIAL_NOTIFICATION_ITEMS);
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    return safeStorage.getItem<NotificationSettings>('vibe_notification_settings', DEFAULT_NOTIFICATION_SETTINGS);
  });

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [activeLiveAlerts, setActiveLiveAlerts] = useState<NotificationItem[]>([]);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [isGoogleAuthModalOpen, setIsGoogleAuthModalOpen] = useState(false);
  const [googleAuthMode, setGoogleAuthMode] = useState<'signup' | 'login'>('signup');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isVibesModalOpen, setIsVibesModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [giftTargetUser, setGiftTargetUser] = useState<User | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null);

  // Moderation state
  const [reports, setReports] = useState<ReportItem[]>(() => {
    return safeStorage.getItem<ReportItem[]>('vibe_moderation_reports', INITIAL_REPORTS);
  });

  const [auditLog, setAuditLog] = useState<ModerationAuditAction[]>(() => {
    return safeStorage.getItem<ModerationAuditAction[]>('vibe_moderation_audit_log', INITIAL_AUDIT_LOG);
  });

  // User Blocking
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => {
    return safeStorage.getItem<string[]>('vibe_blocked_users', []);
  });

  // Post Menu Coordinator State (ensures only one post menu is open at a time)
  const [openPostMenuId, setOpenPostMenuId] = useState<string | null>(null);

  // Share Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState<ShareTarget | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [latestMatch, setLatestMatch] = useState<DatingMatch | null>(null);
  const [isLGPDModalOpen, setIsLGPDModalOpen] = useState(false);

  // Wallet / Carteira State
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletActiveTab, setWalletActiveTab] = useState<WalletTab>('balance');
  const [vibesTransactions, setVibesTransactions] = useState<VibesTransaction[]>(() => {
    return safeStorage.getItem<VibesTransaction[]>('vibe_transactions', INITIAL_VIBES_TRANSACTIONS);
  });
  const [marketplaceAdSpends, setMarketplaceAdSpends] = useState<MarketplaceAdSpend[]>(() => {
    return safeStorage.getItem<MarketplaceAdSpend[]>('vibe_marketplace_ad_spends', INITIAL_AD_SPENDS);
  });
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<SavedPaymentMethod[]>(() => {
    return safeStorage.getItem<SavedPaymentMethod[]>('vibe_payment_methods', INITIAL_PAYMENT_METHODS);
  });

  useEffect(() => {
    safeStorage.setItem('vibe_transactions', vibesTransactions);
  }, [vibesTransactions]);

  useEffect(() => {
    safeStorage.setItem('vibe_marketplace_ad_spends', marketplaceAdSpends);
  }, [marketplaceAdSpends]);

  useEffect(() => {
    safeStorage.setItem('vibe_payment_methods', savedPaymentMethods);
  }, [savedPaymentMethods]);

  // Apps Store State (Vibe Play)
  const [appsList, setAppsList] = useState<AppItem[]>(() => {
    return safeStorage.getItem<AppItem[]>('vibe_apps_list', INITIAL_APPS);
  });
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [isPublishAppModalOpen, setIsPublishAppModalOpen] = useState(false);
  const [installedAppIds, setInstalledAppIds] = useState<string[]>(() => {
    return safeStorage.getItem<string[]>('vibe_installed_apps', ['app_vibe_messenger']);
  });

  // Ads & Boost Campaigns
  const [campaigns, setCampaigns] = useState<BoostCampaign[]>(() => {
    return safeStorage.getItem<BoostCampaign[]>('vibe_campaigns', INITIAL_CAMPAIGNS);
  });
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [boostTargetPost, setBoostTargetPost] = useState<Post | null>(null);
  const [isAdsManagerOpen, setIsAdsManagerOpen] = useState(false);

  useEffect(() => {
    safeStorage.setItem('vibe_campaigns', campaigns);
  }, [campaigns]);

  useEffect(() => {
    safeStorage.setItem('vibe_apps_list', appsList);
  }, [appsList]);

  useEffect(() => {
    safeStorage.setItem('vibe_installed_apps', installedAppIds);
  }, [installedAppIds]);

  useEffect(() => {
    safeStorage.setItem('vibe_moderation_reports', reports);
  }, [reports]);

  useEffect(() => {
    safeStorage.setItem('vibe_moderation_audit_log', auditLog);
  }, [auditLog]);

  useEffect(() => {
    safeStorage.setItem('vibe_blocked_users', blockedUserIds);
  }, [blockedUserIds]);

  // Deep-linking parser on initial load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const idParam = params.get('id');
      const userParam = params.get('user');

      if (tabParam) {
        if (tabParam === 'post') {
          setActiveTab('feed');
        } else if (tabParam === 'profile' && userParam) {
          setViewingUserId(userParam);
          setActiveTab('profile');
        } else if (tabParam === 'marketplace') {
          setActiveTab('marketplace');
        } else if (tabParam === 'community' && idParam) {
          setViewingCommunityId(idParam);
          setActiveTab('communities');
        } else if (tabParam === 'admin' || tabParam === 'moderation') {
          setActiveTab('admin');
        }
      }
    } catch {}
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      safeStorage.setItem('vibe_current_user', currentUser);
      safeStorage.setItem('vibe_auth', 'true');
    } else {
      safeStorage.removeItem('vibe_current_user');
      safeStorage.setItem('vibe_auth', 'false');
    }
  }, [currentUser]);

  useEffect(() => {
    safeStorage.setItem('vibe_posts', posts);
  }, [posts]);

  useEffect(() => {
    safeStorage.setItem('vibe_communities', communities);
  }, [communities]);

  useEffect(() => {
    safeStorage.setItem('vibe_pages', pages);
  }, [pages]);

  useEffect(() => {
    safeStorage.setItem('vibe_notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    safeStorage.setItem('vibe_notification_settings', notificationSettings);
  }, [notificationSettings]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' | 'vibe' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const dismissLiveAlert = (id: string) => {
    setActiveLiveAlerts(prev => prev.filter(a => a.id !== id));
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'createdAt' | 'timestamp' | 'read'>) => {
    if (notificationSettings.categories && notificationSettings.categories[item.category] === false) {
      return;
    }
    const newNotif: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: 'Agora mesmo',
      timestamp: Date.now(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Play synthesized audio chime for real-time alert
    if (notificationSettings.soundEnabled !== false) {
      if (item.type === 'like' || item.type === 'post_like') {
        notificationAudio.playChime('like');
      } else if (item.type === 'friend_request' || item.type === 'friend_accepted') {
        notificationAudio.playChime('friend');
      } else if (item.category === 'groups' || item.type === 'community' || item.type === 'community_reply' || item.type === 'community_topic') {
        notificationAudio.playChime('community');
      } else {
        notificationAudio.playChime('default');
      }
    }

    // Live floating alert card on screen
    if (notificationSettings.realtimeAlerts !== false) {
      setActiveLiveAlerts(prev => [newNotif, ...prev.slice(0, 2)]);
      setTimeout(() => {
        dismissLiveAlert(newNotif.id);
      }, 6500);
    } else if (notificationSettings.pushEnabled && !notificationSettings.mutePushKeepInternal) {
      showToast(`${item.actorName}: ${item.message}`, 'vibe');
    }
  };

  const triggerTestNotification = (type: 'friend_request' | 'post_like' | 'community') => {
    if (type === 'friend_request') {
      const candidates = [
        { id: 'user_mariana', name: 'Mariana Rios', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80' },
        { id: 'user_lucas', name: 'Lucas Silva', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
        { id: 'user_beatriz', name: 'Beatriz Costa', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' }
      ];
      const selected = candidates[Math.floor(Math.random() * candidates.length)];
      
      const newReq: FriendRequestItem = {
        id: 'req_' + Date.now(),
        fromUserId: selected.id,
        fromUserName: selected.name,
        fromUserUsername: selected.name.toLowerCase().replace(/\s+/g, '_'),
        fromUserAvatar: selected.avatar,
        createdAt: 'Agora mesmo',
        status: 'pending'
      };
      setFriendRequests(prev => [newReq, ...prev]);

      addNotification({
        userId: currentUser?.id || 'user_me',
        category: 'social',
        type: 'friend_request',
        actorId: selected.id,
        actorName: selected.name,
        actorAvatar: selected.avatar,
        message: 'enviou um pedido de amizade para você!',
        detailSnippet: 'Gostou do seu perfil e quer se conectar no Vibe Clube ✨',
        targetType: 'profile_scraps',
        targetId: selected.id
      });
    } else if (type === 'post_like') {
      const likers = [
        { id: 'user_mariana', name: 'Mariana Rios', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80' },
        { id: 'user_rafael', name: 'Rafael Santos', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
        { id: 'user_camila', name: 'Camila Lima', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80' }
      ];
      const selected = likers[Math.floor(Math.random() * likers.length)];
      const targetPost = posts[0];
      const snippet = targetPost ? targetPost.content.substring(0, 50) : 'Sua publicação recente';

      addNotification({
        userId: currentUser?.id || 'user_me',
        category: 'social',
        type: 'post_like',
        actorId: selected.id,
        actorName: selected.name,
        actorAvatar: selected.avatar,
        message: 'curtiu a sua publicação no feed!',
        detailSnippet: snippet,
        targetType: 'post',
        targetId: targetPost?.id
      });
    } else if (type === 'community') {
      const members = [
        { id: 'user_diego', name: 'Diego Ferreira', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80' },
        { id: 'user_juliana', name: 'Juliana Paes', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80' },
        { id: 'user_thiago', name: 'Thiago Mendes', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80' }
      ];
      const selected = members[Math.floor(Math.random() * members.length)];
      const comm = communities[0];
      const commName = comm ? comm.name : 'Rock Brasil dos Anos 80 & 2000';

      addNotification({
        userId: currentUser?.id || 'user_me',
        category: 'groups',
        type: 'community_reply',
        actorId: selected.id,
        actorName: selected.name,
        actorAvatar: selected.avatar,
        message: `respondeu a um debate na comunidade "${commName}"!`,
        detailSnippet: 'Adorei a discussão! Concordo plenamente com o que você disse 🎶',
        targetType: 'group',
        targetId: comm?.id
      });
    }
  };

  // Periodic simulation for real-time notifications (friend requests, likes, community activity)
  useEffect(() => {
    if (!currentUser || notificationSettings.liveSimulation === false) return;

    // Pleasant initial simulation after 10s of being in the app
    const initialTimer = setTimeout(() => {
      const types: ('friend_request' | 'post_like' | 'community')[] = ['friend_request', 'post_like', 'community'];
      const chosen = types[Math.floor(Math.random() * types.length)];
      triggerTestNotification(chosen);
    }, 10000);

    // Continuous simulation every ~45 seconds
    const interval = setInterval(() => {
      const types: ('friend_request' | 'post_like' | 'community')[] = ['friend_request', 'post_like', 'community'];
      const chosen = types[Math.floor(Math.random() * types.length)];
      triggerTestNotification(chosen);
    }, 45000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [currentUser, notificationSettings.liveSimulation]);

  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({
      ...prev,
      ...settings,
      categories: {
        ...prev.categories,
        ...(settings.categories || {})
      }
    }));
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    markNotificationAsRead(notif.id);
    setIsNotificationsOpen(false);

    if (notif.targetType === 'profile_scraps') {
      setViewingUserId(notif.targetId || currentUser?.id || 'user_me');
      setActiveTab('profile', 'profile-scraps-tab');
    } else if (notif.targetType === 'profile_testimonials') {
      setViewingUserId(currentUser?.id || 'user_me');
      setActiveTab('profile', 'profile-testimonials-tab');
    } else if (notif.targetType === 'post') {
      setActiveTab('home', notif.targetId);
    } else if (notif.targetType === 'dating') {
      setActiveTab('encontros');
    } else if (notif.targetType === 'marketplace') {
      setActiveTab('marketplace');
    } else if (notif.targetType === 'group') {
      setActiveTab('communities');
      if (notif.targetId) {
        setViewingCommunityId(notif.targetId);
      }
    } else if (notif.targetType === 'chat') {
      openChatWithUser({
        id: notif.actorId,
        name: notif.actorName,
        avatar: notif.actorAvatar,
        username: notif.actorName.toLowerCase().replace(/\s+/g, '_'),
        isOnline: true
      } as any);
    } else if (notif.targetType === 'wallet') {
      openWalletModal(notif.type.includes('boost') || notif.type.includes('mkt') ? 'ads_spend' : 'balance');
    }
  };

  const addXP = (amount: number, reason?: string) => {
    if (!currentUser) return;
    const newXP = currentUser.xp + amount;
    const newLevel = Math.floor(newXP / 400) + 1;
    const leveledUp = newLevel > currentUser.level;

    const updated = {
      ...currentUser,
      xp: newXP,
      level: newLevel
    };
    setCurrentUser(updated);
    if (leveledUp) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      showToast(`🎉 Subiu de nível! Agora você é Nível ${newLevel}!`, 'vibe');
    } else if (reason) {
      showToast(`+${amount} XP: ${reason}`, 'info');
    }
  };

  // Auth functions
  const openGoogleAuthModal = (mode: 'signup' | 'login' = 'signup') => {
    setGoogleAuthMode(mode);
    setIsGoogleAuthModalOpen(true);
    setIsAuthModalOpen(false);
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest_' + Date.now(),
      name: 'Visitante Vibe',
      username: 'visitante',
      email: 'visitante@vibeclube.com',
      birthDate: '2000-01-01',
      city: 'Brasil',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      bio: 'Explorando o Vibe Clube em modo visitante!',
      interests: ['🎮 Games', '🎵 Música', '⭐ Anos 2000'],
      vibesBalance: 100,
      xp: 100,
      level: 1,
      isAdult: true,
      isDatingOptIn: false,
      profileTheme: 'nostalgia2000',
      profileBorder: 'none',
      isPremium: false,
      isOnline: true,
      createdAt: 'Hoje',
      friendsCount: 0,
      communitiesCount: 0,
      testimonialsCount: 0,
      photosCount: 0,
      privacy: {
        profileVisibility: 'public',
        allowScraps: 'all',
        allowMessages: 'all',
        showCity: true
      }
    };
    setCurrentUser(guestUser);
    setIsAuthenticated(true);
    showToast('Entrou em modo Visitante! Sinta-se em casa. ✨', 'info');
  };

  const login = (email: string, pass: string) => {
    const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setViewingUserId(found.id);
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
      showToast(`Bem-vindo de volta, ${found.name}! 🌟`, 'vibe');
      return true;
    }
    showToast('Conta não encontrada. Por favor, conecte-se com o Google.', 'info');
    openGoogleAuthModal('login');
    return false;
  };

  const loginWithGoogle = (data: { name: string; email: string; avatar?: string; username?: string; birthDate?: string; city?: string }) => {
    const existing = allUsers.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    
    if (existing) {
      const updatedUser: User = {
        ...existing,
        name: data.name || existing.name,
        avatar: data.avatar || existing.avatar,
        isOnline: true
      };
      setCurrentUser(updatedUser);
      setViewingUserId(updatedUser.id);
      setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      setIsAuthenticated(true);
      setIsGoogleAuthModalOpen(false);
      setIsAuthModalOpen(false);
      showToast(`Bem-vindo de volta, ${updatedUser.name}! Conectado via Google 🚀`, 'vibe');
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      return;
    }

    const usernameBase = (data.username || data.email.split('@')[0] || data.name.toLowerCase().replace(/\s+/g, '')).replace(/[^a-zA-Z0-9_]/g, '');
    
    const newGoogleUser: User = {
      id: 'user_google_' + Date.now(),
      name: data.name || data.email.split('@')[0],
      username: usernameBase || data.email.split('@')[0],
      email: data.email,
      authProvider: 'google',
      birthDate: data.birthDate || '2000-01-01',
      city: data.city || 'Brasil',
      avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name || data.email)}`,
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      bio: 'Conectado via Google no Vibe Clube! Pronto para fazer amizades, entrar em comunidades e curtir bons momentos.',
      interests: ['🎵 Música', '🎮 Games', '❤️ Amizade', '⭐ Anos 2000'],
      vibesBalance: 250, // Special Google signup bonus!
      xp: 400,
      level: 2,
      isAdult: true,
      isDatingOptIn: false,
      profileTheme: 'nostalgia2000',
      profileBorder: 'gold',
      isPremium: true,
      isOnline: true,
      createdAt: 'Hoje',
      friendsCount: 3,
      communitiesCount: 2,
      testimonialsCount: 0,
      photosCount: 0,
      privacy: {
        profileVisibility: 'public',
        allowScraps: 'all',
        allowMessages: 'all',
        showCity: true
      }
    };

    setAllUsers(prev => [newGoogleUser, ...prev]);
    setCurrentUser(newGoogleUser);
    setViewingUserId(newGoogleUser.id);
    setIsAuthenticated(true);
    setIsGoogleAuthModalOpen(false);
    setIsAuthModalOpen(false);
    setIsOnboardingOpen(false);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    showToast(`Conta conectada com o Google com sucesso! Bem-vindo, ${newGoogleUser.name}! 🎉`, 'vibe');
  };

  const signup = (userData: Partial<User>) => {
    const newUser: User = {
      id: 'user_' + Date.now(),
      name: userData.name || 'Novo Membro',
      username: userData.username || 'novoviber',
      email: userData.email || 'novo@vibeclube.com.br',
      birthDate: userData.birthDate,
      city: userData.city || 'Brasil',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      bio: userData.bio || 'Cheguei no Vibe Clube para fazer amigos, participar de comunidades e curtir bons momentos!',
      interests: userData.interests || ['🎵 Música', '🎮 Games', '❤️ Amizade'],
      vibesBalance: userData.vibesBalance !== undefined ? userData.vibesBalance : 50, // Welcome gift vibes
      xp: 200,
      level: 1,
      isAdult: true,
      isDatingOptIn: userData.isDatingOptIn ?? false,
      datingPreferences: userData.datingPreferences,
      profileTheme: 'nostalgia2000',
      profileBorder: 'gold',
      isPremium: false,
      isOnline: true,
      createdAt: 'Hoje',
      friendsCount: 1,
      communitiesCount: 1,
      testimonialsCount: 0,
      photosCount: 0,
      privacy: {
        profileVisibility: 'public',
        allowScraps: 'all',
        allowMessages: 'all',
        showCity: true
      }
    };
    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setViewingUserId(newUser.id);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    setIsOnboardingOpen(false);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
  };

  const logout = () => {
    logoutFromFirebase();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveTab('home');
    showToast('Você saiu com segurança. Até logo! 👋', 'info');
  };

  const completeOnboarding = (interests: string[], selectedCommunities: string[], enableDating: boolean) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      interests: interests.length > 0 ? interests : currentUser.interests,
      isDatingOptIn: enableDating,
      communitiesCount: selectedCommunities.length || 1,
      xp: currentUser.xp + 150
    };
    setCurrentUser(updated);
    setIsOnboardingOpen(false);
    showToast('Perfil configurado com sucesso! Ganhou +150 XP! 🚀', 'vibe');
  };

  const updateProfile = (fields: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...fields };
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    showToast('Perfil atualizado com sucesso!', 'success');
  };

  const setVibeOfTheDay = (emoji: string, label: string) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      vibeOfTheDay: { emoji, label, updatedAt: 'Agora mesmo' }
    };
    setCurrentUser(updated);
    addXP(30, 'Vibe do Dia publicada');
    showToast(`Vibe do dia definida: ${emoji} ${label}`, 'vibe');
  };

  // Social actions
  const createPost = (data: { 
    content: string; 
    mediaUrl?: string; 
    mediaType: 'none' | 'image' | 'video'; 
    pollQuestion?: string; 
    pollOptions?: string[]; 
    communityId?: string; 
    vibeTag?: string;
    pageId?: string;
    privacy?: 'public' | 'friends' | 'only_me';
    videoThumbnail?: string;
    duration?: number;
  }) => {
    if (!currentUser) return;
    if (currentUser.isSuspended) {
      showToast(`Sua conta está suspensa (${currentUser.suspensionUntil?.replace('_', ' ') || 'temporariamente'}). Você não pode publicar novos posts. Motivo: ${currentUser.suspensionReason || 'Violação de regras'}.`, 'error');
      return;
    }
    
    let poll = undefined;
    if (data.pollQuestion && data.pollOptions && data.pollOptions.length >= 2) {
      poll = {
        id: 'poll_' + Date.now(),
        question: data.pollQuestion,
        totalVotes: 0,
        options: data.pollOptions.map((opt, i) => ({ id: `opt_${i}`, text: opt, votes: 0 }))
      };
    }

    const matchedComm = communities.find(c => c.id === data.communityId);

    let authorName = currentUser.name;
    let authorUsername = currentUser.username;
    let authorAvatar = currentUser.avatar;
    let authorBadge = currentUser.isPremium ? '💎 Premium' : undefined;
    let isPagePost = false;
    let pageId: string | undefined = undefined;
    let pageName: string | undefined = undefined;
    let pageAvatar: string | undefined = undefined;

    if (data.pageId) {
      const page = pages.find(p => p.id === data.pageId);
      if (page && (page.ownerId === currentUser.id || page.admins.includes(currentUser.id))) {
        authorName = page.name;
        authorUsername = page.slug;
        authorAvatar = page.avatar;
        authorBadge = 'PÁGINA';
        isPagePost = true;
        pageId = page.id;
        pageName = page.name;
        pageAvatar = page.avatar;
      }
    }

    const newPost: Post = {
      id: 'post_' + Date.now(),
      authorId: currentUser.id,
      authorName,
      authorUsername,
      authorAvatar,
      authorBadge,
      content: data.content,
      mediaType: data.mediaType,
      mediaUrl: data.mediaUrl,
      poll,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      isSaved: false,
      createdAt: 'Agora mesmo',
      communityId: data.communityId,
      communityName: matchedComm?.name,
      pageId,
      pageName,
      pageAvatar,
      isPagePost,
      vibeTag: data.vibeTag || (isPagePost ? '🏬 Oficial' : currentUser.vibeOfTheDay?.label),
      privacy: data.privacy || 'public',
      videoThumbnail: data.videoThumbnail,
      duration: data.duration,
      comments: []
    };

    INITIAL_POSTS.unshift(newPost);
    setPosts(prev => {
      const updated = [newPost, ...prev];
      safeStorage.setItem('vibe_posts', updated);
      return updated;
    });
    addXP(40, isPagePost ? 'Nova publicação como Página' : 'Nova publicação no feed');
    showToast(isPagePost ? `Publicado como ${authorName}! 🏬✨` : 'Sua publicação foi compartilhada! 💬', 'success');
  };

  const deletePost = (postId: string) => {
    const idx = INITIAL_POSTS.findIndex(p => p.id === postId);
    if (idx !== -1) INITIAL_POSTS.splice(idx, 1);

    setPosts(prev => {
      const updated = prev.filter(p => p.id !== postId);
      safeStorage.setItem('vibe_posts', updated);
      return updated;
    });
    showToast('Publicação excluída', 'info');
  };

  const editPost = (postId: string, newContent: string) => {
    if (!newContent.trim()) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, content: newContent.trim(), isEdited: true };
      }
      return p;
    }));
    showToast('Publicação atualizada com sucesso! ✏️', 'success');
  };

  const updatePostPrivacy = (postId: string, privacy: 'public' | 'friends' | 'only_me') => {
    const privacyLabels = { public: 'Público 🌍', friends: 'Apenas Amigos 👥', only_me: 'Só Eu 🔒' };
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, privacy };
      }
      return p;
    }));
    showToast(`Privacidade alterada para: ${privacyLabels[privacy]}`, 'info');
  };

  const togglePostComments = (postId: string) => {
    let nowDisabled = false;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        nowDisabled = !p.commentsDisabled;
        return { ...p, commentsDisabled: nowDisabled };
      }
      return p;
    }));
    showToast(nowDisabled ? 'Comentários desativados para esta publicação' : 'Comentários ativados para esta publicação 💬', 'info');
  };

  const deleteComment = (postId: string, commentId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const filtered = (p.comments || []).filter(c => c.id !== commentId);
        return {
          ...p,
          comments: filtered,
          commentsCount: Math.max(0, p.commentsCount - 1)
        };
      }
      return p;
    }));
    showToast('Comentário excluído', 'info');
  };

  const editComment = (postId: string, commentId: string, newContent: string) => {
    if (!newContent.trim()) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const updated = (p.comments || []).map(c => c.id === commentId ? { ...c, content: newContent.trim() } : c);
        return { ...p, comments: updated };
      }
      return p;
    }));
    showToast('Comentário editado', 'info');
  };

  const pinPost = (postId: string) => {
    let isNowPinned = false;
    setPosts(prev => {
      const targetPost = prev.find(p => p.id === postId);
      if (!targetPost) return prev;
      isNowPinned = !targetPost.isPinned;
      return prev.map(p => {
        if (p.id === postId) {
          return { ...p, isPinned: isNowPinned };
        }
        // Ao fixar um post, desmarcar outros do mesmo autor para garantir 1 post fixado no topo do perfil
        if (isNowPinned && (p.authorId === targetPost.authorId || (p.authorUsername && p.authorUsername === targetPost.authorUsername)) && p.isPinned) {
          return { ...p, isPinned: false };
        }
        return p;
      });
    });
    showToast(isNowPinned ? 'Publicação fixada no topo do seu perfil! 📌' : 'Publicação desafixada do seu perfil 📌', 'success');
  };

  // Ads & Boost Actions
  const openBoostModalForPost = (post: Post) => {
    setBoostTargetPost(post);
    setIsBoostModalOpen(true);
  };

  const createBoostCampaign = (data: {
    postId: string;
    objective: AdObjective;
    audience: AdAudience;
    budget: number;
    durationDays: number;
  }): BoostCampaign => {
    const post = posts.find(p => p.id === data.postId) || boostTargetPost;
    const cpm = data.objective === 'views' ? 12 : data.objective === 'messages' ? 15 : 14;
    const baseReach = (data.budget / cpm) * 1000;
    const estimatedReachMin = Math.round(baseReach * 0.8);
    const estimatedReachMax = Math.round(baseReach * 1.2);
    const dailyBudget = Number((data.budget / data.durationDays).toFixed(2));
    const billingModel: BillingModel = data.objective === 'views' ? 'CPM' : 'CPC';

    const newCampaign: BoostCampaign = {
      id: 'camp_' + Date.now(),
      postId: data.postId,
      userId: currentUser?.id || 'user_me',
      userName: currentUser?.name || 'Lucas Silva',
      objective: data.objective,
      billingModel,
      audience: data.audience,
      budget: data.budget,
      durationDays: data.durationDays,
      dailyBudget,
      estimatedReachMin,
      estimatedReachMax,
      status: 'in_review',
      createdAt: 'Hoje',
      startDate: 'Hoje',
      endDate: `Daqui a ${data.durationDays} dias`,
      paidWithPix: true,
      pixTransactionId: `PIX-MP-${Math.floor(100000 + Math.random() * 900000)}-VB`,
      pixCopyPaste: `00020126580014br.gov.bcb.pix0136${Date.now()}-mp-vibeclube-pix520400005303986540${data.budget.toFixed(2)}5802BR5916VIBE CLUBE ADS6009SAO PAULO62070503***6304A1B2`,
      impressions: 0,
      clicks: 0,
      messages: 0,
      amountSpent: 0,
      daysRemaining: data.durationDays,
      postSnippet: {
        id: post?.id || data.postId,
        content: post?.content || 'Publicação do Vibe Clube',
        mediaUrl: post?.mediaUrl,
        mediaType: post?.mediaType || 'none',
        authorName: post?.authorName || currentUser?.name || 'Você',
        authorAvatar: post?.authorAvatar || currentUser?.avatar || '',
        createdAt: post?.createdAt || 'Hoje'
      }
    };

    setCampaigns(prev => [newCampaign, ...prev.filter(c => c.postId !== data.postId)]);

    setPosts(prev => prev.map(p => {
      if (p.id === data.postId) {
        return {
          ...p,
          isBoosted: true,
          boostStatus: 'in_review',
          boostCampaignId: newCampaign.id
        };
      }
      return p;
    }));

    addXP(100, 'Impulsionamento com Pix solicitado');
    return newCampaign;
  };

  const confirmPixPayment = (campaignId: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        return { ...c, paidWithPix: true, status: 'in_review' };
      }
      return c;
    }));
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
    showToast('Pagamento Pix aprovado! Anúncio enviado para moderação 🛡️', 'success');
  };

  const pauseCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        return { ...c, status: 'paused' };
      }
      return c;
    }));
    setPosts(prev => prev.map(p => {
      if (p.boostCampaignId === campaignId) {
        return { ...p, boostStatus: 'paused' };
      }
      return p;
    }));
    showToast('Anúncio pausado. O orçamento não continuará sendo consumido.', 'info');
  };

  const resumeCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        return { ...c, status: 'active' };
      }
      return c;
    }));
    setPosts(prev => prev.map(p => {
      if (p.boostCampaignId === campaignId) {
        return { ...p, boostStatus: 'active' };
      }
      return p;
    }));
    showToast('Anúncio retomado! Veiculação ativa no Vibe Clube 🚀', 'success');
  };

  const updateCampaignBudget = (campaignId: string, additionalBudget: number, additionalDays: number = 0) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        const newBudget = c.budget + additionalBudget;
        const newDays = c.durationDays + (additionalDays || 0);
        const cpm = c.objective === 'views' ? 12 : c.objective === 'messages' ? 15 : 14;
        const baseReach = (newBudget / cpm) * 1000;
        return {
          ...c,
          budget: newBudget,
          durationDays: newDays,
          daysRemaining: c.daysRemaining + (additionalDays || 0),
          dailyBudget: Number((newBudget / newDays).toFixed(2)),
          estimatedReachMin: Math.round(baseReach * 0.8),
          estimatedReachMax: Math.round(baseReach * 1.2)
        };
      }
      return c;
    }));
    showToast(`Orçamento atualizado com sucesso (+R$ ${additionalBudget.toFixed(2)})! 📈`, 'success');
  };

  const simulateModerationApproval = (campaignId: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        return {
          ...c,
          status: 'active',
          impressions: Math.max(c.impressions, 140),
          clicks: Math.max(c.clicks, 9)
        };
      }
      return c;
    }));
    setPosts(prev => prev.map(p => {
      if (p.boostCampaignId === campaignId) {
        return { ...p, isBoosted: true, boostStatus: 'active' };
      }
      return p;
    }));
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch {}
    showToast('Anúncio aprovado na moderação! Agora está ATIVO no Vibe Clube 🚀✨', 'success');
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        if (isLiked && notificationSettings.soundEnabled !== false) {
          notificationAudio.playChime('like');
        }
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
        };
      }
      return p;
    }));
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser || !content.trim()) return;
    if (currentUser.isSuspended) {
      showToast('Sua conta está suspensa. Você não pode comentar no momento.', 'error');
      return;
    }
    const newComment = {
      id: 'comm_' + Date.now(),
      postId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      content: content.trim(),
      createdAt: 'Agora',
      likesCount: 0,
      isLiked: false
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...(p.comments || []), newComment]
        };
      }
      return p;
    }));
    addXP(15, 'Comentário enviado');
  };

  const votePoll = (postId: string, optionId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId && p.poll && !p.poll.userVotedOptionId) {
        return {
          ...p,
          poll: {
            ...p.poll,
            totalVotes: p.poll.totalVotes + 1,
            userVotedOptionId: optionId,
            options: p.poll.options.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)
          }
        };
      }
      return p;
    }));
    addXP(10, 'Voto na enquete');
  };

  const toggleSavePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isSaved = !p.isSaved;
        showToast(isSaved ? 'Publicação salva nos favoritos!' : 'Removido dos salvos.', 'info');
        return { ...p, isSaved };
      }
      return p;
    }));
  };

  // Scraps
  const createScrap = (toUserId: string, content: string, emoji: string = '✨', isPrivate: boolean = false) => {
    if (!currentUser || !content.trim()) return;
    const newScrap: Scrap = {
      id: 'scrap_' + Date.now(),
      toUserId,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      fromUserUsername: currentUser.username,
      fromUserAvatar: currentUser.avatar,
      content: content.trim(),
      emoji,
      isPrivate,
      createdAt: 'Agora mesmo'
    };
    setScraps(prev => [newScrap, ...prev]);
    addXP(25, 'Recado enviado');
    showToast('Recado enviado para o mural! 📝', 'success');
  };

  const replyScrap = (scrapId: string, content: string) => {
    if (!currentUser || !content.trim()) return;
    const reply: any = {
      id: 'reply_' + Date.now(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      content: content.trim(),
      createdAt: 'Agora mesmo'
    };
    setScraps(prev => prev.map(s => {
      if (s.id === scrapId) {
        return {
          ...s,
          replies: [...(s.replies || []), reply]
        };
      }
      return s;
    }));
    addXP(15, 'Respondeu a um recado');
    showToast('Resposta publicada no recado! 💬', 'success');
  };

  const deleteScrap = (scrapId: string) => {
    setScraps(prev => prev.filter(s => s.id !== scrapId));
    showToast('Recado excluído.', 'info');
  };

  // Testimonials
  const createTestimonial = (toUserId: string, content: string) => {
    if (!currentUser || !content.trim()) return;
    const newDepo: Testimonial = {
      id: 'depo_' + Date.now(),
      toUserId,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      fromUserUsername: currentUser.username,
      fromUserAvatar: currentUser.avatar,
      content: content.trim(),
      status: 'pending',
      createdAt: 'Hoje'
    };
    setTestimonials(prev => [newDepo, ...prev]);
    addXP(30, 'Depoimento enviado');
    showToast('Depoimento enviado! Aparecerá assim que o destinatário aprovar. 💌', 'success');
  };

  const approveTestimonial = (testimonialId: string) => {
    setTestimonials(prev => prev.map(t => t.id === testimonialId ? { ...t, status: 'approved' } : t));
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, testimonialsCount: prev.testimonialsCount + 1 } : null);
    }
    addXP(35, 'Depoimento aprovado');
    showToast('Depoimento aprovado e visível no seu perfil! ⭐', 'vibe');
  };

  const rejectTestimonial = (testimonialId: string) => {
    setTestimonials(prev => prev.map(t => t.id === testimonialId ? { ...t, status: 'rejected' } : t));
    showToast('Depoimento recusado.', 'info');
  };

  const deleteTestimonial = (testimonialId: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== testimonialId));
    showToast('Depoimento removido.', 'info');
  };

  // Communities & Groups
  const joinCommunity = (communityId: string) => {
    if (!currentUser) return;
    setCommunities(prev => prev.map(c => {
      if (c.id === communityId) {
        const isNowMember = true;
        const newMember: GroupMember = {
          userId: currentUser.id,
          userName: currentUser.name,
          userUsername: currentUser.username,
          userAvatar: currentUser.avatar,
          role: 'member',
          joinedAt: 'Hoje'
        };
        const updatedMembers = c.members ? [...c.members.filter(m => m.userId !== currentUser.id), newMember] : [newMember];
        return { 
          ...c, 
          isMember: isNowMember, 
          membersCount: c.membersCount + 1,
          members: updatedMembers,
          currentUserRole: 'member'
        };
      }
      return c;
    }));
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, communitiesCount: prev.communitiesCount + 1 } : null);
    }
    addXP(30, 'Entrou na comunidade');
    showToast('Você agora faz parte deste espaço! 🏘️', 'vibe');
  };

  const leaveCommunity = (communityId: string) => {
    if (!currentUser) return;
    setCommunities(prev => prev.map(c => {
      if (c.id === communityId) {
        return { 
          ...c, 
          isMember: false, 
          membersCount: Math.max(0, c.membersCount - 1),
          members: c.members ? c.members.filter(m => m.userId !== currentUser.id) : [],
          currentUserRole: null
        };
      }
      return c;
    }));
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, communitiesCount: Math.max(0, prev.communitiesCount - 1) } : null);
    }
    showToast('Você saiu deste espaço.', 'info');
  };

  const createCommunity = (data: { 
    name: string; 
    description: string; 
    category: string; 
    logo: string; 
    coverImage: string; 
    rules: string[]; 
    privacy?: GroupPrivacy; 
    type?: Community['type'] 
  }) => {
    if (!currentUser) return;
    const kind = data.type || 'community';
    const priv = data.privacy || 'public';
    const newComm: Community = {
      id: 'comm_' + Date.now(),
      name: data.name,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      type: kind,
      description: data.description,
      category: data.category,
      logo: data.logo,
      coverImage: data.coverImage,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      membersCount: 1,
      isMember: true,
      privacy: priv,
      isPrivate: priv === 'private' || priv === 'secret',
      rules: data.rules.length ? data.rules : ['Respeito mútuo entre todos os participantes.'],
      topicsCount: 0,
      pollsCount: 0,
      createdAt: 'Hoje',
      photos: [data.coverImage, data.logo].filter(Boolean),
      currentUserRole: 'owner',
      members: [
        {
          userId: currentUser.id,
          userName: currentUser.name,
          userUsername: currentUser.username,
          userAvatar: currentUser.avatar,
          role: 'owner',
          joinedAt: 'Hoje'
        }
      ],
      pendingRequests: []
    };
    INITIAL_COMMUNITIES.unshift(newComm);
    setCommunities(prev => {
      const updated = [newComm, ...prev];
      safeStorage.setItem('vibe_communities', updated);
      return updated;
    });
    addXP(100, `Criou ${kind === 'group' ? 'um novo Grupo' : kind === 'page' ? 'uma nova Página' : 'uma nova Comunidade'}`);
    confetti({ particleCount: 80, spread: 70 });
    const label = kind === 'group' ? 'Grupo' : kind === 'page' ? 'Página' : 'Comunidade';
    showToast(`${label} "${data.name}" criado(a) com sucesso! 🚀`, 'vibe');
  };

  const updateCommunityCover = (communityId: string, coverImage: string) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === communityId) {
        return { 
          ...c, 
          coverImage, 
          photos: c.photos ? (c.photos.includes(coverImage) ? c.photos : [coverImage, ...c.photos]) : [coverImage]
        };
      }
      return c;
    }));
    addXP(20, 'Atualizou a capa');
    showToast('Foto de capa atualizada com sucesso! 📸✨', 'success');
  };

  const updateCommunity = (communityId: string, fields: Partial<Community>) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === communityId) {
        return { ...c, ...fields };
      }
      return c;
    }));
    showToast('Dados atualizados com sucesso! ✨', 'success');
  };

  const addCommunityPhoto = (communityId: string, photoUrl: string) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === communityId) {
        return {
          ...c,
          photos: [photoUrl, ...(c.photos || [])]
        };
      }
      return c;
    }));
    addXP(20, 'Foto adicionada à galeria');
    showToast('Nova foto adicionada com sucesso! 🖼️', 'success');
  };

  const requestJoinGroup = (groupId: string) => {
    if (!currentUser) return;
    setCommunities(prev => prev.map(c => {
      if (c.id === groupId) {
        const alreadyRequested = c.pendingRequests?.some(r => r.userId === currentUser.id);
        if (alreadyRequested) return c;
        const newReq: GroupJoinRequest = {
          userId: currentUser.id,
          userName: currentUser.name,
          userUsername: currentUser.username,
          userAvatar: currentUser.avatar,
          requestedAt: 'Agora'
        };
        return {
          ...c,
          pendingRequests: [...(c.pendingRequests || []), newReq]
        };
      }
      return c;
    }));
    showToast('Solicitação de entrada enviada para moderação! ⏳', 'info');
  };

  const approveJoinRequest = (groupId: string, userId: string) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === groupId) {
        const req = c.pendingRequests?.find(r => r.userId === userId);
        const newMember: GroupMember = {
          userId,
          userName: req?.userName || 'Membro',
          userUsername: req?.userUsername || 'membro',
          userAvatar: req?.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          role: 'member',
          joinedAt: 'Hoje'
        };
        return {
          ...c,
          membersCount: c.membersCount + 1,
          pendingRequests: (c.pendingRequests || []).filter(r => r.userId !== userId),
          members: [...(c.members || []), newMember]
        };
      }
      return c;
    }));
    showToast('Membro aprovado com sucesso! 🎉', 'success');
  };

  const rejectJoinRequest = (groupId: string, userId: string) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === groupId) {
        return {
          ...c,
          pendingRequests: (c.pendingRequests || []).filter(r => r.userId !== userId)
        };
      }
      return c;
    }));
    showToast('Solicitação recusada.', 'info');
  };

  const removeGroupMember = (groupId: string, userId: string) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === groupId) {
        return {
          ...c,
          membersCount: Math.max(0, c.membersCount - 1),
          members: (c.members || []).filter(m => m.userId !== userId)
        };
      }
      return c;
    }));
    showToast('Membro removido do grupo.', 'info');
  };

  const changeMemberRole = (groupId: string, userId: string, newRole: GroupRole) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === groupId) {
        return {
          ...c,
          members: (c.members || []).map(m => m.userId === userId ? { ...m, role: newRole } : m)
        };
      }
      return c;
    }));
    showToast(`Cargo do membro alterado para ${newRole.toUpperCase()}! 🛡️`, 'success');
  };

  const toggleMuteGroup = (groupId: string) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === groupId) {
        const isMuted = !c.isMuted;
        showToast(isMuted ? 'Notificações silenciadas.' : 'Notificações ativadas.', 'info');
        return { ...c, isMuted };
      }
      return c;
    }));
  };

  const pinGroupPost = (groupId: string, postId: string) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === groupId) {
        return { ...c, pinnedPostId: c.pinnedPostId === postId ? undefined : postId };
      }
      return c;
    }));
    showToast('Status de fixação do post atualizado 📌', 'success');
  };

  const deleteGroupPost = (groupId: string, postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    showToast('Publicação removida com sucesso pelos moderadores.', 'info');
  };

  const inviteFriendsToGroup = (groupId: string, friendIds: string[]) => {
    showToast(`Convite enviado para ${friendIds.length} amigo(s)! 💌`, 'success');
  };

  const createTopic = (communityId: string, title: string, content: string) => {
    if (!currentUser || !title.trim() || !content.trim()) return;
    const newTop: CommunityTopic = {
      id: 'top_' + Date.now(),
      communityId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      title: title.trim(),
      content: content.trim(),
      isPinned: false,
      repliesCount: 0,
      viewsCount: 1,
      likesCount: 0,
      isLiked: false,
      createdAt: 'Agora',
      lastActivityAt: 'Agora',
      replies: []
    };
    setTopics(prev => [newTop, ...prev]);
    setCommunities(prev => prev.map(c => c.id === communityId ? { ...c, topicsCount: c.topicsCount + 1 } : c));
    addXP(50, 'Criou um novo tópico no fórum');
    showToast('Tópico publicado no fórum da comunidade! 📌', 'success');
  };

  const replyTopic = (topicId: string, content: string) => {
    if (!currentUser || !content.trim()) return;
    const newReply = {
      id: 'rep_' + Date.now(),
      topicId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content: content.trim(),
      createdAt: 'Agora mesmo',
      likesCount: 0,
      isLiked: false
    };
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          repliesCount: t.repliesCount + 1,
          lastActivityAt: 'Agora',
          replies: [...(t.replies || []), newReply]
        };
      }
      return t;
    }));
    addXP(20, 'Resposta no tópico');
    showToast('Sua resposta foi enviada!', 'success');
  };

  const likeTopic = (topicId: string) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        const isLiked = !t.isLiked;
        if (isLiked && notificationSettings.soundEnabled !== false) {
          notificationAudio.playChime('community');
        }
        return {
          ...t,
          isLiked,
          likesCount: isLiked ? t.likesCount + 1 : Math.max(0, t.likesCount - 1)
        };
      }
      return t;
    }));
  };

  // Photos & Albums
  const createAlbum = (title: string, description: string, privacy: 'public' | 'friends' | 'private', coverUrl: string) => {
    if (!currentUser) return;
    const newAlb: Album = {
      id: 'alb_' + Date.now(),
      userId: currentUser.id,
      title: title.trim(),
      description: description.trim(),
      privacy,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&auto=format&fit=crop&q=80',
      photos: [],
      createdAt: 'Hoje'
    };
    setAlbums(prev => [newAlb, ...prev]);
    addXP(40, 'Criou um álbum de fotos');
    showToast('Álbum criado com sucesso! 📸', 'success');
  };

  const addPhotoToAlbum = (albumId: string, url: string, caption?: string) => {
    const newPh = {
      id: 'ph_' + Date.now(),
      url,
      caption,
      likes: 0,
      comments: 0,
      createdAt: 'Hoje',
      isLiked: false
    };
    setAlbums(prev => prev.map(a => a.id === albumId ? { ...a, photos: [...a.photos, newPh] } : a));
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, photosCount: prev.photosCount + 1 } : null);
    }
    addXP(20, 'Nova foto adicionada');
    showToast('Foto adicionada ao álbum! 🖼️', 'success');
  };

  // Dating
  const swipeDating = (candidateId: string, action: 'like' | 'pass' | 'superlike') => {
    if (!currentUser) return;
    if (action !== 'pass' && !hasUnlimitedDating && datingLikesUsed >= pricingConfig.maxDailyDatingLikes) {
      showToast(`Você atingiu o limite de ${pricingConfig.maxDailyDatingLikes} curtidas de hoje!`, 'error');
      setIsVibesModalOpen(true);
      return;
    }

    if (action === 'like' || action === 'superlike') {
      setDatingLikesUsed(prev => prev + 1);
      const candidate = datingCandidates.find(c => c.userId === candidateId);
      // Simulate high-probability match for demo interactivity
      if (candidate) {
        const matchedUser = allUsers.find(u => u.id === candidate.userId) || {
          id: candidate.userId,
          name: candidate.name,
          username: candidate.name.toLowerCase().replace(' ', '_'),
          email: `${candidate.userId}@exemplo.com.br`,
          city: candidate.city,
          avatar: candidate.photos[0],
          coverImage: candidate.photos[1] || candidate.photos[0],
          bio: candidate.bio,
          interests: candidate.interests,
          vibesBalance: 100,
          xp: 1500,
          level: 4,
          isAdult: true,
          isDatingOptIn: true,
          profileTheme: 'sunset',
          profileBorder: 'gold',
          isPremium: false,
          createdAt: '2026-01-01',
          friendsCount: 20,
          communitiesCount: 5,
          testimonialsCount: 4,
          photosCount: 6,
          privacy: { profileVisibility: 'public', allowScraps: 'all', allowMessages: 'all', showCity: true }
        } as User;

        const newMatch: DatingMatch = {
          id: 'match_' + Date.now(),
          user: matchedUser,
          matchedAt: 'Agora mesmo'
        };

        setDatingMatches(prev => [newMatch, ...prev]);
        setLatestMatch(newMatch);
        setIsMatchModalOpen(true);
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
        addXP(80, 'Deu Match no Vibe Encontros!');
      }
    }

    setDatingCandidates(prev => prev.filter(c => c.userId !== candidateId));
  };

  const buyDatingUnlimited = () => {
    setHasUnlimitedDating(true);
    showToast('Curtidas ilimitadas ativadas por 24 horas! ❤️', 'vibe');
  };

  const setDatingOptIn = (optIn: boolean) => {
    if (!currentUser) return;
    const updated = { ...currentUser, isDatingOptIn: optIn };
    setCurrentUser(updated);
    showToast(optIn ? 'Você está participando do Vibe Encontros! 💘' : 'Vibe Encontros desativado.', 'info');
  };

  // Arcade
  const saveArcadeScore = (gameId: string, score: number) => {
    addXP(Math.min(100, Math.floor(score / 5)), 'Partida no Arcade');
    showToast(`Pontuação de ${score} salva no Arcade! 🕹️`, 'vibe');
  };

  // Wallet / Carteira Methods
  const openWalletModal = (initialTab: WalletTab = 'balance') => {
    setWalletActiveTab(initialTab);
    setIsWalletModalOpen(true);
  };

  const addVibesTransaction = (tx: Omit<VibesTransaction, 'id' | 'timestamp'>) => {
    const newTx: VibesTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      ...tx
    };
    setVibesTransactions(prev => [newTx, ...prev]);
  };

  const addMarketplaceAdSpend = (spend: Omit<MarketplaceAdSpend, 'id' | 'timestamp'>) => {
    const newSpend: MarketplaceAdSpend = {
      id: `ad_spend_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      ...spend
    };
    setMarketplaceAdSpends(prev => [newSpend, ...prev]);
  };

  const addSavedPaymentMethod = (method: Omit<SavedPaymentMethod, 'id'>) => {
    const newMethod: SavedPaymentMethod = {
      id: `pm_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      ...method
    };
    setSavedPaymentMethods(prev => {
      if (newMethod.isDefault) {
        return [newMethod, ...prev.map(m => ({ ...m, isDefault: false }))];
      }
      return [...prev, newMethod];
    });
  };

  const removeSavedPaymentMethod = (id: string) => {
    setSavedPaymentMethods(prev => prev.filter(m => m.id !== id));
  };

  const setDefaultSavedPaymentMethod = (id: string) => {
    setSavedPaymentMethods(prev => prev.map(m => ({
      ...m,
      isDefault: m.id === id
    })));
  };

  const buyVibesWithPix = (packageId: string) => {
    const pkgMap: Record<string, { amount: number; price: number; bonus: number }> = {
      pkg_50: { amount: 50, price: 4.90, bonus: 0 },
      pkg_150: { amount: 150, price: 12.90, bonus: 10 },
      pkg_400: { amount: 400, price: 29.90, bonus: 40 },
      pkg_1000: { amount: 1000, price: 59.90, bonus: 150 },
    };

    const pkg = pkgMap[packageId] || { amount: 100, price: 10, bonus: 0 };
    const totalAmount = pkg.amount + (pkg.bonus || 0);

    if (currentUser) {
      setCurrentUser(prev => prev ? {
        ...prev,
        vibesBalance: prev.vibesBalance + totalAmount
      } : null);
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    addVibesTransaction({
      type: 'purchase',
      amount: totalAmount,
      description: `Compra de Pacote ${pkg.amount} Vibes${pkg.bonus > 0 ? ` (+${pkg.bonus} bônus)` : ''} via Pix Mercado Pago`,
      date: `Hoje às ${timeStr}`,
      category: 'store',
      referenceId: packageId
    });

    addXP(120, 'Recarga de Vibes via Pix');
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    showToast(`Pagamento Pix aprovado! +${totalAmount} Vibes creditadas com sucesso! 🪙`, 'success');

    addNotification({
      userId: currentUser?.id || 'user_me',
      category: 'system',
      type: 'payment_pix_confirmed',
      actorId: 'system_pay',
      actorName: 'Vibe Carteira',
      actorAvatar: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&auto=format&fit=crop&q=80',
      message: `Pagamento Pix confirmado! R$ ${pkg.price.toFixed(2).replace('.', ',')} aprovado`,
      detailSnippet: `+${totalAmount} Vibes creditadas com sucesso na sua carteira.`,
      targetType: 'wallet'
    });
  };

  // Economy & Gifts
  const buyVibesPackage = (packageId: string) => {
    const pkg = pricingConfig.vibesPackages.find(p => p.id === packageId);
    if (!pkg || !currentUser) return;
    const totalAmount = pkg.amount + (pkg.bonus || 0);
    const updated = {
      ...currentUser,
      vibesBalance: currentUser.vibesBalance + totalAmount
    };
    setCurrentUser(updated);
    setIsVibesModalOpen(false);

    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    addVibesTransaction({
      type: 'purchase',
      amount: totalAmount,
      description: `Compra de Pacote ${pkg.amount} Vibes via Loja`,
      date: `Hoje às ${timeStr}`,
      category: 'store',
      referenceId: packageId
    });

    confetti({ particleCount: 70, spread: 60 });
    showToast(`Parabéns! +${totalAmount} Vibes creditadas na sua conta! 🪙`, 'vibe');
  };

  const sendGift = (toUserId: string, giftId: string, message?: string) => {
    const gift = gifts.find(g => g.id === giftId);
    if (!gift || !currentUser) return false;
    if (currentUser.vibesBalance < gift.costVibes) {
      showToast('Vibes insuficientes! Recarregue suas Vibes na loja.', 'error');
      openWalletModal('balance');
      return false;
    }
    const updated = {
      ...currentUser,
      vibesBalance: currentUser.vibesBalance - gift.costVibes
    };
    setCurrentUser(updated);

    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    addVibesTransaction({
      type: 'spend',
      amount: -gift.costVibes,
      description: `Envio do presente ${gift.name} ${gift.emoji}`,
      date: `Hoje às ${timeStr}`,
      category: 'gift',
      referenceId: gift.id
    });

    addXP(40, `Presente ${gift.name} enviado`);
    setIsGiftModalOpen(false);
    confetti({ particleCount: 60, spread: 70 });
    showToast(`Presente ${gift.emoji} ${gift.name} enviado com sucesso! 🎁`, 'vibe');
    return true;
  };

  const buyPremiumSubscription = () => {
    if (!currentUser) return;
    const updated: User = {
      ...currentUser,
      isPremium: true,
      profileBorder: 'gold',
      vibesBalance: currentUser.vibesBalance + 250
    };
    setCurrentUser(updated);
    setIsPremiumModalOpen(false);
    setHasUnlimitedDating(true);
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.4 } });
    showToast('🌟 Você agora é VIBE PREMIUM! Aproveite todos os benefícios exclusivos!', 'vibe');
  };

  // Friendship
  const [friendRequests, setFriendRequests] = useState<FriendRequestItem[]>(() => {
    return safeStorage.getItem<FriendRequestItem[]>('vibe_friend_requests', [
      {
        id: 'req_1',
        fromUserId: 'usr_2',
        fromUserName: 'Juliana Paes',
        fromUserUsername: 'juliana_vibe',
        fromUserAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        createdAt: 'Hoje às 14:20',
        status: 'pending'
      },
      {
        id: 'req_2',
        fromUserId: 'usr_4',
        fromUserName: 'Lucas Lima',
        fromUserUsername: 'lucas_lima_sp',
        fromUserAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        createdAt: 'Ontem',
        status: 'pending'
      }
    ]);
  });

  useEffect(() => {
    safeStorage.setItem('vibe_friend_requests', friendRequests);
  }, [friendRequests]);

  const sendFriendRequest = (userId: string) => {
    if (notificationSettings.soundEnabled !== false) {
      notificationAudio.playChime('friend');
    }
    showToast('Solicitação de amizade enviada! 🤝', 'success');
  };

  const acceptFriendRequest = (requestIdOrUserId: string) => {
    const req = friendRequests.find(r => r.id === requestIdOrUserId || r.fromUserId === requestIdOrUserId);
    if (req) {
      setFriendRequests(prev => prev.filter(r => r.id !== req.id));
    }
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, friendsCount: prev.friendsCount + 1 } : null);
    }
    addXP(50, 'Novo amigo adicionado');
    showToast(req ? `Amizade com ${req.fromUserName} aceita! Agora vocês estão conectados no Vibe Clube.` : 'Amizade aceita! Agora vocês estão conectados no Vibe Clube.', 'vibe');
  };

  const rejectFriendRequest = (requestId: string) => {
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
    showToast('Solicitação de amizade recusada.', 'info');
  };

  const removeFriend = (userId: string) => {
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, friendsCount: Math.max(0, prev.friendsCount - 1) } : null);
    }
    showToast('Amizade desfeita.', 'info');
  };

  // Pages actions
  const createPage = (data: { name: string; category: PageCategory; avatar: string; coverImage: string; bio: string; email?: string; phone?: string; website?: string; whatsapp?: string; }) => {
    if (!currentUser) return;
    const newPage: VibePage = {
      id: `page_${Date.now()}`,
      name: data.name,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      category: data.category,
      avatar: data.avatar || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150',
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
      bio: data.bio,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      admins: [currentUser.id],
      followersCount: 1,
      verified: false,
      createdAt: 'Agora mesmo',
      email: data.email,
      phone: data.phone,
      website: data.website,
      whatsapp: data.whatsapp
    };
    INITIAL_PAGES.unshift(newPage);
    setPages(prev => {
      const updated = [newPage, ...prev];
      safeStorage.setItem('vibe_pages', updated);
      return updated;
    });
    addXP(100, 'Criou uma página comercial');
    showToast(`Página "${data.name}" criada com sucesso! 🏬🎉`, 'success');
  };

  const followPage = (pageId: string) => {
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, followersCount: p.followersCount + 1, isFollowing: true } : p));
    showToast('Você agora segue esta página!', 'success');
  };

  const unfollowPage = (pageId: string) => {
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, followersCount: Math.max(0, p.followersCount - 1), isFollowing: false } : p));
    showToast('Você deixou de seguir esta página.', 'info');
  };

  const updatePage = (pageId: string, fields: Partial<VibePage>) => {
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, ...fields } : p));
    showToast('Página atualizada com sucesso!', 'success');
  };

  const deletePage = (pageId: string) => {
    setPages(prev => prev.filter(p => p.id !== pageId));
    showToast('Página removida com sucesso.', 'info');
  };

  const userAdminPages = pages.filter(p => currentUser && (p.ownerId === currentUser.id || p.admins.includes(currentUser.id)));

  // Following state
  const [followedUserIds, setFollowedUserIds] = useState<string[]>(() => {
    return safeStorage.getItem<string[]>('vibe_followed_users', []);
  });

  const toggleFollowUser = (userId: string, userName?: string) => {
    setFollowedUserIds(prev => {
      const isFollowing = prev.includes(userId);
      const updated = isFollowing ? prev.filter(id => id !== userId) : [...prev, userId];
      safeStorage.setItem('vibe_followed_users', updated);
      showToast(isFollowing ? `Você deixou de seguir ${userName || 'o usuário'}` : `Você agora está seguindo ${userName || 'o usuário'}! ✨`, 'info');
      return updated;
    });
  };

  const isFollowingUser = (userId: string) => followedUserIds.includes(userId);

  // Apps Store (Vibe Play) Actions
  const publishApp = (appData: {
    name: string;
    packageName: string;
    tagline: string;
    description: string;
    category: AppItem['category'];
    iconUrl: string;
    screenshots: string[];
    bannerUrl?: string;
    size: string;
    version: string;
    minAndroid: string;
    apkUrl?: string;
    playStoreUrl?: string;
    changelog?: string;
    ageRating?: AppItem['ageRating'];
  }) => {
    const newApp: AppItem = {
      id: 'app_' + Date.now(),
      name: appData.name,
      packageName: appData.packageName || `com.vibeclube.${appData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      tagline: appData.tagline,
      description: appData.description,
      category: appData.category,
      developer: {
        id: currentUser?.id || 'dev_user',
        name: currentUser?.name || 'Desenvolvedor Vibe',
        avatar: currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev',
        verified: true,
        email: currentUser?.email
      },
      iconUrl: appData.iconUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&auto=format&fit=crop&q=80',
      screenshots: appData.screenshots.length > 0 ? appData.screenshots : [
        'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&auto=format&fit=crop&q=80'
      ],
      bannerUrl: appData.bannerUrl,
      rating: 5.0,
      ratingsCount: 1,
      downloadsCount: 1,
      size: appData.size || '25.0 MB',
      version: appData.version || 'v1.0.0',
      minAndroid: appData.minAndroid || 'Android 8.0+',
      apkUrl: appData.apkUrl,
      playStoreUrl: appData.playStoreUrl,
      changelog: appData.changelog || '• Lançamento oficial no Vibe Play Store!',
      featured: true,
      editorsChoice: false,
      ageRating: appData.ageRating || 'Livre',
      createdAt: 'Agora mesmo',
      comments: [
        {
          id: 'rev_first_' + Date.now(),
          userId: currentUser?.id || 'dev_user',
          userName: currentUser?.name || 'Desenvolvedor',
          userAvatar: currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev',
          rating: 5,
          title: 'App publicado oficialmente!',
          comment: 'Deixem seus comentários e sugestões para as próximas atualizações.',
          createdAt: 'Agora',
          likesCount: 1
        }
      ]
    };

    setAppsList(prev => [newApp, ...prev]);
    setIsPublishAppModalOpen(false);
    addXP(150, 'Publicou um aplicativo no Vibe Play');
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    showToast(`🚀 Aplicativo "${newApp.name}" publicado com sucesso no Vibe Play Store!`, 'vibe');
  };

  const unlockUnlimitedAppLicense = () => {
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        hasUnlimitedAppLicense: true,
        appLicensePaidAt: new Date().toISOString()
      };
      setCurrentUser(updatedUser);
      safeStorage.setItem('vibe_current_user', updatedUser);
      addXP(250, 'Ativou Licença de Desenvolvedor Ilimitada');
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      showToast('🎉 Taxa de R$ 49,90 confirmada! Agora você tem permissão para publicar aplicativos ilimitadamente no Vibe Play!', 'vibe');
    }
  };

  const installApp = (appId: string) => {
    if (!installedAppIds.includes(appId)) {
      setInstalledAppIds(prev => [...prev, appId]);
      setAppsList(prev => prev.map(app => {
        if (app.id === appId) {
          return { ...app, downloadsCount: app.downloadsCount + 1 };
        }
        return app;
      }));
      addXP(30, 'Instalou aplicativo do Vibe Play');
      confetti({ particleCount: 40, spread: 50 });
      showToast('Aplicativo instalado no seu dispositivo com sucesso! 📲', 'success');
    } else {
      showToast('Aplicativo aberto! ✅', 'info');
    }
  };

  const rateApp = (appId: string, rating: number, title: string, comment: string) => {
    if (!currentUser) {
      showToast('Faça login para avaliar aplicativos.', 'error');
      return;
    }

    const newReview: AppReview = {
      id: 'rev_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating,
      title: title || 'Ótimo aplicativo!',
      comment,
      createdAt: 'Agora mesmo',
      likesCount: 0
    };

    setAppsList(prev => prev.map(app => {
      if (app.id === appId) {
        const newComments = [newReview, ...app.comments];
        const totalRating = newComments.reduce((acc, c) => acc + c.rating, 0);
        const avg = parseFloat((totalRating / newComments.length).toFixed(1));
        return {
          ...app,
          rating: avg,
          ratingsCount: app.ratingsCount + 1,
          comments: newComments
        };
      }
      return app;
    }));

    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(prev => {
        if (!prev) return null;
        const newComments = [newReview, ...prev.comments];
        const totalRating = newComments.reduce((acc, c) => acc + c.rating, 0);
        const avg = parseFloat((totalRating / newComments.length).toFixed(1));
        return {
          ...prev,
          rating: avg,
          ratingsCount: prev.ratingsCount + 1,
          comments: newComments
        };
      });
    }

    addXP(40, 'Avaliou aplicativo');
    confetti({ particleCount: 50, spread: 60 });
    showToast('Sua avaliação com estrelas foi enviada! Obrigado pelo feedback. ⭐', 'vibe');
  };

  const likeAppReview = (appId: string, reviewId: string) => {
    setAppsList(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          comments: app.comments.map(c => {
            if (c.id === reviewId) {
              const isLiked = !c.isLiked;
              return {
                ...c,
                isLiked,
                likesCount: isLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1)
              };
            }
            return c;
          })
        };
      }
      return app;
    }));

    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(prev => {
        if (!prev) return null;
        return {
          ...prev,
          comments: prev.comments.map(c => {
            if (c.id === reviewId) {
              const isLiked = !c.isLiked;
              return {
                ...c,
                isLiked,
                likesCount: isLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1)
              };
            }
            return c;
          })
        };
      });
    }
  };

  // Create Club / Group / Page Access
  const [isCreateClubModalOpen, setIsCreateClubModalOpen] = useState(false);
  const [createClubInitialType, setCreateClubInitialType] = useState<CommunityType>('community');

  const openCreateClubModal = (type: CommunityType = 'community') => {
    setCreateClubInitialType(type);
    setIsCreateClubModalOpen(true);
  };

  // Marketplace
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(() => {
    return safeStorage.getItem<MarketplaceItem[]>('vibe_marketplace_items', INITIAL_MARKETPLACE_ITEMS);
  });

  useEffect(() => {
    safeStorage.setItem('vibe_marketplace_items', marketplaceItems);
  }, [marketplaceItems]);

  const createMarketplaceItem = (itemData: Omit<MarketplaceItem, 'id' | 'createdAt' | 'viewsCount' | 'status'>): MarketplaceItem => {
    const newItem: MarketplaceItem = {
      ...itemData,
      id: `item_${Date.now()}`,
      createdAt: 'Agora mesmo',
      viewsCount: 1,
      status: 'available'
    };
    
    // 1. Update in-memory mock database array so fallback also preserves the ad
    INITIAL_MARKETPLACE_ITEMS.unshift(newItem);

    // 2. Persist to state and safeStorage
    const updated = [newItem, ...marketplaceItems];
    setMarketplaceItems(updated);
    safeStorage.setItem('vibe_marketplace_items', updated);

    console.log('[Marketplace:Create] Anúncio salvo com sucesso no AppContext e safeStorage:', newItem);

    addXP(100, 'Anunciou um item no Marketplace');
    showToast('Produto anunciado com sucesso no Vibe Marketplace! 🛍️', 'success');
    return newItem;
  };

  const boostMarketplaceItem = (itemId: string, durationDays: number = 7): boolean => {
    const item = marketplaceItems.find(i => i.id === itemId);
    const priceMap: Record<number, number> = { 3: 15.00, 7: 29.90, 15: 49.90, 30: 89.90 };
    const amountBrl = priceMap[durationDays] || (durationDays * 4.5);

    const boostExpiry = `Ativo por ${durationDays} dias`;

    // Update in-memory mock database array
    const mockItem = INITIAL_MARKETPLACE_ITEMS.find(i => i.id === itemId);
    if (mockItem) {
      mockItem.isBoosted = true;
      mockItem.boostExpiry = boostExpiry;
    }

    setMarketplaceItems(prev => {
      const updated = prev.map(it => it.id === itemId ? { 
        ...it, 
        isBoosted: true,
        boostExpiry
      } : it);
      safeStorage.setItem('vibe_marketplace_items', updated);
      return updated;
    });

    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    addMarketplaceAdSpend({
      itemId,
      itemTitle: item?.title || 'Anúncio no Marketplace',
      itemImage: item?.imageUrl,
      amountBrl,
      durationDays,
      dailyBudget: +(amountBrl / durationDays).toFixed(2),
      status: 'active',
      startDate: `Hoje às ${timeStr}`,
      endDate: `Em ${durationDays} dias`,
      createdAt: 'Hoje',
      paymentMethod: 'pix'
    });

    showToast(`Anúncio impulsionado com sucesso! Ganhou destaque no topo por ${durationDays} dias. ⚡`, 'success');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    return true;
  };

  const markMarketplaceItemSold = (itemId: string) => {
    const mockItem = INITIAL_MARKETPLACE_ITEMS.find(i => i.id === itemId);
    if (mockItem) mockItem.status = 'sold';

    setMarketplaceItems(prev => {
      const updated = prev.map(item => item.id === itemId ? { ...item, status: 'sold' as const } : item);
      safeStorage.setItem('vibe_marketplace_items', updated);
      return updated;
    });
    showToast('Status atualizado para Vendido!', 'info');
  };

  const deleteMarketplaceItem = (itemId: string) => {
    const idx = INITIAL_MARKETPLACE_ITEMS.findIndex(i => i.id === itemId);
    if (idx !== -1) INITIAL_MARKETPLACE_ITEMS.splice(idx, 1);

    setMarketplaceItems(prev => {
      const updated = prev.filter(item => item.id !== itemId);
      safeStorage.setItem('vibe_marketplace_items', updated);
      return updated;
    });
    showToast('Anúncio excluído com sucesso', 'info');
  };

  // Chat / Messenger
  const [chatConversations, setChatConversations] = useState<ChatConversation[]>(() => {
    return safeStorage.getItem<ChatConversation[]>('vibe_chat_conversations', INITIAL_CONVERSATIONS);
  });

  const [chatMessages, setChatMessages] = useState<Record<string, MessageItem[]>>(() => {
    return safeStorage.getItem<Record<string, MessageItem[]>>('vibe_chat_messages', INITIAL_MESSAGES);
  });

  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);

  useEffect(() => {
    safeStorage.setItem('vibe_chat_conversations', chatConversations);
    safeStorage.setItem('vibe_chat_messages', chatMessages);
  }, [chatConversations, chatMessages]);

  const unreadMessagesCount = chatConversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const openChatWithUser = (
    user: User | { id: string; name: string; avatar: string },
    initialMessage?: string,
    contextData?: {
      marketplaceItemId?: string;
      marketplaceItemTitle?: string;
      marketplaceItemPrice?: number;
      marketplaceItemImage?: string;
      contextType?: 'direct' | 'dating' | 'marketplace';
    }
  ) => {
    setChatConversations(prev => {
      const existing = prev.find(c => c.userId === user.id);
      if (existing) {
        return prev.map(c => c.userId === user.id ? { ...c, unreadCount: 0 } : c);
      }
      const fullUser: User = allUsers.find(u => u.id === user.id) || {
        id: user.id,
        name: user.name,
        username: user.name.toLowerCase().replace(/\s+/g, '_'),
        avatar: user.avatar,
        city: 'Brasil',
        isOnline: true,
        isAdult: true,
        friendsCount: 1,
        communitiesCount: 1,
        testimonialsCount: 0,
        photosCount: 0,
        vibesBalance: 50,
        xp: 100,
        level: 1,
        isPremium: false,
        interests: [],
        createdAt: '2026-02-01'
      } as User;

      const newConv: ChatConversation = {
        id: `conv_${user.id}`,
        userId: user.id,
        user: fullUser,
        lastMessage: initialMessage || 'Conversa iniciada',
        lastMessageAt: 'Agora',
        unreadCount: 0,
        isOnline: true,
        contextType: contextData?.contextType || 'direct',
        contextTitle: contextData?.marketplaceItemTitle ? `Anúncio: ${contextData.marketplaceItemTitle}` : undefined
      };
      return [newConv, ...prev];
    });

    setActiveChatUserId(user.id);
    setActiveTab('chat');

    if (initialMessage) {
      sendChatMessage(user.id, initialMessage, 'text', undefined, contextData);
    }
  };

  const sendChatMessage = (
    receiverId: string,
    content: string,
    mediaType: 'text' | 'image' | 'audio' = 'text',
    mediaUrl?: string,
    contextData?: {
      marketplaceItemId?: string;
      marketplaceItemTitle?: string;
      marketplaceItemPrice?: number;
      marketplaceItemImage?: string;
    }
  ) => {
    const newMsg: MessageItem = {
      id: `msg_${Date.now()}`,
      senderId: currentUser?.id || 'user_me',
      receiverId,
      content,
      mediaType,
      mediaUrl,
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      contextData
    };

    setChatMessages(prev => {
      const updated = {
        ...prev,
        [receiverId]: [...(prev[receiverId] || []), newMsg]
      };
      safeStorage.setItem('vibe_chat_messages', updated);
      return updated;
    });

    if (!INITIAL_MESSAGES[receiverId]) {
      INITIAL_MESSAGES[receiverId] = [];
    }
    INITIAL_MESSAGES[receiverId].push(newMsg);

    setChatConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.userId === receiverId) {
          return {
            ...conv,
            lastMessage: mediaType === 'image' ? '📷 [Foto]' : mediaType === 'audio' ? '🎵 [Áudio]' : content,
            lastMessageAt: 'Agora'
          };
        }
        return conv;
      });
      safeStorage.setItem('vibe_chat_conversations', updated);
      return updated;
    });

    // Also update mock conversations
    const mockConv = INITIAL_CONVERSATIONS.find(c => c.userId === receiverId);
    if (mockConv) {
      mockConv.lastMessage = mediaType === 'image' ? '📷 [Foto]' : mediaType === 'audio' ? '🎵 [Áudio]' : content;
      mockConv.lastMessageAt = 'Agora';
    }

    // Auto-reply simulation after 1.5 - 2.5s if chatting with demo user
    if (['user_mariana', 'user_felipe', 'user_beatriz', 'user_rodrigo'].includes(receiverId)) {
      setTimeout(() => {
        let replyContent = 'Opa! Que legal! Vamos nos falando por aqui no Vibe Clube 😉';
        if (receiverId === 'user_mariana') {
          replyContent = content.toLowerCase().includes('café') || content.toLowerCase().includes('encontro') 
            ? 'Bora sim! Conheço um café retrô maravilhoso aqui pertinho da praia no sábado! ☕❤️'
            : 'Adorei conversar contigo! Sua energia é maravilhosa ✨';
        } else if (receiverId === 'user_felipe') {
          replyContent = content.toLowerCase().includes('preço') || content.toLowerCase().includes('disponível') || content.toLowerCase().includes('ps5')
            ? 'Consigo fechar por um valor especial no Pix se retirar comigo essa semana! Me avisa se tiver interesse 👍'
            : 'Massa demais, pode contar comigo!';
        } else if (receiverId === 'user_beatriz') {
          replyContent = 'Que massa! Vamos trocar mais ideias pelo clube!';
        }

        const replyMsg: MessageItem = {
          id: `msg_reply_${Date.now()}`,
          senderId: receiverId,
          receiverId: currentUser?.id || 'user_me',
          content: replyContent,
          createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          read: true
        };

        if (!INITIAL_MESSAGES[receiverId]) {
          INITIAL_MESSAGES[receiverId] = [];
        }
        INITIAL_MESSAGES[receiverId].push(replyMsg);

        setChatMessages(prev => {
          const updated = {
            ...prev,
            [receiverId]: [...(prev[receiverId] || []), replyMsg]
          };
          safeStorage.setItem('vibe_chat_messages', updated);
          return updated;
        });

        setChatConversations(prev => {
          const updated = prev.map(conv => {
            if (conv.userId === receiverId) {
              return {
                ...conv,
                lastMessage: replyContent,
                lastMessageAt: 'Agora',
                unreadCount: activeChatUserId === receiverId ? 0 : conv.unreadCount + 1
              };
            }
            return conv;
          });
          safeStorage.setItem('vibe_chat_conversations', updated);
          return updated;
        });
      }, 2000);
    }
  };

  // ----------------------------------------------------
  // REPORT, MODERATION & USER BLOCKING
  // ----------------------------------------------------
  const openReportModal = (target: ReportTarget) => {
    setReportTarget(target);
    setIsReportModalOpen(true);
  };

  const isUserBlocked = (userId: string): boolean => {
    return blockedUserIds.includes(userId);
  };

  const blockUser = (userId: string, userName?: string) => {
    setBlockedUserIds(prev => {
      if (prev.includes(userId)) return prev;
      const updated = [...prev, userId];
      safeStorage.setItem('vibe_blocked_users', updated);
      return updated;
    });
    showToast(`${userName || 'Usuário'} foi bloqueado. Seus posts e mensagens não serão exibidos. 🚫`, 'info');
  };

  const unblockUser = (userId: string) => {
    setBlockedUserIds(prev => {
      const updated = prev.filter(id => id !== userId);
      safeStorage.setItem('vibe_blocked_users', updated);
      return updated;
    });
    showToast('Usuário desbloqueado com sucesso.', 'success');
  };

  const isCurrentUserSuspended = (): boolean => {
    return !!currentUser?.isSuspended;
  };

  const submitReport = (target: ReportTarget, reason: string, details: string) => {
    const reporterId = currentUser?.id || 'anon_user';
    const reporterName = currentUser?.name || 'Membro da Comunidade';

    setReports(prev => {
      const existingIdx = prev.findIndex(r => r.targetType === target.type && r.targetId === target.id);
      let updated: ReportItem[];

      if (existingIdx >= 0) {
        const existing = prev[existingIdx];
        const newCount = existing.reporterIds.includes(reporterId) ? existing.reportCount : existing.reportCount + 1;
        const newReasons = existing.reasons.includes(reason) ? existing.reasons : [...existing.reasons, reason];
        const newDetails = details ? [...existing.details, details] : existing.details;
        const newReporterIds = existing.reporterIds.includes(reporterId) ? existing.reporterIds : [...existing.reporterIds, reporterId];
        const shouldAutoHide = newCount >= 5;

        const updatedItem: ReportItem = {
          ...existing,
          reportCount: newCount,
          reasons: newReasons,
          details: newDetails,
          reporterIds: newReporterIds,
          latestReporterName: reporterName,
          autoHidden: shouldAutoHide,
          status: 'pending',
          updatedAt: new Date().toISOString()
        };

        updated = [...prev];
        updated[existingIdx] = updatedItem;
      } else {
        const newItem: ReportItem = {
          id: 'rep_' + Date.now(),
          targetType: target.type,
          targetId: target.id,
          targetName: target.name,
          targetAuthorId: target.authorId,
          targetAuthorName: target.authorName,
          targetAuthorAvatar: target.authorAvatar,
          targetContentSnippet: target.contentSnippet,
          targetImageUrl: target.imageUrl,
          reasons: [reason],
          details: details ? [details] : [],
          reportCount: 1,
          reporterIds: [reporterId],
          latestReporterName: reporterName,
          status: 'pending',
          autoHidden: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        updated = [newItem, ...prev];
      }

      safeStorage.setItem('vibe_moderation_reports', updated);
      return updated;
    });

    showToast('Denúncia recebida para análise. Obrigado por ajudar a manter o clube seguro! 🛡️', 'success');
  };

  const removeReportedContent = (reportId: string, justification: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    if (report.targetType === 'post') {
      setPosts(prev => prev.filter(p => p.id !== report.targetId));
    } else if (report.targetType === 'marketplace') {
      setMarketplaceItems(prev => prev.filter(m => m.id !== report.targetId));
    } else if (report.targetType === 'scrap') {
      setScraps(prev => prev.filter(s => s.id !== report.targetId));
    }

    setReports(prev => {
      const updated = prev.map(r => r.id === reportId ? { ...r, status: 'resolved' as const } : r);
      safeStorage.setItem('vibe_moderation_reports', updated);
      return updated;
    });

    const newAuditAction: ModerationAuditAction = {
      id: 'aud_' + Date.now(),
      moderatorId: currentUser?.id || 'staff_mod',
      moderatorName: currentUser?.name || 'Moderação Vibe',
      actionType: 'remove_content',
      targetType: report.targetType,
      targetId: report.targetId,
      targetAuthorId: report.targetAuthorId,
      targetAuthorName: report.targetAuthorName,
      reason: justification,
      createdAt: new Date().toISOString()
    };
    setAuditLog(prev => {
      const updated = [newAuditAction, ...prev];
      safeStorage.setItem('vibe_moderation_audit_log', updated);
      return updated;
    });

    if (report.targetAuthorId) {
      addNotification({
        userId: report.targetAuthorId,
        category: 'social',
        type: 'content_removed',
        actorId: 'system_moderation',
        actorName: 'Moderação Vibe Clube',
        actorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
        message: 'Um de seus conteúdos foi removido por violar as diretrizes da comunidade.',
        detailSnippet: `Motivo: ${justification}. (A identidade dos denunciantes é estritamente anônima).`,
        targetType: 'system'
      });
    }

    showToast('Conteúdo removido e autor notificado com sucesso.', 'success');
  };

  const warnUser = (reportId: string, targetAuthorId: string, message: string) => {
    const report = reports.find(r => r.id === reportId);

    setReports(prev => {
      const updated = prev.map(r => r.id === reportId ? { ...r, status: 'resolved' as const } : r);
      safeStorage.setItem('vibe_moderation_reports', updated);
      return updated;
    });

    const newAuditAction: ModerationAuditAction = {
      id: 'aud_' + Date.now(),
      moderatorId: currentUser?.id || 'staff_mod',
      moderatorName: currentUser?.name || 'Moderação Vibe',
      actionType: 'warn_user',
      targetType: report?.targetType || 'user',
      targetId: report?.targetId || targetAuthorId,
      targetAuthorId,
      targetAuthorName: report?.targetAuthorName,
      reason: message,
      createdAt: new Date().toISOString()
    };
    setAuditLog(prev => {
      const updated = [newAuditAction, ...prev];
      safeStorage.setItem('vibe_moderation_audit_log', updated);
      return updated;
    });

    addNotification({
      userId: targetAuthorId,
      category: 'social',
      type: 'moderation_warning',
      actorId: 'system_moderation',
      actorName: 'Moderação Vibe Clube',
      actorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
      message: '⚠️ Advertência Oficial da Moderação',
      detailSnippet: message,
      targetType: 'system'
    });

    showToast('Advertência formal enviada com sucesso.', 'info');
  };

  const suspendUser = (reportId: string, targetAuthorId: string, duration: '1_dia' | '7_dias' | 'permanente', reason: string) => {
    const report = reports.find(r => r.id === reportId);

    setAllUsers(prev => prev.map(u => {
      if (u.id === targetAuthorId) {
        return {
          ...u,
          isSuspended: true,
          suspensionUntil: duration,
          suspensionReason: reason
        };
      }
      return u;
    }));

    if (currentUser?.id === targetAuthorId) {
      setCurrentUser(prev => prev ? {
        ...prev,
        isSuspended: true,
        suspensionUntil: duration,
        suspensionReason: reason
      } : null);
    }

    setReports(prev => {
      const updated = prev.map(r => r.id === reportId ? { ...r, status: 'resolved' as const } : r);
      safeStorage.setItem('vibe_moderation_reports', updated);
      return updated;
    });

    const newAuditAction: ModerationAuditAction = {
      id: 'aud_' + Date.now(),
      moderatorId: currentUser?.id || 'staff_mod',
      moderatorName: currentUser?.name || 'Moderação Vibe',
      actionType: 'suspend_user',
      targetType: report?.targetType || 'user',
      targetId: report?.targetId || targetAuthorId,
      targetAuthorId,
      targetAuthorName: report?.targetAuthorName,
      duration,
      reason,
      createdAt: new Date().toISOString()
    };
    setAuditLog(prev => {
      const updated = [newAuditAction, ...prev];
      safeStorage.setItem('vibe_moderation_audit_log', updated);
      return updated;
    });

    addNotification({
      userId: targetAuthorId,
      category: 'social',
      type: 'account_suspended',
      actorId: 'system_moderation',
      actorName: 'Moderação Vibe Clube',
      actorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
      message: `🚫 Sua conta foi suspensa (${duration.replace('_', ' ')})`,
      detailSnippet: `Motivo: ${reason}. Durante a suspensão você não pode postar, comentar ou usar o Encontros.`,
      targetType: 'system'
    });

    showToast(`Usuário suspenso com sucesso (${duration.replace('_', ' ')}).`, 'success');
  };

  const dismissReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    setReports(prev => {
      const updated = prev.map(r => r.id === reportId ? { ...r, status: 'dismissed' as const } : r);
      safeStorage.setItem('vibe_moderation_reports', updated);
      return updated;
    });

    const newAuditAction: ModerationAuditAction = {
      id: 'aud_' + Date.now(),
      moderatorId: currentUser?.id || 'staff_mod',
      moderatorName: currentUser?.name || 'Moderação Vibe',
      actionType: 'dismiss_report',
      targetType: report?.targetType || 'post',
      targetId: report?.targetId || reportId,
      reason: 'Denúncia analisada e considerada em conformidade com as regras',
      createdAt: new Date().toISOString()
    };
    setAuditLog(prev => {
      const updated = [newAuditAction, ...prev];
      safeStorage.setItem('vibe_moderation_audit_log', updated);
      return updated;
    });

    showToast('Denúncia arquivada.', 'info');
  };

  // Share handler with native Web Share API & fallback
  const openShareModal = (target: ShareTarget) => {
    if (navigator.share) {
      navigator.share({
        title: target.title,
        text: target.text,
        url: target.url
      }).catch((err) => {
        if (err.name !== 'AbortError') {
          setShareTarget(target);
          setIsShareModalOpen(true);
        }
      });
    } else {
      setShareTarget(target);
      setIsShareModalOpen(true);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        isAuthenticated,
        activeTab,
        setActiveTab,
        viewingUserId,
        setViewingUserId,
        viewingCommunityId,
        setViewingCommunityId,
        viewingTopicId,
        setViewingTopicId,

        posts,
        communities,
        topics,
        scraps,
        testimonials,
        albums,
        achievements,
        gifts,
        pricingConfig,
        datingCandidates,
        datingMatches,
        datingLikesUsed,
        hasUnlimitedDating,

        notifications,
        notificationSettings,
        unreadNotificationsCount,
        isNotificationsOpen,
        setIsNotificationsOpen,
        markNotificationsAsRead,
        markNotificationAsRead,
        deleteNotification,
        clearAllNotifications,
        addNotification,
        updateNotificationSettings,
        handleNotificationClick,
        activeLiveAlerts,
        dismissLiveAlert,
        triggerTestNotification,

        toasts,
        toast: toasts[0] || null,
        showToast,

        login,
        loginAsGuest,
        signup,
        loginWithGoogle,
        openGoogleAuthModal,
        logout,
        completeOnboarding,

        updateProfile,
        setVibeOfTheDay,

        createPost,
        deletePost,
        editPost,
        updatePostPrivacy,
        togglePostComments,
        pinPost,
        openPostMenuId,
        setOpenPostMenuId,
        likePost,
        addComment,
        deleteComment,
        editComment,
        votePoll,
        toggleSavePost,
        createScrap,
        replyScrap,
        deleteScrap,
        createTestimonial,
        approveTestimonial,
        rejectTestimonial,
        deleteTestimonial,

        joinCommunity,
        leaveCommunity,
        createCommunity,
        updateCommunityCover,
        updateCommunity,
        addCommunityPhoto,
        createTopic,
        replyTopic,
        likeTopic,
        requestJoinGroup,
        approveJoinRequest,
        rejectJoinRequest,
        removeGroupMember,
        changeMemberRole,
        toggleMuteGroup,
        pinGroupPost,
        deleteGroupPost,
        inviteFriendsToGroup,

        createAlbum,
        addPhotoToAlbum,

        swipeDating,
        buyDatingUnlimited,
        setDatingOptIn,

        saveArcadeScore,

        buyVibesPackage,
        sendGift,
        buyPremiumSubscription,

        pages,
        activePageId,
        setActivePageId,
        createPage,
        followPage,
        unfollowPage,
        updatePage,
        deletePage,
        userAdminPages,

        friendRequests,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        removeFriend,
        followedUserIds,
        toggleFollowUser,
        isFollowingUser,

        addXP,

        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isGoogleAuthModalOpen,
        setIsGoogleAuthModalOpen,
        googleAuthMode,
        setGoogleAuthMode,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isVibesModalOpen,
        setIsVibesModalOpen,
        isPremiumModalOpen,
        setIsPremiumModalOpen,
        isGiftModalOpen,
        setIsGiftModalOpen,
        giftTargetUser,
        setGiftTargetUser,
        isReportModalOpen,
        setIsReportModalOpen,
        reportTarget,
        setReportTarget,
        openReportModal,
        reports,
        auditLog,
        submitReport,
        removeReportedContent,
        warnUser,
        suspendUser,
        dismissReport,
        blockedUserIds,
        blockUser,
        unblockUser,
        isUserBlocked,
        isCurrentUserSuspended,
        isShareModalOpen,
        setIsShareModalOpen,
        shareTarget,
        openShareModal,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isHelpModalOpen,
        setIsHelpModalOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isMatchModalOpen,
        setIsMatchModalOpen,
        latestMatch,
        isLGPDModalOpen,
        setIsLGPDModalOpen,

        // Wallet / Carteira
        isWalletModalOpen,
        setIsWalletModalOpen,
        walletActiveTab,
        setWalletActiveTab,
        openWalletModal,
        vibesTransactions,
        addVibesTransaction,
        marketplaceAdSpends,
        addMarketplaceAdSpend,
        savedPaymentMethods,
        addSavedPaymentMethod,
        removeSavedPaymentMethod,
        setDefaultSavedPaymentMethod,
        buyVibesWithPix,

        // Apps Store (Vibe Play)
        appsList,
        selectedApp,
        setSelectedApp,
        isPublishAppModalOpen,
        setIsPublishAppModalOpen,
        installedAppIds,
        publishApp,
        unlockUnlimitedAppLicense,
        installApp,
        rateApp,
        likeAppReview,

        // Ads & Boost Campaigns
        campaigns,
        isBoostModalOpen,
        setIsBoostModalOpen,
        boostTargetPost,
        setBoostTargetPost,
        isAdsManagerOpen,
        setIsAdsManagerOpen,
        openBoostModalForPost,
        createBoostCampaign,
        confirmPixPayment,
        pauseCampaign,
        resumeCampaign,
        updateCampaignBudget,
        simulateModerationApproval,

        // Create Club / Group / Page Access
        isCreateClubModalOpen,
        setIsCreateClubModalOpen,
        createClubInitialType,
        setCreateClubInitialType,
        openCreateClubModal,

        // Marketplace
        marketplaceItems,
        createMarketplaceItem,
        boostMarketplaceItem,
        markMarketplaceItemSold,
        deleteMarketplaceItem,

        // Chat / Messenger
        chatConversations,
        chatMessages,
        activeChatUserId,
        setActiveChatUserId,
        unreadMessagesCount,
        openChatWithUser,
        sendChatMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
