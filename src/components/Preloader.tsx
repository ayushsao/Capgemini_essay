'use client';

import { useState, useEffect } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('Initializing...');

  const loadingTexts = [
    'Initializing...',
    'Loading Essay Analysis Engine...',
    'Setting up Grammar Checker...',
    'Preparing Writing Tools...',
    'Almost Ready...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        
        // Update text based on progress
        if (newProgress >= 20 && newProgress < 40) {
          setCurrentText(loadingTexts[1]);
        } else if (newProgress >= 40 && newProgress < 60) {
          setCurrentText(loadingTexts[2]);
        } else if (newProgress >= 60 && newProgress < 80) {
          setCurrentText(loadingTexts[3]);
        } else if (newProgress >= 80 && newProgress < 95) {
          setCurrentText(loadingTexts[4]);
        }

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center z-50">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-300/20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-300/30 rounded-full blur-xl animate-ping"></div>
      </div>

      <div className="relative z-10 text-center px-8">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
            <span className="text-4xl">📚</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Capgemini Essay Tutor
          </h1>
          <p className="text-blue-100 text-lg">
            AI-Powered Writing Assistant
          </p>
        </div>

        {/* Loading Animation */}
        <div className="mb-8">
          <div className="relative w-64 mx-auto">
            {/* Progress Bar Background */}
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              {/* Progress Bar Fill */}
              <div
                className="h-full bg-gradient-to-r from-white to-blue-200 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            {/* Progress Percentage */}
            <div className="mt-4 text-white font-semibold text-lg">
              {Math.round(progress)}%
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-blue-100 text-base sm:text-lg font-medium animate-pulse">
          {currentText}
        </div>

        {/* Loading Dots Animation */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Features Preview */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md mx-auto">
          <div className="text-center text-white/80">
            <div className="text-2xl mb-1">✍️</div>
            <div className="text-xs">Essay Writing</div>
          </div>
          <div className="text-center text-white/80">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-xs">Real-time Analysis</div>
          </div>
          <div className="text-center text-white/80">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-xs">Grammar Check</div>
          </div>
          <div className="text-center text-white/80">
            <div className="text-2xl mb-1">📈</div>
            <div className="text-xs">Progress Tracking</div>
          </div>
        </div>
      </div>
    </div>
  );
}
