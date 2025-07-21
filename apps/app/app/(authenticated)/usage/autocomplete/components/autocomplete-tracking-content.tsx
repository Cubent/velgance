'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Button } from '@repo/design-system/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/design-system/components/ui/select';
import { AutocompleteChart } from './autocomplete-chart';
import { Code, TrendingUp, Calendar, FileText, Zap } from 'lucide-react';

interface AutocompleteTrackingData {
  totalCompletions: number;
  estimatedLinesWritten: number;
  avgDailyCompletions: number;
  avgDailyLines: number;
  peakDay: {
    date: Date;
    completions: number;
    linesWritten: number;
  };
  chartData: Array<{
    date: string;
    completions: number;
    linesWritten: number;
  }>;
  completionsByModel: Array<{
    modelId: string;
    completions: number;
    cubentUnits: number;
    sessions: number;
  }>;
  recentCompletions: Array<{
    id: string;
    modelId: string;
    completions: number;
    cubentUnits: number;
    timestamp: Date;
    linesWritten: number;
  }>;
  activeSessions: number;
}

interface AutocompleteTrackingContentProps {
  data: AutocompleteTrackingData;
}

export const AutocompleteTrackingContent = ({ data }: AutocompleteTrackingContentProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className="space-y-6 p-6 bg-[#1f1f1f] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Autocomplete Analytics</h1>
          <p className="text-gray-400 mt-1">Track your code completion usage and productivity</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30">
            <SelectTrigger className="w-32 bg-[#1a1a1a] border-[#333] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#333]">
              <SelectItem value="7" className="text-white hover:bg-[#333]">Last 7 days</SelectItem>
              <SelectItem value="30" className="text-white hover:bg-[#333]">Last 30 days</SelectItem>
              <SelectItem value="90" className="text-white hover:bg-[#333]">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="bg-[#1a1a1a] border-[#333] text-white hover:bg-[#333]">
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Completions</CardTitle>
            <Code className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.totalCompletions.toLocaleString()}</div>
            <p className="text-xs text-gray-400 mt-1">
              {data.avgDailyCompletions.toFixed(1)} avg per day
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Lines Written</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.estimatedLinesWritten.toLocaleString()}</div>
            <p className="text-xs text-gray-400 mt-1">
              {data.avgDailyLines.toFixed(1)} avg per day
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Peak Day</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.peakDay.completions}</div>
            <p className="text-xs text-gray-400 mt-1">
              {formatDate(data.peakDay.date)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Sessions</CardTitle>
            <Zap className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.activeSessions}</div>
            <p className="text-xs text-gray-400 mt-1">Extension connections</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-[#1a1a1a] border border-[#333]">
          <CardHeader>
            <CardTitle className="text-white">Autocomplete Usage Over Time</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <AutocompleteChart data={data.chartData} />
          </CardContent>
        </Card>

        {/* Model Breakdown */}
        <Card className="col-span-3 bg-[#1a1a1a] border border-[#333]">
          <CardHeader>
            <CardTitle className="text-white">Completions by Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.completionsByModel.length > 0 ? (
                data.completionsByModel.map((model) => (
                  <div key={model.modelId} className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{model.modelId}</span>
                      <span className="text-xs text-gray-400">
                        {model.sessions} sessions
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">{model.completions}</div>
                      <div className="text-xs text-gray-400">
                        {model.cubentUnits.toFixed(1)} units
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-4">
                  No autocomplete data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-[#1a1a1a] border border-[#333]">
        <CardHeader>
          <CardTitle className="text-white">Recent Autocomplete Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentCompletions.length > 0 ? (
              data.recentCompletions.slice(0, 10).map((completion) => (
                <div key={completion.id} className="flex items-center justify-between border-b border-[#333] pb-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{completion.modelId}</span>
                    <span className="text-xs text-gray-400">
                      {formatDate(completion.timestamp)} at {formatTime(completion.timestamp)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">{completion.completions} completions</div>
                    <div className="text-xs text-gray-400">
                      {completion.linesWritten} lines • {completion.cubentUnits.toFixed(2)} units
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Code className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-400" />
                <p className="text-white">No autocomplete activity yet</p>
                <p className="text-xs mt-1 text-gray-400">Start using autocomplete in your VS Code extension to see data here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
