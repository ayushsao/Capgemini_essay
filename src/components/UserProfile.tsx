'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfileProps {
  onNavigateToDashboard?: () => void;
  onNavigateToProfile?: () => void;
}

export default function UserProfile({ onNavigateToDashboard, onNavigateToProfile }: UserProfileProps) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ensure hydration safety
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user || !isClient) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getSubscriptionBadge = () => {
    if (user.subscription === 'premium') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          ⭐ Premium
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Free
      </span>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Icon Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 hover:shadow-md"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center space-x-2">
          {/* Avatar */}
          <div className="relative overflow-hidden">
            {user.avatar && user.avatar.trim() !== '' ? (
              <>
                <img
                  className="h-10 w-10 rounded-full border-2 border-white shadow-sm object-cover object-center"
                  src={user.avatar}
                  alt={user.name}
                  onError={(e) => {
                    // Silently handle avatar loading error
                    const target = e.currentTarget;
                    const fallback = target.parentElement?.querySelector('.avatar-fallback') as HTMLElement;
                    if (fallback) {
                      target.style.display = 'none';
                      fallback.classList.remove('hidden');
                      fallback.style.display = 'block';
                    }
                  }}
                />
                <div className="hidden avatar-fallback absolute inset-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm shadow-sm">
                  <div className="flex items-center justify-center h-full">
                    {getInitials(user.name)}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                {getInitials(user.name)}
              </div>
            )}
            {/* Online indicator */}
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          
          {/* User info (hidden on mobile) */}
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          {/* Dropdown arrow */}
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {user.avatar && user.avatar.trim() !== '' ? (
                <>
                  <img
                    className="h-12 w-12 rounded-full object-cover object-center flex-shrink-0"
                    src={user.avatar}
                    alt={user.name}
                    onError={(e) => {
                      // Silently handle dropdown avatar loading error
                      const target = e.currentTarget;
                      const fallback = target.parentElement?.querySelector('.dropdown-avatar-fallback') as HTMLElement;
                      if (fallback) {
                        target.style.display = 'none';
                        fallback.classList.remove('hidden');
                        fallback.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="hidden dropdown-avatar-fallback h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold flex-shrink-0">
                    <div className="flex items-center justify-center h-full">
                      {getInitials(user.name)}
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {getInitials(user.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {user.email}
                </p>
                <div className="mt-1">
                  {getSubscriptionBadge()}
                </div>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Joined:</span>
                <span className="font-medium">{new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Auth Method:</span>
                <span className="font-medium capitalize">
                  {user.authProvider === 'google' ? '🔗 Google' : '📧 Email'}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Options */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                onNavigateToProfile?.() || onNavigateToDashboard?.();
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              View Profile
            </button>
            
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                onNavigateToProfile?.() || onNavigateToDashboard?.();
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>

            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                logout();
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-200"
            >
              <svg className="h-5 w-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
