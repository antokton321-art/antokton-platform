"use client";

import { useState } from 'react';
import { loginWithEmail, loginWithGoogle } from '@/lib/auth';
import ErrorBox from '@/components/ErrorBox';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleEmailLogin() {
    setErr(null);
    setBusy(true);
    try {
      await loginWithEmail(email.trim(), password);
      router.push('/app');
    } catch (e: any) {
      setErr(e?.message ?? 'Dështoi login-i.');
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleLogin() {
    setErr(null);
    setBusy(true);
    try {
      await loginWithGoogle();
      router.push('/app');
    } catch (e: any) {
      setErr(e?.message ?? 'Dështoi login me Google.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4 py-10 px-4">
      <div className="rounded-lg border bg-white p-6 dark:bg-[#102141] dark:border-gray-700">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Login</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Hyr me email ose Google.</p>
        {err ? (
          <div className="mt-3">
            <ErrorBox message={err} />
          </div>
        ) : null}
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 dark:text-gray-100 dark:border-gray-600 dark:bg-transparent"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 dark:text-gray-100 dark:border-gray-600 dark:bg-transparent"
            />
          </div>
          <button
            disabled={busy}
            onClick={handleEmailLogin}
            className="w-full rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60"
          >
            {busy ? 'Duke hyrë...' : 'Login'}
          </button>
          <button
            disabled={busy}
            onClick={handleGoogleLogin}
            className="w-full rounded-md border px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-60"
          >
            Login me Google
          </button>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Nuk ke llogari?{' '}
            <Link className="underline" href="/register">
              Regjistrohu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}