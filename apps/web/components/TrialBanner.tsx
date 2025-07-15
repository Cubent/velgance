'use client';

import { useTrialStatus } from '@/lib/hooks/useTrialStatus';
import { Button } from '@repo/design-system/components/ui/button';
import { AlertCircle, Crown } from 'lucide-react';

export function TrialBanner() {
  const { isInTrial, trialExpired, daysRemaining } = useTrialStatus();

  const handleUpgrade = async () => {
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
      });
      
      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        console.error('Failed to create billing portal session');
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
    }
  };

  if (!isInTrial && !trialExpired) {
    return null; // User has a paid plan or no trial info
  }

  if (trialExpired) {
    return (
      <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div>
              <h3 className="text-sm font-medium text-red-400">Trial Expired</h3>
              <p className="text-xs text-red-300">
                Your 7-day free trial has ended. Upgrade to continue using Cubent.
              </p>
            </div>
          </div>
          <Button 
            onClick={handleUpgrade}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="h-5 w-5 text-blue-400" />
          <div>
            <h3 className="text-sm font-medium text-blue-400">Free Trial Active</h3>
            <p className="text-xs text-blue-300">
              {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining in your free trial
            </p>
          </div>
        </div>
        <Button 
          onClick={handleUpgrade}
          variant="outline"
          className="border-blue-600/20 text-blue-400 hover:bg-blue-600/10"
        >
          Upgrade
        </Button>
      </div>
    </div>
  );
}
