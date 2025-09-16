'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/user';
import { createUser, getUserByEmail, getUsers, updateUser } from '@/lib/firebaseServices';
import { signInWithGoogle, signOutUser, onAuthStateChange } from '@/lib/googleAuth';
import { AUTH_CONFIG, authLog } from '@/lib/authConfig';
import { auth } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ayush Admin',
    email: 'ayushsao32@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    joinDate: '2024-01-15',
    subscription: 'premium'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    joinDate: '2024-02-20',
    subscription: 'free'
  }
];

// User credentials storage (for demo purposes - in real app would be server-side)
interface UserCredentials {
  email: string;
  password: string;
  userId: string;
}

const getStoredCredentials = (): UserCredentials[] => {
  // Hardcoded credentials for maximum reliability in production
  const ADMIN_CREDENTIALS = [
    { email: 'ayushsao32@gmail.com', password: 'password', userId: '1' },
    { email: 'jane@example.com', password: 'password', userId: '2' }
  ];

  // Always return hardcoded credentials on server side
  if (typeof window === 'undefined') {
    console.log('🖥️ Server side - returning hardcoded admin credentials');
    return ADMIN_CREDENTIALS;
  }

  // For production/online deployment, always ensure admin credentials exist
  const isOnline = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  
  try {
    let credentials = ADMIN_CREDENTIALS; // Start with admin credentials
    
    const stored = localStorage.getItem('user_credentials');
    if (stored) {
      const parsedCredentials = JSON.parse(stored);
      console.log('💾 Found stored credentials, merging with admin credentials');
      
      // Ensure admin credentials are always present
      const hasAdmin = parsedCredentials.some((cred: UserCredentials) => cred.email === 'ayushsao32@gmail.com');
      if (!hasAdmin) {
        credentials = [...ADMIN_CREDENTIALS, ...parsedCredentials];
      } else {
        credentials = parsedCredentials;
      }
    }
    
    // Save merged credentials
    localStorage.setItem('user_credentials', JSON.stringify(credentials));
    console.log('✅ Credentials ensured for', isOnline ? 'ONLINE' : 'LOCAL', 'environment');
    return credentials;
    
  } catch (error) {
    console.warn('⚠️ localStorage error, using hardcoded admin credentials:', error);
    return ADMIN_CREDENTIALS;
  }
};

const saveCredentials = (credentials: UserCredentials[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_credentials', JSON.stringify(credentials));
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true
  });

  // Firebase Auth State Listener for Google Sign-In profile pictures
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      console.log('🔄 Firebase Auth State Changed:', firebaseUser ? 'User signed in' : 'User signed out');
      
      if (firebaseUser && firebaseUser.email) {
        console.log('👤 Firebase User Data:', {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          uid: firebaseUser.uid
        });

        try {
          // Get user from Firestore by email
          const existingUser = await getUserByEmail(firebaseUser.email);
          
          if (existingUser) {
            console.log('✅ Found existing user in Firestore');
            
            // Update avatar if Google profile picture is available and different
            if (firebaseUser.photoURL && firebaseUser.photoURL !== existingUser.avatar) {
              console.log('📷 Updating user avatar from Google photoURL:', firebaseUser.photoURL);
              await updateUser(existingUser.id, { avatar: firebaseUser.photoURL });
              existingUser.avatar = firebaseUser.photoURL;
            }
            
            // Update the auth state with fresh user data including avatar
            setAuthState({
              user: existingUser,
              isAuthenticated: true,
              loading: false
            });
            
            // Store updated user in localStorage
            localStorage.setItem('user', JSON.stringify(existingUser));
            console.log('💾 Updated user stored in localStorage with avatar:', existingUser.avatar ? 'Yes' : 'No');
          }
        } catch (error) {
          console.error('❌ Error handling Firebase auth state change:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Only access localStorage after hydration on client side
    const initializeAuth = () => {
      // Ensure we're on client side and component is mounted
      if (typeof window === 'undefined') {
        setAuthState(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const user = JSON.parse(storedUser);
          console.log('🔄 Restored user from localStorage:', user);
          setAuthState({
            user,
            isAuthenticated: true,
            loading: false
          });
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('❌ Error restoring user:', error);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
        }
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    // Initialize immediately for server-side, with delay for client-side
    if (typeof window === 'undefined') {
      initializeAuth();
    } else {
      // Small delay to ensure proper hydration on client
      const timer = setTimeout(initializeAuth, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('� Login started:', { email });
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      // Ensure we're on the client side
      if (typeof window === 'undefined') {
        console.log('❌ Login attempted on server side');
        setAuthState(prev => ({ ...prev, loading: false }));
        return false;
      }

      console.log('🌐 Client side login processing...');
      
      // Simulate API call with shorter delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get credentials - this should always work now
      const credentials = getStoredCredentials();
      console.log('📋 Available credentials:', credentials.map(c => ({ email: c.email, userId: c.userId })));
      
      // Find matching credential
      let userCredential = credentials.find(c => c.email === email && c.password === password);
      console.log('🎯 Credential match result:', userCredential ? 'FOUND' : 'NOT FOUND');
      
      // If no credential found, try to find user by email and create temporary credential
      if (!userCredential) {
        console.log('🔄 No stored credential found, checking if user exists...');
        
        // Check if user exists in localStorage first
        let existingUser = null;
        try {
          const storedUsers = localStorage.getItem('registered_users');
          if (storedUsers) {
            const registeredUsers = JSON.parse(storedUsers);
            existingUser = registeredUsers.find((u: User) => u.email === email);
          }
        } catch (error) {
          console.error('Error checking localStorage users:', error);
        }
        
        // If user exists but credential doesn't, this might be a registration issue
        if (existingUser) {
          console.log('🔧 User exists but credential missing. Recreating credential...');
          userCredential = { email, password, userId: existingUser.id };
          const updatedCredentials = [...credentials, userCredential];
          saveCredentials(updatedCredentials);
          console.log('✅ Credential recreated for existing user');
        } else {
          console.log('❌ Invalid credentials provided');
          setAuthState(prev => ({ ...prev, loading: false }));
          return false;
        }
      }

      // Find the user data
      let user = mockUsers.find(u => u.id === userCredential.userId);
      console.log('👤 User lookup in mockUsers:', user ? 'FOUND' : 'NOT FOUND');
      
      // If not found in mockUsers, check localStorage registered users
      if (!user) {
        try {
          const storedUsers = localStorage.getItem('registered_users');
          if (storedUsers) {
            const registeredUsers = JSON.parse(storedUsers);
            user = registeredUsers.find((u: User) => u.id === userCredential.userId);
            console.log('💾 User lookup in localStorage:', user ? 'FOUND' : 'NOT FOUND');
          }
        } catch (error) {
          console.error('💥 Error loading registered users:', error);
        }
      }
      
      // If still not found, check Firebase (for users who registered online)
      if (!user) {
        try {
          console.log('🔍 Checking Firebase for user with email:', email);
          const firebaseUser = await getUserByEmail(email);
          if (firebaseUser) {
            user = firebaseUser;
            console.log('☁️ User lookup in Firebase:', user ? 'FOUND' : 'NOT FOUND');
          }
        } catch (error) {
          console.error('💥 Error loading user from Firebase:', error);
        }
      }
      
      if (!user) {
        console.log('❌ User data not found');
        setAuthState(prev => ({ ...prev, loading: false }));
        return false;
      }

      // Success - store user and update state
      console.log('✅ Login successful for user:', user.name);
      localStorage.setItem('user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false
      });
      return true;
      
    } catch (error) {
      console.error('💥 Login error:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      console.log('Starting registration process...', { name, email });
      
      // Check if user already exists
      console.log('Checking if user exists in Firebase...');
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        console.log('User already exists:', existingUser);
        setAuthState(prev => ({ ...prev, loading: false }));
        return false;
      }
      
      console.log('User does not exist, creating new user in Firebase...');
      
      // Create new user in Firebase
      const newUserData = {
        name,
        email,
        joinDate: new Date().toISOString().split('T')[0], // Store as YYYY-MM-DD format
        subscription: 'free' as const,
        authProvider: 'email' as const
      };
      
      console.log('Creating user with data:', newUserData);
      const userId = await createUser(newUserData);
      console.log('Firebase user created with ID:', userId);
      
      const newUser = { id: userId, ...newUserData };
      
      // Save credentials (for demo - in production, use Firebase Auth)
      const credentials = getStoredCredentials();
      const newCredential = { email, password, userId };
      const updatedCredentials = [...credentials, newCredential];
      saveCredentials(updatedCredentials);
      
      // Store user locally for session
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setAuthState({
        user: newUser,
        isAuthenticated: true,
        loading: false
      });
      
      console.log('User registered successfully in Firebase:', newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      const errorDetails = error as any;
      console.error('Full error details:', {
        message: errorDetails?.message,
        code: errorDetails?.code,
        stack: errorDetails?.stack
      });
      
      // Fallback to localStorage registration
      console.log('Falling back to localStorage registration...');
      try {
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          joinDate: new Date().toISOString().split('T')[0], // Store as YYYY-MM-DD format
          subscription: 'free',
          authProvider: 'email' as const
        };
        
        // Save credentials
        const credentials = getStoredCredentials();
        const newCredential = { email, password, userId: newUser.id };
        const updatedCredentials = [...credentials, newCredential];
        saveCredentials(updatedCredentials);
        
        // Save to localStorage
        const storedUsers = localStorage.getItem('registered_users');
        const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
        registeredUsers.push(newUser);
        localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
        localStorage.setItem('user', JSON.stringify(newUser));
        
        setAuthState({
          user: newUser,
          isAuthenticated: true,
          loading: false
        });
        
        console.log('User registered in localStorage as fallback:', newUser);
        return true;
      } catch (fallbackError) {
        console.error('Fallback registration also failed:', fallbackError);
        setAuthState(prev => ({ ...prev, loading: false }));
        return false;
      }
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    console.log('🔍 Google login started');
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        console.error('❌ Google login attempted on server side');
        setAuthState(prev => ({ ...prev, loading: false }));
        return false;
      }

      // Pre-flight checks
      console.log('🌐 Environment check:', {
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        userAgent: navigator.userAgent.substring(0, 50) + '...'
      });

      const result = await signInWithGoogle();
      
      if (result.success && result.user) {
        console.log('✅ Google login successful for user:', result.user.name);
        console.log('👤 User avatar from Google sign-in:', result.user.avatar ? 'Has avatar' : 'No avatar');
        
        // Store user locally for session
        localStorage.setItem('user', JSON.stringify(result.user));
        console.log('💾 User stored in localStorage with avatar:', result.user.avatar ? 'Yes' : 'No');
        
        setAuthState({
          user: result.user,
          isAuthenticated: true,
          loading: false
        });
        
        console.log('🔄 Auth state updated. Firebase auth listener should handle profile picture updates...');
        return true;
      } else {
        console.log('❌ Google login failed:', result.error);
        
        // Show user-friendly error message
        if (result.error?.includes('unauthorized-domain')) {
          console.error('Domain authorization issue:', result.error);
        } else if (result.error?.includes('popup')) {
          console.error('Popup issue:', result.error);
        } else {
          console.error('Generic Google login error:', result.error);
        }
        
        setAuthState(prev => ({ ...prev, loading: false }));
        return false;
      }
    } catch (error) {
      console.error('💥 Google login critical error:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
      return false;
    }
  };

  const logout = async () => {
    // Sign out from Firebase if user was authenticated with Google
    await signOutUser();
    
    // Clear local storage
    localStorage.removeItem('user');
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false
    });
  };

  const updateProfile = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
    }
  };  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
