export type Role = 'admin' | 'moderator' | 'member'

export type User = {
  uid: string
  email?: string | null
  displayName?: string | null
  role?: Role
}

export type Post = {
  id: string
  title: string
  content: string
  author: { displayName?: string | null; email?: string | null }
  createdAt: string
  commentsCount?: number
}

export type Comment = {
  id: string
  content: string
  author: Partial<User>
  createdAt: string
}

export type Report = {
  id: string
  postId: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}
