"use client";

import AuthGate from '@/components/AuthGate';
import RoleGate from '@/components/RoleGate';
import { canModerate, isAdmin } from '@/lib/rbac';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <AuthGate>
      {() => (
        <RoleGate allow={(r) => r !== null}>
          {(role) => (
            <div className="space-y-4">
              <div className="rounded-lg border bg-white p-4 dark:bg-[#102141] dark:border-gray-700">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Paneli</h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Akses role-based: <span className="font-medium">{role}</span>
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Link
                  className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md dark:bg-[#102141] dark:border-gray-700"
                  href="/app/posts/new"
                >
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Krijo postim</div>
                  <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">Publiko njoftim të ri (Pending).</div>
                </Link>
                <Link
                  className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md dark:bg-[#102141] dark:border-gray-700"
                  href="/app/feed"
                >
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Shfleto feed-in</div>
                  <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">Poste të aprovuar me filtra.</div>
                </Link>
                {canModerate(role) ? (
                  <Link
                    className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md dark:bg-[#102141] dark:border-gray-700"
                    href="/app/moderation"
                  >
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Moderim</div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">Mirato ose refuzo postimet në pritje.</div>
                  </Link>
                ) : null}
                {canModerate(role) ? (
                  <Link
                    className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md dark:bg-[#102141] dark:border-gray-700"
                    href="/app/reports"
                  >
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Raportet</div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">Rishiko raportet e përdoruesve.</div>
                  </Link>
                ) : null}
                {isAdmin(role) ? (
                  <Link
                    className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md dark:bg-[#102141] dark:border-gray-700"
                    href="/app/admin/users"
                  >
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Menaxho përdoruesit</div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">Vendos rolet (admin vetëm).</div>
                  </Link>
                ) : null}
              </div>
            </div>
          )}
        </RoleGate>
      )}
    </AuthGate>
  );
}