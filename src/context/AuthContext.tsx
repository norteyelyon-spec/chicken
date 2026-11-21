import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../firebase';
import { signInWithGooglePopup, signOutFirebaseUser } from '../utils/firestoreSync';
import { clearDriveAccessToken, isDriveConnected } from '../utils/googleDrive';
import { useNavigation } from './NavigationContext';

interface AuthContextValue {
  firebaseUser: User | null;
  isAuthBusy: boolean;
  driveConnected: boolean;
  setDriveConnected: React.Dispatch<React.SetStateAction<boolean>>;
  handleGoogleSignIn: () => Promise<void>;
  handleGoogleSignOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setBannerMessage } = useNavigation();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthBusy, setIsAuthBusy] = useState(false);
  const [driveConnected, setDriveConnected] = useState(() => isDriveConnected());

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (!user) {
        clearDriveAccessToken();
        setDriveConnected(false);
      }
    });
    return () => unsubAuth();
  }, []);

  const handleGoogleSignIn = useCallback(async () => {
    if (isAuthBusy) return;
    setIsAuthBusy(true);
    try {
      const user = await signInWithGooglePopup();
      setBannerMessage(`Signed in as ${user.displayName || user.email}. Cloud sync enabled.`);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // User dismissed sign-in popup cleanly
      } else if (code === 'auth/popup-blocked') {
        setBannerMessage('Sign-in popup was blocked by your browser. Please allow popups and try again.');
      } else {
        setBannerMessage('Google sign-in could not complete. Continuing with local browser storage.');
      }
    } finally {
      setIsAuthBusy(false);
    }
  }, [isAuthBusy, setBannerMessage]);

  const handleGoogleSignOut = useCallback(async () => {
    if (isAuthBusy) return;
    setIsAuthBusy(true);
    try {
      await signOutFirebaseUser();
      clearDriveAccessToken();
      setDriveConnected(false);
      setBannerMessage('Signed out of Google Cloud Sync. Progress continues in local storage.');
    } catch {
      setBannerMessage('Could not sign out cleanly. Please refresh and try again.');
    } finally {
      setIsAuthBusy(false);
    }
  }, [isAuthBusy, setBannerMessage]);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        isAuthBusy,
        driveConnected,
        setDriveConnected,
        handleGoogleSignIn,
        handleGoogleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
