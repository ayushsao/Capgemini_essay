// Capgemini Essay Writing Tutor - Comprehensive Essay Analysis and Feedback
'use client';

import React, { useState } from 'react';

// INLINE MOCK SERVICES - NO EXTERNAL DEPENDENCIES
interface EssayAnalysis {
  wordCount: number;
  grammarScore: number;
  spellingScore: number;
  clarityScore: number;
  coherenceScore: number;
  totalScore: number;
  suggestions: string[];
}

interface FeedbackResponse {
  overallScore: number;
  feedback: string;
  improvements: string[];
  analysis: EssayAnalysis;
}

const analyzeEssay = async (text: string): Promise<EssayAnalysis> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  return {
    wordCount,
    grammarScore: Math.floor(Math.random() * 3) + 7,
    spellingScore: Math.floor(Math.random() * 3) + 7,
    clarityScore: Math.floor(Math.random() * 3) + 6,
    coherenceScore: Math.floor(Math.random() * 3) + 6,
    totalScore: Math.floor(Math.random() * 3) + 7,
    suggestions: ["Great work! Keep practicing your writing skills."]
  };
};

const generateFeedback = async (essay: string): Promise<FeedbackResponse> => {
  const analysis = await analyzeEssay(essay);
  return {
    overallScore: analysis.totalScore,
    feedback: `Your essay contains ${analysis.wordCount} words. Well structured with good progression of ideas.`,
    improvements: ["Focus on stronger thesis statements", "Use more varied sentence structures"],
    analysis
  };
};

const analyzeRealTime = (text: string) => {
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  return {
    wordCount,
    estimatedScore: Math.min(10, Math.max(1, Math.floor(wordCount / 50) + 5))
  };
};

const EssayTutor: React.FC = () => {
  const [essay, setEssay] = useState('');
  const [analysis, setAnalysis] = useState<FeedbackResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [realTimeStats, setRealTimeStats] = useState({ wordCount: 0, estimatedScore: 0 });

  const handleEssayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setEssay(text);
    
    // Real-time analysis
    const stats = analyzeRealTime(text);
    setRealTimeStats(stats);
  };

  const handleAnalyze = async () => {
    if (!essay.trim()) return;
    
    setLoading(true);
    try {
      const feedback = await generateFeedback(essay);
      setAnalysis(feedback);
    } catch (error) {
      console.error('Analysis failed:', error);
      // Fallback analysis
      setAnalysis({
        overallScore: 6,
        feedback: 'Analysis service temporarily unavailable. Please try again later.',
        improvements: ['Keep practicing your writing skills!'],
        analysis: {
          wordCount: essay.split(/\s+/).length,
          grammarScore: 6,
          spellingScore: 6,
          clarityScore: 6,
          coherenceScore: 6,
          totalScore: 6,
          suggestions: ['Continue developing your writing abilities.']
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Capgemini Essay Writing Tutor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant AI-powered feedback on your essay writing. Improve your grammar, 
            structure, and overall writing quality with detailed analysis and suggestions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Essay Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Write Your Essay</h2>
                <div className="text-sm text-gray-500">
                  Words: <span className="font-medium">{realTimeStats.wordCount}</span>
                </div>
              </div>
              
              <textarea
                value={essay}
                onChange={handleEssayChange}
                placeholder="Start writing your essay here. Our AI will analyze your writing for grammar, structure, clarity, and coherence..."
                className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700"
              />
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Estimated Score: <span className={`font-medium ${getScoreColor(realTimeStats.estimatedScore)}`}>
                    {realTimeStats.estimatedScore}/10
                  </span>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !essay.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? 'Analyzing...' : 'Analyze Essay'}
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Results Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Essay Analysis</h3>
              
              {!analysis ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Write your essay and click "Analyze Essay" to get detailed feedback</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className={`${getScoreBg(analysis.overallScore)} p-4 rounded-lg text-center`}>
                    <div className="text-3xl font-bold text-gray-800 mb-1">
                      {analysis.overallScore}/10
                    </div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                  </div>

                  {/* Detailed Scores */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Detailed Analysis</h4>
                    {[
                      { label: 'Grammar', score: analysis.analysis.grammarScore },
                      { label: 'Spelling', score: analysis.analysis.spellingScore },
                      { label: 'Clarity', score: analysis.analysis.clarityScore },
                      { label: 'Coherence', score: analysis.analysis.coherenceScore }
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center">
                        <span className="text-gray-700">{item.label}</span>
                        <span className={`font-medium ${getScoreColor(item.score)}`}>
                          {item.score}/10
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Feedback */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">AI Feedback</h4>
                    <p className="text-gray-700 text-sm bg-blue-50 p-3 rounded-lg">
                      {analysis.feedback}
                    </p>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Improvement Suggestions</h4>
                    <ul className="space-y-2">
                      {analysis.improvements.map((suggestion, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-700">
                          <span className="text-green-500 mr-2 mt-1">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Detailed Suggestions */}
                  {analysis.analysis.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Writing Tips</h4>
                      <ul className="space-y-2">
                        {analysis.analysis.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-700">
                            <span className="text-blue-500 mr-2 mt-1">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EssayTutor;
