import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CityStore {
  cities: string[]
  addCity: (name: string) => void
  removeCity: (name: string) => void
  clearCities: () => void
}

export const useCityStore = create<CityStore>()(
  persist(
    (set, get) => ({
      cities: [],

      addCity: (name) => {
        const exists = get().cities.some(
          (c) => c.toLowerCase() === name.toLowerCase()
        )
        if (!exists) {
          set({ cities: [...get().cities, name] })
        }
      },

      removeCity: (name) =>
        set((state) => ({
          cities: state.cities.filter(
            (c) => c.toLowerCase() !== name.toLowerCase()
          ),
        })),

      clearCities: () => set({ cities: [] }),
    }),
    { name: 'weather-cities' }
  )
)