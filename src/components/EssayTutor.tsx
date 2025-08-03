'use client';

import { useState, useEffect } from 'react';
import EssayEditor from './EssayEditor';
import EssayResults from './EssayResults';
import { analyzeEssay } from '@/lib/essayAnalysis';
import { saveEssay } from '@/lib/essayStorage';
import { useAuth } from '@/contexts/AuthContext';
import { EssayAnalysis } from '@/types/essay';

export default function EssayTutor() {
  const { user } = useAuth();
  const [essay, setEssay] = useState('');
  const [analysis, setAnalysis] = useState<EssayAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [essayTitle, setEssayTitle] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showRealTimeAnalysis, setShowRealTimeAnalysis] = useState(false);

  // Real-time analysis with debouncing (only if enabled)
  useEffect(() => {
    if (!showRealTimeAnalysis || essay.trim().length === 0) {
      if (!isSubmitted) {
        setAnalysis(null);
      }
      return;
    }

    setIsAnalyzing(true);
    const debounceTimer = setTimeout(() => {
      const result = analyzeEssay(essay);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 1000); // 1 second debounce

    return () => clearTimeout(debounceTimer);
  }, [essay, showRealTimeAnalysis, isSubmitted]);

  const handleSubmitEssay = () => {
    if (essay.trim().length < 10) {
      alert('Please write at least 10 words before submitting your essay.');
      return;
    }

    setIsAnalyzing(true);
    const result = analyzeEssay(essay);
    setAnalysis(result);
    setIsSubmitted(true);
    setIsAnalyzing(false);
  };

  const handleStartNewEssay = () => {
    setEssay('');
    setEssayTitle('');
    setAnalysis(null);
    setLastSaved(null);
    setIsSubmitted(false);
    setShowRealTimeAnalysis(false);
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
      {/* Essay Editor */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Write Your Essay</h2>
          <div className="flex flex-wrap gap-2">
            {!isSubmitted && (
              <button
                onClick={handleSubmitEssay}
                disabled={!canSubmitEssay || isAnalyzing}
                className={`px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg font-medium transition-colors touch-manipulation ${
                  canSubmitEssay && !isAnalyzing
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isAnalyzing ? 'Analyzing...' : '📝 Submit Essay'}
              </button>
            )}
            {isSubmitted && (
              <button
                onClick={handleStartNewEssay}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors touch-manipulation"
              >
                ✨ New Essay
              </button>
            )}
            {user && (
              <button
                onClick={handleSaveEssay}
                disabled={!canSaveEssay || isSaving}
                className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg font-medium transition-colors touch-manipulation ${
                  canSaveEssay && !isSaving
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSaving ? 'Saving...' : 'Save Essay'}
              </button>
            )}
          </div>
        </div>
        
        {user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <label htmlFor="essayTitle" className="block text-sm font-medium text-blue-800 mb-2">
              Essay Title (Optional)
            </label>
            <input
              id="essayTitle"
              type="text"
              value={essayTitle}
              onChange={(e) => setEssayTitle(e.target.value)}
              placeholder="Enter a title for your essay..."
              className="w-full px-3 py-2 text-sm sm:text-base border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {lastSaved && (
              <p className="text-xs sm:text-sm text-green-600 mt-2">
                ✓ Last saved at {lastSaved}
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

      {/* Results Panel */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Essay Analysis</h2>
        {isSubmitted && analysis ? (
          <div className="space-y-4">
            {/* Score Highlight */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-4 sm:p-6 text-white text-center">
              <h3 className="text-lg sm:text-2xl font-bold mb-2">🎉 Your Essay Score</h3>
              <div className="text-2xl sm:text-4xl font-bold mb-2">{analysis.totalMarks}/{analysis.maxTotalMarks}</div>
              <div className="text-sm sm:text-lg opacity-90">
                {analysis.totalMarks >= 40 ? 'Excellent!' : 
                 analysis.totalMarks >= 30 ? 'Good Work!' : 
                 analysis.totalMarks >= 20 ? 'Keep Improving!' : 
                 'Practice More!'}
              </div>
            </div>
            <EssayResults analysis={analysis} />
          </div>
        ) : analysis ? (
          <div className="space-y-2">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                🔄 Live Preview - Submit essay for final score
              </p>
            </div>
            <EssayResults analysis={analysis} />
          </div>
        ) : (
          <div className="bg-white rounded-lg border p-4 sm:p-6 lg:p-8 text-center text-gray-500">
            <div className="mb-4">
              <div className="text-2xl sm:text-4xl mb-2">📝</div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">Ready to Get Your Score?</h3>
              <p className="text-xs sm:text-sm">
                {essay.trim().length < 10 
                  ? `Write at least 10 words (currently ${essay.trim().split(' ').filter(word => word.length > 0).length} words)`
                  : 'Click "Submit Essay" to see your detailed analysis and score'
                }
              </p>
            </div>
            {essay.trim().length >= 10 && !isSubmitted && (
              <button
                onClick={handleSubmitEssay}
                className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-medium transition-colors touch-manipulation"
              >
                📊 Get My Score Now
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
