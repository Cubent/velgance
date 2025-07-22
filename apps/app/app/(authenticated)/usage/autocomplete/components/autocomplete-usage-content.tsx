'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { Progress } from '@repo/ui/components/ui/progress';
import { Skeleton } from '@repo/ui/components/ui/skeleton';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Code2, 
  TrendingUp, 
  Zap, 
  Target, 
  Clock,
  FileText,
  Activity,
  BarChart3
} from 'lucide-react';

interface AutocompleteData {
  totalCompletions: number;
  totalAccepted: number;
  totalLinesAdded: number;
  totalCharactersAdded: number;
  avgLatency: number;
  avgAcceptanceRate: number;
  chartData: Array<{
    date: string;
    completions: number;
    accepted: number;
    lines: number;
    characters: number;
    acceptanceRate: number;
  }>;
  modelBreakdown: Array<{
    modelId: string;
    provider: string;
    completions: number;
    accepted: number;
    lines: number;
    characters: number;
    avgLatency: number;
    acceptanceRate: number;
  }>;
  recentSessions: Array<{
    id: string;
    modelId: string;
    provider: string;
    completions: number;
    accepted: number;
    lines: number;
    language: string;
    timestamp: string;
  }>;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

export function AutocompleteUsageContent() {
  const [data, setData] = useState<AutocompleteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchAutocompleteData();
  }, [timeRange]);

  const fetchAutocompleteData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/extension/track-autocomplete?days=${timeRange}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch autocomplete data');
      }

      const result = await response.json();
      setData(result.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching autocomplete data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatLatency = (ms: number) => {
    if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.round(ms)}ms`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Autocomplete Usage</h1>
            <p className="text-gray-400 mt-1">Track your AI autocomplete performance and statistics</p>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="bg-red-950/20 border-red-900/20">
          <CardContent className="p-6 text-center">
            <p className="text-red-400 mb-4">Error loading autocomplete data</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <Button onClick={fetchAutocompleteData} variant="outline" size="sm">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="bg-gray-900/20 border-gray-800/20">
          <CardContent className="p-6 text-center">
            <Code2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No autocomplete data available</p>
            <p className="text-gray-500 text-sm">Start using autocomplete in your VS Code extension to see statistics here.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Autocomplete Usage</h1>
          <p className="text-gray-400 mt-1">Track your AI autocomplete performance and statistics</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32 bg-gray-900 border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 days</SelectItem>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-gray-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Completions</p>
                <p className="text-2xl font-semibold text-white">{formatNumber(data.totalCompletions)}</p>
              </div>
              <Code2 className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Accepted</p>
                <p className="text-2xl font-semibold text-white">{formatNumber(data.totalAccepted)}</p>
                <p className="text-green-400 text-xs">
                  {data.totalCompletions > 0 ? `${((data.totalAccepted / data.totalCompletions) * 100).toFixed(1)}%` : '0%'} acceptance rate
                </p>
              </div>
              <Target className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Lines Added</p>
                <p className="text-2xl font-semibold text-white">{formatNumber(data.totalLinesAdded)}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Latency</p>
                <p className="text-2xl font-semibold text-white">{formatLatency(data.avgLatency)}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Over Time */}
        <Card className="bg-gray-900/50 border-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Usage Over Time
            </CardTitle>
            <CardDescription>Daily autocomplete completions and acceptance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="completions" stroke="#3B82F6" strokeWidth={2} name="Generated" />
                <Line type="monotone" dataKey="accepted" stroke="#10B981" strokeWidth={2} name="Accepted" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Model Breakdown */}
        <Card className="bg-gray-900/50 border-gray-800/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Model Performance
            </CardTitle>
            <CardDescription>Completion statistics by AI model</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.modelBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="modelId" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="completions" fill="#3B82F6" name="Generated" />
                <Bar dataKey="accepted" fill="#10B981" name="Accepted" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Model Details */}
      <Card className="bg-gray-900/50 border-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white">Model Details</CardTitle>
          <CardDescription>Detailed performance metrics for each AI model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.modelBreakdown.map((model, index) => (
              <div key={model.modelId} className="p-4 bg-gray-800/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div>
                      <h3 className="text-white font-medium">{model.modelId}</h3>
                      <p className="text-gray-400 text-sm capitalize">{model.provider}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-gray-300">
                    {formatLatency(model.avgLatency)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Completions</p>
                    <p className="text-white font-medium">{formatNumber(model.completions)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Accepted</p>
                    <p className="text-white font-medium">{formatNumber(model.accepted)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Lines Added</p>
                    <p className="text-white font-medium">{formatNumber(model.lines)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Acceptance Rate</p>
                    <p className="text-white font-medium">{model.acceptanceRate.toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Acceptance Rate</span>
                    <span>{model.acceptanceRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={model.acceptanceRate} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
