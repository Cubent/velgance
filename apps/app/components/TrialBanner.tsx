'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@repo/design-system/components/ui/button';
import { AlertCircle, Crown } from 'lucide-react';

interface TrialStatus {
  isInTrial: boolean;
  trialExpired: boolean;
  trialEndDate: Date | null;
  daysRemaining: number;
  subscriptionStatus: string | null;
}

export function TrialBanner() {
  const { user } = useUser();
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    isInTrial: false,
    trialExpired: false,
    trialEndDate: null,
    daysRemaining: 0,
    subscriptionStatus: null,
  });

  useEffect(() => {
    if (!user) return;

    // Fetch trial status from API endpoint
    fetch('/api/user/trial-status')
      .then(res => res.json())
      .then(data => {
        setTrialStatus({
          isInTrial: data.isInTrial,
          trialExpired: data.trialExpired,
          trialEndDate: data.trialEndDate ? new Date(data.trialEndDate) : null,
          daysRemaining: data.daysRemaining,
          subscriptionStatus: data.subscriptionStatus,
        });
      })
      .catch(error => {
        console.error('Error fetching trial status:', error);
      });
  }, [user]);

  const { isInTrial, trialExpired, daysRemaining } = trialStatus;

  // Don't show banner if not in trial or trial expired
  if (!isInTrial && !trialExpired) {
    return null;
  }

  const handleUpgrade = () => {
    // Redirect to billing portal
    fetch('/api/billing/portal', {
      method: 'POST',
    })
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          window.open(data.url, '_blank');
        }
      })
      .catch(error => {
        console.error('Error opening billing portal:', error);
      });
  };

  if (trialExpired) {
    return (
      <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div>
              <h3 className="text-sm font-medium text-red-400">Trial Expired</h3>
              <p className="text-xs text-red-300">
                Your free trial has ended. Upgrade to continue using Cubent.
              </p>
            </div>
          </div>
          <Button
            onClick={handleUpgrade}
            size="sm"
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
          size="sm"
          variant="outline"
          className="border-blue-600/20 text-blue-400 hover:bg-blue-600/10"
        >
          Upgrade
        </Button>
      </div>
    </div>
  );
}
