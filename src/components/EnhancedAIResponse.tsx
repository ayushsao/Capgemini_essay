'use client';

import React, { useState, useEffect } from 'react';
import { AIResponseProcessor, FormattedAIResponse } from '../utils/aiResponseFormatter';

interface EnhancedAIResponseProps {
  essayText: string;
  onAnalysisComplete?: (response: FormattedAIResponse) => void;
}

export default function EnhancedAIResponse({ essayText, onAnalysisComplete }: EnhancedAIResponseProps) {
  const [response, setResponse] = useState<FormattedAIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const [activeTab, setActiveTab] = useState('summary');

  const analyzeEssay = async () => {
    if (!essayText.trim()) return;
    
    setLoading(true);
    setStreamedContent('');
    
    try {
      const analysisResponse = await AIResponseProcessor.processEssayAnalysis(essayText);
      setResponse(analysisResponse);
      onAnalysisComplete?.(analysisResponse);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const streamAnalysis = async () => {
    if (!essayText.trim()) return;
    
    setLoading(true);
    setStreamedContent('');
    
    try {
      await AIResponseProcessor.streamResponse(essayText, (chunk) => {
        setStreamedContent(prev => prev + chunk);
      });
    } catch (error) {
      console.error('Streaming failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'text-green-600 bg-green-50',
      medium: 'text-yellow-600 bg-yellow-50',
      high: 'text-orange-600 bg-orange-50',
      critical: 'text-red-600 bg-red-50'
    };
    return colors[severity as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  const getSeverityIcon = (severity: string) => {
    const icons = {
      low: '🟢',
      medium: '🟡',
      high: '🟠',
      critical: '🔴'
    };
    return icons[severity as keyof typeof icons] || '⚪';
  };

  const ScoreCircle = ({ score }: { score: number }) => {
    const strokeColor = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444';
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;
    
    return (
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#E5E7EB"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={strokeColor}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{score}</div>
            <div className="text-xs text-gray-500">Score</div>
          </div>
        </div>
      </div>
    );
  };

  const IssueCard = ({ issue }: { issue: any }) => (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getSeverityIcon(issue.severity)}</span>
          <h4 className="font-semibold text-gray-900">{issue.title}</h4>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
          {issue.severity}
        </span>
      </div>
      
      <p className="text-gray-700 text-sm mb-3">{issue.description}</p>
      
      {issue.suggestion && (
        <div className="mb-2">
          <strong className="text-sm text-blue-600">💡 Suggestion:</strong>
          <p className="text-sm text-gray-600 mt-1">{issue.suggestion}</p>
        </div>
      )}
      
      {issue.example && (
        <div className="mb-2">
          <strong className="text-sm text-purple-600">📝 Example:</strong>
          <p className="text-sm text-gray-600 mt-1 italic bg-gray-50 p-2 rounded">{issue.example}</p>
        </div>
      )}
      
      {issue.reasoning && (
        <div className="mb-2">
          <strong className="text-sm text-green-600">🤔 Why:</strong>
          <p className="text-sm text-gray-600 mt-1">{issue.reasoning}</p>
        </div>
      )}
      
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
        {issue.position && (
          <span className="text-xs text-gray-500">
            📍 Line {issue.position.line || 'N/A'}
          </span>
        )}
        <span className="text-xs text-gray-500">
          Confidence: {issue.confidence}%
        </span>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI Essay Analysis</h1>
            <p className="text-gray-600 mt-1">Get detailed, structured feedback on your essay</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={analyzeEssay}
              disabled={loading || !essayText.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Analyzing...' : 'Analyze Essay'}
            </button>
            <button
              onClick={streamAnalysis}
              disabled={loading || !essayText.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Stream Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your essay with advanced AI...</p>
        </div>
      )}

      {/* Streamed Content */}
      {streamedContent && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">📄 Live Analysis Stream</h2>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap overflow-auto max-h-96">
            {streamedContent}
          </div>
        </div>
      )}

      {/* Structured Response */}
      {response && !loading && (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="flex justify-center">
                <ScoreCircle score={response.summary.overallScore} />
              </div>
              
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Analysis Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total Issues:</span>
                      <span className="ml-2 font-medium">{response.summary.totalIssues}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Words Analyzed:</span>
                      <span className="ml-2 font-medium">{response.metadata.wordsAnalyzed}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-green-700 mb-2">✅ Strengths</h4>
                  <ul className="text-sm space-y-1">
                    {response.summary.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-700">• {strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-orange-700 mb-2">🔍 Areas for Improvement</h4>
                  <ul className="text-sm space-y-1">
                    {response.summary.areasForImprovement.map((area, index) => (
                      <li key={index} className="text-gray-700">• {area}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto scrollbar-hide">
                {[
                  { id: 'summary', name: 'Summary', count: response.summary.totalIssues },
                  { id: 'grammar', name: 'Grammar', count: response.sections.grammar.length },
                  { id: 'style', name: 'Style', count: response.sections.style.length },
                  { id: 'structure', name: 'Structure', count: response.sections.structure.length },
                  { id: 'content', name: 'Content', count: response.sections.content.length },
                  { id: 'citations', name: 'Citations', count: response.sections.citations.length },
                  { id: 'recommendations', name: 'Action Plan', count: response.recommendations.length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.name} ({tab.count})
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Tab Content */}
              {activeTab === 'summary' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">📋 Complete Analysis Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(response.sections).map(([section, issues]) => (
                      <div key={section} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium capitalize mb-2">{section}</h4>
                        <div className="text-2xl font-bold text-blue-600">{issues.length}</div>
                        <div className="text-sm text-gray-500">issues found</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'grammar' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">📝 Grammar Analysis</h3>
                  {response.sections.grammar.length > 0 ? (
                    <div className="grid gap-4">
                      {response.sections.grammar.map((issue, index) => (
                        <IssueCard key={index} issue={issue} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      ✅ No grammar issues found! Your grammar is excellent.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'style' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">🎨 Style Suggestions</h3>
                  {response.sections.style.length > 0 ? (
                    <div className="grid gap-4">
                      {response.sections.style.map((issue, index) => (
                        <IssueCard key={index} issue={issue} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      ✅ Your writing style is well-developed!
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'structure' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">🏗️ Structure Analysis</h3>
                  {response.sections.structure.length > 0 ? (
                    <div className="grid gap-4">
                      {response.sections.structure.map((issue, index) => (
                        <IssueCard key={index} issue={issue} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      ✅ Your essay structure is solid!
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">💡 Content Enhancement</h3>
                  {response.sections.content.length > 0 ? (
                    <div className="grid gap-4">
                      {response.sections.content.map((issue, index) => (
                        <IssueCard key={index} issue={issue} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      ✅ Your content is comprehensive and well-developed!
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'citations' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">📚 Citation Check</h3>
                  {response.sections.citations.length > 0 ? (
                    <div className="grid gap-4">
                      {response.sections.citations.map((issue, index) => (
                        <IssueCard key={index} issue={issue} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      ✅ Your citations are properly formatted!
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">🚀 Action Plan</h3>
                  <div className="space-y-4">
                    {response.recommendations.map((rec, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{index + 1}. {rec.action}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {rec.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm mb-2"><strong>Impact:</strong> {rec.impact}</p>
                        <p className="text-gray-700 text-sm"><strong>Time Estimate:</strong> {rec.timeEstimate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">📈 Analysis Metadata</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600">
              <div>
                <span className="font-medium">Analysis Time:</span>
                <br />
                {response.metadata.analysisTime}ms
              </div>
              <div>
                <span className="font-medium">Model:</span>
                <br />
                {response.metadata.model}
              </div>
              <div>
                <span className="font-medium">Words:</span>
                <br />
                {response.metadata.wordsAnalyzed}
              </div>
              <div>
                <span className="font-medium">Timestamp:</span>
                <br />
                {response.metadata.timestamp.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
