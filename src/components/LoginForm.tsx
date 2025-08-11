'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import GoogleSignInButton from './GoogleSignInButton';
import GoogleSignInDiagnostics from './GoogleSignInDiagnostics';

interface LoginFormProps {
  onToggleMode: () => void;
  isLogin: boolean;
}

export default function LoginForm({ onToggleMode, isLogin }: LoginFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { login, register, loginWithGoogle, loading } = useAuth();

  // Ensure form starts completely empty on mount
  useEffect(() => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  }, []);

  // Update form data when switching between login and signup modes
  useEffect(() => {
    // Clear any potential cached values
    if (typeof window !== 'undefined') {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const form = document.querySelector('form');
        if (form) {
          form.reset();
          // Force clear all inputs
          const inputs = form.querySelectorAll('input');
          inputs.forEach(input => {
            input.value = '';
            input.setAttribute('value', '');
          });
        }
      }, 10);
    }
    
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError(''); // Clear any errors when switching modes
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isLogin && formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      let success;
      if (isLogin) {
        success = await login(formData.email, formData.password);
        if (!success) {
          setError('Invalid email or password. Please check your credentials and try again.');
        }
      } else {
        success = await register(formData.name, formData.email, formData.password);
        if (!success) {
          setError('Email already exists');
        }
      }
      
      if (success) {
        // Clear form on successful login/register
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4 px-4 sm:py-8 lg:py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-red-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl space-y-6 sm:space-y-8 relative z-10">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-xl transform hover:scale-110 transition-all duration-500 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-60 animate-pulse"></div>
            <span className="text-white text-lg sm:text-xl font-bold relative z-10">📝</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight mb-2">
            EssayPolish
          </h1>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            {isLogin ? 'Welcome back!' : 'Join EssayPolish'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed px-2 max-w-sm mx-auto">
            {isLogin 
              ? 'Continue your journey to better writing' 
              : 'Start your writing improvement journey'
            }
          </p>
          
          {/* Trust Badges */}
          <div className="flex justify-center items-center space-x-3 mt-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Free</span>
            </div>
            <div className="w-px h-3 bg-gray-300"></div>
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secure</span>
            </div>
            <div className="w-px h-3 bg-gray-300"></div>
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>AI-Powered</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form 
          key={isLogin ? 'login' : 'signup'} // Force re-render when mode changes
          className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 bg-white/90 backdrop-blur-lg p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl border border-white/20 relative overflow-hidden" 
          onSubmit={handleSubmit}
          autoComplete="off"
          noValidate
        >
          {/* Form background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-blue-50/50 rounded-xl sm:rounded-2xl"></div>
          
          <div className="relative z-10 space-y-3 sm:space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="words"
                  spellCheck="false"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-sm transition-all duration-300 shadow-sm hover:border-blue-300 hover:shadow-md bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-sm transition-all duration-300 shadow-sm hover:border-blue-300 hover:shadow-md bg-white/50 backdrop-blur-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-sm transition-all duration-300 shadow-sm hover:border-blue-300 hover:shadow-md bg-white/50 backdrop-blur-sm"
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  required={!isLogin}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-sm transition-all duration-300 shadow-sm hover:border-blue-300 hover:shadow-md bg-white/50 backdrop-blur-sm"
                  placeholder="Confirm your password"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="relative z-10 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg">
              <div className="flex items-start">
                <span className="text-red-400 mr-3 mt-0.5 text-lg">⚠️</span>
                <p className="text-sm sm:text-base text-red-700 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          <div className="relative z-10">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] touch-manipulation overflow-hidden"
            >
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    {isLogin ? (
                      <>
                        <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Sign In to Your Account
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Create Your Free Account
                      </>
                    )}
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <div>
            <GoogleSignInButton 
              onSignIn={loginWithGoogle}
              loading={loading}
            />
          </div>

          <div className="text-center pt-5 relative z-20">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                console.log('Toggle button clicked, isLogin:', isLogin);
                onToggleMode();
              }}
              className="inline-block text-sm text-blue-600 hover:text-blue-800 font-medium transition-all duration-300 hover:underline cursor-pointer px-3 py-1.5 rounded hover:bg-blue-50 border border-transparent hover:border-blue-200"
            >
              {isLogin 
                ? "Don't have an account? Sign up for free" 
                : "Already have an account? Sign in here"
              }
            </button>
          </div>
        </form>

        {/* Enhanced Features Section */}
        <div className="mt-6 sm:mt-8 lg:mt-10 bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/20 relative overflow-hidden">
          {/* Features background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-2xl sm:rounded-3xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Why choose EssayPolish?
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Join thousands of writers improving their skills daily
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 hover:border-green-200 transition-all duration-300 transform hover:scale-105">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Real-time Grammar Analysis</h4>
                  <span className="text-sm text-gray-600 leading-relaxed">Advanced AI detects errors as you type</span>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 hover:border-blue-200 transition-all duration-300 transform hover:scale-105">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Detailed Scoring & Feedback</h4>
                  <span className="text-sm text-gray-600 leading-relaxed">Comprehensive analysis with actionable insights</span>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 hover:border-purple-200 transition-all duration-300 transform hover:scale-105">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Progress Tracking</h4>
                  <span className="text-sm text-gray-600 leading-relaxed">Monitor improvement with visual analytics</span>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100 hover:border-orange-200 transition-all duration-300 transform hover:scale-105">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Professional Writing Guidance</h4>
                  <span className="text-sm text-gray-600 leading-relaxed">Expert tips and best practices included</span>
                </div>
              </div>
            </div>
            
            {/* Additional features row */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-100">
                <div className="text-2xl mb-2">🔒</div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">100% Secure</h4>
                <p className="text-xs text-gray-600">Your data is always protected</p>
              </div>
              
              <div className="text-center p-4 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-100">
                <div className="text-2xl mb-2">⚡</div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">Lightning Fast</h4>
                <p className="text-xs text-gray-600">Instant analysis & feedback</p>
              </div>
              
              <div className="text-center p-4 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-100">
                <div className="text-2xl mb-2">🎓</div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">Expert-Level</h4>
                <p className="text-xs text-gray-600">Professional writing standards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
