"use client"
import { useEffect, useState } from 'react'
import { getCurrentUserRole } from '@/lib/auth'

export default function RoleGate({ children, roles = [] }: { children: React.ReactNode; roles: string[] }){
  const [ok,setOk]=useState<boolean|undefined>(undefined)

  useEffect(()=>{
    let mounted=true
    getCurrentUserRole().then(r=>{ if(mounted) setOk(roles.includes(r||'')) }).catch(()=>setOk(false))
    return ()=>{ mounted=false }
  },[roles.join(',')])

  if(ok===undefined) return <div>Checking role...</div>
  if(!ok) return <div className="text-red-600">You do not have access to this page.</div>
  return <>{children}</>
}
