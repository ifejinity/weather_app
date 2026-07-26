export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}

export interface WindData {
  speed: number;
  deg: number;
  gust: number;
}

export interface CurrentWeatherResponse {
  coord: {
    lat: number;
    lon: number;
  };
  weather: WeatherCondition[];
  base: string;
  main: MainWeatherData;
  visibility: number;
  wind: WindData;
  rain?: {
    '1h': number;
  };
  snow?: {
    '1h': number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: WeatherCondition[];
  clouds: {
    all: number;
  };
  wind: WindData;
  visibility: number;
  pop: number;
  rain?: {
    '3h': number;
  };
  snow?: {
    '3h': number;
  };
  sys: {
    pod: string;
  };
  dt_iso: string;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface WeatherData {
  location: string;
  country: string;
  current: {
    temp: number;
    feelsLike: number;
    tempMin: number;
    tempMax: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDeg: number;
    windGust: number;
    visibility: number;
    cloudCover: number;
    conditions: WeatherCondition;
    sunrise: number;
    sunset: number;
  };
  forecast: ForecastItem[];
  _theme: WeatherTheme;
  _conditionGroup: WeatherConditionGroup;
}

export type WeatherConditionGroup =
  | 'clear'
  | 'clouds'
  | 'rain'
  | 'drizzle'
  | 'thunderstorm'
  | 'snow'
  | 'mist'
  | 'fog'
  | 'default';

export interface WeatherTheme {
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  textColor: string;
  iconColor: string;
  cardBg: string;
  labelColor: string;
}