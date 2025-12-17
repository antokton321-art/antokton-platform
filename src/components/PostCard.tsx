"use client"
import Link from 'next/link'
import { Post } from '@/types'

export default function PostCard({ post, detailed = false }: { post: Post; detailed?: boolean }){
  return (
    <article className="card">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{post.title}</h3>
          <div className="text-sm text-gray-600">by {post.author.displayName || post.author.email}</div>
        </div>
        <div className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
      </div>
      <div className="mt-2 text-sm text-gray-800">{post.content}</div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">{post.commentsCount || 0} comments</div>
        <div>
          <Link href={`/posts/${post.id}`} className="text-blue-600">View</Link>
        </div>
      </div>
    </article>
  )
}
