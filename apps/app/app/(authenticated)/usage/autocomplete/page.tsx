import { auth } from '@clerk/nextjs/server';
import { database } from '@repo/database';
import { redirect } from 'next/navigation';
import { AutocompleteTrackingContent } from './components/autocomplete-tracking-content';

const AutocompleteTrackingPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get user from database
  const dbUser = await database.user.findUnique({
    where: { clerkId: userId },
    include: {
      usageMetrics: {
        orderBy: { date: 'desc' },
        take: 30, // Last 30 days
        select: {
          date: true,
          requestsMade: true,
          cubentUnitsUsed: true,
          autocompleteCompletions: true,
          autocompleteLinesWritten: true,
        }
      },
      usageAnalytics: {
        where: { isAutocomplete: true },
        orderBy: { createdAt: 'desc' },
        take: 100, // Recent autocomplete requests
        select: {
          id: true,
          modelId: true,
          requestsMade: true,
          cubentUnitsUsed: true,
          createdAt: true,
          completionsCount: true,
          linesWritten: true,
          metadata: true,
        }
      },
      extensionSessions: {
        where: { isActive: true },
        select: {
          id: true,
          isActive: true,
        }
      }
    }
  });

  if (!dbUser) {
    redirect('/sign-in');
  }

  // Use autocomplete-specific analytics (already filtered by isAutocomplete: true)
  const autocompleteAnalytics = dbUser.usageAnalytics;

  // Calculate autocomplete-specific metrics from database fields
  const totalCompletions = autocompleteAnalytics.reduce((sum, analytics) =>
    sum + (analytics.completionsCount || 0), 0
  );

  // Calculate total lines written from database
  const totalLinesWritten = autocompleteAnalytics.reduce((sum, analytics) =>
    sum + (analytics.linesWritten || 0), 0
  );

  // Also get totals from daily metrics
  const totalCompletionsFromMetrics = dbUser.usageMetrics.reduce((sum, metric) =>
    sum + (metric.autocompleteCompletions || 0), 0
  );

  const totalLinesFromMetrics = dbUser.usageMetrics.reduce((sum, metric) =>
    sum + (metric.autocompleteLinesWritten || 0), 0
  );

  // Use the higher of the two totals (in case of data inconsistency)
  const finalTotalCompletions = Math.max(totalCompletions, totalCompletionsFromMetrics);
  const finalTotalLines = Math.max(totalLinesWritten, totalLinesFromMetrics);

  // Calculate completions by model
  const completionsByModel = autocompleteAnalytics.reduce((acc, analytics) => {
    const modelId = analytics.modelId;
    if (!acc[modelId]) {
      acc[modelId] = { completions: 0, cubentUnits: 0, sessions: 0 };
    }
    acc[modelId].completions += analytics.completionsCount || 0;
    acc[modelId].cubentUnits += analytics.cubentUnitsUsed || 0;
    acc[modelId].sessions += 1;
    return acc;
  }, {} as Record<string, { completions: number; cubentUnits: number; sessions: number }>);

  // Calculate daily averages for autocomplete using new database fields
  const autocompleteMetrics = dbUser.usageMetrics.map(metric => ({
    date: metric.date,
    completions: metric.autocompleteCompletions || 0,
    linesWritten: metric.autocompleteLinesWritten || 0,
  }));

  const last7Days = autocompleteMetrics.slice(0, 7);
  const avgDailyCompletions = last7Days.length > 0
    ? last7Days.reduce((sum, day) => sum + day.completions, 0) / last7Days.length
    : 0;

  const avgDailyLines = last7Days.length > 0
    ? last7Days.reduce((sum, day) => sum + day.linesWritten, 0) / last7Days.length
    : 0;

  // Calculate peak usage day
  const peakDay = autocompleteMetrics.reduce((peak, day) => 
    day.completions > peak.completions ? day : peak, 
    { completions: 0, linesWritten: 0, date: new Date() }
  );

  // Prepare chart data for the last 30 days
  const chartData = autocompleteMetrics.map((metric) => ({
    date: metric.date.toISOString().split('T')[0],
    completions: metric.completions,
    linesWritten: metric.linesWritten,
  })).reverse();

  const autocompleteTrackingData = {
    totalCompletions: finalTotalCompletions,
    estimatedLinesWritten: finalTotalLines,
    avgDailyCompletions: Math.round(avgDailyCompletions * 10) / 10,
    avgDailyLines: Math.round(avgDailyLines * 10) / 10,
    peakDay: {
      date: peakDay.date,
      completions: peakDay.completions,
      linesWritten: peakDay.linesWritten,
    },
    chartData,
    completionsByModel: Object.entries(completionsByModel).map(([modelId, data]) => ({
      modelId,
      completions: data.completions,
      cubentUnits: data.cubentUnits,
      sessions: data.sessions,
    })),
    recentCompletions: autocompleteAnalytics.map(analytics => ({
      id: analytics.id,
      modelId: analytics.modelId,
      completions: analytics.completionsCount || 0,
      cubentUnits: analytics.cubentUnitsUsed,
      timestamp: analytics.createdAt,
      linesWritten: analytics.linesWritten || 0,
    })),
    activeSessions: dbUser.extensionSessions?.length || 0,
  };

  return <AutocompleteTrackingContent data={autocompleteTrackingData} />;
};

export default AutocompleteTrackingPage;
