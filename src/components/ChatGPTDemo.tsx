'use client';

import { useState } from 'react';
import { Send, Zap, MessageCircle, Bot, Sparkles } from 'lucide-react';
import { analyzeEssayWithChatGPT, streamEssayFeedback, isOpenAIAvailable, type EssayAnalysisResult } from '@/services/openaiService';

export default function ChatGPTDemo() {
  const [essay, setEssay] = useState('');
  const [analysis, setAnalysis] = useState<EssayAnalysisResult | null>(null);
  const [streamedFeedback, setStreamedFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [analysisType, setAnalysisType] = useState<'grammar' | 'structure' | 'content' | 'style' | 'comprehensive'>('comprehensive');

  const handleAnalyze = async () => {
    if (!essay.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysis(null);
    
    try {
      const result = await analyzeEssayWithChatGPT(essay, { analysisType });
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please check your OpenAI API key.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStreamFeedback = async () => {
    if (!essay.trim()) return;
    
    setIsStreaming(true);
    setStreamedFeedback('');
    
    try {
      await streamEssayFeedback(
        essay,
        (chunk) => {
          setStreamedFeedback(prev => prev + chunk);
        },
        (result) => {
          setAnalysis(result);
          setIsStreaming(false);
        },
        { analysisType }
      );
    } catch (error) {
      console.error('Streaming failed:', error);
      alert('Streaming failed. Please check your OpenAI API key.');
      setIsStreaming(false);
    }
  };

  const openAIAvailable = isOpenAIAvailable();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Bot className="w-10 h-10 text-green-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            ChatGPT Essay Analyzer
          </h1>
          <Sparkles className="w-10 h-10 text-blue-500" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Powered by OpenAI's GPT-4o Mini - Get instant, intelligent feedback on your essays with real-time streaming analysis
        </p>
        
        {!openAIAvailable && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-lg mx-auto">
            <p className="text-yellow-800 text-sm">
              ⚠️ Add your OpenAI API key to <code className="bg-yellow-200 px-1 rounded">.env.local</code> to enable ChatGPT features
            </p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
              <MessageCircle className="w-6 h-6 text-blue-500" />
              <span>Essay Input</span>
            </h2>
            
            {/* Analysis Type Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analysis Type
              </label>
              <select 
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value as any)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="comprehensive">Comprehensive Analysis</option>
                <option value="grammar">Grammar & Mechanics</option>
                <option value="structure">Structure & Organization</option>
                <option value="content">Content & Arguments</option>
                <option value="style">Writing Style & Tone</option>
              </select>
            </div>

            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="Paste your essay here for ChatGPT analysis..."
              className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleAnalyze}
                disabled={!essay.trim() || isAnalyzing || !openAIAvailable}
                className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Essay'}</span>
              </button>
              
              <button
                onClick={handleStreamFeedback}
                disabled={!essay.trim() || isStreaming || !openAIAvailable}
                className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>{isStreaming ? 'Streaming...' : 'Stream Live Feedback'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Streamed Feedback */}
          {(streamedFeedback || isStreaming) && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-green-500" />
                <span>Live Feedback Stream</span>
                {isStreaming && <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full animate-pulse">LIVE</span>}
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800">
                  {streamedFeedback}
                  {isStreaming && <span className="animate-pulse">▊</span>}
                </pre>
              </div>
            </div>
          )}

          {/* Structured Analysis */}
          {analysis && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Bot className="w-5 h-5 text-blue-500" />
                <span>ChatGPT Analysis</span>
              </h3>
              
              {/* Score */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Overall Score</span>
                  <span className="text-2xl font-bold text-blue-600">{analysis.score}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${analysis.score}%` }}
                  ></div>
                </div>
              </div>

              {/* Feedback */}
              <div className="mb-6">
                <h4 className="font-semibold text-green-600 mb-2">📝 Detailed Feedback</h4>
                <p className="text-gray-700 bg-green-50 p-3 rounded-lg">{analysis.feedback}</p>
              </div>

              {/* Strengths */}
              {analysis.strengths.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-green-600 mb-2">✅ Strengths</h4>
                  <ul className="space-y-1">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {analysis.suggestions.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-blue-600 mb-2">💡 Suggestions</h4>
                  <ul className="space-y-1">
                    {analysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {analysis.weaknesses.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">⚠️ Areas for Improvement</h4>
                  <ul className="space-y-1">
                    {analysis.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* API Info */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-3">🤖 ChatGPT Integration Features</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded-lg">
            <h4 className="font-semibold text-blue-600 mb-1">Real-time Streaming</h4>
            <p className="text-gray-600">Watch as ChatGPT analyzes your essay in real-time</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <h4 className="font-semibold text-green-600 mb-1">Structured Analysis</h4>
            <p className="text-gray-600">Get detailed scores, feedback, and actionable suggestions</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <h4 className="font-semibold text-purple-600 mb-1">Multiple Analysis Types</h4>
            <p className="text-gray-600">Choose from grammar, structure, content, style, or comprehensive analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
}
