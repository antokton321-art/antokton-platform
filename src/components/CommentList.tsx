import type { CommentDoc } from '@/types';

export default function CommentList({ comments }: { comments: CommentDoc[] }) {
  if (!comments.length) {
    return (
      <div className="rounded-lg border bg-white p-4 text-sm text-gray-700 dark:bg-[#102141] dark:border-gray-700 dark:text-gray-300">
        Nuk ka komente.
      </div>
    );
  }
  return (
    <div className="rounded-lg border bg-white p-4 dark:bg-[#102141] dark:border-gray-700">
      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Komentet</div>
      <div className="mt-3 space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="rounded-md border p-3 dark:border-gray-600">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {c.authorDisplayName ?? c.authorEmail}
            </div>
            <div className="mt-1 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
              {c.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}