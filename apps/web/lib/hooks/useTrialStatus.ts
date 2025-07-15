import { useUser } from '@clerk/nextjs';
import { useMemo } from 'react';

interface TrialStatus {
  isInTrial: boolean;
  trialExpired: boolean;
  trialEndDate: Date | null;
  daysRemaining: number;
  subscriptionStatus: string | null;
}

export function useTrialStatus(): TrialStatus {
  const { user } = useUser();

  return useMemo(() => {
    if (!user?.privateMetadata) {
      return {
        isInTrial: false,
        trialExpired: false,
        trialEndDate: null,
        daysRemaining: 0,
        subscriptionStatus: null,
      };
    }

    const metadata = user.privateMetadata;
    const subscriptionStatus = metadata.subscriptionStatus as string | null;
    const trialEndDateStr = metadata.trialEndDate as string | null;
    
    const trialEndDate = trialEndDateStr ? new Date(trialEndDateStr) : null;
    const now = new Date();
    
    const isInTrial = subscriptionStatus === 'trial';
    const trialExpired = trialEndDate ? now > trialEndDate : false;
    
    const daysRemaining = trialEndDate 
      ? Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    return {
      isInTrial,
      trialExpired,
      trialEndDate,
      daysRemaining,
      subscriptionStatus,
    };
  }, [user?.privateMetadata]);
}
