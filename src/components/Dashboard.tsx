'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserEssays, getUserStats } from '@/lib/essayStorage';
import { EssayHistory, UserProgress } from '@/types/user';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardProps {
  onNavigateToEssayWriter: () => void;
}

export default function Dashboard({ onNavigateToEssayWriter }: DashboardProps) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'essays' | 'progress' | 'profile'>('overview');
  const [essayHistory, setEssayHistory] = useState<EssayHistory[]>([]);
  const [userStats, setUserStats] = useState({
    totalEssays: 0,
    averageScore: 0,
    improvementRate: 0,
    recentScores: [] as number[]
  });

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

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg sm:rounded-xl p-4 sm:p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">Welcome back, {user?.name}! 👋</h2>
            <p className="text-blue-100 mb-3 sm:mb-4 text-sm sm:text-base">Ready to improve your writing skills today?</p>
            <button
              onClick={onNavigateToEssayWriter}
              className="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-50 transition duration-200 transform hover:scale-105 text-sm sm:text-base touch-manipulation"
            >
              ✍️ Start Writing
            </button>
          </div>
          <div className="hidden md:block flex-shrink-0 ml-4">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-blue-500 rounded-full flex items-center justify-center text-3xl lg:text-4xl">
              📚
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Essays</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900">{userStats.totalEssays}</p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
              <span className="text-lg sm:text-2xl">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900">{userStats.averageScore}</p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-full">
              <span className="text-lg sm:text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Improvement</p>
              <p className="text-xl sm:text-3xl font-bold text-green-600">
                {userStats.improvementRate > 0 ? '+' : ''}{userStats.improvementRate}%
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 rounded-full">
              <span className="text-lg sm:text-2xl">📈</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Subscription</p>
              <p className="text-sm sm:text-lg font-bold text-purple-600 capitalize">{user?.subscription || 'Free'}</p>
            </div>
            <div className="p-2 sm:p-3 bg-purple-100 rounded-full">
              <span className="text-lg sm:text-2xl">👑</span>
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

      {/* Message for new users */}
      {userStats.totalEssays === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-8 text-center">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📝</div>
          <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-2">Ready to start your writing journey?</h3>
          <p className="text-blue-600 mb-3 sm:mb-4 text-sm sm:text-base">Write your first essay to see detailed analytics and track your progress!</p>
          <button
            onClick={onNavigateToEssayWriter}
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200 text-sm sm:text-base touch-manipulation"
          >
            Write Your First Essay
          </button>
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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm sm:text-base touch-manipulation w-full sm:w-auto"
        >
          ✍️ Write New Essay
        </button>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {essayHistory.map((essay) => (
          <div key={essay.id} className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition duration-200">
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
            
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 text-xs sm:text-sm">
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
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center min-w-0 flex-1">
              <div className="h-7 w-7 sm:h-8 sm:w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                <span className="text-white font-bold text-sm sm:text-base">📝</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-blue-600 truncate">Capgemini Essay Tutor</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <div className="hidden sm:flex items-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full mr-2" />
                ) : (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-sm font-bold">{user?.name?.[0]}</span>
                  </div>
                )}
                <span className="text-gray-700 mr-4 text-sm lg:text-base">{user?.name}</span>
              </div>
              
              {/* Mobile user info */}
              <div className="sm:hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full" />
                ) : (
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user?.name?.[0]}</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700 transition duration-200 p-1 sm:p-0"
                aria-label="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6 sm:mb-8">
          <nav className="-mb-px flex overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'essays', name: 'My Essays', icon: '📝' },
              { id: 'progress', name: 'Progress', icon: '📈' },
              { id: 'profile', name: 'Profile', icon: '👤' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3 sm:px-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition duration-200 flex-shrink-0`}
              >
                <span className="mr-1 sm:mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'essays' && renderEssays()}
        {activeTab === 'progress' && userStats.totalEssays > 0 && (
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
        {activeTab === 'progress' && userStats.totalEssays === 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 text-center">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📈</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">No Progress Data Yet</h2>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Write at least 2 essays to see your progress tracking!</p>
            <button
              onClick={onNavigateToEssayWriter}
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200 text-sm sm:text-base touch-manipulation"
            >
              Start Writing Essays
            </button>
          </div>
        )}
        {activeTab === 'profile' && (
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
      </div>
    </div>
  );
}
