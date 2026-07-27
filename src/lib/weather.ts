import type {
  CurrentWeatherResponse,
  ForecastResponse,
  WeatherData,
  WeatherConditionGroup,
  WeatherTheme,
} from '@/types/weather';

const API_BASE = 'https://api.openweathermap.org/data/2.5';

function getConditionGroup(main: string): WeatherConditionGroup {
  const map: Record<string, WeatherConditionGroup> = {
    Clear: 'clear',
    Clouds: 'clouds',
    Rain: 'rain',
    Drizzle: 'drizzle',
    Thunderstorm: 'thunderstorm',
    Snow: 'snow',
    Mist: 'mist',
    Fog: 'fog',
    Haze: 'mist',
    Smoke: 'mist',
    Dust: 'mist',
    Sand: 'mist',
    Ash: 'mist',
    Squall: 'rain',
    Tornado: 'default',
  };
  return map[main] ?? 'default';
}

function getWeatherTheme(group: WeatherConditionGroup): WeatherTheme {
  const themes: Record<WeatherConditionGroup, WeatherTheme> = {
    clear: {
      gradientFrom: 'from-amber-400',
      gradientTo: 'to-orange-500',
      accentColor: 'text-amber-400',
      textColor: 'text-white',
      iconColor: 'text-yellow-300',
      cardBg: 'bg-white/10',
      labelColor: 'text-amber-100',
    },
    clouds: {
      gradientFrom: 'from-gray-400',
      gradientTo: 'to-gray-600',
      accentColor: 'text-gray-300',
      textColor: 'text-white',
      iconColor: 'text-gray-200',
      cardBg: 'bg-white/10',
      labelColor: 'text-gray-200',
    },
    rain: {
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-indigo-700',
      accentColor: 'text-blue-300',
      textColor: 'text-white',
      iconColor: 'text-blue-200',
      cardBg: 'bg-white/10',
      labelColor: 'text-blue-100',
    },
    drizzle: {
      gradientFrom: 'from-blue-400',
      gradientTo: 'to-cyan-600',
      accentColor: 'text-blue-200',
      textColor: 'text-white',
      iconColor: 'text-blue-100',
      cardBg: 'bg-white/10',
      labelColor: 'text-blue-100',
    },
    thunderstorm: {
      gradientFrom: 'from-violet-700',
      gradientTo: 'to-indigo-900',
      accentColor: 'text-violet-300',
      textColor: 'text-white',
      iconColor: 'text-purple-200',
      cardBg: 'bg-white/10',
      labelColor: 'text-violet-100',
    },
    snow: {
      gradientFrom: 'from-slate-300',
      gradientTo: 'to-blue-200',
      accentColor: 'text-slate-200',
      textColor: 'text-gray-900',
      iconColor: 'text-white',
      cardBg: 'bg-white/15',
      labelColor: 'text-gray-800',
    },
    mist: {
      gradientFrom: 'from-stone-400',
      gradientTo: 'to-stone-600',
      accentColor: 'text-stone-300',
      textColor: 'text-white',
      iconColor: 'text-stone-200',
      cardBg: 'bg-white/10',
      labelColor: 'text-stone-200',
    },
    fog: {
      gradientFrom: 'from-stone-400',
      gradientTo: 'to-stone-600',
      accentColor: 'text-stone-300',
      textColor: 'text-white',
      iconColor: 'text-stone-200',
      cardBg: 'bg-white/10',
      labelColor: 'text-stone-200',
    },
    default: {
      gradientFrom: 'from-slate-500',
      gradientTo: 'to-slate-700',
      accentColor: 'text-slate-300',
      textColor: 'text-white',
      iconColor: 'text-slate-200',
      cardBg: 'bg-white/10',
      labelColor: 'text-slate-200',
    },
  };
  return themes[group];
}

function kelvinToCelsius(kelvin: number): number {
  return Math.round(kelvin - 273.15);
}

function formatWindSpeed(ms: number): string {
  const kmh = ms * 3.6;
  if (kmh < 1) return `${Math.round(ms * 3.6 * 10) / 10} m/s`;
  return `${Math.round(kmh)} km/h`;
}

function formatVisibility(meters: number): string {
  if (meters >= 1000) return `${meters / 1000} km`;
  return `${meters} m`;
}

function formatPressure(hPa: number): string {
  return `${hPa} hPa`;
}

function getDayName(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function getHour(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false });
}

export async function fetchCurrentWeather(
  city: string,
  apiKey: string
): Promise<CurrentWeatherResponse> {
  const url = `${API_BASE}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message = data.message || `HTTP ${res.status}`;
    throw new Error(message);
  }
  return res.json();
}

export async function fetchForecast(
  city: string,
  apiKey: string
): Promise<ForecastResponse> {
  const url = `${API_BASE}/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message = data.message || `HTTP ${res.status}`;
    throw new Error(message);
  }
  return res.json();
}

export function transformWeatherData(
  current: CurrentWeatherResponse,
  forecast: ForecastResponse
): WeatherData {
  const group = getConditionGroup(current.weather[0].main);
  const theme = getWeatherTheme(group);

  const dailyForecast = forecast.list.filter((item, index) => {
    const date = new Date(item.dt * 1000);
    return date.getHours() === 12 && index % 8 === 0;
  });

  return {
    location: current.name,
    country: current.sys.country,
    current: {
      temp: (current.main.temp),
      feelsLike: (current.main.feels_like),
      tempMin: (current.main.temp_min),
      tempMax: (current.main.temp_max),
      humidity: current.main.humidity,
      pressure: current.main.pressure,
      windSpeed: current.wind.speed,
      windDeg: current.wind.deg,
      windGust: current.wind.gust ?? 0,
      visibility: current.visibility,
      cloudCover: current.clouds.all,
      conditions: current.weather[0],
      sunrise: current.sys.sunrise,
      sunset: current.sys.sunset,
    },
    forecast:  forecast.list,
    _theme: theme,
    _conditionGroup: group,
  };
}

export { getConditionGroup, getWeatherTheme, kelvinToCelsius, formatWindSpeed, formatVisibility, formatPressure, getDayName, getHour };