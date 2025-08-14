'use client';

import React, { useState, useEffect } from 'react';
import { AIPromptEngineer, ResponseQualityChecker } from '../utils/promptEngineering';
import { AIResponseProcessor } from '../utils/aiResponseFormatter';

interface AIResponseConfigProps {
  essayText: string;
  onResponseGenerated: (response: string) => void;
}

export default function AIResponseConfig({ essayText, onResponseGenerated }: AIResponseConfigProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('comprehensive-essay-analysis');
  const [customOptions, setCustomOptions] = useState({
    responseLength: 'detailed' as 'concise' | 'detailed' | 'comprehensive',
    tone: 'encouraging' as 'encouraging' | 'critical' | 'neutral' | 'academic',
    focus: [] as string[],
    expertLevel: 'student' as 'student' | 'teacher' | 'professor' | 'professional'
  });
  const [context, setContext] = useState({
    assignmentType: '',
    academicLevel: '',
    subject: '',
    specificRequirements: [] as string[],
    rubric: ''
  });
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [responseQuality, setResponseQuality] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = AIPromptEngineer.getAllTemplates();
  const focusAreas = [
    'Grammar & Mechanics',
    'Essay Structure',
    'Argument Development',
    'Evidence & Sources',
    'Writing Style',
    'Citations',
    'Clarity & Coherence',
    'Academic Tone'
  ];

  const generateOptimizedPrompt = () => {
    try {
      let prompt;
      
      if (selectedTemplate === 'contextual') {
        // Use contextual prompt generation
        prompt = AIPromptEngineer.generateContextualPrompt(essayText, context);
      } else {
        // Use template-based generation
        prompt = AIPromptEngineer.buildPrompt(selectedTemplate, { essayText });
      }
      
      // Optimize the prompt with selected options
      prompt = AIPromptEngineer.optimizePrompt(prompt, customOptions);
      
      setGeneratedPrompt(prompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
    }
  };

  const generateAIResponse = async () => {
    if (!generatedPrompt || !essayText.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // In a real implementation, you would send the optimized prompt to your AI service
      // For now, we'll simulate with our existing processor
      const response = await AIResponseProcessor.processEssayAnalysis(essayText);
      const responseText = `# AI-Generated Response\n\n## Analysis Summary\nScore: ${response.summary.overallScore}/100\nTotal Issues: ${response.summary.totalIssues}\n\n## Detailed Feedback\n[This would be the actual AI response using the optimized prompt]\n\nThe essay demonstrates ${response.summary.strengths.join(', ')}. Areas for improvement include ${response.summary.areasForImprovement.join(', ')}.`;
      
      setLastResponse(responseText);
      
      // Assess response quality
      const quality = ResponseQualityChecker.assessResponseQuality(responseText);
      setResponseQuality(quality);
      
      onResponseGenerated(responseText);
    } catch (error) {
      console.error('Error generating AI response:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (essayText) {
      generateOptimizedPrompt();
    }
  }, [selectedTemplate, customOptions, context, essayText]);

  const handleFocusChange = (area: string) => {
    setCustomOptions(prev => ({
      ...prev,
      focus: prev.focus.includes(area)
        ? prev.focus.filter(f => f !== area)
        : [...prev.focus, area]
    }));
  };

  const addRequirement = () => {
    const requirement = prompt('Enter a specific requirement:');
    if (requirement) {
      setContext(prev => ({
        ...prev,
        specificRequirements: [...prev.specificRequirements, requirement]
      }));
    }
  };

  const removeRequirement = (index: number) => {
    setContext(prev => ({
      ...prev,
      specificRequirements: prev.specificRequirements.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          🧠 AI Response Configuration
        </h1>
        <p className="text-gray-600">
          Customize how AI analyzes and responds to essays for optimal feedback quality
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Template Selection */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📋 Analysis Template</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="contextual"
                  name="template"
                  value="contextual"
                  checked={selectedTemplate === 'contextual'}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="text-blue-600"
                />
                <label htmlFor="contextual" className="font-medium">Contextual Analysis</label>
              </div>
              
              {templates.map(template => (
                <div key={template.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={template.id}
                    name="template"
                    value={template.id}
                    checked={selectedTemplate === template.id}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="text-blue-600"
                  />
                  <label htmlFor={template.id} className="flex-1">
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-gray-500">{template.description}</div>
                    <div className="flex space-x-2 mt-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {template.category}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        {template.difficulty}
                      </span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Response Options */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">⚙️ Response Options</h2>
            
            <div className="space-y-4">
              {/* Response Length */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Length
                </label>
                <select
                  value={customOptions.responseLength}
                  onChange={(e) => setCustomOptions(prev => ({
                    ...prev,
                    responseLength: e.target.value as any
                  }))}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="concise">Concise - Quick key points</option>
                  <option value="detailed">Detailed - Thorough analysis</option>
                  <option value="comprehensive">Comprehensive - Complete review</option>
                </select>
              </div>

              {/* Tone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback Tone
                </label>
                <select
                  value={customOptions.tone}
                  onChange={(e) => setCustomOptions(prev => ({
                    ...prev,
                    tone: e.target.value as any
                  }))}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="encouraging">Encouraging - Supportive and motivating</option>
                  <option value="critical">Critical - Direct and analytical</option>
                  <option value="neutral">Neutral - Objective and balanced</option>
                  <option value="academic">Academic - Formal and scholarly</option>
                </select>
              </div>

              {/* Expert Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <select
                  value={customOptions.expertLevel}
                  onChange={(e) => setCustomOptions(prev => ({
                    ...prev,
                    expertLevel: e.target.value as any
                  }))}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="student">Student - Learning-focused explanations</option>
                  <option value="teacher">Teacher - Pedagogical insights</option>
                  <option value="professor">Professor - Advanced analysis</option>
                  <option value="professional">Professional - Practical improvements</option>
                </select>
              </div>
            </div>
          </div>

          {/* Focus Areas */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">🎯 Focus Areas</h2>
            <p className="text-sm text-gray-600 mb-4">
              Select specific areas to emphasize in the analysis
            </p>
            <div className="grid grid-cols-2 gap-2">
              {focusAreas.map(area => (
                <label key={area} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customOptions.focus.includes(area)}
                    onChange={() => handleFocusChange(area)}
                    className="text-blue-600 rounded"
                  />
                  <span className="text-sm">{area}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Contextual Information */}
          {selectedTemplate === 'contextual' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📚 Assignment Context</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignment Type
                  </label>
                  <input
                    type="text"
                    value={context.assignmentType}
                    onChange={(e) => setContext(prev => ({...prev, assignmentType: e.target.value}))}
                    placeholder="e.g., Research Paper, Argumentative Essay, Analysis"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Level
                  </label>
                  <input
                    type="text"
                    value={context.academicLevel}
                    onChange={(e) => setContext(prev => ({...prev, academicLevel: e.target.value}))}
                    placeholder="e.g., High School, College Freshman, Graduate"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject/Course
                  </label>
                  <input
                    type="text"
                    value={context.subject}
                    onChange={(e) => setContext(prev => ({...prev, subject: e.target.value}))}
                    placeholder="e.g., English Literature, History, Psychology"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Requirements
                  </label>
                  <div className="space-y-2">
                    {context.specificRequirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="flex-1 text-sm bg-gray-50 px-3 py-2 rounded">{req}</span>
                        <button
                          onClick={() => removeRequirement(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addRequirement}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      + Add Requirement
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grading Rubric
                  </label>
                  <textarea
                    value={context.rubric}
                    onChange={(e) => setContext(prev => ({...prev, rubric: e.target.value}))}
                    placeholder="Paste grading rubric or evaluation criteria..."
                    rows={4}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          {/* Generated Prompt Preview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">👁️ Prompt Preview</h2>
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {generatedPrompt || 'Prompt will appear here...'}
              </pre>
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={generateOptimizedPrompt}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 Regenerate Prompt
              </button>
              <button
                onClick={generateAIResponse}
                disabled={!generatedPrompt || !essayText.trim() || isGenerating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? '⏳ Generating...' : '🚀 Generate Response'}
              </button>
            </div>
          </div>

          {/* Response Quality Assessment */}
          {responseQuality && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📊 Response Quality</h2>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Quality Score</span>
                  <span className="text-2xl font-bold text-blue-600">{responseQuality.score}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{width: `${responseQuality.score}%`}}
                  ></div>
                </div>
              </div>

              {responseQuality.strengths.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-green-700 mb-2">✅ Strengths</h4>
                  <ul className="text-sm space-y-1">
                    {responseQuality.strengths.map((strength: string, index: number) => (
                      <li key={index} className="text-green-600">• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {responseQuality.issues.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-red-700 mb-2">⚠️ Issues</h4>
                  <ul className="text-sm space-y-1">
                    {responseQuality.issues.map((issue: string, index: number) => (
                      <li key={index} className="text-red-600">• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {responseQuality.suggestions.length > 0 && (
                <div>
                  <h4 className="font-medium text-blue-700 mb-2">💡 Suggestions</h4>
                  <ul className="text-sm space-y-1">
                    {responseQuality.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="text-blue-600">• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Last Generated Response */}
          {lastResponse && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📝 Generated Response</h2>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  {lastResponse.split('\n').map((line, index) => (
                    <div key={index} className="mb-1">
                      {line.startsWith('#') ? (
                        <h3 className="font-bold text-lg">{line.replace(/^#+\s/, '')}</h3>
                      ) : line.startsWith('##') ? (
                        <h4 className="font-semibold text-base">{line.replace(/^#+\s/, '')}</h4>
                      ) : (
                        <p>{line}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
