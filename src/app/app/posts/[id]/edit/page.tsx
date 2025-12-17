"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthGate from '@/components/AuthGate';
import RoleGate from '@/components/RoleGate';
import Loading from '@/components/Loading';
import ErrorBox from '@/components/ErrorBox';
import PostEditor from '@/components/PostEditor';
import { fetchPost, updatePost } from '@/lib/firestore';
import { canModerate } from '@/lib/rbac';
import { auth } from '@/lib/firebase';
import type { PostDoc } from '@/types';

/**
 * Faqe për redaktimin e një njoftimi ekzistues.
 *
 * Lejon autorin (kur statusi është pending) ose stafin të redaktojë postimin.
 */
export default function EditPostPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [post, setPost] = useState<PostDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ngarkon postimin
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const p = await fetchPost(id);
        if (!p) throw new Error('Postimi nuk u gjet.');
        if (!alive) return;
        setPost(p);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? 'Dështoi ngarkimi.');
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

  return (
    <AuthGate>
      {(user) => (
        <RoleGate
          allow={(role) => {
            const isAuthor = post.authorId === user.uid && post.status === 'pending';
            return isAuthor || canModerate(role);
          }}
        >
          {() => (
            <div className="space-y-4">
              <div className="rounded-lg border bg-white p-4 dark:bg-[#102141] dark:border-gray-700">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Redakto njoftimin</h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Autorët mund të redaktojnë vetëm kur statusi është pending. Stafi mund të redaktojë kurdo.
                </p>
              </div>
              <PostEditor
                initial={{
                  type: post.type,
                  title: post.title,
                  content: post.content,
                  country: post.country ?? '',
                  city: post.city ?? '',
                  profession: post.profession ?? ''
                }}
                submitLabel="Ruaj"
                onSubmit={async (values) => {
                  await updatePost(id, {
                    title: values.title,
                    content: values.content,
                    country: values.country || undefined,
                    city: values.city || undefined,
                    profession: values.profession || undefined
                  });
                  router.push(`/app/posts/${id}`);
                }}
              />
            </div>
          )}
        </RoleGate>
      )}
    </AuthGate>
  );
}