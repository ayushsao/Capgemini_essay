import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { createUser, getUserByEmail } from './firebaseServices';
import { User } from '@/types/user';

export interface GoogleAuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// Sign in with Google
export const signInWithGoogle = async (): Promise<GoogleAuthResult> => {
  try {
    console.log('🚀 Starting Google Sign-In...');
    console.log('🌐 Current domain:', window.location.hostname);
    console.log('🌐 Current URL:', window.location.href);
    
    // Pre-flight checks
    if (!auth) {
      console.error('❌ Firebase Auth is not initialized');
      return { success: false, error: 'Firebase Auth is not initialized. Please refresh the page and try again.' };
    }
    
    if (!googleProvider) {
      console.error('❌ Google Auth Provider is not configured');
      return { success: false, error: 'Google Sign-In is not properly configured. Please contact support.' };
    }
    
    // Additional environment checks
    console.log('🔥 Firebase config check:', {
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'capgemini-essay-tutor.firebaseapp.com',
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Loaded' : 'Using fallback',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'capgemini-essay-tutor'
    });
    
    // Check if we're on localhost and provide specific guidance
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
      console.log('🏠 Running on localhost - ensuring localhost is in authorized domains');
    }
    
    console.log('🔑 Attempting signInWithPopup...');
    
    // Set a timeout for the popup
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Sign-in timeout - popup may have been blocked')), 30000);
    });
    
    const signInPromise = signInWithPopup(auth, googleProvider);
    
    // Race between sign-in and timeout
    const result = await Promise.race([signInPromise, timeoutPromise]);
    
    console.log('✅ Google Sign-In popup completed successfully');
    
    const firebaseUser = result.user;
    console.log('👤 Firebase User received:', {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL
    });

    if (!firebaseUser.email) {
      console.error('❌ No email found in Google account');
      return { success: false, error: 'No email found in your Google account. Please use a different account or sign up manually.' };
    }

    console.log('📧 Processing user with email:', firebaseUser.email);

    // Check if user already exists in Firestore
    console.log('🔍 Checking if user exists in Firestore...');
    let existingUser = await getUserByEmail(firebaseUser.email);

    if (existingUser) {
      console.log('👤 Existing user found:', existingUser.name);
      
      // Update user data if needed
      let needsUpdate = false;
      const updates: Partial<User> = {};
      
      if (firebaseUser.photoURL && firebaseUser.photoURL !== existingUser.avatar) {
        updates.avatar = firebaseUser.photoURL;
        needsUpdate = true;
        console.log('📷 Updating avatar');
      }
      
      if (firebaseUser.displayName && firebaseUser.displayName !== existingUser.name) {
        updates.name = firebaseUser.displayName;
        needsUpdate = true;
        console.log('👤 Updating display name');
      }
      
      const finalUser = needsUpdate ? { ...existingUser, ...updates } : existingUser;
      console.log('✅ Using user data:', finalUser.name);
      return { success: true, user: finalUser };
    } else {
      // Create new user
      const newUserData = {
        name: firebaseUser.displayName || 'Google User',
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL || undefined,
        joinDate: new Date().toISOString().split('T')[0],
        subscription: 'free' as const,
        authProvider: 'google' as const
      };

      console.log('💾 Creating new user in Firestore...');
      const userId = await createUser(newUserData);
      console.log('✅ New user created with ID:', userId);
      
      const newUser: User = { id: userId, ...newUserData };
      return { success: true, user: newUser };
    }
  } catch (error: any) {
    console.error('💥 Google sign-in error:', error);
    
    // Handle specific Firebase Auth error codes
    if (error && typeof error === 'object' && 'code' in error) {
      const firebaseError = error as any;
      console.error('🔥 Firebase error details:', {
        code: firebaseError.code,
        message: firebaseError.message,
        customData: firebaseError.customData
      });
      
      switch (firebaseError.code) {
        case 'auth/popup-closed-by-user':
          return { 
            success: false, 
            error: 'Sign-in was cancelled. Please try again and complete the Google sign-in process.' 
          };
          
        case 'auth/popup-blocked':
          return { 
            success: false, 
            error: 'Popup was blocked by your browser. Please allow popups for this site and try again.' 
          };
          
        case 'auth/unauthorized-domain':
          const currentDomain = window.location.hostname;
          return { 
            success: false, 
            error: `Domain authorization required. The domain "${currentDomain}" needs to be added to Firebase authorized domains. Please contact support or try from an authorized domain.` 
          };
          
        case 'auth/operation-not-allowed':
          return { 
            success: false, 
            error: 'Google Sign-In is not enabled. Please contact support or use email sign-in instead.' 
          };
          
        case 'auth/invalid-api-key':
          return { 
            success: false, 
            error: 'Invalid Firebase configuration. Please contact support.' 
          };
          
        case 'auth/network-request-failed':
          return { 
            success: false, 
            error: 'Network error. Please check your internet connection and try again.' 
          };
          
        case 'auth/configuration-not-found':
          return { 
            success: false, 
            error: 'Firebase configuration missing. Please contact support.' 
          };
          
        case 'auth/internal-error':
          return {
            success: false,
            error: 'Internal authentication error. Please try again or use email sign-in.'
          };
          
        default:
          return { 
            success: false, 
            error: `Authentication failed (${firebaseError.code}). Please try again or use email sign-in.` 
          };
      }
    }
    
    // Handle timeout errors
    if (error.message && error.message.includes('timeout')) {
      return {
        success: false,
        error: 'Sign-in timed out. This may be due to popup blockers or slow internet. Please try again.'
      };
    }
    
    // Generic error fallback
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { 
      success: false, 
      error: `Sign-in failed: ${errorMessage}. Please try email sign-in instead.` 
    };
  }
};

// Sign out
export const signOutUser = async (): Promise<boolean> => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    return false;
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current Firebase user
export const getCurrentFirebaseUser = (): FirebaseUser | null => {
  return auth.currentUser;
};
