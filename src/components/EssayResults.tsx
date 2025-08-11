'use client';

import { EssayAnalysis } from '@/types/essay';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EssayResultsProps {
  analysis: EssayAnalysis;
  isSubmitted?: boolean;
}

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'];

export default function EssayResults({ analysis }: EssayResultsProps) {
  const {
    wordCount,
    spellingAccuracy,
    grammarEvaluation,
    plagiarismCheck,
    backspaceScore,
    deleteScore,
    totalMarks,
    maxTotalMarks,
    grammarErrors,
    suggestions,
    improvementAreas
  } = analysis;

  const chartData = [
    { name: 'Word Count', score: wordCount.score, maxScore: wordCount.maxScore },
    { name: 'Spelling', score: spellingAccuracy.score, maxScore: spellingAccuracy.maxScore },
    { name: 'Grammar', score: grammarEvaluation.score, maxScore: grammarEvaluation.maxScore },
    { name: 'Plagiarism Checker', score: plagiarismCheck.score, maxScore: plagiarismCheck.maxScore },
    { name: 'Backspace', score: backspaceScore.score, maxScore: backspaceScore.maxScore },
    { name: 'Delete', score: deleteScore.score, maxScore: deleteScore.maxScore },
  ];

  const pieData = chartData.map((item, index) => ({
    name: item.name,
    value: item.score,
    fill: COLORS[index]
  }));

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return '🏆';
    if (percentage >= 60) return '📝';
    return '📊';
  };

  return (
    <div className="space-y-6">
      {/* Total Score Card */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <div className="text-green-600 text-2xl mr-2">🏆</div>
          <h3 className="text-lg font-semibold text-green-800">Total Marks</h3>
        </div>
        <div className="text-4xl font-bold text-green-600">
          {totalMarks} <span className="text-2xl text-green-500">/ {maxTotalMarks}</span>
        </div>
      </div>

      {/* Individual Scores */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Evaluation Breakdown</h3>
        <div className="space-y-4">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-xl mr-3">{getScoreIcon(item.score, item.maxScore)}</span>
                <span className="font-medium text-gray-700">{item.name} Evaluation</span>
                {item.name === 'Grammar' && grammarErrors.length > 0 && (
                  <span className="ml-2 text-sm text-red-600">
                    ({grammarErrors.length} errors)
                  </span>
                )}
                {item.name === 'Plagiarism Checker' && (
                  <span className={`ml-2 text-sm ${plagiarismCheck.isOriginal ? 'text-green-600' : 'text-red-600'}`}>
                    ({plagiarismCheck.percentage}% {plagiarismCheck.isOriginal ? 'original' : 'similarity detected'})
                  </span>
                )}
              </div>
              <span className={`text-lg font-bold ${getScoreColor(item.score, item.maxScore)}`}>
                {item.score} / {item.maxScore}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Score Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Bar dataKey="score" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Score Composition</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grammar Errors */}
      {grammarErrors.length > 0 && (
        <div className="bg-white rounded-lg border border-red-200 shadow-sm p-6">
          <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
            Grammar Issues Found
            <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
              {grammarErrors.filter(e => e.source).length > 0 ? 'AI Enhanced' : 'Standard'}
            </span>
          </h4>
          <div className="space-y-3">
            {grammarErrors.map((error, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start">
                  <span className="text-red-600 mr-2">⚠️</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-red-800">&ldquo;{error.text}&rdquo;</p>
                      {error.source && (
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          error.source === 'LanguageTool' ? 'bg-blue-100 text-blue-600' :
                          error.source === 'Grammarly-Style' ? 'bg-green-100 text-green-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {error.source === 'Grammarly-Style' ? '🧠 Grammarly' : 
                           error.source === 'LanguageTool' ? '🔧 LanguageTool' : 
                           '📝 Local'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-red-600 mt-1">{error.suggestions[0]}</p>
                    {error.severity && (
                      <p className="text-xs text-red-500 mt-1 italic">
                        Severity: {error.severity}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spelling Errors from API */}
      {analysis.spellingErrors && analysis.spellingErrors.length > 0 && (
        <div className="bg-white rounded-lg border border-yellow-200 shadow-sm p-6">
          <h4 className="text-lg font-semibold text-yellow-800 mb-4">
            🔍 Spelling Issues Found (Enhanced Analysis)
          </h4>
          <div className="space-y-3">
            {analysis.spellingErrors.map((error: any, index: number) => (
              <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start">
                  <span className="text-yellow-600 mr-2">📝</span>
                  <div className="flex-1">
                    <p className="font-medium text-yellow-800">
                      &ldquo;{error.context?.text.substring(error.offset, error.offset + error.length)}&rdquo;
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">{error.message}</p>
                    {error.replacements && error.replacements.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-medium text-yellow-800">Suggestions: </span>
                        <span className="text-xs text-yellow-700">
                          {error.replacements.map((r: any) => r.value).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plagiarism Details */}
      {plagiarismCheck.matches && plagiarismCheck.matches.length > 0 && (
        <div className="bg-white rounded-lg border border-red-200 shadow-sm p-6">
          <h4 className="text-lg font-semibold text-red-800 mb-4">🔍 Plagiarism Detection Results</h4>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
              <span className="text-red-600 font-semibold">
                {plagiarismCheck.percentage}% similarity detected
              </span>
              <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                plagiarismCheck.isOriginal 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {plagiarismCheck.isOriginal ? 'ACCEPTABLE' : 'NEEDS REVISION'}
              </span>
            </div>
            <p className="text-sm text-red-700">
              {plagiarismCheck.isOriginal 
                ? 'Minor similarity detected but within acceptable limits.' 
                : 'Significant similarity found. Please revise your content to ensure originality.'}
            </p>
          </div>
          
          <div className="space-y-3">
            <h5 className="font-medium text-gray-800">Similar Content Found:</h5>
            {plagiarismCheck.matches.map((match, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Source: {match.source}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    match.similarity >= 80 ? 'bg-red-100 text-red-700' :
                    match.similarity >= 50 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {match.similarity}% match
                  </span>
                </div>
                <p className="text-sm text-gray-600 italic">"{match.text}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Areas */}
      {improvementAreas && improvementAreas.length > 0 && (
        <div className="bg-white rounded-lg border border-orange-200 shadow-sm p-6">
          <h4 className="text-lg font-semibold text-orange-800 mb-4">🎯 Areas for Improvement</h4>
          <div className="space-y-4">
            {improvementAreas.map((area, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                area.priority === 'high' ? 'border-red-500 bg-red-50' :
                area.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3 ${
                      area.priority === 'high' ? 'bg-red-100 text-red-800' :
                      area.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {area.priority.toUpperCase()} PRIORITY
                    </span>
                    <h5 className="font-semibold text-gray-800">{area.category}</h5>
                  </div>
                  <div className="text-sm text-gray-600">
                    Score: {area.currentScore}/10 → Target: {area.targetScore}/10
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{area.description}</p>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-800">Action Steps:</p>
                  {area.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-start text-sm text-gray-700">
                      <span className="text-green-500 mr-2 mt-0.5">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Current Progress</span>
                    <span>{Math.round((area.currentScore / 10) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        area.priority === 'high' ? 'bg-red-500' :
                        area.priority === 'medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${(area.currentScore / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="bg-white rounded-lg border border-blue-200 shadow-sm p-6">
        <h4 className="text-lg font-semibold text-blue-800 mb-4">Suggestions for Improvement</h4>
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start">
              <span className="text-blue-600 mr-2">💡</span>
              <p className="text-blue-700">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
