// ChatGPT Demo - temporarily using mock implementation
'use client';

import { useState } from 'react';

const ChatGPTDemo: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock response for demo purposes
    setTimeout(() => {
      setResponse(`Mock AI Response: Thank you for your input "${input}". AI analysis features will be available soon!`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">AI Essay Analysis Demo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="essay-input" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your essay text:
          </label>
          <textarea
            id="essay-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={6}
            placeholder="Type your essay here for AI analysis..."
          />
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Analyzing...' : 'Analyze Essay'}
        </button>
      </form>
      
      {response && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold text-gray-800 mb-2">AI Analysis:</h3>
          <p className="text-gray-700">{response}</p>
        </div>
      )}
    </div>
  );
};

export default ChatGPTDemo;
