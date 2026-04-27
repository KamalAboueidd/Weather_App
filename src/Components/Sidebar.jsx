export default function Sidebar({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onReset,
  activeLocation,
  weather,
  isLoading,
  distance,
  lastWeather,
  refetch,
}) {
  return (
    <aside className="order-2 flex w-full flex-col gap-5 rounded-[40px] border border-white/15 bg-white/5 p-5 shadow-[0_30px_90px_-60px_rgba(0,0,0,0.8)] backdrop-blur-xl lg:order-1 lg:w-[380px]">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.35em] text-amber-300">Weather control</span>
        <h2 className="text-3xl font-semibold text-white">Search or tap any place</h2>
        <p className="text-sm leading-6 text-slate-300">
          Find weather in a city or select a map point for instant results that look modern and clear.
        </p>
      </div>

      <div className="space-y-3 rounded-[32px] border border-white/10 bg-slate-900/40 p-4 shadow-sm backdrop-blur-sm">
        <label className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">Search city</label>
        <div className="flex gap-2">
          <input
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Paris, Cairo, London"
            className="flex-1 rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/30"
          />
          <button
            onClick={onSearch}
            className="rounded-3xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid gap-3 rounded-[32px] border border-white/10 bg-slate-900/40 p-4 text-slate-100 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-400">Selected location</p>
            <h3 className="text-lg font-semibold text-white">{activeLocation.label || 'Selected location'}</h3>
          </div>
          <button
            onClick={refetch}
            className="rounded-full bg-slate-950/80 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            Refresh
          </button>
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-slate-300">
          <span className="rounded-full bg-slate-950/80 px-3 py-2">{activeLocation.city ? activeLocation.city : 'Map / coords mode'}</span>
          <span className="rounded-full bg-slate-950/80 px-3 py-2">{activeLocation.lat?.toFixed(2) ?? '-'} , {activeLocation.lon?.toFixed(2) ?? '-'}</span>
        </div>

        {distance != null ? (
          <div className="rounded-3xl bg-slate-950/80 p-3 text-sm text-slate-200">
            Distance from home location: <span className="font-semibold text-amber-300">{distance.toFixed(1)} km</span>
          </div>
        ) : (
          <div className="rounded-3xl bg-slate-950/80 p-3 text-sm text-slate-400">
            Click the map or search by city to view weather details instantly.
          </div>
        )}
      </div>

      <div className="grid gap-3 rounded-[32px] border border-white/10 bg-slate-950/40 p-4 shadow-sm backdrop-blur-sm">
        <h3 className="text-base font-semibold text-white">Last saved search</h3>
        {lastWeather ? (
          <div className="rounded-3xl bg-slate-900/95 p-4 shadow-sm text-sm text-slate-100">
            <p className="text-slate-400">{lastWeather.location.name}, {lastWeather.location.country}</p>
            <p className="mt-2 text-lg font-semibold text-white">{Math.round(lastWeather.weather.temperature)}°C</p>
            <p className="text-slate-400">{lastWeather.weather.description}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-400">No saved weather data yet. Search or click the map to get started.</p>
        )}
      </div>

      <button
        onClick={onReset}
        className="mt-auto rounded-3xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
      >
        Back to my location
      </button>

      {isLoading ? (
        <div className="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-200">Searching for weather...</div>
      ) : null}
    </aside>
  )
}
