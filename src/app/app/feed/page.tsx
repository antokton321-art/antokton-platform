"use client";

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import FeedFilters from '@/components/FeedFilters';
import PostCard from '@/components/PostCard';
import Loading from '@/components/Loading';
import { fetchFeedPage } from '@/lib/firestore';
import type { PostDoc } from '@/types';
import type { DocumentSnapshot } from 'firebase/firestore';

/**
 * Page për shfaqjen e feed‑it publik me filtra.
 *
 * Kjo është një komponentë klienti sepse mbështetet në Firebase
 * (klient SDK) për të lexuar të dhënat. Përdor search params
 * për të ruajtur statusin e filtrave në URL.
 */
export default function FeedPage() {
  const sp = useSearchParams();

  // Përgatit filtrat nga query string
  const filters = useMemo(
    () => ({
      type: sp.get('type') ?? undefined,
      country: sp.get('country') ?? undefined,
      city: sp.get('city') ?? undefined,
      profession: sp.get('profession') ?? undefined
    }),
    [sp]
  );

  const [posts, setPosts] = useState<PostDoc[]>([]);
  const [cursor, setCursor] = useState<DocumentSnapshot | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Ngarko faqen e parë të feed‑it sa herë ndryshojnë filtrat
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setCursor(undefined);
      try {
        const res = await fetchFeedPage(filters, 10);
        if (!alive) return;
        setPosts(res.items);
        setCursor(res.nextCursor);
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
    // filtra të veçantë: përdor vargu konkret që Next.js ta rifreskojë
  }, [filters.type, filters.country, filters.city, filters.profession]);

  // Funksioni për të ngarkuar më shumë posta
  async function loadMore() {
    if (!cursor) return;
    setLoadingMore(true);
    try {
      const res = await fetchFeedPage(filters, 10, cursor);
      setPosts((prev) => [...prev, ...res.items]);
      setCursor(res.nextCursor);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filtrat */}
      <FeedFilters />
      {/* Ngarkimi */}
      {loading && <Loading label="Duke ngarkuar…" />}
      {/* Mesazh kur nuk ka postime */}
      {!loading && posts.length === 0 && (
        <div className="rounded-lg border bg-white p-4 text-sm text-gray-700 dark:bg-[#102141] dark:border-gray-700 dark:text-gray-300">
          Nuk ka postime (vetëm postet e aprovuar shfaqen).
        </div>
      )}
      {/* Lista e postimeve */}
      <div className="space-y-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {/* Butoni “Ngarko më shumë” */}
      {cursor && (
        <button
          disabled={loadingMore}
          onClick={loadMore}
          className="rounded-md border bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:bg-[#102141] dark:border-gray-700 dark:text-gray-300 dark:hover:bg-[#0b1931]"
        >
          {loadingMore ? 'Duke ngarkuar…' : 'Ngarko më shumë'}
        </button>
      )}
    </div>
  );
}