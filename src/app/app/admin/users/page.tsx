"use client";

import AuthGate from '@/components/AuthGate';
import RoleGate from '@/components/RoleGate';
import Loading from '@/components/Loading';
import ErrorBox from '@/components/ErrorBox';
import { isAdmin } from '@/lib/rbac';
import { fetchUsers, setUserRole } from '@/lib/firestore';
import { useEffect, useState } from 'react';
import type { UserDoc, Role } from '@/types';
import UserRoleBadge from '@/components/UserRoleBadge';
import { ROLES } from '@/constants/roles';

/**
 * Faqe për menaxhimin e përdoruesve (vetëm adminët).
 */
export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    setError(null);
    try {
      const u = await fetchUsers(100);
      setUsers(u);
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
        <RoleGate allow={(r) => isAdmin(r)}>
          {() => (
            <div className="space-y-4">
              <div className="rounded-lg border bg-white p-4 dark:bg-[#102141] dark:border-gray-700">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Menaxho përdoruesit</h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Adminët mund të ndryshojnë rolet e përdoruesve.
                </p>
              </div>
              {loading && <Loading label="Duke ngarkuar…" />}
              {error && <ErrorBox message={error} />}
              <div className="rounded-lg border bg-white p-4 dark:bg-[#102141] dark:border-gray-700">
                <div className="space-y-3">
                  {users.map((u) => (
                    <div
                      key={u.uid}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3 dark:border-gray-700"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {u.displayName ?? u.email}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{u.email}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <UserRoleBadge role={u.role} />
                        <select
                          className="rounded-md border px-3 py-2 text-sm text-gray-900 dark:text-gray-100 dark:bg-transparent dark:border-gray-600"
                          value={u.role}
                          onChange={async (e) => {
                            const next = e.target.value as Role;
                            await setUserRole(u.uid, next);
                            await reload();
                          }}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </RoleGate>
      )}
    </AuthGate>
  );
}