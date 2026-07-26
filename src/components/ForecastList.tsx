import type { ForecastItem, WeatherTheme } from '@/types/weather';

interface ForecastListProps {
  forecast: ForecastItem[];
  theme: WeatherTheme;
}

function getDayLabel(dtTxt: string): string {
  const date = new Date(dtTxt);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function getTimeLabel(dtTxt: string): string {
  const date = new Date(dtTxt);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false });
}

export default function ForecastList({ forecast, theme }: ForecastListProps) {
  if (forecast.length === 0) {
    return null;
  }

  return (
    <div className={`${theme.cardBg} backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-black/20 overflow-hidden animate-slide-up`}>
      <div className="p-8 sm:p-10">
        <h3 className={`text-2xl sm:text-3xl font-bold ${theme.textColor} mb-8 tracking-tight`}>
          5-Day Forecast
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {forecast.map((item, index) => {
            const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
            const dayLabel = index === 0 ? 'Today' : getDayLabel(item.dt_txt);
            const timeLabel = getTimeLabel(item.dt_txt);

            return (
              <div
                key={item.dt}
                className={`${theme.cardBg} rounded-2xl p-5 border border-white/5 flex flex-col items-center text-center hover:bg-white/10 hover:border-white/15 hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm relative overflow-hidden group`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex flex-col items-center w-full">
                  <p className={`text-sm font-semibold ${theme.textColor} mb-0.5`}>
                    {dayLabel}
                  </p>
                  <p className={`text-xs ${theme.labelColor} opacity-60 mb-3`}>
                    {timeLabel}
                  </p>
                  <div className="relative mb-3">
                    <div className="absolute -inset-2 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <img
                      src={iconUrl}
                      alt={item.weather[0].description}
                      className="w-10 h-10 sm:w-12 sm:h-12 relative z-10"
                      loading="lazy"
                    />
                  </div>
                  <p className={`text-2xl font-bold ${theme.textColor} mb-1 tracking-tight`}>
                    {Math.round(item.main.temp)}°
                  </p>
                  <p className={`text-xs ${theme.labelColor} capitalize font-medium`}>
                    {item.weather[0].main}
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className={`text-xs ${theme.labelColor}`}>{item.main.humidity}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
