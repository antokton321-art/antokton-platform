"use client";

import AuthGate from '@/components/AuthGate';
import PostEditor from '@/components/PostEditor';
import { createPost } from '@/lib/firestore';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import type { PostType } from '@/types';

/**
 * Faqe për krijimin e një njoftimi të ri.
 *
 * Kjo komponentë është klienti sepse përdor Firebase Auth dhe Firestore.
 */
export default function NewPostPage() {
  const router = useRouter();
  return (
    <AuthGate>
      {(user) => (
        <div className="space-y-4">
          <div className="rounded-lg border bg-white p-4 dark:bg-[#102141] dark:border-gray-700">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Krijo njoftim</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Postimet e reja janë <span className="font-medium">pending</span> dhe duhet miratim nga
              moderatorët.
            </p>
          </div>
          <PostEditor
            submitLabel="Krijo (Pending)"
            onSubmit={async (values) => {
              const u = auth.currentUser!;
              const id = await createPost({
                type: values.type as PostType,
                title: values.title,
                content: values.content,
                country: values.country || undefined,
                city: values.city || undefined,
                profession: values.profession || undefined,
                authorId: u.uid,
                authorEmail: u.email!,
                authorDisplayName: u.displayName ?? null
              } as any);
              router.push(`/app/posts/${id}`);
            }}
          />
        </div>
      )}
    </AuthGate>
  );
}