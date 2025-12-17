import { Timestamp } from 'firebase/firestore';

export type Role = 'admin' | 'moderator' | 'member';
export type PostType = 'pune' | 'shtepi' | 'juridike' | 'edukim' | 'bamiresi' | 'media';
export type PostStatus = 'pending' | 'approved' | 'rejected';

export interface UserDoc {
  uid: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  role: Role;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PostDoc {
  id: string;
  type: PostType;
  status: PostStatus;
  title: string;
  content: string;
  country?: string;
  city?: string;
  profession?: string;
  authorId: string;
  authorEmail: string;
  authorDisplayName?: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  moderation?: {
    reviewedBy?: string;
    reviewedAt?: Timestamp;
    note?: string;
  };
}

export interface CommentDoc {
  id: string;
  postId: string;
  authorId: string;
  authorEmail: string;
  authorDisplayName?: string | null;
  text: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ReportTargetType = 'post' | 'comment';

export interface ReportDoc {
  id: string;
  reporterId: string;
  reporterEmail: string;
  targetType: ReportTargetType;
  targetId: string;
  postId?: string;
  reason: string;
  createdAt: Timestamp;
}