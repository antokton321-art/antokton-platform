"use client"
import { useEffect, useState } from 'react'
import { getCommentsForPost, addComment } from '@/lib/firestore'

export default function CommentList({ postId }: { postId: string }){
  const [comments,setComments]=useState<any[]>([])
  const [text,setText]=useState('')

  useEffect(()=>{ getCommentsForPost(postId).then(setComments) },[postId])

  async function submit(e: React.FormEvent){
    e.preventDefault()
    if(!text.trim()) return
    const c = await addComment(postId, { content: text })
    setComments((s)=>[c,...s])
    setText('')
  }

  return (
    <div className="card">
      <form onSubmit={submit} className="mb-3">
        <textarea value={text} onChange={(e)=>setText(e.target.value)} className="w-full input" placeholder="Write a comment" />
        <div className="flex justify-end mt-2">
          <button className="btn btn-primary">Comment</button>
        </div>
      </form>

      <div className="space-y-3">
        {comments.map(c=> (
          <div key={c.id} className="border rounded p-2">
            <div className="text-sm text-gray-600">{c.author.displayName || c.author.email} • {new Date(c.createdAt).toLocaleString()}</div>
            <div className="mt-1">{c.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
