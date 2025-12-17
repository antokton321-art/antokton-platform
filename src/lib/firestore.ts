"use client";

import { getFirestoreDb } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  type DocumentSnapshot
} from 'firebase/firestore';
import type {
  Role,
  PostDoc,
  PostStatus,
  CommentDoc,
  ReportDoc,
  UserDoc
} from '@/types';

export async function getMyRole(uid: string): Promise<Role | null> {
  const db = await getFirestoreDb();
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  const data = snap.data() as UserDoc;
  return (data.role as Role) ?? null;
}

export async function fetchPost(postId: string) {
  const db = await getFirestoreDb();
  const snap = await getDoc(doc(db, 'posts', postId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<PostDoc, 'id'>) } as PostDoc;
}

export async function createPost(input: Omit<PostDoc, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'moderation'>) {
  const db = await getFirestoreDb();
  const ref = doc(collection(db, 'posts'));
  const payload = {
    ...input,
    status: 'pending' as PostStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  await setDoc(ref, payload);
  return ref.id;
}

export async function updatePost(
  postId: string,
  input: Partial<Pick<PostDoc, 'title' | 'content' | 'country' | 'city' | 'profession'>>
) {
  const db = await getFirestoreDb();
  await updateDoc(doc(db, 'posts', postId), {
    ...input,
    updatedAt: serverTimestamp()
  });
}

export async function setPostStatus(postId: string, status: PostStatus, reviewedBy: string, note?: string) {
  const db = await getFirestoreDb();
  await updateDoc(doc(db, 'posts', postId), {
    status,
    updatedAt: serverTimestamp(),
    moderation: {
      reviewedBy,
      reviewedAt: serverTimestamp(),
      note: note ?? ''
    }
  });
}

export async function deletePost(postId: string) {
  const db = await getFirestoreDb();
  await deleteDoc(doc(db, 'posts', postId));
}

export type FeedFilters = {
  type?: string;
  country?: string;
  city?: string;
  profession?: string;
  status?: PostStatus;
};

export async function fetchFeedPage(
  filters: FeedFilters,
  pageSize = 20,
  cursor?: DocumentSnapshot
) {
  const db = await getFirestoreDb();
  const clauses: any[] = [];
  if (filters.type) clauses.push(where('type', '==', filters.type));
  if (filters.country) clauses.push(where('country', '==', filters.country));
  if (filters.city) clauses.push(where('city', '==', filters.city));
  if (filters.profession) clauses.push(where('profession', '==', filters.profession));
  if (filters.status) clauses.push(where('status', '==', filters.status));
  else clauses.push(where('status', '==', 'approved'));
  let q = query(collection(db, 'posts'), ...clauses, orderBy('createdAt', 'desc'), limit(pageSize));
  if (cursor) {
    q = query(collection(db, 'posts'), ...clauses, orderBy('createdAt', 'desc'), startAfter(cursor), limit(pageSize));
  }
  const snaps = await getDocs(q);
  const items = snaps.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PostDoc, 'id'>) } as PostDoc));
  const nextCursor = snaps.docs.length ? snaps.docs[snaps.docs.length - 1] : undefined;
  return { items, nextCursor };
}

export async function addComment(
  postId: string,
  input: Omit<CommentDoc, 'id' | 'createdAt' | 'updatedAt'>
) {
  const db = await getFirestoreDb();
  const ref = doc(collection(db, 'posts', postId, 'comments'));
  await setDoc(ref, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}

export async function fetchComments(postId: string, pageSize = 50) {
  const db = await getFirestoreDb();
  const q = query(
    collection(db, 'posts', postId, 'comments'),
    orderBy('createdAt', 'asc'),
    limit(pageSize)
  );
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CommentDoc, 'id'>) } as CommentDoc));
}

export async function reportContent(
  input: Omit<ReportDoc, 'id' | 'createdAt'>
) {
  const db = await getFirestoreDb();
  const ref = await addDoc(collection(db, 'reports'), {
    ...input,
    createdAt: serverTimestamp()
  });
  return ref.id;
}

export async function fetchReports(pageSize = 50) {
  const db = await getFirestoreDb();
  const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'), limit(pageSize));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ReportDoc, 'id'>) } as ReportDoc));
}

export async function fetchUsers(pageSize = 50) {
  const db = await getFirestoreDb();
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(pageSize));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ ...(d.data() as UserDoc) } as UserDoc));
}

export async function setUserRole(uid: string, role: Role) {
  const db = await getFirestoreDb();
  await updateDoc(doc(db, 'users', uid), {
    role,
    updatedAt: serverTimestamp()
  });
}