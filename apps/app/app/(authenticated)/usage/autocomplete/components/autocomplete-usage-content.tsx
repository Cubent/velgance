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
  const [linesPerPage, setLinesPerPage] = useState('10');
  const [currentPage, setCurrentPage] = useState(0);

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

      {/* Recent Usage */}
      <Card className="bg-[#1a1a1a] border border-[#333]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">Recent Usage</CardTitle>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>LINES PER PAGE</span>
              <Select value={linesPerPage} onValueChange={(value) => {
                setLinesPerPage(value);
                setCurrentPage(0); // Reset to first page when changing lines per page
              }}>
                <SelectTrigger className="w-16 h-8 bg-[#111] border-[#333] text-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-[#333]">
                  <SelectItem value="5" className="text-white hover:bg-[#333] text-xs">5</SelectItem>
                  <SelectItem value="10" className="text-white hover:bg-[#333] text-xs">10</SelectItem>
                  <SelectItem value="20" className="text-white hover:bg-[#333] text-xs">20</SelectItem>
                  <SelectItem value="50" className="text-white hover:bg-[#333] text-xs">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Column Headers */}
          <div className="flex items-center justify-center px-4 py-3 border-b border-[#333] bg-[#111]">
            <div className="grid grid-cols-6 gap-4 w-full max-w-5xl items-center">
              <div className="text-left">
                <span className="text-gray-400 text-xs font-medium uppercase">Date & Time</span>
              </div>
              <div className="text-center">
                <span className="text-gray-400 text-xs font-medium uppercase">Model</span>
              </div>
              <div className="text-center">
                <span className="text-gray-400 text-xs font-medium uppercase">Generated</span>
              </div>
              <div className="text-center">
                <span className="text-gray-400 text-xs font-medium uppercase">Accepted</span>
              </div>
              <div className="text-center">
                <span className="text-gray-400 text-xs font-medium uppercase">Lines</span>
              </div>
              <div className="text-center">
                <span className="text-gray-400 text-xs font-medium uppercase">Language</span>
              </div>
            </div>
          </div>

          <div className="space-y-0">
            {data.recentUsage.slice(currentPage * parseInt(linesPerPage), (currentPage + 1) * parseInt(linesPerPage)).map((usage, index, array) => (
              <div key={usage.id} className={`flex items-center justify-center px-4 py-2 ${index !== array.length - 1 ? 'border-b border-[#333]' : ''}`}>
                <div className="grid grid-cols-6 gap-4 w-full max-w-5xl items-center">
                  <div className="text-left">
                    <span className="text-white text-xs">
                      {formatDate(usage.timestamp)} at {formatTime(usage.timestamp)}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-white text-sm capitalize">{usage.modelId}</span>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-sm">{usage.completions}</div>
                    <div className="text-gray-400 text-xs">Generated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-sm">{usage.accepted}</div>
                    <div className="text-gray-400 text-xs">Accepted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-sm">{usage.lines}</div>
                    <div className="text-gray-400 text-xs">Lines</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-300 text-xs uppercase">{usage.language || 'UNKNOWN'}</div>
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

          {/* Pagination Controls */}
          {data.recentUsage.length > parseInt(linesPerPage) && (
            <div className="flex items-center justify-center px-4 py-3 border-t border-[#333] bg-[#111]">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="bg-[#1a1a1a] border-[#333] text-white hover:bg-[#333] text-xs"
                >
                  Previous
                </Button>
                <span className="text-gray-400 text-xs">
                  Page {currentPage + 1} of {Math.ceil(data.recentUsage.length / parseInt(linesPerPage))}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(Math.ceil(data.recentUsage.length / parseInt(linesPerPage)) - 1, currentPage + 1))}
                  disabled={currentPage >= Math.ceil(data.recentUsage.length / parseInt(linesPerPage)) - 1}
                  className="bg-[#1a1a1a] border-[#333] text-white hover:bg-[#333] text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
