import type { WeatherData, WeatherTheme } from '@/types/weather';

interface CurrentWeatherCardProps {
  data: WeatherData;
  theme: WeatherTheme;
}

function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return dirs[index];
}

export default function CurrentWeatherCard({ data, theme }: CurrentWeatherCardProps) {
  const { current } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${current.conditions.icon}@4x.png`;
  
  return (
    <div className={`${theme.cardBg} backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-black/20 overflow-hidden transition-all duration-500 hover:shadow-black/40 hover:scale-[1.005] animate-fade-in-up`}>
      <div className="p-8 sm:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4 relative">
            <div className="absolute -inset-4 bg-white/5 rounded-full blur-2xl" />
            <img
              src={iconUrl}
              alt={current.conditions.description}
              className="w-28 h-28 sm:w-32 sm:h-32 relative z-10 animate-scale-in"
              loading="eager"
            />
          </div>
          <div className="mb-2">
            <span className={`text-3xl font-semibold ${theme.labelColor} tracking-widest uppercase text-xs animate-fade-in-up`} style={{ animationDelay: '80ms' }}>
              {data.location}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className={`text-7xl sm:text-8xl font-bold ${theme.textColor} tracking-tighter leading-none animate-fade-in-up`} style={{ animationDelay: '140ms' }}>
              {current.temp}°
            </span>
            <span className={`text-2xl font-medium ${theme.labelColor} animate-fade-in-up`} style={{ animationDelay: '200ms' }}>C</span>
          </div>
          <p className={`text-lg ${theme.labelColor} capitalize font-light tracking-wide animate-fade-in-up`} style={{ animationDelay: '260ms' }}>
            {current.conditions.description}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className={`${theme.cardBg} rounded-2xl p-4 border border-white/5 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.14] hover:scale-[1.03] animate-fade-in-up`} style={{ animationDelay: '320ms' }}>
            <p className={`text-xs ${theme.labelColor} uppercase tracking-widest mb-1.5 font-medium opacity-80`}>Feels Like</p>
            <p className={`text-xl font-semibold ${theme.textColor}`}>{current.feelsLike}°</p>
          </div>
          <div className={`${theme.cardBg} rounded-2xl p-4 border border-white/5 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.14] hover:scale-[1.03] animate-fade-in-up`} style={{ animationDelay: '380ms' }}>
            <p className={`text-xs ${theme.labelColor} uppercase tracking-widest mb-1.5 font-medium opacity-80`}>High / Low</p>
            <p className={`text-xl font-semibold ${theme.textColor}`}>
              {current.tempMax}° / {current.tempMin}°
            </p>
          </div>
          <div className={`${theme.cardBg} rounded-2xl p-4 border border-white/5 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.14] hover:scale-[1.03] animate-fade-in-up`} style={{ animationDelay: '440ms' }}>
            <p className={`text-xs ${theme.labelColor} uppercase tracking-widest mb-1.5 font-medium opacity-80`}>Humidity</p>
            <p className={`text-xl font-semibold ${theme.textColor}`}>{current.humidity}%</p>
          </div>
          <div className={`${theme.cardBg} rounded-2xl p-4 border border-white/5 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.14] hover:scale-[1.03] animate-fade-in-up`} style={{ animationDelay: '500ms' }}>
            <p className={`text-xs ${theme.labelColor} uppercase tracking-widest mb-1.5 font-medium opacity-80`}>Wind</p>
            <p className={`text-xl font-semibold ${theme.textColor}`}>
              {Math.round(current.windSpeed * 3.6)} km/h
            </p>
            <p className={`text-xs ${theme.labelColor} opacity-70`}>{getWindDirection(current.windDeg)}</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          <div className={`flex items-center gap-2.5 ${theme.labelColor} bg-white/5 rounded-full px-4 py-2 border border-white/5 transition-all duration-300 hover:bg-white/10 animate-fade-in-up`} style={{ animationDelay: '560ms' }}>
            <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-medium">{Math.round(current.pressure)} hPa</span>
          </div>
          <div className={`flex items-center gap-2.5 ${theme.labelColor} bg-white/5 rounded-full px-4 py-2 border border-white/5 transition-all duration-300 hover:bg-white/10 animate-fade-in-up`} style={{ animationDelay: '620ms' }}>
            <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-sm font-medium">{Math.round(current.visibility / 1000)} km</span>
          </div>
          <div className={`flex items-center gap-2.5 ${theme.labelColor} bg-white/5 rounded-full px-4 py-2 border border-white/5 transition-all duration-300 hover:bg-white/10 animate-fade-in-up`} style={{ animationDelay: '680ms' }}>
            <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm font-medium">{current.cloudCover}% clouds</span>
          </div>
        </div>
      </div>
    </div>
  );
}
