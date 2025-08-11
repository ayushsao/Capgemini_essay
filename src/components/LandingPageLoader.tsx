'use client';

import { useEffect, useState } from 'react';

export default function LandingPageLoader() {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    "🚀 Preparing your writing environment...",
    "🧠 Loading AI analysis engines...",
    "📊 Setting up progress tracking...",
    "✨ Almost ready to polish your essays!"
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, [tips.length]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center z-50">
      {/* Background animation */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto px-6">
        {/* Logo */}
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-500 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-60 animate-pulse"></div>
            <span className="text-white text-3xl font-bold relative z-10">📝</span>
          </div>
        </div>

        {/* Brand name */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2">
          EssayPolish
        </h1>
        <p className="text-gray-600 mb-8">Professional Writing Tutor</p>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-500">{progress}%</div>
        </div>

        {/* Loading tips */}
        <div className="h-8 flex items-center justify-center">
          <p className="text-gray-600 text-sm animate-pulse">
            {tips[currentTip]}
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
