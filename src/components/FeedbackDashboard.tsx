'use client';

import { useState, useEffect } from 'react';

interface FeedbackItem {
  id: string;
  feedback: string;
  email?: string;
  rating: number;
  category: string;
  timestamp: string;
  status: 'new' | 'reviewed' | 'resolved';
}

export default function FeedbackDashboard() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'new' | 'reviewed' | 'resolved'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Load feedback from localStorage (temporary storage)
  useEffect(() => {
    const savedFeedbacks = localStorage.getItem('essaypolish_feedbacks');
    console.log('🔍 Loading feedbacks from localStorage:', savedFeedbacks);
    
    if (savedFeedbacks) {
      try {
        const parsedFeedbacks = JSON.parse(savedFeedbacks);
        console.log('✅ Parsed feedbacks:', parsedFeedbacks);
        setFeedbacks(parsedFeedbacks);
      } catch (error) {
        console.error('❌ Error parsing feedbacks:', error);
        setFeedbacks([]);
      }
    } else {
      console.log('ℹ️ No feedbacks found in localStorage');
      setFeedbacks([]);
    }
  }, []);

  const updateFeedbackStatus = (id: string, status: 'new' | 'reviewed' | 'resolved') => {
    const updatedFeedbacks = feedbacks.map(item => 
      item.id === id ? { ...item, status } : item
    );
    setFeedbacks(updatedFeedbacks);
    localStorage.setItem('essaypolish_feedbacks', JSON.stringify(updatedFeedbacks));
  };

  const deleteFeedback = (id: string) => {
    const updatedFeedbacks = feedbacks.filter(item => item.id !== id);
    setFeedbacks(updatedFeedbacks);
    localStorage.setItem('essaypolish_feedbacks', JSON.stringify(updatedFeedbacks));
  };

  // Add test feedback for debugging
  const addTestFeedback = () => {
    const testFeedback: FeedbackItem = {
      id: Date.now().toString(),
      feedback: 'This is a test feedback to verify the system is working!',
      email: 'test@example.com',
      rating: 5,
      category: 'general',
      timestamp: new Date().toISOString(),
      status: 'new'
    };
    
    const updatedFeedbacks = [testFeedback, ...feedbacks];
    setFeedbacks(updatedFeedbacks);
    localStorage.setItem('essaypolish_feedbacks', JSON.stringify(updatedFeedbacks));
    console.log('✅ Test feedback added:', testFeedback);
  };

  // Refresh feedbacks from localStorage
  const refreshFeedbacks = () => {
    const savedFeedbacks = localStorage.getItem('essaypolish_feedbacks');
    console.log('🔄 Refreshing feedbacks:', savedFeedbacks);
    if (savedFeedbacks) {
      setFeedbacks(JSON.parse(savedFeedbacks));
    }
  };

  const filteredFeedbacks = feedbacks.filter(item => {
    const statusMatch = filter === 'all' || item.status === filter;
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    return statusMatch && categoryMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const stats = {
    total: feedbacks.length,
    new: feedbacks.filter(f => f.status === 'new').length,
    reviewed: feedbacks.filter(f => f.status === 'reviewed').length,
    resolved: feedbacks.filter(f => f.status === 'resolved').length,
    avgRating: feedbacks.length > 0 ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1) : '0'
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback Management</h1>
            <p className="text-gray-600">Manage and respond to user feedback for EssayPolish</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={refreshFeedbacks}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Refresh
            </button>
            <button
              onClick={addTestFeedback}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              ➕ Add Test
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Feedback</div>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl shadow-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
          <div className="text-sm text-blue-600">New</div>
        </div>
        <div className="bg-yellow-50 p-6 rounded-xl shadow-lg">
          <div className="text-2xl font-bold text-yellow-600">{stats.reviewed}</div>
          <div className="text-sm text-yellow-600">Reviewed</div>
        </div>
        <div className="bg-green-50 p-6 rounded-xl shadow-lg">
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          <div className="text-sm text-green-600">Resolved</div>
        </div>
        <div className="bg-purple-50 p-6 rounded-xl shadow-lg">
          <div className="text-2xl font-bold text-purple-600">{stats.avgRating}</div>
          <div className="text-sm text-purple-600">Avg Rating</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="feature">Feature Request</option>
              <option value="bug">Bug Report</option>
              <option value="ui">UI/UX</option>
              <option value="performance">Performance</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Debug Information */}
      <div className="bg-gray-50 rounded-xl shadow-lg p-4">
        <details className="cursor-pointer">
          <summary className="font-medium text-gray-700 mb-2">🔍 Debug Information</summary>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Total feedbacks loaded:</strong> {feedbacks.length}</p>
            <p><strong>Filtered feedbacks:</strong> {filteredFeedbacks.length}</p>
            <p><strong>Current filter:</strong> {filter}</p>
            <p><strong>Current category:</strong> {selectedCategory}</p>
            <p><strong>localStorage key:</strong> essaypolish_feedbacks</p>
            <div className="mt-2">
              <strong>Raw localStorage data:</strong>
              <pre className="bg-white p-2 rounded border text-xs overflow-auto max-h-32">
                {localStorage.getItem('essaypolish_feedbacks') || 'No data found'}
              </pre>
            </div>
          </div>
        </details>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
            <p className="text-gray-600">Users haven't submitted any feedback yet, or no feedback matches your filters.</p>
          </div>
        ) : (
          filteredFeedbacks.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                    {item.category}
                  </span>
                  <div className="text-lg">
                    {getRatingStars(item.rating)}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-900 leading-relaxed">{item.feedback}</p>
                {item.email && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Contact:</strong> {item.email}
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                <select
                  value={item.status}
                  onChange={(e) => updateFeedbackStatus(item.id, e.target.value as any)}
                  className="px-3 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </select>
                <button
                  onClick={() => deleteFeedback(item.id)}
                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
                {item.email && (
                  <a
                    href={`mailto:${item.email}?subject=Re: Your feedback about EssayPolish`}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Reply
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
