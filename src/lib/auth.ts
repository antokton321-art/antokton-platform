import { auth } from './firebase'
import { onAuthStateChanged as fbOnAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as fbSignOut, updateProfile } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

export function onAuthStateChanged(cb: (user: any) => void) {
  return fbOnAuthStateChanged(auth, async (u) => {
    if (!u) return cb(null)
    // try to ensure user profile in users collection
    const ref = doc(db, 'users', u.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, { uid: u.uid, email: u.email, displayName: u.displayName || null, role: 'member' })
    }
    cb({ uid: u.uid, email: u.email, displayName: u.displayName })
  })
}

export async function signInWithEmail(email:string, password:string){
  await signInWithEmailAndPassword(auth, email, password)
}

export async function signUpWithEmail(email:string, password:string, options?: { displayName?: string }){
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  if(options?.displayName) await updateProfile(cred.user, { displayName: options.displayName })
  const ref = doc(db, 'users', cred.user.uid)
  await setDoc(ref, { uid: cred.user.uid, email: cred.user.email, displayName: options?.displayName || null, role: 'member' })
}

export async function signOut(){
  await fbSignOut(auth)
}

export async function getCurrentUserRole(){
  const u = auth.currentUser
  if(!u) return null
  const docRef = doc(db, 'users', u.uid)
  const snap = await getDoc(docRef)
  return snap.exists() ? (snap.data() as any).role : null
}
