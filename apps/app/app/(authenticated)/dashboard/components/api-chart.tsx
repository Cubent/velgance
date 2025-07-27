'use client';

import { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ChartData {
  date: string;
  requests: number;
  cubentUnits: number;
  tokens: number;
  inputTokens: number;
  outputTokens: number;
}

interface ApiChartProps {
  data: ChartData[];
  timeRange?: '7days' | 'monthly';
}

export function ApiChart({ data, timeRange = 'monthly' }: ApiChartProps) {
  const chartData = useMemo(() => {
    // If we have filtered data (e.g., for a specific month), use it directly
    if (data && data.length > 0) {
      // Check if the data is already filtered for a specific month
      const dates = data.map(item => new Date(item.date));
      const isFiltered = dates.length > 0 && dates.every(date => {
        const firstDate = dates[0];
        return date.getFullYear() === firstDate.getFullYear() &&
               date.getMonth() === firstDate.getMonth();
      });

      if (isFiltered && dates.length > 0) {
        // Data is filtered for a specific month, fill in all days of that month
        const firstDate = dates[0];
        const year = firstDate.getFullYear();
        const month = firstDate.getMonth();

        // Get the number of days in the selected month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Create a map of existing data for quick lookup
        const dataMap = new Map(data.map(item => [item.date, item]));

        const filledData = [];
        for (let day = 1; day <= daysInMonth; day++) {
          const currentDate = new Date(year, month, day);

          // Use local date string to avoid timezone issues
          const dateYear = currentDate.getFullYear();
          const dateMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
          const dateDay = String(currentDate.getDate()).padStart(2, '0');
          const dateStr = `${dateYear}-${dateMonth}-${dateDay}`;

          const existingData = dataMap.get(dateStr);
          filledData.push({
            date: currentDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            }),
            requests: existingData?.requests || 0,
            cubentUnits: existingData?.cubentUnits || 0,
            tokens: existingData?.tokens || 0,
            inputTokens: existingData?.inputTokens || 0,
            outputTokens: existingData?.outputTokens || 0,
          });
        }

        return filledData;
      }
    }

    // Use the same logic as other charts for consistency
    const today = new Date();
    const daysToShow = timeRange === '7days' ? 7 : 30;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (daysToShow - 1));

    const filledData = [];
    const dataMap = new Map(data.map(item => [item.date, item]));

    for (let i = 0; i < daysToShow; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      // Use local date string to avoid timezone issues
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const existingData = dataMap.get(dateStr);
      filledData.push({
        date: currentDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        requests: existingData?.requests || 0,
        cubentUnits: existingData?.cubentUnits || 0,
        tokens: existingData?.tokens || 0,
        inputTokens: existingData?.inputTokens || 0,
        outputTokens: existingData?.outputTokens || 0,
      });
    }

    return filledData;
  }, [data, timeRange]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg bg-[#1a1a1a] border border-[#333] p-3 shadow-lg">
          <p className="font-medium text-white text-sm mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <p className="text-sm text-gray-300">
                  {entry.name}: {entry.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorInputTokens" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" stopOpacity={1}/>
              <stop offset="100%" stopColor="#d97706" stopOpacity={0.3}/>
            </linearGradient>
            <linearGradient id="colorOutputTokens" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="1 1" stroke="#333" className="opacity-50" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            interval={timeRange === '7days' ? 0 : Math.floor(chartData.length / 6)}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="inputTokens"
            name="Total tokens in"
            stroke="#d97706"
            strokeWidth={0}
            fillOpacity={1}
            fill="url(#colorInputTokens)"
            stackId="1"
          />
          <Area
            type="monotone"
            dataKey="outputTokens"
            name="Total tokens out"
            stroke="#f59e0b"
            strokeWidth={0}
            fillOpacity={1}
            fill="url(#colorOutputTokens)"
            stackId="1"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
