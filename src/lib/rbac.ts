import type { Role } from '@/types';

export function canModerate(role: Role | null | undefined) {
  return role === 'admin' || role === 'moderator';
}

export function isAdmin(role: Role | null | undefined) {
  return role === 'admin';
}