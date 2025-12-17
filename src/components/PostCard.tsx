import Link from 'next/link';
import type { PostDoc } from '@/types';

export default function PostCard({ post }: { post: PostDoc }) {
  return (
    <div className="rounded-lg border bg-white p-4 dark:bg-[#102141] dark:border-gray-700">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
        <div>
          <span className="font-medium capitalize text-gray-700 dark:text-gray-200">{post.type}</span>
          {post.status ? (
            <>
              {' '}
              · <span className="uppercase text-gray-500 dark:text-gray-400">{post.status}</span>
            </>
          ) : null}
          {post.country ? ` · ${post.country}` : ''}
          {post.city ? ` / ${post.city}` : ''}
          {post.profession ? ` · ${post.profession}` : ''}
        </div>
        <div>{post.authorDisplayName ? post.authorDisplayName : post.authorEmail}</div>
      </div>
      <Link
        href={`/app/posts/${post.id}`}
        className="mt-2 block text-lg font-semibold text-gray-900 hover:underline dark:text-gray-100"
      >
        {post.title}
      </Link>
      <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
        {post.content}
      </p>
      <div className="mt-3">
        <Link
          className="text-sm text-blue-600 underline underline-offset-2 dark:text-blue-400"
          href={`/app/posts/${post.id}`}
        >
          Hape
        </Link>
      </div>
    </div>
  );
}