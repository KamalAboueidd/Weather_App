import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useWeatherStore = create(
  persist(
    (set) => ({
      lastWeather: null,
      setLastWeather: (value) => set({ lastWeather: value }),
    }),
    {
      name: 'weather-storage',
    }
  )
)
