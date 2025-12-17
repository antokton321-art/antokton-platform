"use client";

import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { getFirebaseAuth } from '@/lib/firebase';
import Loading from '@/components/Loading';
import Link from 'next/link';

export default function AuthGate({ children }: { children: (user: User) => React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsub: () => void;
    getFirebaseAuth().then((auth) => {
      unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setReady(true);
      });
    });
    return () => {
      if (unsub) unsub();
    };
  }, []);

  if (!ready) return <Loading label="Duke verifikuar seancën..." />;
  if (!user) {
    return (
      <div className="rounded-lg border bg-white p-4 text-sm dark:bg-[#102141] dark:border-gray-700">
        <div className="text-gray-700 dark:text-gray-300">Duhet të jeni të loguar për të hyrë në këtë faqe.</div>
        <div className="mt-3 flex gap-2">
          <Link href="/login" className="rounded-md border px-3 py-1.5 text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            Login
          </Link>
          <Link href="/register" className="rounded-md bg-gray-900 px-3 py-1.5 text-white hover:bg-black">
            Register
          </Link>
        </div>
      </div>
    );
  }
  return <>{children(user)}</>;
}