"use client"
import { useEffect, useState } from 'react'
import { fetchModerationQueue, approveReport, rejectReport } from '@/lib/firestore'

export default function ModerationQueue(){
  const [items,setItems]=useState<any[]>([])

  useEffect(()=>{ fetchModerationQueue().then(setItems) },[])

  async function approve(id:string){ await approveReport(id); setItems((s)=>s.filter(i=>i.id!==id)) }
  async function reject(id:string){ await rejectReport(id); setItems((s)=>s.filter(i=>i.id!==id)) }

  if(items.length===0) return <div>No moderation items</div>
  return (
    <div className="space-y-2">
      {items.map(it=> (
        <div key={it.id} className="border rounded p-2">
          <div className="text-sm text-gray-600">Report: {it.reason}</div>
          <div className="mt-1 flex gap-2">
            <button onClick={()=>approve(it.id)} className="text-green-600">Approve</button>
            <button onClick={()=>reject(it.id)} className="text-red-600">Reject</button>
          </div>
        </div>
      ))}
    </div>
  )
}
