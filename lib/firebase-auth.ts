"use client";

import {
  auth,
  db,
  googleProvider,
  facebookProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  firebaseSignOut,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  type User
} from "./firebase";

// Types
export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "user" | "admin";
  createdAt: any;
  lastLoginAt: any;
  phoneNumber?: string | null;
  provider: string;
}

// Sign up with email/password
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    await createUserDocument(user, "email");

    return user;
  } catch (error: any) {
    console.error("Sign up error:", error);
    throw new Error(getAuthErrorMessage(error));
  }
};

// Sign in with email/password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update last login
    await updateUserLastLogin(user.uid);

    return user;
  } catch (error: any) {
    console.error("Sign in error:", error);
    throw new Error(getAuthErrorMessage(error));
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
  try {
    googleProvider.setCustomParameters({
      prompt: "select_account"
    });

    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user exists, if not create document
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await createUserDocument(user, "google");
    } else {
      await updateUserLastLogin(user.uid);
    }

    return user;
  } catch (error: any) {
    console.error("Google sign in error:", error);
    console.error("Error code:", error?.code);
    console.error("Error message:", error?.message);
    throw new Error(getAuthErrorMessage(error));
  }
};

// Sign in with Facebook
export const signInWithFacebook = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;

    // Check if user exists, if not create document
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await createUserDocument(user, "facebook");
    } else {
      await updateUserLastLogin(user.uid);
    }

    return user;
  } catch (error: any) {
    console.error("Facebook sign in error:", error);
    console.error("Error code:", error?.code);
    console.error("Error message:", error?.message);
    throw new Error(getAuthErrorMessage(error));
  }
};

// Sign out
export const logout = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error("Sign out error:", error);
    throw new Error("Failed to sign out");
  }
};

// Create user document in Firestore
const createUserDocument = async (user: User, provider: string): Promise<void> => {
  const userData: UserData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    role: "user", // Default role
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
    phoneNumber: user.phoneNumber,
    provider: provider
  };

  await setDoc(doc(db, "users", user.uid), userData);
};

// Update user last login
const updateUserLastLogin = async (uid: string): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    lastLoginAt: serverTimestamp()
  }, { merge: true });
};

// Get user data from Firestore
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

// Check if user is admin
export const isUserAdmin = async (uid: string): Promise<boolean> => {
  try {
    const userData = await getUserData(uid);
    return userData?.role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Set user role (admin only)
export const setUserRole = async (uid: string, role: "user" | "admin"): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { role }, { merge: true });
};

// Create admin user (call this manually in console for first admin)
export const createAdminUser = async (email: string, password: string, displayName: string): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName });

    const userData: UserData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: "admin",
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      phoneNumber: user.phoneNumber,
      provider: "email"
    };

    await setDoc(doc(db, "users", user.uid), userData);
    console.log("Admin user created successfully:", user.uid);
  } catch (error: any) {
    console.error("Create admin error:", error);
    throw new Error(getAuthErrorMessage(error));
  }
};

// Error message mapper with detailed debugging info
const getAuthErrorMessage = (error: any): string => {
  const code = error?.code || 'unknown';
  const message = error?.message || '';

  const errorMessages: Record<string, string> = {
    "auth/email-already-in-use": "Email is already registered",
    "auth/invalid-email": "Invalid email address",
    "auth/weak-password": "Password should be at least 6 characters",
    "auth/wrong-password": "Incorrect password",
    "auth/user-not-found": "No account found with this email",
    "auth/popup-closed-by-user": "Sign in popup was closed. Please try again and don't close the popup.",
    "auth/cancelled-popup-request": "Sign in was cancelled. Please try again.",
    "auth/popup-blocked": "Sign in popup was blocked by browser. Please allow popups for this site.",
    "auth/account-exists-with-different-credential": "An account already exists with this email. Sign in with the original method.",
    "auth/invalid-credential": "Invalid credentials. Please try again.",
    "auth/network-request-failed": "Network error. Check your internet connection.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
    "auth/user-disabled": "This account has been disabled",
    "auth/operation-not-allowed": "This sign-in method is not enabled. Please enable Google/Facebook in Firebase Console > Authentication > Sign-in method.",
    "auth/unauthorized-domain": `This domain is not authorized. Add "${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}" to Firebase Console > Authentication > Settings > Authorized domains.`,
    "auth/internal-error": "Internal authentication error. Please try again.",
    "auth/invalid-api-key": "Invalid Firebase API key. Check your configuration.",
    "auth/argument-error": "Invalid arguments provided to authentication method."
  };

  // Return detailed error with code for debugging
  const friendlyMessage = errorMessages[code];
  if (friendlyMessage) {
    return friendlyMessage;
  }

  // For OAuth errors, provide more context
  if (code.includes('auth/')) {
    return `Authentication error (${code}): ${message || 'Please check your Firebase configuration and try again.'}`;
  }

  return message || "Authentication failed. Please try again";
};

export { auth };
