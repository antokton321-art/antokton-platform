import type { Role } from '@/types';
import { cx } from '@/lib/utils';

export default function UserRoleBadge({ role }: { role: Role }) {
  const base = 'inline-flex items-center rounded-full border px-2 py-0.5 text-xs';
  let cls = '';
  if (role === 'admin') cls = 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-800/20 dark:text-purple-200 dark:border-purple-600';
  else if (role === 'moderator') cls = 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-800/20 dark:text-blue-200 dark:border-blue-600';
  else cls = 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600';
  return <span className={cx(base, cls)}>{role}</span>;
}