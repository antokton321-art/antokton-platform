import { z } from 'zod';
import { POST_TYPES } from '@/constants/postTypes';

export const postSchema = z.object({
  type: z.enum(POST_TYPES.map((p) => p.value) as [string, ...string[]]),
  title: z.string().min(3).max(140),
  content: z.string().min(10).max(20000),
  country: z.string().optional(),
  city: z.string().max(80).optional(),
  profession: z.string().optional()
});

export const commentSchema = z.object({
  text: z.string().min(1).max(2000)
});

export const reportSchema = z.object({
  targetType: z.enum(['post', 'comment']),
  targetId: z.string().min(5),
  postId: z.string().optional(),
  reason: z.string().min(3).max(2000)
});