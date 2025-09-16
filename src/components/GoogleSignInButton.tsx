'use client';

import { useState } from 'react';

interface GoogleSignInButtonProps {
  onSignIn: () => Promise<boolean>;
  loading?: boolean;
}

export default function GoogleSignInButton({ onSignIn, loading = false }: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    console.log('🔍 Google Sign-In button clicked');
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if we're in a secure context (required for Firebase Auth)
      if (typeof window !== 'undefined' && !window.isSecureContext && window.location.protocol !== 'http:') {
        throw new Error('Google Sign-In requires a secure context (HTTPS) or localhost');
      }
      
      console.log('🌐 Environment check:', {
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        isSecureContext: window.isSecureContext
      });
      
      const result = await onSignIn();
      console.log('🎯 Google Sign-In result:', result);
      
      if (!result) {
        setError('Google Sign-In failed. Please try again or use email sign-in.');
        console.error('❌ Google Sign-In failed');
      }
    } catch (error: any) {
      console.error('💥 Google Sign-In error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Provide user-friendly error messages
      if (errorMessage.includes('popup')) {
        setError('Popup was blocked or closed. Please allow popups and try again.');
      } else if (errorMessage.includes('network')) {
        setError('Network error. Please check your connection and try again.');
      } else if (errorMessage.includes('unauthorized-domain')) {
        setError('This website is not authorized for Google Sign-In. Please contact support.');
      } else if (errorMessage.includes('secure context')) {
        setError('Google Sign-In requires HTTPS. Please use email sign-in instead.');
      } else {
        setError('Google Sign-In failed. Please try email sign-in instead.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl p-3 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <span className="text-red-400 text-sm mt-0.5">⚠️</span>
              <p className="text-sm text-red-700 leading-relaxed flex-1">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600 transition-colors ml-2 flex-shrink-0"
              aria-label="Dismiss error"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading || isLoading}
        className="w-full flex justify-center items-center py-4 sm:py-5 px-4 border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm bg-white/80 backdrop-blur-sm text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
      >
        {isLoading ? (
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
            <span>Connecting to Google...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </div>
        )}
      </button>
    </div>
  );
}
