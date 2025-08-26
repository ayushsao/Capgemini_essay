'use client';

import { useState } from 'react';
import { checkFirebaseConfig, getFirebaseTroubleshootingInfo } from '@/lib/firebaseDebug';

export default function GoogleSignInDiagnostics() {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);

  const runDiagnostics = () => {
    const info = getFirebaseTroubleshootingInfo();
    setDiagnosticInfo(info);
    setShowDiagnostics(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!showDiagnostics) {
    return (
      <div className="text-center mt-4">
        <button
          onClick={runDiagnostics}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Having issues with Google Sign-In? Click for help
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-blue-800">Google Sign-In Diagnostics</h3>
        <button
          onClick={() => setShowDiagnostics(false)}
          className="text-blue-600 hover:text-blue-800"
        >
          ✕
        </button>
      </div>

      {diagnosticInfo && (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-blue-700 mb-2">Current Configuration:</h4>
            <div className="bg-white p-3 rounded border text-xs font-mono">
              <div>Domain: {diagnosticInfo.currentDomain}</div>
              <div>Project: {diagnosticInfo.config.projectId}</div>
              <div>Auth Domain: {diagnosticInfo.config.authDomain}</div>
              <div>Status: {diagnosticInfo.isConfigured ? '✅ Configured' : '❌ Missing config'}</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-blue-700 mb-2">Required Authorized Domains:</h4>
            <div className="bg-white p-3 rounded border space-y-1">
              {diagnosticInfo.troubleshooting.domainAuthorization.required.map((domain: string, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-xs font-mono">{domain}</span>
                  <button
                    onClick={() => copyToClipboard(domain)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-blue-700 mb-2">Fix Instructions:</h4>
            <div className="bg-white p-3 rounded border text-xs">
              <ol className="list-decimal list-inside space-y-1">
                <li>Open <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Firebase Console</a></li>
                <li>Select project: <code className="bg-gray-100 px-1 rounded">{diagnosticInfo.config.projectId}</code></li>
                <li>Go to Authentication → Settings → Authorized domains</li>
                <li>Add the domains listed above</li>
                <li>Save and wait 5-10 minutes</li>
              </ol>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => copyToClipboard(JSON.stringify(diagnosticInfo, null, 2))}
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
            >
              Copy Full Diagnostic Info
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
