'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/design-system/components/ui/tabs';
import { Progress } from '@repo/design-system/components/ui/progress';
import {
  Activity,
  Zap,
  Clock,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Filter,
  ExternalLink,
  BarChart3,
  PieChart,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { ApiChart } from './api-chart';
import { RequestsTable } from './requests-table';
import { ModelBreakdown } from './model-breakdown';


interface DashboardData {
  totalRequests: number;
  totalCubentUnits: number;
  totalTokens: number;
  totalInputTokens?: number;
  totalOutputTokens?: number;
  totalCost: number;
  avgResponseTime: number;
  chartData: Array<{
    date: string;
    requests: number;
    cubentUnits: number;
    tokens: number;
    inputTokens: number;
    outputTokens: number;
  }>;
  modelBreakdown: Array<{
    modelId: string;
    requests: number;
    cubentUnits: number;
    tokens: number;
    cost: number;
  }>;
  recentAnalytics: any[];
  activeSessions: number;
  userLimit: number;
  subscriptionTier: string;
}

interface DashboardContentProps {
  data: DashboardData;
}

export function DashboardContent({ data }: DashboardContentProps) {
  const [timeRange, setTimeRange] = useState<'7days' | 'monthly'>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());

  const usagePercentage = (data.totalCubentUnits / data.userLimit) * 100;
  const isNearLimit = usagePercentage > 80;
  const isOverLimit = usagePercentage > 100;

  // Helper function to format time for recent requests
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatCurrentPeriod = () => {
    if (timeRange === '7days') {
      return 'Last 7 days';
    } else {
      return currentDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
    }
  };

  // Filter chart data based on current selection
  const getFilteredChartData = () => {
    if (timeRange === '7days') {
      // Show last 7 days of data
      return data.chartData.slice(-7);
    } else {
      // Filter data by selected month and year
      const selectedYear = currentDate.getFullYear();
      const selectedMonth = currentDate.getMonth();

      return data.chartData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getFullYear() === selectedYear &&
               itemDate.getMonth() === selectedMonth;
      });
    }
  };

  return (
    <div className="space-y-6 p-6 bg-[#1f1f1f] min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Usage</h1>
        </div>
        <div className="flex items-center space-x-3">
          <select
            className="bg-[#1a1a1a] border border-[#333] text-white px-3 py-1.5 rounded-md text-sm font-medium text-center"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7days' | 'monthly')}
          >
            <option value="monthly">Month</option>
            <option value="7days">Last 7 days</option>
          </select>
          {timeRange === 'monthly' && (
            <div className="flex items-center space-x-2">
              <button
                className="text-white hover:text-gray-300"
                onClick={() => navigateMonth('prev')}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="text-white font-medium min-w-[120px] text-center">
                {formatCurrentPeriod()}
              </span>
              <button
                className="text-white hover:text-gray-300"
                onClick={() => navigateMonth('next')}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          {timeRange === '7days' && (
            <span className="text-white font-medium">
              {formatCurrentPeriod()}
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-3">
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
          <div className="text-sm font-medium text-gray-400 mb-2">Total tokens in</div>
          <div className="text-3xl font-bold text-white">{(data.totalInputTokens || data.totalTokens).toLocaleString()}</div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
          <div className="text-sm font-medium text-gray-400 mb-2">Total tokens out</div>
          <div className="text-3xl font-bold text-white">{(data.totalOutputTokens || Math.floor(data.totalTokens * 0.15)).toLocaleString()}</div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-400">Total web searches</div>
            <div className="text-xs text-gray-500">No data</div>
          </div>
          <div className="text-3xl font-bold text-white">0</div>
        </div>
      </div>

      {/* Token Usage Chart */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-1">Token usage</h3>
          <p className="text-sm text-gray-400">Includes usage from both API and Console</p>
        </div>
        <div className="h-[400px]">
          <ApiChart data={getFilteredChartData()} timeRange={timeRange} />
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Recent Requests</h3>
            <p className="text-sm text-gray-400">Latest API activity</p>
          </div>
          <Link href="/usage/requests">
            <Button variant="outline" className="bg-transparent border-[#333] text-white hover:bg-[#2a2a2a] text-sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View all requests
            </Button>
          </Link>
        </div>
        <div className="space-y-2">
          {data.recentAnalytics && data.recentAnalytics.length > 0 ? (
            data.recentAnalytics.slice(0, 8).map((request: any) => (
              <div key={request.id} className="flex items-center justify-between py-2 px-3 bg-[#161616] rounded border border-[#333]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {request.modelId}
                      <span className="text-xs text-gray-400 ml-2 font-normal">
                        {formatTime(new Date(request.createdAt))} • API Request
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{request.requestsMade} req</p>
                  <p className="text-xs text-gray-400">{request.cubentUnitsUsed.toFixed(2)} units</p>
                </div>
              </div>
            ))
          ) : (
            <div className="h-[150px] flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-white mb-1">No recent requests</div>
                <p className="text-gray-400 text-xs">API activity will appear here once you start making requests</p>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
