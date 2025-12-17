"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Loading from '@/components/Loading';
import ErrorBox from '@/components/ErrorBox';
import type { CommentDoc, PostDoc, Role } from '@/types';
import {
  fetchPost,
  fetchComments,
  getMyRole,
  addComment,
  reportContent
} from '@/lib/firestore';
import CommentList from '@/components/CommentList';
import CommentComposer from '@/components/CommentComposer';
import Link from 'next/link';
import { canModerate } from '@/lib/rbac';

/**
 * Faqja e detajit të njoftimit.
 *
 * Ngarkon postimin dhe komentet e tij nga Firestore dhe lejon komentimin
 * ose raportimin. Përdor `use client` sepse Firebase SDK nuk funksionon në server.
 */
export default function PostDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [post, setPost] = useState<PostDoc | null>(null);
  const [comments, setComments] = useState<CommentDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  // Ndjek statusin e autentikimit për të marrë uid/email/rol
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUid(u?.uid ?? null);
      setEmail(u?.email ?? null);
      setRole(null);
      if (u?.uid) {
        const r = await getMyRole(u.uid);
        setRole(r);
      }
    });
    return () => unsub();
  }, []);

  // Ngarkon postimin dhe komentet
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const p = await fetchPost(id);
        if (!p) throw new Error('Postimi nuk u gjet ose akses i ndaluar.');
        const c = await fetchComments(id);
        if (!alive) return;
        setPost(p);
        setComments(c);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? 'Dështoi ngarkimi i postimit.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) return <Loading label="Duke ngarkuar…" />;
  if (error) return <ErrorBox message={error} />;
  if (!post) return null;

  const isAuthor = uid && post.authorId === uid;
  const staff = canModerate(role);

  return (
    <div className="space-y-4">
      {/* Detajet e postimit */}
      <div className="rounded-lg border bg-white p-4 dark:bg-[#102141] dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {post.type} · <span className="uppercase">{post.status}</span>
          {post.country ? ` · ${post.country}` : ''}
          {post.city ? ` / ${post.city}` : ''}
          {post.profession ? ` · ${post.profession}` : ''}
        </div>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">{post.title}</h1>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {post.authorDisplayName ?? post.authorEmail}
        </div>
        <div className="mt-4 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
          {post.content}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(isAuthor && post.status === 'pending') || staff ? (
            <Link
              className="rounded-md border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:bg-transparent dark:hover:bg-[#0b1931]"
              href={`/app/posts/${post.id}/edit`}
            >
              Redakto
            </Link>
          ) : null}
          <button
            className="rounded-md border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:bg-transparent dark:hover:bg-[#0b1931]"
            onClick={async () => {
              if (!uid || !email) {
                router.push('/login');
                return;
              }
              await reportContent({
                reporterId: uid,
                reporterEmail: email,
                targetType: 'post',
                targetId: post.id,
                postId: post.id,
                reason: 'Raportuar nga përdoruesi.'
              } as any);
              alert('Raporti u dërgua.');
            }}
          >
            Raporto
          </button>
        </div>
      </div>
      {/* Lista e komenteve */}
      <CommentList comments={comments} />
      {/* Komentuesi ose mesazh që kërkon login */}
      {uid ? (
        <CommentComposer
          onSubmit={async (text) => {
            await addComment(id, {
              postId: id,
              authorId: uid!,
              authorEmail: email ?? '',
              authorDisplayName: auth.currentUser?.displayName ?? null,
              text
            } as any);
            const c = await fetchComments(id);
            setComments(c);
          }}
        />
      ) : (
        <div className="rounded-lg border bg-white p-4 text-sm text-gray-700 dark:bg-[#102141] dark:border-gray-700 dark:text-gray-300">
          Hyni për të komentuar.
        </div>
      )}
    </div>
  );
}