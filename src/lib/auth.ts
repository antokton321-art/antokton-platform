"use client";

import { getFirebaseAuth, getFirestoreDb } from '@/lib/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ADMIN_EMAIL } from '@/constants/roles';

/**
 * Creates the user document in Firestore if it does not exist. Default role is "member".
 */
export async function ensureUserDoc() {
  const auth = await getFirebaseAuth();
  const user = auth.currentUser;
  if (!user?.uid || !user.email) return;
  const db = await getFirestoreDb();
  const ref = doc(db, 'users', user.uid);
  const base = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
    role: 'member'
  } as const;
  await setDoc(
    ref,
    {
      ...base,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
  // Optional: reserved variable to emphasise not auto-admining client-side
  void ADMIN_EMAIL;
}

export async function loginWithGoogle() {
  const auth = await getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
  await ensureUserDoc();
}

export async function loginWithEmail(email: string, password: string) {
  const auth = await getFirebaseAuth();
  await signInWithEmailAndPassword(auth, email, password);
  await ensureUserDoc();
}

export async function registerWithEmail(email: string, password: string, displayName?: string) {
  const auth = await getFirebaseAuth();
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && displayName.trim().length) {
    await updateProfile(cred.user, { displayName: displayName.trim() });
  }
  await ensureUserDoc();
}

export async function logout() {
  const auth = await getFirebaseAuth();
  await signOut(auth);
}