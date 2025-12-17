"use client"
import { useState } from 'react'
import { createPost } from '@/lib/firestore'

export default function PostEditor(){
  const [title,setTitle]=useState('')
  const [content,setContent]=useState('')
  const [loading,setLoading]=useState(false)

  async function submit(e: React.FormEvent){
    e.preventDefault()
    setLoading(true)
    try{
      await createPost({ title, content })
      setTitle('')
      setContent('')
    }catch(err){ console.error(err) }
    setLoading(false)
  }

  return (
    <form onSubmit={submit} className="card">
      <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full input mb-2" />
      <textarea value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Share something..." className="w-full input mb-2" rows={4} />
      <div className="flex justify-end">
        <button disabled={loading} className="btn btn-primary">{loading ? 'Posting...' : 'Post'}</button>
      </div>
    </form>
  )
}
