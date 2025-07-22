'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import { AutocompleteUsageContent } from './components/autocomplete-usage-content';
import { Card, CardContent } from '@repo/design-system/components/ui/card';
import { Button } from '@repo/design-system/components/ui/button';
import { Code2 } from 'lucide-react';

interface AutocompleteData {
  totalCompletions: number;
  totalAccepted: number;
  totalLinesAdded: number;
  totalCharactersAdded: number;
  avgLatency: number;
  avgAcceptanceRate: number;
  avgDailyCompletions: number;
  completionsPerSession: number;
  modelBreakdown: Array<{
    modelId: string;
    provider: string;
    completions: number;
    accepted: number;
    lines: number;
    characters: number;
    sessions: number;
  }>;
  recentUsage: Array<{
    id: string;
    modelId: string;
    provider: string;
    completions: number;
    accepted: number;
    lines: number;
    language: string;
    timestamp: Date;
  }>;
}

export default function AutocompletePage() {
  const [data, setData] = useState<AutocompleteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAutocompleteData();
  }, []);

  const fetchAutocompleteData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/extension/track-autocomplete?days=30');

      if (!response.ok) {
        throw new Error('Failed to fetch autocomplete data');
      }

      const result = await response.json();

      // Transform the data to match our interface
      const transformedData: AutocompleteData = {
        totalCompletions: result.data?.totalCompletions || 0,
        totalAccepted: result.data?.totalAccepted || 0,
        totalLinesAdded: result.data?.totalLinesAdded || 0,
        totalCharactersAdded: result.data?.totalCharactersAdded || 0,
        avgLatency: result.data?.avgLatency || 0,
        avgAcceptanceRate: result.data?.avgAcceptanceRate || 0,
        avgDailyCompletions: Math.round((result.data?.totalCompletions || 0) / 30),
        completionsPerSession: result.data?.totalCompletions || 0,
        modelBreakdown: result.data?.modelBreakdown || [],
        recentUsage: (result.data?.recentSessions || []).map((session: any) => ({
          ...session,
          timestamp: new Date(session.timestamp)
        }))
      };

      setData(transformedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching autocomplete data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6 bg-[#1f1f1f] min-h-screen">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Autocomplete Usage</h1>
            <p className="text-gray-400 mt-1">Track your AI autocomplete performance and statistics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="bg-[#1a1a1a] border border-[#333]">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-[#1a1a1a] border border-[#333]">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1f1f1f]">
        <Card className="bg-[#1a1a1a] border border-red-900/20">
          <CardContent className="p-6 text-center">
            <p className="text-red-400 mb-4">Error loading autocomplete data</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <Button onClick={fetchAutocompleteData} variant="outline" size="sm" className="bg-[#1a1a1a] border-[#333] text-white hover:bg-[#333]">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data || (data.totalCompletions === 0 && data.modelBreakdown.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1f1f1f]">
        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardContent className="p-6 text-center">
            <Code2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No autocomplete data available</p>
            <p className="text-gray-500 text-sm">Start using autocomplete in your VS Code extension to see statistics here.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AutocompleteUsageContent data={data} />;
}
