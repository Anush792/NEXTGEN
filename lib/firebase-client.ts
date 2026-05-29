import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Firestore } from 'firebase/firestore';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

function initFirebase() {
  if (typeof window === 'undefined') return;
  if (db) return db;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return null;

  if (!getApps().length) {
    app = initializeApp({
      apiKey: apiKey,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
  }
  db = getFirestore();
  return db;
}

export async function logMessage(entry: { role: string; text: string; extra?: any }) {
  try {
    const firestore = initFirebase();
    if (!firestore) return;
    await addDoc(collection(firestore, 'nextgen_logs'), {
      role: entry.role,
      text: entry.text,
      extra: entry.extra || null,
      createdAt: new Date().toISOString(),
    });
  } catch (e) {
    // don't fail the main flow on logging errors
    console.warn('Firebase log failed', e);
  }
}

export default initFirebase;
