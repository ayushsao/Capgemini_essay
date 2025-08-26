'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { getUsers } from '@/lib/firebaseServices';

interface UserManagementProps {
  onBack: () => void;
}

export default function UserManagement({ onBack }: UserManagementProps) {
  const { user: currentUser } = useAuth();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser || currentUser.email !== 'ayushsao32@gmail.com') {
      onBack();
      return;
    }
    loadUsers();
    
    const interval = setInterval(() => {
      loadUsers();
    }, 30000); // Refresh every 30 seconds for Firebase
    
    return () => clearInterval(interval);
  }, [currentUser, onBack]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get users from Firebase
      const firebaseUsers = await getUsers();
      console.log('Firebase users loaded:', firebaseUsers);
      
      // Include demo users for backward compatibility
      const demoUsers: User[] = [
        {
          id: 'demo-1',
          name: 'Ayush Admin',
          email: 'ayushsao32@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          joinDate: '2024-01-15',
          subscription: 'premium'
        },
        {
          id: 'demo-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          joinDate: '2024-02-20',
          subscription: 'free'
        }
      ];
      
      // Combine demo users and Firebase users
      const combinedUsers = [...demoUsers, ...firebaseUsers];
      setAllUsers(combinedUsers);
      
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users. Using fallback data.');
      
      // Fallback to demo users only
      const demoUsers: User[] = [
        {
          id: 'demo-1',
          name: 'Ayush Admin',
          email: 'ayushsao32@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          joinDate: '2024-01-15',
          subscription: 'premium'
        },
        {
          id: 'demo-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          joinDate: '2024-02-20',
          subscription: 'free'
        }
      ];
      setAllUsers(demoUsers);
    } finally {
      setLoading(false);
    }
  };

  const getUserStats = (userId: string) => {
    if (typeof window === 'undefined') return { essayCount: 0, lastActive: 'Never' };
    
    try {
      const essays = localStorage.getItem(`essays_${userId}`);
      const essayData = essays ? JSON.parse(essays) : [];
      
      const lastEssay = essayData.length > 0 ? essayData[essayData.length - 1] : null;
      const lastActive = lastEssay 
        ? new Date(lastEssay.timestamp).toLocaleDateString()
        : 'Never';
      
      return {
        essayCount: essayData.length,
        lastActive
      };
    } catch (error) {
      return { essayCount: 0, lastActive: 'Never' };
    }
  };

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case 'premium':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'pro':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const demoUsers = allUsers.filter(u => u.id.startsWith('demo-'));
  const registeredUsers = allUsers.filter(u => !u.id.startsWith('demo-'));
  const premiumUsers = allUsers.filter(u => u.subscription === 'premium');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Total Users: <span className="font-semibold text-blue-600">{allUsers.length}</span>
              </div>
              <button
                onClick={() => {
                  // Force refresh and clear any caches
                  if (typeof window !== 'undefined') {
                    console.log('Force refreshing user data...');
                    console.log('Current localStorage data:', {
                      registered_users: localStorage.getItem('registered_users'),
                      user_credentials: localStorage.getItem('user_credentials')
                    });
                  }
                  loadUsers();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 Refresh
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{allUsers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <span className="text-2xl">✨</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Demo Users</p>
                <p className="text-2xl font-bold text-gray-900">{demoUsers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Registered Users</p>
                <p className="text-2xl font-bold text-gray-900">{registeredUsers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <span className="text-2xl">👑</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Premium Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {premiumUsers.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Registered Users</h2>
            <p className="text-sm text-gray-600">Manage and view all users who have registered on your platform</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Essays</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allUsers.map((user) => {
                  const stats = getUserStats(user.id);
                  const isDemo = user.id.startsWith('demo-');
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                          ) : (
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white font-medium">{user.name[0]}</span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSubscriptionBadge(user.subscription || 'free')}`}>
                          {(user.subscription || 'free').charAt(0).toUpperCase() + (user.subscription || 'free').slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stats.essayCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stats.lastActive}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isDemo ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {isDemo ? 'Demo' : 'Registered'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {allUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">No users have registered yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
