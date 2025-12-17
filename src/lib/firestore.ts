import { db } from './firebase'
import { collection, addDoc, getDocs, query, orderBy, limit, doc, getDoc, where, updateDoc, serverTimestamp } from 'firebase/firestore'
import { Post, Comment, Report } from '@/types'

export async function createPost(data: { title: string; content: string }){
  const ref = await addDoc(collection(db, 'posts'), {
    title: data.title,
    content: data.content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    authorRef: null,
  })
  return { id: ref.id, ...data }
}

export async function getFeed({ limit: l = 20 } = {}){
  const q = query(collection(db,'posts'), orderBy('createdAt','desc'), limit(l))
  const snap = await getDocs(q)
  return snap.docs.map(d => {
    const data:any = d.data()
    return {
      id: d.id,
      title: data.title,
      content: data.content,
      createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      author: { displayName: data.authorDisplayName || null, email: data.authorEmail || null },
      commentsCount: data.commentsCount || 0,
    } as Post
  })
}

export async function getPostById(id:string){
  const d = await getDoc(doc(db,'posts',id))
  if(!d.exists()) return null
  const data:any = d.data()
  return { id: d.id, ...data, createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString() }
}

export async function getCommentsForPost(postId:string){
  const q = query(collection(db, `posts/${postId}/comments`), orderBy('createdAt','desc'), limit(100))
  const snap = await getDocs(q)
  return snap.docs.map(d=>({ id:d.id, ...d.data() })) as Comment[]
}

export async function addComment(postId:string, data:{ content:string }){
  const ref = await addDoc(collection(db, `posts/${postId}/comments`), { content: data.content, createdAt: serverTimestamp(), authorRef: null })
  return { id: ref.id, ...data, createdAt: new Date().toISOString() }
}

export async function reportPost(postId:string, data:{ reason:string }){
  const ref = await addDoc(collection(db,'reports'), { postId, reason: data.reason, createdAt: serverTimestamp(), status: 'pending' })
  return { id: ref.id }
}

export async function fetchModerationQueue(){
  const q = query(collection(db,'reports'), where('status','==','pending'), orderBy('createdAt','desc'), limit(50))
  const snap = await getDocs(q)
  return snap.docs.map(d=>({ id:d.id, ...d.data() })) as Report[]
}

export async function approveReport(reportId:string){
  await updateDoc(doc(db,'reports',reportId), { status: 'approved', reviewedAt: serverTimestamp() })
}

export async function rejectReport(reportId:string){
  await updateDoc(doc(db,'reports',reportId), { status: 'rejected', reviewedAt: serverTimestamp() })
}
