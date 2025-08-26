'use client';

import { useState, useEffect } from 'react';

interface EssayTimerProps {
  onTimeUp: () => void;
  onTimerStart?: () => void;
  onTimerStop?: () => void;
}

export default function EssayTimer({ onTimeUp, onTimerStart, onTimerStop }: EssayTimerProps) {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false);
            onTimeUp();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeLeft, onTimeUp]);

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
    onTimerStart?.();
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const stopTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(30 * 60); // Reset to 30 minutes
    onTimerStop?.();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 300) return 'text-red-600'; // Last 5 minutes - red
    if (timeLeft <= 600) return 'text-orange-600'; // Last 10 minutes - orange
    return 'text-green-600'; // More than 10 minutes - green
  };

  const getProgressPercent = () => {
    return ((30 * 60 - timeLeft) / (30 * 60)) * 100;
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl border-2 border-blue-100 p-6 shadow-md">
      <div className="text-center space-y-6">
        {/* Timer Display */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-center">
            <span className="mr-2">⏱️</span>
            Essay Timer
          </h3>
          <div className={`text-4xl font-mono font-bold ${getTimeColor()} bg-white rounded-lg py-3 px-4 shadow-sm border`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-gray-600 font-medium">
            {isActive ? (isPaused ? '⏸️ Paused' : '▶️ Writing Time') : '🎯 Ready to Start'}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Start</span>
            <span>30:00</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                timeLeft <= 300 ? 'bg-gradient-to-r from-red-400 to-red-600' : 
                timeLeft <= 600 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 
                'bg-gradient-to-r from-green-400 to-green-600'
              }`}
              style={{ width: `${getProgressPercent()}%` }}
            ></div>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center gap-3">
          {!isActive ? (
            <button
              onClick={startTimer}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <span>▶️</span>
              <span>Start Timer</span>
            </button>
          ) : (
            <>
              <button
                onClick={pauseTimer}
                className={`px-6 py-3 ${
                  isPaused 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                    : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
                } text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center space-x-2`}
              >
                <span>{isPaused ? '▶️' : '⏸️'}</span>
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
              <button
                onClick={stopTimer}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <span>⏹️</span>
                <span>Stop</span>
              </button>
            </>
          )}
        </div>

        {/* Timer Status Messages */}
        {timeLeft <= 300 && isActive && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 animate-pulse">
            <p className="text-sm text-red-800 font-medium flex items-center justify-center">
              <span className="mr-2">⚠️</span>
              Only {Math.floor(timeLeft / 60)} minutes left! Finish up your essay.
            </p>
          </div>
        )}
        
        {timeLeft <= 60 && isActive && (
          <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 animate-bounce">
            <p className="text-sm text-red-900 font-bold flex items-center justify-center">
              <span className="mr-2">🚨</span>
              Less than 1 minute remaining!
            </p>
          </div>
        )}

        {timeLeft === 0 && (
          <div className="bg-red-200 border-2 border-red-400 rounded-lg p-4">
            <p className="text-sm text-red-900 font-bold flex items-center justify-center">
              <span className="mr-2">⏰</span>
              Time's up! Please submit your essay.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
