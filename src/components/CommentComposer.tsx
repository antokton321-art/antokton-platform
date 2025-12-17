"use client";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { commentSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorBox from '@/components/ErrorBox';

type FormValues = z.infer<typeof commentSchema>;

export default function CommentComposer({ onSubmit }: { onSubmit: (text: string) => Promise<void> }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError
  } = useForm<FormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { text: '' }
  });

  return (
    <form
      onSubmit={handleSubmit(async (v) => {
        try {
          await onSubmit(v.text);
          reset();
        } catch (e: any) {
          setError('root', { message: e?.message ?? 'Dështoi komentimi.' });
        }
      })}
      className="rounded-lg border bg-white p-4 dark:bg-[#102141] dark:border-gray-700"
    >
      {errors.root?.message ? <ErrorBox message={errors.root.message} /> : null}
      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Shto koment</label>
      <textarea
        {...register('text')}
        className="mt-1 min-h-[90px] w-full rounded-md border px-3 py-2 text-sm text-gray-900 dark:text-gray-100 dark:border-gray-600 dark:bg-transparent"
      />
      {errors.text?.message ? (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.text.message}</p>
      ) : null}
      <div className="mt-3">
        <button
          disabled={isSubmitting}
          className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60"
        >
          {isSubmitting ? 'Duke postuar...' : 'Posto koment'}
        </button>
      </div>
    </form>
  );
}