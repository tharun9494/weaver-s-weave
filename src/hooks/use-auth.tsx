import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  profileCompleted: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (details: Partial<UserProfile>) => Promise<void>;
  skipProfileCompletion: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Set up Firebase Auth state listener
  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      // Clean up previous profile listener if any
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (currentUser) {
        // Retrieve or initialize user profile from Firestore
        const profileRef = doc(db, "users", currentUser.uid);

        // Listen to profile updates in real time
        unsubscribeProfile = onSnapshot(
          profileRef,
          async (profileDoc) => {
            if (profileDoc.exists()) {
              setProfile(profileDoc.data() as UserProfile);
            } else {
              // Document doesn't exist yet, initialize it
              const newProfile: UserProfile = {
                uid: currentUser.uid,
                email: currentUser.email || "",
                name: currentUser.displayName || "",
                phone: "",
                address: "",
                profileCompleted: false,
                createdAt: new Date().toISOString(),
              };
              await setDoc(profileRef, newProfile);
              setProfile(newProfile);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Error subscribing to profile:", error);
            setLoading(false);
          },
        );
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setLoading(false);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing up with email:", error);
      setLoading(false);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in with email:", error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setProfile(null);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      setLoading(false);
      throw error;
    }
  };

  const updateProfile = async (details: Partial<UserProfile>) => {
    if (!user) throw new Error("No authenticated user found");
    try {
      const profileRef = doc(db, "users", user.uid);
      const updateData = {
        ...details,
        profileCompleted: true,
      };
      await updateDoc(profileRef, updateData);
      setProfile((prev) => (prev ? { ...prev, ...updateData } : null));
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const skipProfileCompletion = async () => {
    if (!user) throw new Error("No authenticated user found");
    try {
      const profileRef = doc(db, "users", user.uid);
      await updateDoc(profileRef, {
        profileCompleted: true,
      });
      setProfile((prev) => (prev ? { ...prev, profileCompleted: true } : null));
    } catch (error) {
      console.error("Error skipping profile completion:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthModalOpen,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        signOut,
        updateProfile,
        skipProfileCompletion,
        openAuthModal,
        closeAuthModal,
      }}
    >
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
