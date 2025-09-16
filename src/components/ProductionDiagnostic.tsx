'use client';

import { useEffect, useState } from 'react';

interface DiagnosticInfo {
  domain: string;
  environment: string;
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
  };
  browser: string;
}

export default function ProductionDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticInfo | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDiagnostics({
        domain: window.location.hostname,
        environment: process.env.NODE_ENV || 'unknown',
        firebaseConfig: {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Loaded ✅' : 'Missing ❌',
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Missing ❌',
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Missing ❌',
        },
        browser: navigator.userAgent,
      });
    }
  }, []);

  if (process.env.NODE_ENV === 'production' && !showDiagnostics) {
    return (
      <button
        onClick={() => setShowDiagnostics(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
        title="Show Google Auth Diagnostics"
      >
        🔧 Debug
      </button>
    );
  }

  if (!showDiagnostics && process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm text-xs z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">🔧 Google Auth Diagnostics</h3>
        <button
          onClick={() => setShowDiagnostics(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      {diagnostics && (
        <div className="space-y-2 text-gray-600">
          <div>
            <strong>Domain:</strong> {diagnostics.domain}
          </div>
          <div>
            <strong>Environment:</strong> {diagnostics.environment}
          </div>
          <div>
            <strong>Firebase Config:</strong>
            <ul className="ml-2 mt-1">
              <li>API Key: {diagnostics.firebaseConfig.apiKey}</li>
              <li>Auth Domain: {diagnostics.firebaseConfig.authDomain}</li>
              <li>Project ID: {diagnostics.firebaseConfig.projectId}</li>
            </ul>
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500">
              If Google Sign-In fails, check:
              <br />1. Domain authorized in Firebase
              <br />2. Environment variables set
              <br />3. Google Cloud OAuth configured
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to test Google Auth configuration
export const testGoogleAuthConfig = () => {
  if (typeof window === 'undefined') return;
  
  console.log('🔧 Google Auth Configuration Test:');
  console.log('Domain:', window.location.hostname);
  console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Loaded ✅' : 'Missing ❌');
  console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Missing ❌');
  console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Missing ❌');
  
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  if (isProduction) {
    console.log('🌐 Production environment detected');
    console.log('⚠️ Make sure your domain is authorized in Firebase Console');
    console.log('📋 Firebase Console URL: https://console.firebase.google.com/project/capgemini-essay-tutor/authentication/settings');
  }
};
