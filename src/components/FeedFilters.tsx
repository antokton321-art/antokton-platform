"use client";

import { POST_TYPES } from '@/constants/postTypes';
import { COUNTRIES } from '@/constants/locations';
import { PROFESSIONS } from '@/constants/professions';
import { useMemo, useState } from 'react';
import { toQueryString } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FeedFilters() {
  const router = useRouter();
  const sp = useSearchParams();

  const initial = useMemo(
    () => ({
      type: sp.get('type') ?? '',
      country: sp.get('country') ?? '',
      city: sp.get('city') ?? '',
      profession: sp.get('profession') ?? ''
    }),
    [sp]
  );

  const [type, setType] = useState(initial.type);
  const [country, setCountry] = useState(initial.country);
  const [city, setCity] = useState(initial.city);
  const [profession, setProfession] = useState(initial.profession);

  function apply() {
    router.push(
      '/app/feed' +
        toQueryString({
          type: type || undefined,
          country: country || undefined,
          city: city || undefined,
          profession: profession || undefined
        })
    );
  }

  function reset() {
    setType('');
    setCountry('');
    setCity('');
    setProfession('');
    router.push('/app/feed');
  }

  return (
    <div className="rounded-lg border bg-white p-4 dark:bg-[#102141] dark:border-gray-700">
      <div className="grid gap-3 md:grid-cols-4">
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Lloji</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 dark:text-gray-100 dark:border-gray-600 dark:bg-transparent"
          >
            <option value="">Të gjitha</option>
            {POST_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Shteti</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 dark:text-gray-100 dark:border-gray-600 dark:bg-transparent"
          >
            <option value="">Të gjitha</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Qyteti</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 dark:text-gray-100 dark:border-gray-600 dark:bg-transparent"
            placeholder="Bruksel, Tiranë..."
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Profesioni</label>
          <select
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 dark:text-gray-100 dark:border-gray-600 dark:bg-transparent"
          >
            <option value="">Të gjitha</option>
            {PROFESSIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={apply}
          className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
        >
          Apliko
        </button>
        <button
          onClick={reset}
          className="rounded-md border px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Reseto
        </button>
      </div>
    </div>
  );
}