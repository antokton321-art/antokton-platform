"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema } from '@/lib/validators';
import { z } from 'zod';
import { POST_TYPES } from '@/constants/postTypes';
import { COUNTRIES } from '@/constants/locations';
import { PROFESSIONS } from '@/constants/professions';
import ErrorBox from '@/components/ErrorBox';

type FormValues = z.infer<typeof postSchema>;

export default function PostEditor({
  initial,
  onSubmit,
  submitLabel
}: {
  initial?: Partial<FormValues>;
  onSubmit: (values: FormValues) => Promise<void>;
  submitLabel: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<FormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      type: (initial?.type as any) ?? 'pune',
      title: initial?.title ?? '',
      content: initial?.content ?? '',
      country: initial?.country ?? '',
      city: initial?.city ?? '',
      profession: initial?.profession ?? ''
    }
  });

  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        try {
          await onSubmit(v);
        } catch (e: any) {
          setError('root', { message: e?.message ?? 'Dështoi publikimi.' });
        }
      })}
      className="rounded-lg border bg-white p-4 dark:bg-[#102141] dark:border-gray-700"
    >
      {errors.root?.message ? <ErrorBox message={errors.root.message} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Lloji</label>
          <select
            {...register('type')}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 dark:text-gray-100 dark:border-gray-600 dark:bg-transparent"
          >
            {POST_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {errors.type?.message ? (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.type.message}</p>
          ) : null}
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Profesioni</label>
          <select
            {...register('profession')}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 dark:text-gray-100 dark:border-gray-600 dark:bg-transparent"
          >
            <option value="">(opsionale)</option>
            {PROFESSIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errors.profession?.message ? (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.profession.message}</p>
          ) : null}
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Shteti</label>
          <select
            {...register('country')}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 dark:text-gray-100 dark:border-gray-600 dark:bg-transparent"
          >
            <option value="">(opsionale)</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.country?.message ? (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.country.message}</p>
          ) : null}
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Qyteti</label>
          <input
            {...register('city')}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 dark:text-gray-100 dark:border-gray-600 dark:bg-transparent"
            placeholder="Bruksel, Tiranë..."
          />
          {errors.city?.message ? (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.city.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-4">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Titulli</label>
        <input
          {...register('title')}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm text-gray-900 dark:text-gray-100 dark:border-gray-600 dark:bg-transparent"
        />
        {errors.title?.message ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.title.message}</p>
        ) : null}
      </div>
      <div className="mt-4">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Përmbajtja</label>
        <textarea
          {...register('content')}
          className="mt-1 min-h-[220px] w-full rounded-md border px-3 py-2 text-sm text-gray-900 dark:text-gray-100 dark:border-gray-600 dark:bg-transparent"
        />
        {errors.content?.message ? (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.content.message}</p>
        ) : null}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          disabled={isSubmitting}
          className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60"
        >
          {isSubmitting ? 'Duke publikuar...' : submitLabel}
        </button>
      </div>
    </form>
  );
}