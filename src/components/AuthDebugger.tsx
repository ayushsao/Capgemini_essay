'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function AuthDebugger() {
  const { login, user, isAuthenticated } = useAuth();
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  const testAdminLogin = async () => {
    addDebugInfo('🧪 Testing admin login...');
    
    try {
      // Clear any existing debug info
      setDebugInfo([]);
      
      addDebugInfo('📱 Environment check...');
      addDebugInfo(`Client side: ${typeof window !== 'undefined'}`);
      addDebugInfo(`User agent: ${typeof window !== 'undefined' ? navigator.userAgent.slice(0, 50) : 'N/A'}`);
      
      addDebugInfo('🔐 Attempting admin login...');
      const result = await login('ayushsao32@gmail.com', 'password');
      
      addDebugInfo(`Login result: ${result ? '✅ SUCCESS' : '❌ FAILED'}`);
      addDebugInfo(`Current auth state: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);
      
      if (user) {
        addDebugInfo(`User: ${user.name} (${user.email})`);
      }
      
    } catch (error) {
      addDebugInfo(`💥 Error: ${error}`);
    }
  };

  const testEnvironment = () => {
    setDebugInfo([]);
    addDebugInfo('🔍 Environment diagnostics...');
    addDebugInfo(`Window: ${typeof window !== 'undefined' ? 'Available' : 'Not available'}`);
    addDebugInfo(`LocalStorage: ${typeof localStorage !== 'undefined' ? 'Available' : 'Not available'}`);
    
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      addDebugInfo('✅ LocalStorage write test: PASSED');
    } catch (error) {
      addDebugInfo(`❌ LocalStorage write test: FAILED - ${error}`);
    }
    
    addDebugInfo(`Current URL: ${window.location.href}`);
    addDebugInfo(`Is HTTPS: ${window.location.protocol === 'https:'}`);
  };

  const clearStorage = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('user_credentials');
      localStorage.removeItem('registered_users');
      addDebugInfo('🧹 Cleared all localStorage data');
    } catch (error) {
      addDebugInfo(`❌ Clear storage failed: ${error}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-md z-50 border">
      <h3 className="font-bold text-lg mb-3">🔧 Auth Debugger</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={testAdminLogin}
          className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
        >
          Test Admin Login
        </button>
        
        <button
          onClick={testEnvironment}
          className="w-full bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600"
        >
          Test Environment
        </button>
        
        <button
          onClick={clearStorage}
          className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
        >
          Clear Storage
        </button>
        
        <button
          onClick={() => setDebugInfo([])}
          className="w-full bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600"
        >
          Clear Logs
        </button>
      </div>
      
      {debugInfo.length > 0 && (
        <div className="bg-gray-100 p-2 rounded text-xs max-h-40 overflow-y-auto">
          {debugInfo.map((info, index) => (
            <div key={index} className="mb-1 font-mono">
              {info}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-600">
        Current Status: {isAuthenticated ? '✅ Logged In' : '❌ Not Logged In'}
      </div>
    </div>
  );
}
