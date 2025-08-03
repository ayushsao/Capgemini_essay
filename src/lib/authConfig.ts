// Environment configuration for debugging online login issues
export const AUTH_CONFIG = {
  // Admin credentials - these should always work
  ADMIN_EMAIL: 'ayushsao32@gmail.com',
  ADMIN_PASSWORD: 'password',
  
  // Environment detection
  isOnline: () => typeof window !== 'undefined' && 
    window.location.hostname !== 'localhost' && 
    window.location.hostname !== '127.0.0.1',
    
  // Debug mode - shows detailed logs
  debugMode: true,
  
  // Storage keys
  STORAGE_KEYS: {
    USER: 'user',
    CREDENTIALS: 'user_credentials',
    REGISTERED_USERS: 'registered_users'
  },
  
  // Fallback user data
  ADMIN_USER: {
    id: '1',
    name: 'Ayush Admin',
    email: 'ayushsao32@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    joinDate: '2024-01-15',
    subscription: 'premium' as const
  }
};

// Logging utility for debugging
export const authLog = (message: string, data?: any) => {
  if (AUTH_CONFIG.debugMode) {
    const env = AUTH_CONFIG.isOnline() ? 'ONLINE' : 'LOCAL';
    console.log(`🔐 [${env}] ${message}`, data || '');
  }
};
