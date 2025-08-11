'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserEssays, getUserStats } from '@/lib/essayStorage';
import { EssayHistory } from '@/types/user';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import EssayResults from './EssayResults';
import TransitionLoader from './TransitionLoader';
import UserManagement from './UserManagement';
import FirebaseTest from './FirebaseTest';
import UserProfile from './UserProfile';
import FeedbackDashboard from './FeedbackDashboard';
import { isCurrentUserAdmin } from '@/utils/adminUtils';

// Dashboard component for user analytics and essay management
// Updated for deployment compatibility
interface DashboardProps {
  onNavigateToEssayWriter: () => void;
  initialTab?: 'overview' | 'essays' | 'progress' | 'profile' | 'firebase' | 'feedback';
}

export default function Dashboard({ onNavigateToEssayWriter, initialTab = 'overview' }: DashboardProps) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'essays' | 'progress' | 'profile' | 'firebase' | 'feedback'>(initialTab);
  const [viewingEssay, setViewingEssay] = useState<EssayHistory | null>(null);
  const [essayHistory, setEssayHistory] = useState<EssayHistory[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [userStats, setUserStats] = useState({
    totalEssays: 0,
    averageScore: 0,
    improvementRate: 0,
    recentScores: [] as number[]
  });

  // Check if current user is admin
  const isAdmin = isCurrentUserAdmin(user);

  useEffect(() => {
    if (!user) return;
    
    // Load real essay data from localStorage
    const essays = getUserEssays(user.id);
    const stats = getUserStats(user.id);
    
    setEssayHistory(essays);
    setUserStats(stats);
  }, [user]);

  // Refresh data when component becomes visible (e.g., after saving an essay)
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        const essays = getUserEssays(user.id);
        const stats = getUserStats(user.id);
        setEssayHistory(essays);
        setUserStats(stats);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Handle tab switching with transition
  const handleTabChange = async (newTab: 'overview' | 'essays' | 'progress' | 'profile' | 'firebase' | 'feedback') => {
    if (newTab === activeTab) return;
    
    setIsTransitioning(true);
    
    // Small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setActiveTab(newTab);
    setIsTransitioning(false);
  };

  // Handle essay viewing with transition
  const handleViewEssay = async (essay: EssayHistory) => {
    setIsTransitioning(true);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setViewingEssay(essay);
    setIsTransitioning(false);
  };

  // Handle back to dashboard with transition
  const handleBackToDashboard = async () => {
    setIsTransitioning(true);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setViewingEssay(null);
    setIsTransitioning(false);
  };

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Enhanced Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden shadow-2xl">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-2xl">👋</span>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">Welcome back, {user?.name}!</h2>
                <p className="text-blue-100 text-sm sm:text-base opacity-90">Ready to elevate your writing to the next level?</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <button
                onClick={onNavigateToEssayWriter}
                className="group bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base touch-manipulation shadow-lg hover:shadow-xl border-2 border-transparent hover:border-white/20 cursor-pointer flex items-center space-x-2"
              >
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>Start Writing Now</span>
              </button>
              
              <div className="flex items-center space-x-4 text-white/80 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>System Online</span>
                </div>
                <div className="w-px h-4 bg-white/30"></div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>AI Ready</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block flex-shrink-0 ml-6">
            <div className="w-24 h-24 xl:w-32 xl:h-32 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl xl:text-5xl transform hover:scale-110 transition-transform duration-300">
              📚
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:scale-105 cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-xl sm:rounded-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Essays</p>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{userStats.totalEssays}</p>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl transition-all duration-300 hover:from-blue-600 hover:to-indigo-600 shadow-lg">
              <span className="text-xl sm:text-2xl">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 hover:shadow-xl hover:border-green-200 transition-all duration-300 transform hover:scale-105 cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-xl sm:rounded-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Average Score</p>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{userStats.averageScore}</p>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl transition-all duration-300 hover:from-green-600 hover:to-emerald-600 shadow-lg">
              <span className="text-xl sm:text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 hover:shadow-xl hover:border-green-200 transition-all duration-300 transform hover:scale-105 cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-xl sm:rounded-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Improvement</p>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {userStats.improvementRate > 0 ? '+' : ''}{userStats.improvementRate}%
              </p>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl transition-all duration-300 hover:from-green-600 hover:to-emerald-600 shadow-lg">
              <span className="text-xl sm:text-2xl">📈</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 hover:shadow-xl hover:border-purple-200 transition-all duration-300 transform hover:scale-105 cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-xl sm:rounded-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Subscription</p>
              <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent capitalize">{user?.subscription || 'Free'}</p>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl transition-all duration-300 hover:from-purple-600 hover:to-pink-600 shadow-lg">
              <span className="text-xl sm:text-2xl">👑</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      {userStats.totalEssays > 0 && (
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Recent Essay Scores</h3>
          <div className="w-full h-48 sm:h-64 lg:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userStats.recentScores.map((score, index) => ({
                essay: `Essay ${userStats.recentScores.length - index}`,
                score
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="essay" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 50]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Enhanced Message for new users */}
      {userStats.totalEssays === 0 && (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center relative overflow-hidden shadow-xl">
          {/* Background elements */}
          <div className="absolute inset-0">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-5xl sm:text-7xl mb-4 sm:mb-6 animate-bounce">�</div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-3 sm:mb-4">
              Ready to start your writing journey?
            </h3>
            <p className="text-blue-700 mb-6 sm:mb-8 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
              Write your first essay to unlock detailed analytics, track your progress, and improve your writing skills with AI-powered insights!
            </p>
            
            <div className="space-y-4 sm:space-y-6">
              <button
                onClick={onNavigateToEssayWriter}
                className="group bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white px-8 sm:px-12 py-4 sm:py-6 rounded-2xl font-bold hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 transition-all duration-500 transform hover:scale-110 active:scale-95 text-base sm:text-lg lg:text-xl touch-manipulation shadow-2xl hover:shadow-3xl border-2 border-transparent hover:border-white/20 cursor-pointer animate-pulse hover:animate-none relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Write Your First Essay</span>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-blue-600 font-medium">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>100% Free to start</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-blue-300"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Instant AI feedback</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-blue-300"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>No signup required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderEssays = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Essays</h2>
        <button
          onClick={onNavigateToEssayWriter}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm sm:text-base touch-manipulation w-full sm:w-auto shadow-lg hover:shadow-xl border-2 border-transparent hover:border-blue-400 cursor-pointer"
        >
          ✍️ Write New Essay
        </button>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {essayHistory.map((essay) => (
          <div 
            key={essay.id} 
            onClick={() => handleViewEssay(essay)}
            className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2 sm:gap-0">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{essay.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500">Created: {new Date(essay.createdAt).toLocaleDateString()}</p>
              </div>
              <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start ${getScoreColor(essay.analysis.totalMarks, essay.analysis.maxTotalMarks)}`}>
                {essay.analysis.totalMarks}/{essay.analysis.maxTotalMarks}
              </div>
            </div>
            
            <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">{essay.content}</p>
            
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 text-xs sm:text-sm mb-4">
              <div className="text-center">
                <p className="text-gray-500">Word Count</p>
                <p className="font-semibold">{essay.analysis.wordCount.score}/10</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">Spelling</p>
                <p className="font-semibold">{essay.analysis.spellingAccuracy.score}/10</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">Grammar</p>
                <p className="font-semibold">{essay.analysis.grammarEvaluation.score}/10</p>
              </div>
              <div className="text-center sm:block">
                <p className="text-gray-500">Backspace</p>
                <p className="font-semibold">{essay.analysis.backspaceScore.score}/10</p>
              </div>
              <div className="text-center sm:block">
                <p className="text-gray-500">Delete</p>
                <p className="font-semibold">{essay.analysis.deleteScore.score}/10</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-xs sm:text-sm text-gray-500">Click to view detailed analysis</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewEssay(essay);
                }}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
              >
                📖 View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Transition Loader */}
      {isTransitioning && <TransitionLoader message="Loading..." />}
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center min-w-0 flex-1">
              <div className="h-7 w-7 sm:h-8 sm:w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                <span className="text-white font-bold text-sm sm:text-base">📝</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-blue-600 truncate">EssayPolish</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {/* Admin button - only show for admin users */}
              {user?.email === 'ayushsao32@gmail.com' && (
                <div className="flex items-center space-x-2">
                  <span className="hidden sm:inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    👑 Admin
                  </span>
                  <button
                    onClick={() => setShowUserManagement(true)}
                    className="text-gray-500 hover:text-gray-700 transition duration-200 p-1 sm:p-0"
                    aria-label="User Management"
                    title="User Management - View All Registered Users"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* User Profile Component */}
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 relative z-10">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6 sm:mb-8">
          <nav className="-mb-px flex overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'essays', name: 'My Essays', icon: '📝' },
              { id: 'progress', name: 'Progress', icon: '📈' },
              { id: 'profile', name: 'Profile', icon: '👤' },
              ...(isAdmin ? [{ id: 'feedback', name: 'Feedback', icon: '💬' }] : []),
              ...(user?.email === 'ayushsao32@gmail.com' ? [{ id: 'firebase', name: 'Firebase Test', icon: '🔥' }] : [])
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as 'overview' | 'essays' | 'progress' | 'profile' | 'firebase' | 'feedback')}
                className={`py-2 px-3 sm:px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0 transform hover:scale-105 active:scale-95 cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50 rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 rounded-t-lg'
                }`}
              >
                <span className="mr-1 sm:mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {showUserManagement ? (
          <UserManagement onBack={() => setShowUserManagement(false)} />
        ) : viewingEssay ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Back button and header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleBackToDashboard()}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                ← Back to Essays
              </button>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(viewingEssay.analysis.totalMarks, viewingEssay.analysis.maxTotalMarks)}`}>
                Score: {viewingEssay.analysis.totalMarks}/{viewingEssay.analysis.maxTotalMarks}
              </div>
            </div>

            {/* Essay header */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{viewingEssay.title}</h1>
              <p className="text-sm text-gray-500 mb-4">Created: {new Date(viewingEssay.createdAt).toLocaleDateString()}</p>
              
              {/* Essay content */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Essay Content:</h3>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {viewingEssay.content}
                </div>
              </div>
            </div>

            {/* Detailed analysis */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Analysis</h2>
              <EssayResults analysis={viewingEssay.analysis} />
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'essays' && renderEssays()}
          </>
        )}
        
        {!viewingEssay && activeTab === 'progress' && userStats.totalEssays > 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Your Progress</h2>
            <div className="w-full h-64 sm:h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userStats.recentScores.map((score, index) => ({
                  essay: `Essay ${userStats.recentScores.length - index}`,
                  score
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="essay" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 50]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {!viewingEssay && activeTab === 'progress' && userStats.totalEssays === 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📈</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">No Progress Data Yet</h2>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Write at least 2 essays to see your progress tracking!</p>
            <button
              onClick={onNavigateToEssayWriter}
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm sm:text-base touch-manipulation shadow-lg hover:shadow-xl border-2 border-transparent hover:border-blue-400 cursor-pointer"
            >
              Start Writing Essays
            </button>
          </div>
        )}
        {!viewingEssay && activeTab === 'profile' && (
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Profile Settings</h2>
            <div className="max-w-md space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                <input
                  type="text"
                  value={user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base bg-gray-50"
                  readOnly
                />
              </div>
            </div>
          </div>
        )}

        {/* Feedback Management Tab */}
        {!viewingEssay && activeTab === 'feedback' && (
          <div className="space-y-4 sm:space-y-6">
            <FeedbackDashboard />
          </div>
        )}

        {/* Firebase Test Tab */}
        {!viewingEssay && activeTab === 'firebase' && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Firebase Test Panel</h2>
            <FirebaseTest />
          </div>
        )}
      </div>
    </div>
  );
}
