'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/user';
import { createUser, getUserByEmail, getUsers } from '@/lib/firebaseServices';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
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
  // Default credentials for both server and client
  const defaultCredentials = [
    { email: 'ayushsao32@gmail.com', password: 'password', userId: '1' },
    { email: 'jane@example.com', password: 'password', userId: '2' }
  ];

  // Return default if on server side
  if (typeof window === 'undefined') {
    return defaultCredentials;
  }

  try {
    const stored = localStorage.getItem('user_credentials');
    if (stored) {
      return JSON.parse(stored);
    } else {
      // Initialize with default demo users if nothing is stored
      localStorage.setItem('user_credentials', JSON.stringify(defaultCredentials));
      return defaultCredentials;
    }
  } catch (error) {
    // If there's any error, return and save default credentials
    localStorage.setItem('user_credentials', JSON.stringify(defaultCredentials));
    return defaultCredentials;
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client flag to prevent hydration issues
    setIsClient(true);
    
    // Add a small delay to show the preloader
    const timer = setTimeout(() => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            loading: false
          });
        } catch (error) {
          localStorage.removeItem('user');
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    }, 1500); // Show preloader for at least 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check stored credentials
    const credentials = getStoredCredentials();
    const userCredential = credentials.find(c => c.email === email && c.password === password);
    
    if (userCredential) {
      // Find the user data (either in mockUsers or check localStorage for registered users)
      let user = mockUsers.find(u => u.id === userCredential.userId);
      
      // If not in mockUsers, try to find in localStorage (for registered users)
      if (!user) {
        try {
          const storedUsers = localStorage.getItem('registered_users');
          if (storedUsers) {
            const registeredUsers = JSON.parse(storedUsers);
            user = registeredUsers.find((u: User) => u.id === userCredential.userId);
          }
        } catch (error) {
          console.error('Error loading registered users:', error);
        }
      }
      
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        setAuthState({
          user,
          isAuthenticated: true,
          loading: false
        });
        return true;
      }
    }
    
    setAuthState(prev => ({ ...prev, loading: false }));
    return false;
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
        subscription: 'free' as const
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
          subscription: 'free'
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

  const logout = () => {
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
        logout,
        updateProfile
      }}
    >
      {isClient ? children : <div>Loading...</div>}
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
