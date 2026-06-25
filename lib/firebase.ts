import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
  type UserCredential,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  or,
  type DocumentData,
  type QuerySnapshot,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtLQE8DjH_m_cEehBFGVoYeeZbAPUL5AA",
  authDomain: "ngcdo-6b1ce.firebaseapp.com",
  projectId: "ngcdo-6b1ce",
  storageBucket: "ngcdo-6b1ce.firebasestorage.app",
  messagingSenderId: "723238683916",
  appId: "1:723238683916:web:49cec0cd701a97e5223529",
  measurementId: "G-Z0RCXPQ3JS",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Export Firebase instances and functions
export {
  app,
  analytics,
  auth,
  db,
  storage,
  googleProvider,
  facebookProvider,
  // Auth functions
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  // Firestore functions
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  or,
  // Storage functions
  ref,
  uploadBytes,
  getDownloadURL,
};

export type { User, UserCredential, DocumentData, QuerySnapshot };

console.log("✅ Firebase initialized successfully");
