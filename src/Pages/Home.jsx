import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../Components/Sidebar.jsx'
import WeatherMap from '../Components/WeatherMap.jsx'
import WeatherDetails from '../Components/WeatherDetails.jsx'
import { toast } from 'react-toastify'
import { useWeatherQuery } from '../hooks/useWeather.js'
import { useWeatherStore } from '../stores/useWeatherStore.js'
import { getDistanceKm } from '../utils/location.js'
import { getAddress } from '../services/apiGeocoding.js'

const HOME_LOCATION = {
  lat: 30.0444,
  lon: 31.2357,
  city: 'Cairo',
  label: 'My current location',
}

export default function Home() {
  const [activeLocation, setActiveLocation] = useState(HOME_LOCATION)
  const [userLocation, setUserLocation] = useState(HOME_LOCATION)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState(null)
  const [hasTriedGeolocation, setHasTriedGeolocation] = useState(false)
  const { data, isLoading, error, refetch } = useWeatherQuery(activeLocation)
  const { lastWeather, setLastWeather } = useWeatherStore()

  useEffect(() => {
    if (data) {
      setLastWeather({
        timestamp: Date.now(),
        location: data.location,
        weather: data.weather,
      })
    }
  }, [data, setLastWeather])

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Unable to fetch weather for this location.')
    }
  }, [error])

  useEffect(() => {
    if (locationError) {
      toast.error(locationError)
    }
  }, [locationError])

  useEffect(() => {
    if (!hasTriedGeolocation) {
      handleUseMyLocation()
    }
  }, [hasTriedGeolocation])

  const distance = useMemo(() => {
    if (!data || !data.location) return null
    if (!userLocation || (activeLocation.lat === userLocation.lat && activeLocation.lon === userLocation.lon)) return null
    return getDistanceKm(userLocation.lat, userLocation.lon, data.location.lat, data.location.lon)
  }, [activeLocation, data, userLocation])

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    setActiveLocation({ city: searchQuery.trim(), label: searchQuery.trim() })
  }

  const handleMapSelect = (latlng) => {
    setActiveLocation({ lat: latlng.lat, lon: latlng.lng, label: 'Selected place' })
  }

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not available in this browser.')
      setHasTriedGeolocation(true)
      return
    }

    setIsLocating(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const address = await getAddress({ latitude, longitude })
          const location = {
            lat: latitude,
            lon: longitude,
            label: 'My location',
            city: address.city || address.locality || address.principalSubdivision || address.countryName || 'Current location',
          }
          setUserLocation(location)
          setActiveLocation(location)
        } catch (addressError) {
          const location = {
            lat: latitude,
            lon: longitude,
            label: 'My location',
            city: 'Current location',
          }
          setUserLocation(location)
          setActiveLocation(location)
        } finally {
          setIsLocating(false)
          setHasTriedGeolocation(true)
        }
      },
      (positionError) => {
        setLocationError(positionError.message || 'Unable to read current location.')
        setIsLocating(false)
        setHasTriedGeolocation(true)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
    )
  }

  const handleReset = () => {
    setSearchQuery('')
    handleUseMyLocation()
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.16),_transparent_30%),linear-gradient(180deg,_#3b1b5f_0%,_#1f1140_45%,_#110a25_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-5 p-4 lg:flex-row">
        <Sidebar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearch={handleSearch}
          onReset={handleReset}
          activeLocation={activeLocation}
          weather={data?.weather}
          isLoading={isLoading}
          distance={distance}
          lastWeather={lastWeather}
          refetch={refetch}
        />

        <main className="relative flex min-h-[680px] flex-1 flex-col gap-4 rounded-[40px] border border-white/10 bg-white/5 p-4 shadow-[0_45px_120px_-60px_rgba(0,0,0,0.8)] backdrop-blur-xl lg:p-6">
          <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_-35px_rgba(255,255,255,0.35)]">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Weather Forecast</p>
              <h1 className="mt-2 text-4xl font-semibold text-white sm:text-5xl">Weather Near you</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Get precise weather for your current location or any city, with fast updates and a clean dashboard.
              </p>
            </div>
            <button
              onClick={handleUseMyLocation}
              className="inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
            >
              {isLocating ? 'Finding location…' : 'Use current location'}
            </button>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
            <div className="rounded-[32px] border border-white/10 bg-white/10 p-3 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.7)]">
              <WeatherMap
                position={data?.location || HOME_LOCATION}
                onSelectLocation={handleMapSelect}
                onGoHome={handleUseMyLocation}
              />
            </div>
            <WeatherDetails
              weather={data?.weather}
              location={data?.location}
              isLoading={isLoading}
              error={error}
              distance={distance}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
