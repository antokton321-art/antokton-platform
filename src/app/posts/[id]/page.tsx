import CommentList from '@/components/CommentList'
import PostCard from '@/components/PostCard'
import { getPostById } from '@/lib/firestore'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {  const post = await getPostById((await params).id)  if(!post) return <div className="card">Post not found</div>

  return (
    <div className="space-y-4">
      <PostCard post={post} detailed />
      <CommentList postId={post.id} />
    </div>
  )
}
