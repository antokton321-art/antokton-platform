"use client";

import { useEffect, useState } from 'react';
import { getFirebaseAuth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getMyRole } from '@/lib/firestore';
import type { Role } from '@/types';
import Loading from '@/components/Loading';

export default function RoleGate({
  allow,
  children
}: {
  allow: (role: Role | null) => boolean;
  children: (role: Role) => React.ReactNode;
}) {
  const [role, setRole] = useState<Role | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsub: () => void;
    getFirebaseAuth().then((auth) => {
      unsub = onAuthStateChanged(auth, async (u) => {
        setRole(null);
        if (u?.uid) {
          const r = await getMyRole(u.uid);
          setRole(r);
        }
        setReady(true);
      });
    });
    return () => {
      if (unsub) unsub();
    };
  }, []);

  if (!ready) return <Loading label="Duke kontrolluar të drejtat..." />;

  if (!allow(role)) {
    return (
      <div className="rounded-lg border bg-white p-4 text-sm dark:bg-[#102141] dark:border-gray-700">
        Aksesi i ndaluar.
      </div>
    );
  }

  return <>{children(role as Role)}</>;
}