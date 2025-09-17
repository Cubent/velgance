'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function TestSubscriptionPage() {
  const { user, isLoaded } = useUser();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(false);

  const testSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/subscription/status');
      const data = await response.json();
      setSubscriptionData(data);
      console.log('Subscription data:', data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Subscription Status</h1>
      <button 
        onClick={testSubscription}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Subscription Status'}
      </button>
      
      {subscriptionData && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-bold">Response:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(subscriptionData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
