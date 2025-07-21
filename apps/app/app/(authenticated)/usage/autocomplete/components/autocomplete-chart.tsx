'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface AutocompleteChartData {
  date: string;
  completions: number;
  linesWritten: number;
}

interface AutocompleteChartProps {
  data: AutocompleteChartData[];
}

export const AutocompleteChart = ({ data }: AutocompleteChartProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">{formatDate(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="completionsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="linesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="date" 
          tickFormatter={formatDate}
          axisLine={false}
          tickLine={false}
          className="text-xs"
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          className="text-xs"
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="completions"
          stackId="1"
          stroke="#8884d8"
          fill="url(#completionsGradient)"
          name="Completions"
        />
        <Area
          type="monotone"
          dataKey="linesWritten"
          stackId="2"
          stroke="#82ca9d"
          fill="url(#linesGradient)"
          name="Lines Written"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
