"use client"
import { useState } from 'react'
import { signUpWithEmail } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function SignUpPage(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [displayName,setDisplayName]=useState('')
  const [error,setError]=useState<string| null>(null)
  const router = useRouter()

  async function submit(e: React.FormEvent){
    e.preventDefault()
    setError(null)
    try{
      await signUpWithEmail(email,password, { displayName })
      router.push('/')
    }catch(err:any){ setError(err.message||'Sign up failed') }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-xl font-semibold mb-4">Create account</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={displayName} onChange={(e)=>setDisplayName(e.target.value)} placeholder="Display name" className="w-full input" />
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full input" />
        <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full input" />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button className="btn btn-primary">Sign up</button>
      </form>
    </div>
  )
}
