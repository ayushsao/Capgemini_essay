'use client';

import { useState } from 'react';

interface EssayEditorProps {
  value: string;
  onChange: (value: string) => void;
  isAnalyzing: boolean;
  disabled?: boolean;
}

export default function EssayEditor({ value, onChange, isAnalyzing, disabled = false }: EssayEditorProps) {
  const [wordCount, setWordCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    onChange(text);
    
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  return (
    <div className="space-y-6">
      {/* Professional Editor Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Editor Header */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="heading-secondary text-lg text-gray-800">Essay Editor</h3>
            </div>
            
            <div className="flex items-center space-x-6">
              {isAnalyzing && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  <span className="text-small font-medium">Analyzing...</span>
                </div>
              )}
              <div className="text-small text-gray-600">
                <span className="font-medium">{wordCount}</span> words
              </div>
            </div>
          </div>
        </div>
        
        {/* Editor Area */}
        <div className="p-6">
          <textarea
            value={value}
            onChange={handleChange}
            disabled={disabled}
            placeholder={disabled 
              ? "📝 Essay submitted successfully! Start a new essay to continue writing..." 
              : "Begin crafting your essay here... Express your thoughts clearly and confidently."
            }
            className={`w-full h-80 p-6 border-2 border-dashed border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-all duration-200 resize-none text-gray-700 placeholder-gray-400 ${
              disabled 
                ? 'bg-gray-50 cursor-not-allowed border-gray-100 text-gray-500' 
                : 'bg-white hover:border-gray-300 focus:shadow-lg focus:bg-blue-50/30'
            }`}
            style={{ 
              fontFamily: "var(--font-merriweather), 'Merriweather', serif", 
              fontSize: '16px', 
              lineHeight: '1.8',
              letterSpacing: '0.01em'
            }}
          />
        </div>
        
        {/* Status Bar */}
        <div className="bg-gray-50 border-t border-gray-100 px-6 py-3">
          <div className="flex justify-between items-center text-small text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Characters: {value.length}</span>
              <span>•</span>
              <span className={wordCount < 10 ? 'text-red-500' : wordCount < 50 ? 'text-yellow-600' : 'text-green-600'}>
                {wordCount < 10 ? 'Keep writing...' : wordCount < 50 ? 'Good start!' : 'Great length!'}
              </span>
            </div>
            {!disabled && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Auto-saving enabled</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Professional Writing Tips */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="space-y-3">
            <h4 className="heading-secondary text-lg text-blue-800">Professional Writing Tips</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-small text-blue-700">
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Aim for 200-500 words for comprehensive analysis</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Use clear topic sentences and supporting examples</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Check spelling and grammar as you write</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Structure with introduction, body, and conclusion</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
