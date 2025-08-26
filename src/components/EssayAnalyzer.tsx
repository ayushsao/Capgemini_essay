'use client';

import { useState } from 'react';
import { analyzeEssay } from '@/services/essayService';

export default function EssayAnalyzer() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    const analysis = await analyzeEssay(text);
    setResult(analysis);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Essay Analyzer</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-3 border rounded h-32 mb-4"
        placeholder="Enter your essay here..."
      />
      <button
        onClick={handleAnalyze}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Analyze
      </button>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>Words: {result.wordCount}</p>
          <p>Score: {result.score}/10</p>
          <p>Feedback: {result.feedback}</p>
        </div>
      )}
    </div>
  );
}