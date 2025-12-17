import PostCard from '@/components/PostCard'
import PostEditor from '@/components/PostEditor'
import { getFeed } from '@/lib/firestore'
import { Suspense } from 'react'

export default async function Page() {
  const posts = await getFeed({ limit: 20 })

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Feed</h1>
      <div className="mb-6">
        {/* Post editor rendered on client */}
        <PostEditor />
      </div>

      <div className="space-y-4">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  )
}
