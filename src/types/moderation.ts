export type ReportTargetType = 
  | 'post' 
  | 'comment' 
  | 'user' 
  | 'marketplace' 
  | 'group' 
  | 'community' 
  | 'page' 
  | 'chat_message' 
  | 'scrap' 
  | 'testimonial';

export type GeneralReportReason =
  | 'Spam'
  | 'Conteúdo ofensivo/discurso de ódio'
  | 'Nudez ou conteúdo sexual'
  | 'Violência'
  | 'Golpe/fraude'
  | 'Informação falsa'
  | 'Outro';

export type MarketplaceReportReason =
  | 'Produto proibido'
  | 'Anúncio enganoso'
  | 'Preço abusivo';

export type ProfileReportReason =
  | 'Perfil falso'
  | 'Assédio';

export type ReportReason = GeneralReportReason | MarketplaceReportReason | ProfileReportReason;

export interface ReportTarget {
  type: ReportTargetType;
  id: string;
  name?: string;
  authorId?: string;
  authorName?: string;
  authorAvatar?: string;
  contentSnippet?: string;
  imageUrl?: string;
  parentId?: string;
}

export interface ReportItem {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  targetName?: string;
  targetAuthorId?: string;
  targetAuthorName?: string;
  targetAuthorAvatar?: string;
  targetContentSnippet?: string;
  targetImageUrl?: string;
  reasons: string[];
  details: string[];
  reportCount: number;
  reporterIds: string[];
  latestReporterName?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  autoHidden?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ModerationActionType = 
  | 'remove_content' 
  | 'warn_user' 
  | 'suspend_user' 
  | 'dismiss_report';

export interface ModerationAuditAction {
  id: string;
  moderatorId: string;
  moderatorName: string;
  actionType: ModerationActionType;
  targetType: ReportTargetType;
  targetId: string;
  targetAuthorId?: string;
  targetAuthorName?: string;
  reason: string;
  duration?: '1_dia' | '7_dias' | 'permanente';
  createdAt: string;
}

export interface ShareTarget {
  title: string;
  text?: string;
  url: string;
  category?: string;
  id?: string;
}
