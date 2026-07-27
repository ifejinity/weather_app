'use client';

import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ForecastItem, WeatherTheme } from '@/types/weather';

interface ForecastChartProps {
  forecast: ForecastItem[];
  theme: WeatherTheme;
}

type ChartMetric = 'temperature' | 'wind' | 'humidity';

const METRICS: { key: ChartMetric; label: string; shortLabel: string; color: string }[] = [
  { key: 'temperature', label: 'Temperature', shortLabel: 'Temp', color: 'rgba(255,255,255,0.85)' },
  { key: 'wind', label: 'Wind', shortLabel: 'Wind', color: 'rgba(147,197,253,0.85)' },
  { key: 'humidity', label: 'Humidity', shortLabel: 'Hum', color: 'rgba(94,234,212,0.85)' },
];

function formatTime(dtTxt: string): string {
  const date = new Date(dtTxt);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatShortTime(dtTxt: string): string {
  const date = new Date(dtTxt);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function ForecastChart({ forecast, theme }: ForecastChartProps) {
  const [activeMetric, setActiveMetric] = useState<ChartMetric>('temperature');

  const chartData = useMemo(() => {
    return forecast.map((item) => ({
      time: formatShortTime(item.dt_txt),
      fullTime: formatTime(item.dt_txt),
      temperature: Math.round(item.main.temp),
      wind: Math.round(item.wind.speed * 3.6),
      humidity: item.main.humidity,
      pop: Math.round(item.pop * 100),
    }));
  }, [forecast]);

  const metric = METRICS.find((m) => m.key === activeMetric)!;

  const getYAxisDomain = () => {
    if (activeMetric === 'temperature') {
      const values = chartData.map((d) => d.temperature);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const padding = (max - min) * 0.15 || 2;
      return [Math.floor(min - padding), Math.ceil(max + padding)];
    }
    if (activeMetric === 'wind') {
      const values = chartData.map((d) => d.wind);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const padding = (max - min) * 0.15 || 2;
      return [Math.max(0, Math.floor(min - padding)), Math.ceil(max + padding)];
    }
    const values = chartData.map((d) => d.humidity);
    return [0, Math.min(100, Math.max(...values) + 10)];
  };

  const getUnit = () => {
    if (activeMetric === 'temperature') return '°C';
    if (activeMetric === 'wind') return 'km/h';
    return '%';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
    return (
      <div className={`${theme.cardBg} backdrop-blur-xl rounded-xl border border-white/10 p-3 shadow-2xl`}>
        <p className={`text-xs ${theme.labelColor} opacity-70 mb-1`}>{data.fullTime}</p>
        <p className={`text-sm font-semibold ${theme.textColor}`}>
          {metric.label}: {payload[0].value}{getUnit()}
        </p>
        <p className={`text-xs ${theme.labelColor} opacity-70 mt-0.5`}>
          Precip: {data.pop}%
        </p>
      </div>
    );
  };

  return (
    <div className={`${theme.cardBg} backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-black/20 overflow-hidden animate-card-enter`} style={{ animationDelay: '240ms' }}>
      <div className="p-4 sm:p-8 sm:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className={`text-xl sm:text-2xl font-bold ${theme.textColor} tracking-tight`}>
            Forecast Trends
          </h3>
          <div className="flex items-center gap-1 p-1 bg-white/5 rounded-full border border-white/5 w-fit">
            {METRICS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setActiveMetric(m.key)}
                className={`px-2.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeMetric === m.key
                    ? 'bg-white/15 text-white shadow-sm'
                    : `${theme.labelColor} opacity-60 hover:opacity-100 hover:bg-white/5`
                }`}
              >
                {m.shortLabel}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-56 sm:h-64 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="time"
                stroke="rgba(255,255,255,0.25)"
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis
                stroke="rgba(255,255,255,0.25)"
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                domain={getYAxisDomain()}
                unit={getUnit()}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeDasharray: '3 3' }} />
              <Line
                type="monotone"
                dataKey={activeMetric}
                stroke={metric.color}
                strokeWidth={2.5}
                dot={{ r: 3, fill: metric.color, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: metric.color, strokeWidth: 2, stroke: 'rgba(255,255,255,0.3)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
