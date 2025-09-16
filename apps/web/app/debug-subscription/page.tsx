'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function DebugSubscriptionPage() {
  const { user, isLoaded } = useUser();
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch('/api/debug/subscription');
      const data = await response.json();
      setSubscriptionData(data);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    }
  };

  const syncSubscription = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/debug/subscription', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ Subscription synced! Tier: ${data.subscriptionTier}, Status: ${data.status}`);
        fetchSubscriptionData(); // Refresh data
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSubscriptionData();
    }
  }, [user]);

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Please sign in</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Subscription Status</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          {subscriptionData ? (
            <div className="space-y-4">
              <div>
                <strong>User ID:</strong> {subscriptionData.user?.id}
              </div>
              <div>
                <strong>Email:</strong> {subscriptionData.user?.email}
              </div>
              <div>
                <strong>Subscription Tier:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  subscriptionData.user?.subscriptionTier === 'MEMBER' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {subscriptionData.user?.subscriptionTier || 'None'}
                </span>
              </div>
              <div>
                <strong>Subscription Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  subscriptionData.user?.subscriptionStatus === 'ACTIVE' || subscriptionData.user?.subscriptionStatus === 'TRIALING' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {subscriptionData.user?.subscriptionStatus || 'None'}
                </span>
              </div>
              
              {subscriptionData.stripeSubscription && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <h3 className="font-semibold mb-2">Database Subscription:</h3>
                  <div>Status: {subscriptionData.stripeSubscription.status}</div>
                  <div>Customer ID: {subscriptionData.stripeSubscription.stripeCustomerId}</div>
                  <div>Subscription ID: {subscriptionData.stripeSubscription.stripeSubscriptionId}</div>
                </div>
              )}
              
              {subscriptionData.stripeData && (
                <div className="mt-4 p-4 bg-blue-50 rounded">
                  <h3 className="font-semibold mb-2">Stripe Data:</h3>
                  <div>Status: {subscriptionData.stripeData.status}</div>
                  <div>Price ID: {subscriptionData.stripeData.items?.[0]?.priceId}</div>
                  <div>Lookup Key: {subscriptionData.stripeData.items?.[0]?.lookupKey}</div>
                  <div>Amount: {subscriptionData.stripeData.items?.[0]?.amount} {subscriptionData.stripeData.items?.[0]?.currency}</div>
                </div>
              )}
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <button
            onClick={syncSubscription}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Syncing...' : 'Sync Subscription with Stripe'}
          </button>
          
          {message && (
            <div className={`mt-4 p-3 rounded ${
              message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
