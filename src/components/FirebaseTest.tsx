'use client';

import { useState } from 'react';
import { createUser, getUsers } from '@/lib/firebaseServices';
import { User } from '@/types/user';

export default function FirebaseTest() {
  const [status, setStatus] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  const testFirebaseWrite = async () => {
    try {
      setStatus('Testing Firebase write...');
      
      const testUser = {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        joinDate: new Date().toISOString().split('T')[0],
        subscription: 'free' as const
      };
      
      const userId = await createUser(testUser);
      setStatus(`✅ Firebase write successful! User ID: ${userId}`);
      
      // Also test reading
      const allUsers = await getUsers();
      setUsers(allUsers);
      setStatus(prev => prev + `\n✅ Found ${allUsers.length} users in Firebase`);
      
    } catch (error) {
      console.error('Firebase test error:', error);
      setStatus(`❌ Firebase error: ${(error as any)?.message || 'Unknown error'}`);
    }
  };

  const testFirebaseRead = async () => {
    try {
      setStatus('Testing Firebase read...');
      const allUsers = await getUsers();
      setUsers(allUsers);
      setStatus(`✅ Read successful! Found ${allUsers.length} users`);
    } catch (error) {
      console.error('Firebase read error:', error);
      setStatus(`❌ Firebase read error: ${(error as any)?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Firebase Test Panel</h2>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={testFirebaseWrite}
            className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
          >
            Test Firebase Write
          </button>
          <button
            onClick={testFirebaseRead}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Test Firebase Read
          </button>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Status:</h3>
          <pre className="whitespace-pre-wrap text-sm">{status}</pre>
        </div>
        
        {users.length > 0 && (
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Users in Firebase:</h3>
            <pre className="text-xs">{JSON.stringify(users, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
