"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  auth,
  onAuthStateChanged,
  type User
} from "@/lib/firebase";
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signInWithFacebook,
  logout,
  getUserData,
  isUserAdmin,
  type UserData
} from "@/lib/firebase-auth";

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signInFacebook: () => Promise<void>;
  signOut: () => Promise<void>;
  checkAdmin: () => Promise<boolean>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const data = await getUserData(currentUser.uid);
        setUserData(data);
        const adminStatus = await isUserAdmin(currentUser.uid);
        setIsAdmin(adminStatus);
        
        // Save to localStorage for compatibility
        if (currentUser.email) {
          localStorage.setItem('studentEmail', currentUser.email);
        }
        localStorage.setItem('studentToken', currentUser.uid);
      } else {
        setUserData(null);
        setIsAdmin(false);
        localStorage.removeItem('studentEmail');
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentPassword');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUserData = useCallback(async () => {
    if (user) {
      const data = await getUserData(user.uid);
      setUserData(data);
      const adminStatus = await isUserAdmin(user.uid);
      setIsAdmin(adminStatus);
    }
  }, [user]);

  const checkAdmin = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    const adminStatus = await isUserAdmin(user.uid);
    setIsAdmin(adminStatus);
    return adminStatus;
  }, [user]);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      await signUpWithEmail(email, password, displayName);
      localStorage.setItem('studentEmail', email);
      localStorage.setItem('studentPassword', password);
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmail(email, password);
      localStorage.setItem('studentEmail', email);
      localStorage.setItem('studentPassword', password);
    } catch (error) {
      throw error;
    }
  };

  const signInGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.email) {
        localStorage.setItem('studentEmail', result.email);
      }
    } catch (error) {
      throw error;
    }
  };

  const signInFacebook = async () => {
    try {
      const result = await signInWithFacebook();
      if (result.email) {
        localStorage.setItem('studentEmail', result.email);
      }
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await logout();
      setUser(null);
      setUserData(null);
      setIsAdmin(false);
      localStorage.removeItem('studentEmail');
      localStorage.removeItem('studentToken');
      localStorage.removeItem('studentPassword');
      router.push("/signin");
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    isAdmin,
    signUp,
    signIn,
    signInGoogle,
    signInFacebook,
    signOut,
    checkAdmin,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
