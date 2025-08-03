'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/user';

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
    name: 'John Doe',
    email: 'john@example.com',
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
  // Check if we're on the client side
  if (typeof window === 'undefined') {
    return [
      { email: 'john@example.com', password: 'password', userId: '1' },
      { email: 'jane@example.com', password: 'password', userId: '2' }
    ];
  }

  try {
    const stored = localStorage.getItem('user_credentials');
    if (stored) {
      return JSON.parse(stored);
    } else {
      // Initialize with default demo users if nothing is stored
      const defaultCredentials = [
        { email: 'john@example.com', password: 'password', userId: '1' },
        { email: 'jane@example.com', password: 'password', userId: '2' }
      ];
      localStorage.setItem('user_credentials', JSON.stringify(defaultCredentials));
      return defaultCredentials;
    }
  } catch (error) {
    // If there's any error, return and save default credentials
    const defaultCredentials = [
      { email: 'john@example.com', password: 'password', userId: '1' },
      { email: 'jane@example.com', password: 'password', userId: '2' }
    ];
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

  useEffect(() => {
    // Check for stored auth state
    // Ensure we're on the client side
    if (typeof window === 'undefined') {
      setAuthState(prev => ({ ...prev, loading: false }));
      return;
    }
    
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
      if (!user && typeof window !== 'undefined') {
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
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
        }
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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists in mockUsers or credentials
    const credentials = getStoredCredentials();
    if (mockUsers.find(u => u.email === email) || credentials.find(c => c.email === email)) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return false;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      joinDate: new Date().toISOString().split('T')[0],
      subscription: 'free'
    };
    
    // Save user credentials
    const newCredential: UserCredentials = {
      email,
      password,
      userId: newUser.id
    };
    
    const updatedCredentials = [...credentials, newCredential];
    saveCredentials(updatedCredentials);
    
    // Save user data to registered users storage
    if (typeof window !== 'undefined') {
      try {
        const storedUsers = localStorage.getItem('registered_users');
        const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
        registeredUsers.push(newUser);
        localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
      } catch (error) {
        console.error('Error saving registered user:', error);
      }
      
      localStorage.setItem('user', JSON.stringify(newUser));
    }
    
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      loading: false
    });
    return true;
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false
    });
  };

  const updateProfile = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
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
