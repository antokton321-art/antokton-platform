"use client";

import AuthGate from '@/components/AuthGate';
import RoleGate from '@/components/RoleGate';
import Loading from '@/components/Loading';
import ErrorBox from '@/components/ErrorBox';
import { canModerate } from '@/lib/rbac';
import { fetchReports } from '@/lib/firestore';
import { useEffect, useState } from 'react';
import type { ReportDoc } from '@/types';
import Link from 'next/link';

/**
 * Faqja për listimin e raporteve nga përdoruesit.
 */
export default function ReportsPage() {
  const [reports, setReports] = useState<ReportDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchReports(100);
        if (!alive) return;
        setReports(res);
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
  }, []);

  return (
    <AuthGate>
      {() => (
        <RoleGate allow={(r) => canModerate(r)}>
          {() => (
            <div className="space-y-4">
              <div className="rounded-lg border bg-white p-4 dark:bg-[#102141] dark:border-gray-700">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Raportet</h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Raporte të dërguara nga përdoruesit.</p>
              </div>
              {loading && <Loading label="Duke ngarkuar…" />}
              {error && <ErrorBox message={error} />}
              {!loading && reports.length === 0 && (
                <div className="rounded-lg border bg-white p-4 text-sm text-gray-700 dark:bg-[#102141] dark:border-gray-700 dark:text-gray-300">
                  Nuk ka raporte.
                </div>
              )}
              <div className="space-y-3">
                {reports.map((r) => (
                  <div key={r.id} className="rounded-lg border bg-white p-4 dark:bg-[#102141] dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {r.targetType.toUpperCase()} · Raportuar nga: {r.reporterEmail}
                    </div>
                    <div className="mt-2 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-300">{r.reason}</div>
                    {r.postId ? (
                      <div className="mt-3">
                        <Link
                          className="text-sm underline text-blue-600 dark:text-blue-400"
                          href={`/app/posts/${r.postId}`}
                        >
                          Hap postimin
                        </Link>
                      </div>
                    ) : null}
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