import { render, screen } from '@testing-library/react'
import { CityList } from './CityList'
import { useCityStore } from '@/store/useCityStore'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


jest.mock('@/store/useCityStore')
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    forward: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

const renderWithQueryClient = (ui: React.ReactNode) => {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  )
}

describe('CityList', () => {
  it('shows a message when there are no cities', () => {
    (useCityStore as unknown as jest.Mock).mockReturnValue({ cities: [] })

    renderWithQueryClient(<CityList />)

    expect(screen.getByText(/no cities added yet/i)).toBeInTheDocument()
  })

  it('renders a list of CityItem components when cities are present', () => {
    const cities = ['Kyiv', 'Lviv'];
    (useCityStore as unknown as jest.Mock).mockReturnValue({ cities })

    renderWithQueryClient(<CityList />)

    cities.forEach((city) => {
      expect(screen.getByText(city)).toBeInTheDocument()
    })
  })
})
