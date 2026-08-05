import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  db,
  serverTimestamp
} from '../lib/firebase';
import { User } from 'firebase/auth';
import { CountryRegion, Currency } from '../types';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  preferredLocale?: string;
  preferredCountry?: CountryRegion;
  preferredCurrency?: Currency;
  experienceMode?: 'quick' | 'research';
  role?: 'guest' | 'user' | 'researcher' | 'moderator' | 'administrator';
  createdAt?: any;
  updatedAt?: any;
  acceptedTermsVersion?: string;
  acceptedPrivacyVersion?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (e: string, p: string, name?: string) => Promise<void>;
  sendPasswordReset: (e: string) => Promise<void>;
  resendEmailVerification: () => Promise<void>;
  signOutUser: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            setProfile(snap.data() as UserProfile);
          } else {
            // Create default profile for new user
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              displayName: currentUser.displayName || 'FinTrustBench User',
              email: currentUser.email,
              photoURL: currentUser.photoURL || null,
              preferredLocale: navigator.language || 'en-US',
              preferredCountry: 'Global / Country-Neutral',
              preferredCurrency: 'USD',
              experienceMode: 'quick',
              role: 'user',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              acceptedTermsVersion: '1.0',
              acceptedPrivacyVersion: '1.0'
            };
            await setDoc(userRef, newProfile);
            setProfile(newProfile);
          }
        } catch (err: any) {
          console.error('Error fetching/creating user profile:', err);
          // Fallback profile if offline/permission issue
          setProfile({
            uid: currentUser.uid,
            displayName: currentUser.displayName || 'FinTrustBench User',
            email: currentUser.email,
            photoURL: currentUser.photoURL || null,
            role: 'user'
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message || 'Failed to sign in with Google');
      }
    }
  };

  const signInWithEmail = async (e: string, p: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, e, p);
    } catch (err: any) {
      setAuthError(err.message || 'Invalid email or password');
      throw err;
    }
  };

  const signUpWithEmail = async (e: string, p: string, name?: string) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, e, p);
      if (cred.user) {
        await sendEmailVerification(cred.user).catch(() => {});
        const userRef = doc(db, 'users', cred.user.uid);
        const newProfile: UserProfile = {
          uid: cred.user.uid,
          displayName: name || e.split('@')[0],
          email: e,
          photoURL: null,
          preferredLocale: navigator.language || 'en-US',
          preferredCountry: 'Global / Country-Neutral',
          preferredCurrency: 'USD',
          experienceMode: 'quick',
          role: 'user',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          acceptedTermsVersion: '1.0',
          acceptedPrivacyVersion: '1.0'
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Failed to create account');
      throw err;
    }
  };

  const sendPasswordReset = async (e: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, e);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to send password reset email');
      throw err;
    }
  };

  const resendEmailVerification = async () => {
    if (user) {
      await sendEmailVerification(user);
    }
  };

  const signOutUser = async () => {
    setAuthError(null);
    await signOut(auth);
    setProfile(null);
  };

  const deleteAccount = async () => {
    if (!user) return;
    setAuthError(null);
    try {
      const uid = user.uid;
      // Delete user doc
      await deleteDoc(doc(db, 'users', uid)).catch(() => {});
      // Delete auth user
      await deleteUser(user);
      setProfile(null);
      setUser(null);
    } catch (err: any) {
      setAuthError(err.message || 'Requires recent authentication. Please sign in again before deleting account.');
      throw err;
    }
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const updated = {
      ...data,
      updatedAt: serverTimestamp()
    };
    await setDoc(userRef, updated, { merge: true });
    setProfile((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        authError,
        clearAuthError,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        resendEmailVerification,
        signOutUser,
        deleteAccount,
        updateProfileData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
