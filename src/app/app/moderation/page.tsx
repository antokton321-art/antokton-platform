"use client";

import AuthGate from '@/components/AuthGate';
import RoleGate from '@/components/RoleGate';
import Loading from '@/components/Loading';
import ErrorBox from '@/components/ErrorBox';
import { canModerate } from '@/lib/rbac';
import { fetchFeedPage, setPostStatus } from '@/lib/firestore';
import type { PostDoc } from '@/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';

/**
 * Faqja e moderimit të postimeve në pritje.
 */
export default function ModerationPage() {
  const [posts, setPosts] = useState<PostDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFeedPage({ status: 'pending' }, 50);
      setPosts(res.items);
    } catch (e: any) {
      setError(e?.message ?? 'Dështoi ngarkimi.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  return (
    <AuthGate>
      {() => (
        <RoleGate allow={(r) => canModerate(r)}>
          {() => (
            <div className="space-y-4">
              <div className="rounded-lg border bg-white p-4 dark:bg-[#102141] dark:border-gray-700">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Moderim</h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Postime në pritje për aprovim.</p>
              </div>
              {loading && <Loading label="Duke ngarkuar…" />}
              {error && <ErrorBox message={error} />}
              {!loading && posts.length === 0 && (
                <div className="rounded-lg border bg-white p-4 text-sm text-gray-700 dark:bg-[#102141] dark:border-gray-700 dark:text-gray-300">
                  Nuk ka postime në pritje.
                </div>
              )}
              <div className="space-y-3">
                {posts.map((p) => (
                  <div key={p.id} className="rounded-lg border bg-white p-4 dark:bg-[#102141] dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {p.type} · {p.country ?? '-'} {p.city ? ` / ${p.city}` : ''} {p.profession ? ` · ${p.profession}` : ''}
                    </div>
                    <Link
                      href={`/app/posts/${p.id}`}
                      className="mt-1 block text-lg font-semibold hover:underline text-gray-900 dark:text-gray-100"
                    >
                      {p.title}
                    </Link>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{p.content}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        className="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                        onClick={async () => {
                          await setPostStatus(p.id, 'approved', auth.currentUser!.uid, 'Approved');
                          await reload();
                        }}
                      >
                        Mirato
                      </button>
                      <button
                        className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                        onClick={async () => {
                          await setPostStatus(p.id, 'rejected', auth.currentUser!.uid, 'Rejected');
                          await reload();
                        }}
                      >
                        Refuzo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </RoleGate>
      )}
    </AuthGate>
  );
}