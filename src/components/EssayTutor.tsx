'use client';

import { useState, useEffect } from 'react';
import EssayEditor from './EssayEditor';
import EssayResults from './EssayResults';
import EssayTimer from './EssayTimer';
import ClientOnly from './ClientOnly';
import { analyzeEssay, analyzeEssayWithAPI, analyzeEssayWithAdvancedGrammar } from '@/lib/essayAnalysis';
import { saveEssay } from '@/lib/essayStorage';
import { useAuth } from '@/contexts/AuthContext';
import { EssayAnalysis } from '@/types/essay';

export default function EssayTutor() {
  const { user } = useAuth();
  const [essay, setEssay] = useState('');
  const [analysis, setAnalysis] = useState<EssayAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [useAPIAnalysis, setUseAPIAnalysis] = useState(true); // Toggle for using API
  const useAdvancedGrammar = true; // Always use advanced grammar
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [essayTitle, setEssayTitle] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showRealTimeAnalysis, setShowRealTimeAnalysis] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Real-time analysis with debouncing (only if enabled)
  useEffect(() => {
    if (!showRealTimeAnalysis || essay.trim().length === 0) {
      if (!isSubmitted) {
        setAnalysis(null);
      }
      return;
    }

    setIsAnalyzing(true);
    const debounceTimer = setTimeout(async () => {
      try {
        const result = useAPIAnalysis 
          ? await analyzeEssayWithAdvancedGrammar(essay, useAdvancedGrammar)
          : analyzeEssay(essay);
        setAnalysis(result);
      } catch (error) {
        console.warn('API analysis failed, falling back to local analysis:', error);
        const result = analyzeEssay(essay);
        setAnalysis(result);
      }
      setIsAnalyzing(false);
    }, 1000); // 1 second debounce

    return () => clearTimeout(debounceTimer);
  }, [essay, showRealTimeAnalysis, isSubmitted, useAPIAnalysis]);

  const handleSubmitEssay = async () => {
    if (essay.trim().length < 10) {
      alert('Please write at least 10 words before submitting your essay.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = useAPIAnalysis 
        ? await analyzeEssayWithAdvancedGrammar(essay, useAdvancedGrammar)
        : analyzeEssay(essay);
      setAnalysis(result);
      setIsSubmitted(true);
    } catch (error) {
      console.warn('API analysis failed, falling back to local analysis:', error);
      const result = analyzeEssay(essay);
      setAnalysis(result);
      setIsSubmitted(true);
    }
    setIsAnalyzing(false);
  };

  const handleStartNewEssay = () => {
    setEssay('');
    setEssayTitle('');
    setAnalysis(null);
    setLastSaved(null);
    setIsSubmitted(false);
    setShowRealTimeAnalysis(false);
    setTimerEnabled(false);
    setIsTimerActive(false);
  };

  const handleSaveEssay = async () => {
    if (!user || !analysis || essay.trim().length < 20) {
      alert('Please write at least 20 words before saving your essay.');
      return;
    }

    setIsSaving(true);
    try {
      const savedEssay = saveEssay(user.id, essayTitle, essay, analysis);
      setLastSaved(new Date().toLocaleTimeString());
      
      // Show success message
      alert(`Essay "${savedEssay.title}" saved successfully! Check your dashboard to see updated stats.`);
      
      // Optionally clear the editor for a new essay
      if (confirm('Would you like to start a new essay?')) {
        handleStartNewEssay();
      }
    } catch (error) {
      console.error('Error saving essay:', error);
      alert('Error saving essay. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const canSubmitEssay = essay.trim().length >= 10 && !isSubmitted;
  const canSaveEssay = user && analysis && essay.trim().length >= 20;

  // Timer handlers
  const handleTimerTimeUp = () => {
    alert('⏰ Time\'s up! Your 30 minutes are over. Please submit your essay now.');
    setIsTimerActive(false);
    // Auto-submit if there's content
    if (essay.trim().length >= 10) {
      handleSubmitEssay();
    }
  };

  const handleTimerStart = () => {
    setIsTimerActive(true);
  };

  const handleTimerStop = () => {
    setIsTimerActive(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Timer Section */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-6">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-3">
              <h2 className="text-base sm:text-lg font-medium text-gray-800 leading-tight">✍️ Writing Session</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTimerEnabled(!timerEnabled)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-full font-medium transition-all duration-300 self-start sm:self-auto ${
                    timerEnabled 
                      ? 'bg-blue-100 text-blue-800 border border-blue-300 shadow-sm' 
                      : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {timerEnabled ? '⏱️ Timer ON' : '⏱️ Timer OFF'}
                </button>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {timerEnabled 
                ? '🎯 Challenge yourself with a 30-minute timed writing session! Perfect for practicing under time pressure.' 
                : '💡 Click "Timer ON" to enable 30-minute timed mode and improve your writing speed.'
            }
            </p>
          </div>
          
          {timerEnabled && (
            <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
              <ClientOnly fallback={
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl border-2 border-blue-100 p-6 shadow-md">
                  <div className="text-center space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-center">
                        <span className="mr-2">⏱️</span>
                        Essay Timer
                      </h3>
                      <div className="text-4xl font-mono font-bold text-green-600 bg-white rounded-lg py-3 px-4 shadow-sm border">
                        30:00
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        🎯 Ready to Start
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Start</span>
                        <span>30:00</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">Loading timer...</div>
                  </div>
                </div>
              }>
                <EssayTimer 
                  onTimeUp={handleTimerTimeUp}
                  onTimerStart={handleTimerStart}
                  onTimerStop={handleTimerStop}
                />
              </ClientOnly>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">
        {/* Essay Editor */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 lg:gap-6 mb-6 lg:mb-8">
              <h2 className="text-base sm:text-lg font-medium text-gray-800 leading-tight">✍️ Write Your Essay</h2>
              <div className="flex flex-wrap gap-3 lg:gap-4">
                {!isSubmitted && (
                  <button
                    onClick={handleSubmitEssay}
                    disabled={!canSubmitEssay || isAnalyzing}
                    className={`px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-medium rounded-lg lg:rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      canSubmitEssay && !isAnalyzing
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isAnalyzing ? '⏳ Analyzing...' : '📝 Submit Essay'}
                  </button>
                )}
                {isSubmitted && (
                  <button
                    onClick={handleStartNewEssay}
                    className="px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg lg:rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    ✨ New Essay
                  </button>
                )}
                {user && (
                  <button
                    onClick={handleSaveEssay}
                    disabled={!canSaveEssay || isSaving}
                    className={`px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg rounded-lg lg:rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      canSaveEssay && !isSaving
                        ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isSaving ? '💾 Saving...' : '💾 Save Essay'}
                  </button>
                )}
              </div>
            </div>
            
            {user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 lg:mb-8">
                <label htmlFor="essayTitle" className="block text-sm sm:text-base lg:text-lg font-medium text-blue-800 mb-3">
                  📝 Essay Title (Optional)
                </label>
                <input
                  id="essayTitle"
                  type="text"
                  value={essayTitle}
                  onChange={(e) => setEssayTitle(e.target.value)}
                  placeholder="Enter a compelling title for your essay..."
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg border border-blue-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                {lastSaved && (
                  <p className="text-sm sm:text-base text-green-600 mt-3 flex items-center">
                    <span className="mr-2">✅</span>
                    Last saved at {lastSaved}
                  </p>
                )}
              </div>
            )}
            
            <EssayEditor 
              value={essay} 
              onChange={setEssay}
              isAnalyzing={isAnalyzing}
              disabled={isSubmitted}
            />
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
            <h2 className="text-base sm:text-lg font-medium text-gray-800 mb-4 sm:mb-6 flex items-center leading-tight">
              <span className="mr-2">📊</span>
              Essay Analysis
            </h2>
            
            {isSubmitted && analysis ? (
              <div className="space-y-6 lg:space-y-8">
                {/* Score Highlight */}
                <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white text-center shadow-lg">
                  <h3 className="text-lg sm:text-xl font-bold mb-3">🎉 Your Essay Score</h3>
                  <div className="text-3xl sm:text-4xl font-bold mb-3">{analysis.totalMarks}/{analysis.maxTotalMarks}</div>
                  <div className="text-base sm:text-lg opacity-90">
                    {analysis.totalMarks >= 40 ? '🌟 Excellent!' : 
                     analysis.totalMarks >= 30 ? '👍 Good Work!' : 
                     analysis.totalMarks >= 20 ? '📈 Keep Improving!' : 
                     '💪 Practice More!'}
                  </div>
                </div>
                <EssayResults analysis={analysis} />
              </div>
            ) : analysis ? (
              <div className="space-y-4 lg:space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <p className="text-sm sm:text-base lg:text-lg text-yellow-800 flex items-center">
                    <span className="mr-3">🔄</span>
                    Live Preview - Submit essay for final score
                  </p>
                </div>
                <EssayResults analysis={analysis} />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-200 p-8 sm:p-10 lg:p-12 text-center text-gray-500">
                <div className="mb-6 lg:mb-8">
                  <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 lg:mb-6">📝</div>
                  <h3 className="text-base sm:text-lg font-medium mb-3 text-gray-700 leading-tight">Ready to Get Your Score?</h3>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
                    {essay.trim().length < 10 
                      ? `✍️ Write at least 10 words to get started (currently ${essay.trim().split(' ').filter(word => word.length > 0).length} words)`
                      : '🚀 Click "Submit Essay" to see your detailed analysis and score'
                    }
                  </p>
                </div>
                {essay.trim().length >= 10 && !isSubmitted && (
                  <button
                    onClick={handleSubmitEssay}
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg rounded-lg sm:rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    📊 Get My Score Now
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
    </div>
    </div>
  );
}
