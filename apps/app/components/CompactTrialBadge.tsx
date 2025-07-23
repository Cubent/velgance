'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@repo/design-system/components/ui/button';
import { Clock } from 'lucide-react';

interface TrialStatus {
  isInTrial: boolean;
  trialExpired: boolean;
  daysRemaining: number;
  subscriptionStatus: string | null;
  planType: string | null;
}

export function CompactTrialBadge() {
  const { user } = useUser();
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    isInTrial: false,
    trialExpired: false,
    daysRemaining: 0,
    subscriptionStatus: null,
    planType: null,
  });

  useEffect(() => {
    if (!user) return;

    fetch('/api/user/trial-status')
      .then(res => res.json())
      .then(data => {
        setTrialStatus({
          isInTrial: data.isInTrial,
          trialExpired: data.trialExpired,
          daysRemaining: data.daysRemaining,
          subscriptionStatus: data.subscriptionStatus,
          planType: data.planType,
        });
      })
      .catch(error => {
        console.error('Error fetching trial status:', error);
      });
  }, [user]);

  const handleUpgrade = () => {
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

  // Don't show if not in trial or trial expired
  if (!trialStatus.isInTrial && !trialStatus.trialExpired) {
    return null;
  }

  if (trialStatus.trialExpired) {
    return (
      <Button
        onClick={handleUpgrade}
        size="sm"
        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-7"
      >
        Byok Trial Expired
      </Button>
    );
  }

  return (
    <Button
      onClick={handleUpgrade}
      variant="outline"
      size="sm"
      className="bg-white border-gray-300 text-white hover:bg-gray-50 hover:text-white text-xs px-3 py-1 h-7 flex items-center gap-1"
    >
      <Clock className="h-3 w-3" />
      Byok: {trialStatus.daysRemaining} days left
    </Button>
  );
}
