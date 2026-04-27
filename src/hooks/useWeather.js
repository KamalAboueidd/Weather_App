import { useQuery } from '@tanstack/react-query'

const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast'

const WEATHER_CODE_LABELS = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with heavy hail',
}

function weatherCodeToLabel(code) {
  return WEATHER_CODE_LABELS[code] ?? 'Unknown weather'
}

async function fetchCoordsByCity(city) {
  const isArabic = /[\u0600-\u06FF]/.test(city)
  const languages = isArabic ? ['ar', 'en'] : ['en', 'ar']

  for (const language of languages) {
    const response = await fetch(`${GEOCODING_BASE}?name=${encodeURIComponent(city)}&count=1&language=${language}&format=json`)
    if (!response.ok) continue

    const payload = await response.json()
    const result = payload.results?.[0]
    if (result) {
      return {
        name: result.name,
        country: result.country,
        lat: result.latitude,
        lon: result.longitude,
      }
    }
  }

  throw new Error('City not found')
}

async function fetchWeatherByCoords(lat, lon) {
  const url = new URL(FORECAST_BASE)
  url.searchParams.set('latitude', lat)
  url.searchParams.set('longitude', lon)
  url.searchParams.set('current_weather', 'true')
  url.searchParams.set('hourly', 'relativehumidity_2m,cloudcover')
  url.searchParams.set('temperature_unit', 'celsius')
  url.searchParams.set('windspeed_unit', 'ms')
  url.searchParams.set('timezone', 'auto')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error('Weather data not available for this location')
  }

  return response.json()
}

function findHourlyIndex(hourly, currentTime) {
  return hourly.time.findIndex((time) => time === currentTime)
}

function normalizeWeather(payload, location) {
  const currentMeteor = payload.current_weather
  const timeIndex = findHourlyIndex(payload.hourly, currentMeteor.time)

  return {
    location: {
      name: location.name,
      country: location.country,
      lat: Number(location.lat),
      lon: Number(location.lon),
    },
    weather: {
      temperature: currentMeteor.temperature,
      windSpeed: currentMeteor.windspeed,
      windDirection: currentMeteor.winddirection,
      code: currentMeteor.weathercode,
      description: weatherCodeToLabel(currentMeteor.weathercode),
      humidity: timeIndex >= 0 ? payload.hourly.relativehumidity_2m[timeIndex] : null,
      cloudCover: timeIndex >= 0 ? payload.hourly.cloudcover[timeIndex] : null,
      time: currentMeteor.time,
    },
  }
}

export function useWeatherQuery(location) {
  const key = ['weather', location.city ?? location.lat, location.lon]

  return useQuery({
    queryKey: key,
    queryFn: async () => {
      let resolvedLocation = location
      if (location.city) {
        resolvedLocation = await fetchCoordsByCity(location.city)
      }

      if (resolvedLocation.lat == null || resolvedLocation.lon == null) {
        throw new Error('Provide a city name or latitude/longitude values')
      }

      const payload = await fetchWeatherByCoords(resolvedLocation.lat, resolvedLocation.lon)
      return normalizeWeather(payload, resolvedLocation)
    },
    enabled: Boolean(location.city || (location.lat != null && location.lon != null)),
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
