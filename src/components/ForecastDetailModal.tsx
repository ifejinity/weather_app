'use client';

import { useEffect } from 'react';
import type { ForecastItem, WeatherTheme } from '@/types/weather';

interface ForecastDetailModalProps {
  item: ForecastItem;
  theme: WeatherTheme;
  onClose: () => void;
}

function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return dirs[index];
}

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

export default function ForecastDetailModal({ item, theme, onClose }: ForecastDetailModalProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@4x.png`;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={`relative ${theme.cardBg} backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl shadow-black/40 w-full max-w-lg overflow-hidden animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 sm:p-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className={`text-2xl font-bold ${theme.textColor} tracking-tight`}>
                {formatTime(item.dt_txt)}
              </h2>
              <p className={`text-sm ${theme.labelColor} opacity-70 mt-1`}>
                Detailed Forecast
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label="Close details"
            >
              <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-4">
              <div className="absolute -inset-4 bg-white/5 rounded-full blur-2xl" />
              <img
                src={iconUrl}
                alt={item.weather[0].description}
                className="w-24 h-24 sm:w-28 sm:h-28 relative z-10"
                loading="eager"
              />
            </div>
            <p className={`text-4xl font-bold ${theme.textColor} mb-1 tracking-tight`}>
              {Math.round(item.main.temp)}°
            </p>
            <p className={`text-lg ${theme.labelColor} capitalize font-light`}>
              {item.weather[0].description}
            </p>
            <p className={`text-sm ${theme.labelColor} opacity-70 mt-1`}>
              Feels like {Math.round(item.main.feels_like)}°
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`${theme.cardBg} rounded-2xl p-4 border border-white/5 text-center backdrop-blur-sm`}>
              <p className={`text-xs ${theme.labelColor} uppercase tracking-widest mb-1.5 font-medium opacity-80`}>High / Low</p>
              <p className={`text-xl font-semibold ${theme.textColor}`}>
                {Math.round(item.main.temp_max)}° / {Math.round(item.main.temp_min)}°
              </p>
            </div>
            <div className={`${theme.cardBg} rounded-2xl p-4 border border-white/5 text-center backdrop-blur-sm`}>
              <p className={`text-xs ${theme.labelColor} uppercase tracking-widest mb-1.5 font-medium opacity-80`}>Humidity</p>
              <p className={`text-xl font-semibold ${theme.textColor}`}>{item.main.humidity}%</p>
            </div>
            <div className={`${theme.cardBg} rounded-2xl p-4 border border-white/5 text-center backdrop-blur-sm`}>
              <p className={`text-xs ${theme.labelColor} uppercase tracking-widest mb-1.5 font-medium opacity-80`}>Wind</p>
              <p className={`text-xl font-semibold ${theme.textColor}`}>
                {Math.round(item.wind.speed * 3.6)} km/h
              </p>
              <p className={`text-xs ${theme.labelColor} opacity-70`}>
                {getWindDirection(item.wind.deg)} {item.wind.gust ? `· Gust ${Math.round(item.wind.gust * 3.6)} km/h` : ''}
              </p>
            </div>
            <div className={`${theme.cardBg} rounded-2xl p-4 border border-white/5 text-center backdrop-blur-sm`}>
              <p className={`text-xs ${theme.labelColor} uppercase tracking-widest mb-1.5 font-medium opacity-80`}>Pressure</p>
              <p className={`text-xl font-semibold ${theme.textColor}`}>{Math.round(item.main.pressure)} hPa</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <div className={`flex items-center gap-2.5 ${theme.labelColor} bg-white/5 rounded-full px-4 py-2 border border-white/5`}>
              <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-sm font-medium">{Math.round(item.clouds.all)}% clouds</span>
            </div>
            <div className={`flex items-center gap-2.5 ${theme.labelColor} bg-white/5 rounded-full px-4 py-2 border border-white/5`}>
              <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-medium">{Math.round(item.pop * 100)}% precip.</span>
            </div>
            {item.visibility && (
              <div className={`flex items-center gap-2.5 ${theme.labelColor} bg-white/5 rounded-full px-4 py-2 border border-white/5`}>
                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-sm font-medium">{item.visibility >= 1000 ? `${item.visibility / 1000} km` : `${item.visibility} m`}</span>
              </div>
            )}
            {item.rain && (
              <div className={`flex items-center gap-2.5 ${theme.labelColor} bg-white/5 rounded-full px-4 py-2 border border-white/5`}>
                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <span className="text-sm font-medium">Rain: {item.rain['3h']} mm</span>
              </div>
            )}
            {item.snow && (
              <div className={`flex items-center gap-2.5 ${theme.labelColor} bg-white/5 rounded-full px-4 py-2 border border-white/5`}>
                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <span className="text-sm font-medium">Snow: {item.snow['3h']} mm</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
