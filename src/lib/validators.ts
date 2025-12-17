import { z } from 'zod'

export const PostSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(1).max(5000),
})

export const CommentSchema = z.object({
  content: z.string().min(1).max(2000),
})

export const ReportSchema = z.object({ reason: z.string().min(3).max(1000) })
