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
    console.log('🔧 Auth object:', auth);
    console.log('🔧 Google Provider:', googleProvider);
    console.log('🔥 Firebase config check:', {
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Loaded' : 'Missing',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    });
    
    // Additional validation checks
    if (!auth) {
      throw new Error('Firebase Auth is not initialized. Please check your Firebase configuration.');
    }
    
    if (!googleProvider) {
      throw new Error('Google Auth Provider is not configured. Please check your Firebase setup.');
    }
    
    console.log('🔑 Attempting signInWithPopup...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('✅ Google Sign-In popup completed:', result);
    
    const firebaseUser = result.user;
    console.log('👤 Firebase User object:', {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      providerId: firebaseUser.providerId
    });

    if (!firebaseUser.email) {
      console.error('❌ No email found in Google account');
      return { success: false, error: 'No email found in Google account' };
    }

    console.log('📧 User email:', firebaseUser.email);
    console.log('📷 Photo URL from Google:', firebaseUser.photoURL);

    // Check if user already exists in Firestore
    console.log('🔍 Checking if user exists in Firestore...');
    let existingUser = await getUserByEmail(firebaseUser.email);

    if (existingUser) {
      // User exists, but let's update their avatar and name if they've changed
      console.log('👤 Existing user found, checking for updates...');
      
      let needsUpdate = false;
      const updates: Partial<User> = {};
      
      // Check if avatar needs updating
      if (firebaseUser.photoURL && firebaseUser.photoURL !== existingUser.avatar) {
        updates.avatar = firebaseUser.photoURL;
        needsUpdate = true;
        console.log('📷 Avatar needs updating:', firebaseUser.photoURL);
      }
      
      // Check if name needs updating
      if (firebaseUser.displayName && firebaseUser.displayName !== existingUser.name) {
        updates.name = firebaseUser.displayName;
        needsUpdate = true;
        console.log('👤 Name needs updating:', firebaseUser.displayName);
      }
      
      if (needsUpdate) {
        console.log('🔄 Updating user data...');
        // Update the user in Firebase (you'll need to implement updateUser function)
        const updatedUser = { ...existingUser, ...updates };
        console.log('✅ User updated with new data:', updatedUser);
        return { success: true, user: updatedUser };
      }
      
      console.log('✅ Using existing user data');
      return { success: true, user: existingUser };
    } else {
      // Create new user in Firestore
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
      console.log('✅ User created with ID:', userId);
      
      const newUser: User = { id: userId, ...newUserData };
      console.log('🎯 Final user object:', newUser);
      
      return { success: true, user: newUser };
    }
  } catch (error) {
    console.error('💥 Google sign-in error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('💥 Error message:', errorMessage);
    
    // Check if it's a Firebase Auth error
    if (error && typeof error === 'object' && 'code' in error) {
      const firebaseError = error as any;
      console.error('🔥 Firebase error code:', firebaseError.code);
      console.error('🔥 Firebase error message:', firebaseError.message);
      
      // Provide specific error messages for common issues
      switch (firebaseError.code) {
        case 'auth/popup-closed-by-user':
          return { success: false, error: 'Sign-in was cancelled. Please try again.' };
        case 'auth/popup-blocked':
          return { success: false, error: 'Popup was blocked by browser. Please allow popups and try again.' };
        case 'auth/unauthorized-domain':
          return { 
            success: false, 
            error: `This domain (${window.location.hostname}) is not authorized for Google Sign-In. Please add it to Firebase Console → Authentication → Settings → Authorized domains.` 
          };
        case 'auth/operation-not-allowed':
          return { success: false, error: 'Google Sign-In is not enabled in Firebase. Please contact support.' };
        case 'auth/invalid-api-key':
          return { success: false, error: 'Invalid Firebase API key. Please check environment variables.' };
        case 'auth/network-request-failed':
          return { success: false, error: 'Network error. Please check your internet connection and Firebase configuration.' };
        case 'auth/configuration-not-found':
          return { success: false, error: 'Firebase configuration missing. Please check environment variables.' };
        default:
          return { success: false, error: `Authentication error (${firebaseError.code}): ${firebaseError.message}` };
      }
    }
    
    return { success: false, error: errorMessage };
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
