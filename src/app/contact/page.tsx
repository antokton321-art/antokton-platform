"use client";

import { useState } from 'react';
import ErrorBox from '@/components/ErrorBox';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setError(null);
    try {
      // TODO: integrate with backend or email service. For now we just simulate delay.
      await new Promise((res) => setTimeout(res, 1000));
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setStatus('error');
      setError('Dështoi dërgimi i mesazhit.');
    }
  }

  return (
    <div className="mx-auto max-w-4xl py-10 px-4">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Kontakt</h1>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        Plotësoni formularin e mëposhtëm dhe ne do të kthehemi tek ju sa më shpejt.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {status === 'success' && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-600 dark:bg-green-900/20 dark:text-green-200">
            Mesazhi u dërgua me sukses. Faleminderit!
          </div>
        )}
        {error && <ErrorBox message={error} />}
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Emri</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 dark:text-gray-100 dark:border-gray-600 dark:bg-transparent"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 dark:text-gray-100 dark:border-gray-600 dark:bg-transparent"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Mesazhi</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 dark:text-gray-100 dark:border-gray-600 dark:bg-transparent"
            required
            rows={6}
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60"
          >
            {status === 'submitting' ? 'Duke dërguar...' : 'Dërgo mesazh'}
          </button>
        </div>
      </form>
    </div>
  );
}