'use client';

/*
 * Capgemini Essay Writing Tutor
 * © 2025 Ayush Kumar Sao. All rights reserved.
 * 
 * A comprehensive essay analysis and writing improvement platform
 */

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Enhanced Header with Gradient and Animation */}
        <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-blue-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="group flex items-center space-x-2 text-blue-600 hover:text-blue-800 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="font-medium">Dashboard</span>
                </button>
                
                <div className="h-8 w-px bg-gradient-to-b from-blue-200 to-purple-200"></div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Essay Writing Tutor
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">Powered by Capgemini</p>
                  </div>
                </div>
              </div>
              
              {/* Enhanced User Profile */}
              <div className="transform hover:scale-105 transition-transform duration-300">
                <UserProfile />
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content with Enhanced Styling */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-fade-in">
            <EssayTutor />
          </div>
        </main>
        
        {/* Enhanced Footer with Gradient */}
        <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white py-8 mt-12 relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-20 w-40 h-40 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Capgemini Essay Writing Tutor
                </h3>
              </div>
              
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <div className="space-y-2">
                <p className="text-white/90 font-medium">
                  © 2025 <span className="font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Ayush Kumar Sao</span>
                </p>
                <p className="text-white/60 text-sm">
                  All rights reserved • Empowering writers with AI-powered insights
                </p>
              </div>
              
              <div className="flex items-center justify-center space-x-6 pt-4">
                <div className="flex items-center space-x-2 text-white/70">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs">Secure Platform</span>
                </div>
                <div className="flex items-center space-x-2 text-white/70">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-xs">AI-Powered</span>
                </div>
                <div className="flex items-center space-x-2 text-white/70">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-xs">Made with Care</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <Dashboard onNavigateToEssayWriter={() => setCurrentView('essay-writer')} />
  );
}
