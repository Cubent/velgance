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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Autocomplete Analytics</h2>
        <div className="flex items-center space-x-2">
          <Select defaultValue="30">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Completions</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCompletions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {data.avgDailyCompletions.toFixed(1)} avg per day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lines Written</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.estimatedLinesWritten.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {data.avgDailyLines.toFixed(1)} avg per day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Day</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.peakDay.completions}</div>
            <p className="text-xs text-muted-foreground">
              {formatDate(data.peakDay.date)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeSessions}</div>
            <p className="text-xs text-muted-foreground">
              Extension connections
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Autocomplete Usage Over Time</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <AutocompleteChart data={data.chartData} />
          </CardContent>
        </Card>

        {/* Model Breakdown */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Completions by Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.completionsByModel.length > 0 ? (
                data.completionsByModel.map((model) => (
                  <div key={model.modelId} className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{model.modelId}</span>
                      <span className="text-xs text-muted-foreground">
                        {model.sessions} sessions
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{model.completions}</div>
                      <div className="text-xs text-muted-foreground">
                        {model.cubentUnits.toFixed(1)} units
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No autocomplete data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Autocomplete Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentCompletions.length > 0 ? (
              data.recentCompletions.slice(0, 10).map((completion) => (
                <div key={completion.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{completion.modelId}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(completion.timestamp)} at {formatTime(completion.timestamp)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{completion.completions} completions</div>
                    <div className="text-xs text-muted-foreground">
                      {completion.linesWritten} lines • {completion.cubentUnits.toFixed(2)} units
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No autocomplete activity yet</p>
                <p className="text-xs mt-1">Start using autocomplete in your VS Code extension to see data here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
