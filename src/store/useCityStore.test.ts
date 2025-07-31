import { useCityStore } from './useCityStore'

describe('useCityStore', () => {
  beforeEach(() => {
    useCityStore.getState().clearCities()
  })

  it('adds a city if not present', () => {
    useCityStore.getState().addCity('Kyiv')
    expect(useCityStore.getState().cities).toContain('Kyiv')
  })

  it('does not add duplicate city (case insensitive)', () => {
    useCityStore.getState().addCity('Kyiv')
    useCityStore.getState().addCity('kyiv')
    expect(useCityStore.getState().cities.length).toBe(1)
  })

  it('removes city (case insensitive)', () => {
    useCityStore.getState().addCity('Kyiv')
    useCityStore.getState().removeCity('kyiv')
    expect(useCityStore.getState().cities.length).toBe(0)
  })

  it('clears all cities', () => {
    useCityStore.getState().addCity('Kyiv')
    useCityStore.getState().addCity('Lviv')
    useCityStore.getState().clearCities()
    expect(useCityStore.getState().cities.length).toBe(0)
  })
})