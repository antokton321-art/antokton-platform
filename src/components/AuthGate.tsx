"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from '@/lib/auth'

export default function AuthGate({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }){
  const [user,setUser]=useState<any>(undefined)
  const router = useRouter()

  useEffect(()=>{
    return onAuthStateChanged((u)=>{
      setUser(u)
      if(u===null) router.push('/auth/signin')
    })
  },[])

  if(user===undefined) return <div className="p-4">Loading...</div>
  if(!user) return <>{fallback}</>
  return <>{children}</>
}
