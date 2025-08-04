'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import EssayTutor from './EssayTutor';
import Preloader from './Preloader';
import UserProfile from './UserProfile';

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'essay-writer'>('dashboard');
  const [showPreloader, setShowPreloader] = useState(true);
  const [appReady, setAppReady] = useState(false);

  // Simulate initial app loading
  useEffect(() => {
    if (!loading) {
      setAppReady(true);
    }
  }, [loading]);

  // Show preloader on first load or when loading auth state
  if (showPreloader || loading) {
    return <Preloader onComplete={() => setShowPreloader(false)} />;
  }

  if (!isAuthenticated) {
    return (
      <LoginForm 
        isLogin={isLoginMode} 
        onToggleMode={() => setIsLoginMode(!isLoginMode)} 
      />
    );
  }

  if (currentView === 'essay-writer') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="text-blue-600 hover:text-blue-800 mr-4 transition duration-200"
                >
                  ← Back to Dashboard
                </button>
                <h1 className="text-2xl font-bold text-blue-600">
                  Capgemini Essay Writing Tutor
                </h1>
              </div>
              
              {/* User Profile in top-right */}
              <UserProfile />
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EssayTutor />
        </main>
      </div>
    );
  }

  return (
    <Dashboard onNavigateToEssayWriter={() => setCurrentView('essay-writer')} />
  );
}
