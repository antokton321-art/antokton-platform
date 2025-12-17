// Firebase client helpers. These functions ensure Firebase is only
// initialised in the browser. Avoid importing firebase directly in
// server components or during build.

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

function getPublicConfig() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  if (!apiKey || !authDomain || !projectId) {
    throw new Error(
      'Missing NEXT_PUBLIC_FIREBASE_* environment variables. Define them in your .env.local or Vercel settings.'
    );
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId
  };
}

/**
 * Returns the Firebase app instance. Throws on the server.
 */
export async function getFirebaseApp() {
  if (typeof window === 'undefined') {
    throw new Error('Firebase client SDK cannot be used on the server.');
  }
  if (_app) return _app;
  const { initializeApp, getApp, getApps } = await import('firebase/app');
  const config = getPublicConfig();
  _app = getApps().length ? getApp() : initializeApp(config);
  return _app;
}

/**
 * Returns the Firebase Auth instance. Only callable in client components.
 */
export async function getFirebaseAuth() {
  if (_auth) return _auth;
  const app = await getFirebaseApp();
  const { getAuth } = await import('firebase/auth');
  _auth = getAuth(app);
  return _auth;
}

/**
 * Returns the Firestore instance. Only callable in client components.
 */
export async function getFirestoreDb() {
  if (_db) return _db;
  const app = await getFirebaseApp();
  const { getFirestore } = await import('firebase/firestore');
  _db = getFirestore(app);
  return _db;
}