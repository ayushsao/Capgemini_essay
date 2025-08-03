'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import EssayTutor from './EssayTutor';

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'essay-writer'>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
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
