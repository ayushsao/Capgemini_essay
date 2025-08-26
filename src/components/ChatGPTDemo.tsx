// ChatGPT Demo - using OpenAI API for essay analysis
'use client';

import React, { useState } from 'react';
import { analyzeEssay, generateFeedback } from '@/services/openaiService';

const ChatGPTDemo: React.FC = () => {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setLoading(true);
    
    try {
      const [essayAnalysis, feedback] = await Promise.all([
        analyzeEssay(input),
        generateFeedback(input)
      ]);
      
      setAnalysis({
        ...essayAnalysis,
        ...feedback
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysis({
        wordCount: input.split(/\s+/).length,
        overallScore: 5,
        feedback: 'Analysis temporarily unavailable. Please try again later.',
        suggestions: ['Keep writing and practicing!']
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Capgemini Essay Writing Tutor
        </h2>
        <p className="text-gray-600">
          Get instant AI-powered feedback on your essay writing
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label htmlFor="essay-input" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your essay text:
          </label>
          <textarea
            id="essay-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={8}
            placeholder="Type your essay here for AI analysis..."
          />
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? 'Analyzing Essay...' : 'Analyze Essay'}
        </button>
      </form>
      
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Essay Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Word Count:</span>
                  <span className="font-medium">{analysis.wordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Overall Score:</span>
                  <span className="font-medium text-blue-600">{analysis.overallScore}/10</span>
                </div>
                {analysis.grammarScore && (
                  <div className="flex justify-between">
                    <span>Grammar:</span>
                    <span className="font-medium">{analysis.grammarScore}/10</span>
                  </div>
                )}
                {analysis.spellingScore && (
                  <div className="flex justify-between">
                    <span>Spelling:</span>
                    <span className="font-medium">{analysis.spellingScore}/10</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">AI Feedback</h3>
              <p className="text-gray-700 text-sm">{analysis.feedback}</p>
            </div>

            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Suggestions</h3>
                <ul className="space-y-1">
                  {analysis.suggestions.slice(0, 3).map((suggestion: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatGPTDemo;
