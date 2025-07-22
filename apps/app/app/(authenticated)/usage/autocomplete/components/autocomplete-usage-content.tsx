'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Button } from '@repo/design-system/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/design-system/components/ui/select';
import {
  Code2,
  TrendingUp,
  Target,
  Clock,
  FileText,
  CheckCircle
} from 'lucide-react';

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

interface AutocompleteUsageContentProps {
  data: AutocompleteData;
}

export const AutocompleteUsageContent = ({ data }: AutocompleteUsageContentProps) => {
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const formatLatency = (ms: number) => {
    if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.round(ms)}ms`;
  };

  return (
    <div className="space-y-6 p-6 bg-[#1f1f1f] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Autocomplete Usage</h1>
          <p className="text-gray-400 mt-1">Track your AI autocomplete performance and statistics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30d">
            <SelectTrigger className="w-32 bg-[#1a1a1a] border-[#333] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#333]">
              <SelectItem value="7d" className="text-white hover:bg-[#333]">Last 7 days</SelectItem>
              <SelectItem value="30d" className="text-white hover:bg-[#333]">Last 30 days</SelectItem>
              <SelectItem value="90d" className="text-white hover:bg-[#333]">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-[#1a1a1a] border-[#333] text-white hover:bg-[#333]">
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Completions</CardTitle>
            <Code2 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(data.totalCompletions)}</div>
            <p className="text-xs text-gray-400 mt-1">All time usage</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(data.totalAccepted)}</div>
            <p className="text-xs text-gray-400 mt-1">
              {data.totalCompletions > 0 ? `${((data.totalAccepted / data.totalCompletions) * 100).toFixed(1)}%` : '0%'} acceptance rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Lines Added</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(data.totalLinesAdded)}</div>
            <p className="text-xs text-gray-400 mt-1">Code lines generated</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] border border-[#333]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Latency</CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatLatency(data.avgLatency)}</div>
            <p className="text-xs text-gray-400 mt-1">Response time</p>
          </CardContent>
        </Card>
      </div>

      {/* Model Breakdown */}
      <Card className="bg-[#1a1a1a] border border-[#333]">
        <CardHeader>
          <CardTitle className="text-white">Model Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.modelBreakdown.map((model, index) => (
              <div key={model.modelId} className="flex items-center justify-between p-4 bg-[#111] rounded-lg border border-[#333]">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <span className="text-white font-medium capitalize">{model.modelId}</span>
                    <span className="text-gray-400 text-sm capitalize">{model.provider}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-8 text-sm">
                  <div className="text-center">
                    <div className="text-white font-medium">{formatNumber(model.completions)}</div>
                    <div className="text-gray-400">Completions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-medium">{formatNumber(model.accepted)}</div>
                    <div className="text-gray-400">Accepted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-medium">{formatNumber(model.lines)}</div>
                    <div className="text-gray-400">Lines</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-medium">
                      {model.completions > 0 ? `${((model.accepted / model.completions) * 100).toFixed(1)}%` : '0%'}
                    </div>
                    <div className="text-gray-400">Acceptance</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Usage */}
      <Card className="bg-[#1a1a1a] border border-[#333]">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Recent Usage</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {data.recentUsage.slice(0, 10).map((usage, index) => (
              <div key={usage.id} className={`flex items-center px-6 py-3 ${index !== data.recentUsage.slice(0, 10).length - 1 ? 'border-b border-[#333]' : ''}`}>
                <div className="flex items-center space-x-8 flex-1">
                  <div className="flex flex-col min-w-[200px]">
                    <span className="text-white text-sm font-medium">
                      {formatDate(usage.timestamp)} at {formatTime(usage.timestamp)}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-[120px]">
                    <span className="text-white text-sm font-medium capitalize">{usage.modelId}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-8 text-sm">
                  <div className="text-center min-w-[60px]">
                    <div className="text-white font-medium">{usage.completions}</div>
                    <div className="text-gray-400 text-xs">Generated</div>
                  </div>
                  <div className="text-center min-w-[60px]">
                    <div className="text-white font-medium">{usage.accepted}</div>
                    <div className="text-gray-400 text-xs">Accepted</div>
                  </div>
                  <div className="text-center min-w-[60px]">
                    <div className="text-white font-medium">{usage.lines}</div>
                    <div className="text-gray-400 text-xs">Lines</div>
                  </div>
                  <div className="text-center min-w-[80px]">
                    <div className="text-gray-300 text-xs uppercase font-medium">{usage.language || 'UNKNOWN'}</div>
                    <div className="text-gray-500 text-xs">Language</div>
                  </div>
                </div>
              </div>
            ))}
            {data.recentUsage.length === 0 && (
              <div className="text-center py-12 px-6">
                <Code2 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No recent autocomplete usage</p>
                <p className="text-gray-500 text-sm">Start using autocomplete in VS Code to see activity here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
