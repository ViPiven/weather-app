import { render, waitFor } from '@testing-library/react'
import { CityItem } from './CityItem'
import { useCityStore } from '@/store/useCityStore'
import { getWeatherByCity } from '@/lib/api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Props as CityCardProps } from '@/components/CityCard'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('@/lib/api', () => ({
  getWeatherByCity: jest.fn(),
}))

jest.mock('@/store/useCityStore')

const mockCityCard = jest.fn((_props: CityCardProps) => <div data-testid="mocked-card" />)
jest.mock('@/components/CityCard', () => ({
  CityCard: (props: CityCardProps) => mockCityCard(props),
}))

const createTestClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

describe('CityItem', () => {
  const removeCityMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    const mockedUseCityStore = useCityStore as unknown as jest.Mock
    mockedUseCityStore.mockReturnValue({ removeCity: removeCityMock })
  })

  const renderWithProvider = (name: string) =>
    render(
      <QueryClientProvider client={createTestClient()}>
        <CityItem name={name} />
      </QueryClientProvider>
    )

  it('renders loading state', () => {
    (getWeatherByCity as jest.Mock).mockImplementation(() => new Promise(() => {}))
    renderWithProvider('Kyiv')

    const props = mockCityCard.mock.calls.at(-1)?.[0] as CityCardProps
    expect(props).toMatchObject({
      name: 'Kyiv',
      isLoading: true,
      isError: false,
      temperature: 0,
      weatherDescription: '',
      icon: '',
    })
    expect(typeof props.onRemove).toBe('function')
    expect(typeof props.onRefresh).toBe('function')
  })

  it('renders error state', async () => {
    (getWeatherByCity as jest.Mock).mockRejectedValue(new Error('API error'))
    renderWithProvider('Kyiv')

    await waitFor(() => {
      const props = mockCityCard.mock.calls.at(-1)?.[0] as CityCardProps
      expect(props).toMatchObject({
        isError: true,
        isLoading: false,
      })
    })
  })

  it('renders weather data', async () => {
    (getWeatherByCity as jest.Mock).mockResolvedValue({
      temp: 22,
      description: 'clear sky',
      icon: '01d',
    })
    renderWithProvider('Kyiv')

    await waitFor(() => {
      const props = mockCityCard.mock.calls.at(-1)?.[0] as CityCardProps
      expect(props).toMatchObject({
        isLoading: false,
        isError: false,
        temperature: 22,
        weatherDescription: 'clear sky',
        icon: '01d',
      })
    })
  })

  it('calls removeCity when onRemove is triggered', async () => {
    (getWeatherByCity as jest.Mock).mockResolvedValue({
      temp: 10,
      description: 'rain',
      icon: '09d',
    })
    renderWithProvider('Kyiv')

    await waitFor(() => {
      const props = mockCityCard.mock.calls.at(-1)?.[0] as CityCardProps
      expect(props).toBeTruthy()
      props.onRemove?.()
      expect(removeCityMock).toHaveBeenCalledWith('Kyiv')
    })
  })

  it('calls refetch when onRefresh is triggered', async () => {
    (getWeatherByCity as jest.Mock).mockResolvedValue({
      temp: 15,
      description: 'cloudy',
      icon: '02d',
    })

    const queryClient = createTestClient()
    render(
      <QueryClientProvider client={queryClient}>
        <CityItem name="Kyiv" />
      </QueryClientProvider>
    )

    await waitFor(() => {
      const props = mockCityCard.mock.calls.at(-1)?.[0] as CityCardProps
      expect(props).toBeTruthy()
      props.onRefresh?.()
    })
  })
})
