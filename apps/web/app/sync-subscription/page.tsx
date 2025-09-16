'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function SyncSubscriptionPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSync = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch('/api/subscription/sync-clerk', {
        method: 'POST',
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to sync subscription' });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to sync your subscription.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Sync Subscription Status</h1>
        <p className="text-gray-600 mb-6">
          This will sync your Stripe subscription status with Clerk metadata.
        </p>
        
        <button
          onClick={handleSync}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Syncing...' : 'Sync Subscription'}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
