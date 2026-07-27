import useSWR, { type KeyedMutator } from 'swr';
import { fetchCurrentWeather, fetchForecast, transformWeatherData } from './weather';
import type { CurrentWeatherResponse, ForecastResponse, WeatherData } from '@/types/weather';

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) {
    return res.json().then((d: { message?: string }) => {
      throw new Error(d.message || `Request failed with status ${res.status}`);
    });
  }
  return res.json();
});

export function useWeather(city: string | null) {
  const currentQuery = useSWR<CurrentWeatherResponse>(
    city ? `/api/weather?city=${encodeURIComponent(city)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
      errorRetryCount: 2,
    }
  );

  const forecastQuery = useSWR<ForecastResponse>(
    city ? `/api/forecast?city=${encodeURIComponent(city)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
      errorRetryCount: 2,
    }
  );

  const isLoading = currentQuery.isLoading || forecastQuery.isLoading;
  const isError = currentQuery.error ?? forecastQuery.error;
  const currentData = currentQuery.data;
  const forecastData = forecastQuery.data;

  let weatherData: WeatherData | null = null;
  if (currentData && forecastData) {
    weatherData = transformWeatherData(currentData, forecastData);
  }

  const refresh = () => {
    if (!city) return Promise.resolve();
    return Promise.all([
      currentQuery.mutate(),
      forecastQuery.mutate(),
    ]);
  };

  return {
    weatherData,
    isLoading,
    isError: isError as Error | null,
    isSearching: city !== null && !isLoading && !isError && !weatherData,
    refresh: refresh as () => Promise<void>,
  };
}

export { fetcher };