import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AddCityForm } from './AddCityForm'
import { useCityStore } from '@/store/useCityStore'

jest.mock('@/store/useCityStore')

const getWeatherByCityMock = jest.fn()

jest.mock('@/lib/api', () => ({
  getWeatherByCity: (...args: any[]) => getWeatherByCityMock(...args),
}))

describe('AddCityForm', () => {
  const queryClient = new QueryClient()

  beforeEach(() => {
    queryClient.clear()
    getWeatherByCityMock.mockReset()
  })

  it('adds a city when input is filled and form is submitted', async () => {
    const addCityMock = jest.fn();
    (useCityStore as any).mockReturnValue({ addCity: addCityMock, cities: [] })

    getWeatherByCityMock.mockResolvedValue({
      temp: 20,
      feelsLike: 18,
      tempMin: 15,
      tempMax: 22,
      humidity: 50,
      wind: 3,
      clouds: 20,
      pressure: 1012,
      sunrise: 1672520400,
      sunset: 1672563600,
      description: 'clear sky',
      icon: '01d',
    })

    render(
      <QueryClientProvider client={queryClient}>
        <AddCityForm />
      </QueryClientProvider>
    )

    const input = screen.getByLabelText(/enter city name/i)
    await userEvent.type(input, 'Kyiv')

    const addButton = screen.getByRole('button', { name: /add/i })
    await userEvent.click(addButton)

    await waitFor(() => {
      expect(addCityMock).toHaveBeenCalledWith('Kyiv')
    })
  })

  it('shows an error when input is empty', async () => {
    const addCityMock = jest.fn();
    (useCityStore as any).mockReturnValue({ addCity: addCityMock, cities: [] })

    render(
      <QueryClientProvider client={queryClient}>
        <AddCityForm />
      </QueryClientProvider>
    )

    const addButton = screen.getByRole('button', { name: /add/i })
    await userEvent.click(addButton)

    expect(screen.getByText(/please enter a city name/i)).toBeInTheDocument()
    expect(addCityMock).not.toHaveBeenCalled()
  })

  it('shows error if city is already added', async () => {
    const addCityMock = jest.fn();
    (useCityStore as any).mockReturnValue({ addCity: addCityMock, cities: ['Kyiv'] })

    render(
      <QueryClientProvider client={queryClient}>
        <AddCityForm />
      </QueryClientProvider>
    )

    const input = screen.getByLabelText(/enter city name/i)
    await userEvent.type(input, 'Kyiv')

    const addButton = screen.getByRole('button', { name: /add/i })
    await userEvent.click(addButton)

    expect(screen.getByText(/city already added/i)).toBeInTheDocument()
    expect(addCityMock).not.toHaveBeenCalled()
  })
})