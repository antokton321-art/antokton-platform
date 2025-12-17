"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from '@/lib/auth'

export default function Navbar(){
  const [user,setUser]=useState<any>(null)

  useEffect(()=>{
    return onAuthStateChanged(setUser)
  },[])

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold">Antokton</Link>
        <nav className="flex items-center gap-3">
          <Link href="/">Feed</Link>
          <Link href="/dashboard">Dashboard</Link>
          {user ? (
            <>
              <span className="text-sm">{user.displayName||user.email}</span>
              <button onClick={signOut} className="text-sm text-red-600">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">Sign in</Link>
              <Link href="/auth/signup" className="ml-2">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
