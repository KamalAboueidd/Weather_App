export default function WeatherDetails({ weather, location, isLoading, error, distance }) {
  if (isLoading) {
    return (
      <section className="grid gap-4 rounded-[32px] border border-white/10 bg-slate-950/60 p-6 shadow-[0_20px_80px_-45px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Loading</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Fetching weather</h2>
          </div>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-300 border-t-transparent" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 rounded-3xl bg-slate-900/70" />
          ))}
        </div>
      </section>
    )
  }

  if (error || !weather) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-slate-950/60 p-6 shadow-[0_20px_80px_-45px_rgba(0,0,0,0.7)] text-slate-200">
        <h2 className="text-xl font-semibold text-white">Select a location first</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Use the search field or tap a point on the map to load weather details for your chosen location.
        </p>
      </section>
    )
  }

  return (
    <section className="grid gap-4 rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_20px_80px_-45px_rgba(0,0,0,0.7)] text-slate-100">
      <div className="flex flex-col gap-4 rounded-[28px] bg-gradient-to-br from-violet-700 via-fuchsia-700 to-slate-900 p-5 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-200">{location.name}, {location.country}</p>
            <h2 className="mt-2 text-5xl font-semibold text-white">{Math.round(weather.temperature)}°C</h2>
          </div>
          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-amber-200 backdrop-blur-sm">
            {weather.description}
          </span>
        </div>
        <p className="text-sm text-slate-300">Updated at {weather.time}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2 rounded-[28px] bg-slate-900/60 p-4 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Temperature</p>
          <p className="text-2xl font-semibold text-white">{Math.round(weather.temperature)}°C</p>
        </div>
        <div className="space-y-2 rounded-[28px] bg-slate-900/60 p-4 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Humidity</p>
          <p className="text-2xl font-semibold text-white">{weather.humidity ?? 'N/A'}%</p>
        </div>
        <div className="space-y-2 rounded-[28px] bg-slate-900/60 p-4 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Wind speed</p>
          <p className="text-2xl font-semibold text-white">{Math.round(weather.windSpeed)} m/s</p>
        </div>
        <div className="space-y-2 rounded-[28px] bg-slate-900/60 p-4 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Cloud cover</p>
          <p className="text-2xl font-semibold text-white">{weather.cloudCover ?? 'N/A'}%</p>
        </div>
      </div>

      {distance != null ? (
        <div className="rounded-[28px] bg-slate-900/60 p-4 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Distance from home location</p>
          <p className="text-2xl font-semibold text-white">{distance.toFixed(1)} km</p>
        </div>
      ) : null}
    </section>
  )
}
