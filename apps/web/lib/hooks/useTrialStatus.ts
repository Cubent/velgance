import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

interface TrialStatus {
  isInTrial: boolean;
  trialExpired: boolean;
  trialEndDate: Date | null;
  daysRemaining: number;
  subscriptionStatus: string | null;
}

export function useTrialStatus(): TrialStatus {
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

  return trialStatus;
}
