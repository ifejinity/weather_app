'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import CurrentWeatherCard from '@/components/CurrentWeatherCard';
import ForecastList from '@/components/ForecastList';
import WeatherBackground from '@/components/WeatherBackground';
import { useWeather } from '@/lib/swr';
import type { WeatherTheme, WeatherConditionGroup } from '@/types/weather';

const defaultTheme: WeatherTheme = {
  gradientFrom: 'from-slate-500',
  gradientTo: 'to-slate-700',
  accentColor: 'text-slate-300',
  textColor: 'text-white',
  iconColor: 'text-slate-200',
  cardBg: 'bg-white/10',
  labelColor: 'text-slate-200',
};

export default function Home() {
  const [searchCity, setSearchCity] = useState<string | null>(null);
  const { weatherData, isLoading, isError } = useWeather(searchCity);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (city: string) => {
    setSearchCity(city);
  };

  const theme = weatherData?._theme ?? defaultTheme;
  const conditionGroup: WeatherConditionGroup = weatherData?._conditionGroup ?? 'default';

  return (
    <div className="fixed inset-0">
      <WeatherBackground conditionGroup={conditionGroup} theme={theme} />
      <main className="relative z-10 h-full overflow-y-auto">
        <div className="flex flex-col items-center px-4 sm:px-6 py-6 sm:py-10 min-h-screen">
          <div className="w-full max-w-3xl mx-auto">
            <header className="text-center mb-8 sm:mb-10">
              <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-3 tracking-tight">
                  Weather
                </h1>
                <p className="text-white/50 text-sm sm:text-base font-light tracking-wide">
                  Search for a city to get current weather and forecast
                </p>
              </div>
            </header>

            <div className={`transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </div>

            <section className="mt-8 min-h-[200px]" aria-live="polite">
              {isLoading && !weatherData && (
                <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                  <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                    <div className="absolute inset-0 border-4 border-t-white/80 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-white/60 text-lg font-light">Fetching weather data...</p>
                </div>
              )}

              {isError && (
                <div className="mt-6 p-5 bg-red-500/10 backdrop-blur-sm border border-red-400/20 rounded-2xl text-red-200 text-center animate-fade-in">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Unable to fetch data</span>
                  </div>
                  <p className="text-sm text-red-200/80">{isError.message || 'Failed to fetch weather data. Please try again.'}</p>
                </div>
              )}

              {!weatherData && !isLoading && !isError && searchCity && (
                <div className="mt-6 text-center text-white/50 animate-fade-in py-12">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-light">No data available for this location.</p>
                  <p className="text-sm mt-1 opacity-70">Please check the city name and try again.</p>
                </div>
              )}

              {weatherData && (
                <div className={`mt-8 space-y-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <article aria-label="Current weather">
                    <CurrentWeatherCard data={weatherData} theme={theme} />
                  </article>
                  <section aria-label="5-day forecast">
                    <ForecastList forecast={weatherData.forecast} theme={theme} />
                  </section>
                </div>
              )}
            </section>
          </div>

          <footer className="mt-auto pt-16 text-center space-y-3">
            <a
              href="https://jefflonzanida.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-full text-white/80 hover:text-white text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Built by Jeffrey Lonzanida
            </a>
            <p className="text-white/20 text-xs font-light tracking-wide">
              Powered by OpenWeatherMap
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
