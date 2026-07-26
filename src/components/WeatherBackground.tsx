import type { WeatherConditionGroup, WeatherTheme } from '@/types/weather';

interface WeatherBackgroundProps {
  conditionGroup: WeatherConditionGroup;
  theme: WeatherTheme;
}

const conditionGradients: Record<string, string> = {
  clear: 'from-amber-300 via-orange-400 to-rose-500',
  clouds: 'from-slate-300 via-slate-500 to-slate-800',
  rain: 'from-blue-400 via-indigo-500 to-slate-900',
  drizzle: 'from-cyan-300 via-blue-400 to-indigo-600',
  thunderstorm: 'from-violet-600 via-slate-800 to-slate-950',
  snow: 'from-slate-200 via-blue-100 to-indigo-200',
  mist: 'from-stone-300 via-stone-500 to-stone-700',
  fog: 'from-stone-300 via-stone-500 to-stone-700',
  default: 'from-slate-400 via-slate-600 to-slate-900',
};

const rainStreaks = Array.from({ length: 20 }).map((_, i) => ({
  left: `${Math.random() * 100}%`,
  height: 14 + Math.random() * 24,
  delay: `${Math.random() * 2}s`,
  duration: 0.7 + Math.random() * 0.7,
  opacity: 0.25 + Math.random() * 0.4,
}));

const snowflakes = Array.from({ length: 30 }).map((_, i) => ({
  left: `${Math.random() * 100}%`,
  width: 2 + Math.random() * 4,
  height: 2 + Math.random() * 4,
  delay: `${Math.random() * 3}s`,
  duration: 2 + Math.random() * 3,
  opacity: 0.5 + Math.random() * 0.5,
}));

const clouds = Array.from({ length: 5 }).map((_, i) => ({
  left: `${10 + i * 18}%`,
  top: `${8 + (i % 2) * 20}%`,
  size: 240 + i * 100,
  delay: `${i * 1.4}s`,
  duration: 14 + i * 2,
  opacity: 0.12 + i * 0.04,
}));

const mistBands = Array.from({ length: 4 }).map((_, i) => ({
  left: `${5 + i * 24}%`,
  top: `${18 + i * 18}%`,
  width: 240 + i * 70,
  height: 70 + i * 20,
  delay: `${i * 1.6}s`,
  duration: 10 + i,
  opacity: 0.2 + i * 0.04,
}));

const leaves = Array.from({ length: 8 }).map((_, i) => ({
  left: `${5 + i * 12}%`,
  delay: `${Math.random() * 2}s`,
  duration: 6 + Math.random() * 4,
  opacity: 0.4 + Math.random() * 0.35,
}));

export default function WeatherBackground({ conditionGroup, theme }: WeatherBackgroundProps) {
  const gradient = conditionGradients[conditionGroup] ?? conditionGradients.default;
  const isRain = conditionGroup === 'rain' || conditionGroup === 'drizzle';
  const isCloudy = conditionGroup === 'clouds' || conditionGroup === 'mist' || conditionGroup === 'fog';
  const isSnow = conditionGroup === 'snow';
  const isClear = conditionGroup === 'clear';
  const isThunder = conditionGroup === 'thunderstorm';

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br ${gradient} transition-all duration-1000 ease-in-out`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,0,0,0.4)_0%,transparent_70%)]" />

      {isRain && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {rainStreaks.map((s, i) => (
            <div
              key={`rain-${i}`}
              className="absolute top-0 bg-white/60 rounded-full"
              style={{
                left: s.left,
                height: `${s.height}px`,
                width: 1.5,
                animation: `weather-rain-fall ${s.duration}s linear infinite`,
                animationDelay: s.delay,
                opacity: s.opacity,
              }}
            />
          ))}
        </div>
      )}

      {isSnow && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {snowflakes.map((f, i) => (
            <div
              key={`snow-${i}`}
              className="absolute rounded-full bg-white"
              style={{
                left: f.left,
                width: `${f.width}px`,
                height: `${f.height}px`,
                animation: `weather-snow-fall ${f.duration}s linear infinite`,
                animationDelay: f.delay,
                opacity: f.opacity,
                filter: 'blur(0.5px)',
              }}
            />
          ))}
        </div>
      )}

      {isClear && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="rounded-full"
            style={{
              width: 340,
              height: 340,
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
              animation: 'weather-sun-pulse 5s ease-in-out infinite',
              filter: 'blur(50px)',
            }}
          />
        </div>
      )}

      {isCloudy && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {clouds.map((c, i) => (
            <div
              key={`cloud-${i}`}
              className="absolute rounded-full bg-white/25"
              style={{
                left: c.left,
                top: c.top,
                width: c.size,
                height: c.size * 0.5,
                filter: `blur(${28 + i * 6}px)`,
                animation: `weather-cloud-drift ${c.duration}s ease-in-out infinite alternate`,
                animationDelay: c.delay,
                opacity: c.opacity,
              }}
            />
          ))}
          {conditionGroup === 'mist' && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {mistBands.map((m, i) => (
                <div
                  key={`mist-${i}`}
                  className="absolute rounded-full bg-white/20"
                  style={{
                    left: m.left,
                    top: m.top,
                    width: m.width,
                    height: m.height,
                    filter: 'blur(40px)',
                    animation: `weather-mist-drift ${m.duration}s ease-in-out infinite alternate`,
                    animationDelay: m.delay,
                    opacity: m.opacity,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {isThunder && (
        <div
          className="absolute inset-0 bg-white/40 pointer-events-none"
          style={{ animation: 'weather-thunder-flash 6s steps(1) infinite' }}
        />
      )}

      {conditionGroup === 'default' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={`leaf-${i}`}
              className="absolute rounded-full bg-white/30"
              style={{
                left: `${5 + i * 15}%`,
                width: 2 + (i % 3) * 2,
                height: 2 + (i % 3) * 2,
                animation: `weather-leaves-drift ${6 + i}s linear infinite`,
                animationDelay: `${i * 0.8}s`,
                opacity: 0.4 + i * 0.05,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
