import { render, fireEvent } from '@testing-library/react'
import { CityCard } from '@/components/CityCard'
import { useRouter } from 'next/navigation'

const pushMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('CityCard', () => {
  beforeEach(() => {
    pushMock.mockReset();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock })
  })

  it('calls onRemove when the delete button is clicked', () => {
    const onRemove = jest.fn()
    const onRefresh = jest.fn()

    const { getByRole } = render(
      <CityCard
        name="Kyiv"
        temperature={20}
        weatherDescription="clear sky"
        icon="01d"
        onRemove={onRemove}
        onRefresh={onRefresh}
      />
    )

    const deleteButton = getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    expect(onRemove).toHaveBeenCalled()
  })

  it('calls onRefresh when the refresh button is clicked', () => {
    const onRemove = jest.fn()
    const onRefresh = jest.fn()

    const { getByRole } = render(
      <CityCard
        name="Kyiv"
        temperature={20}
        weatherDescription="clear sky"
        icon="01d"
        onRemove={onRemove}
        onRefresh={onRefresh}
      />
    )

    const refreshButton = getByRole('button', { name: /refresh/i })
    fireEvent.click(refreshButton)
    expect(onRefresh).toHaveBeenCalled()
  })

  it('navigates to city page when card clicked', () => {
    const onRemove = jest.fn()
    const onRefresh = jest.fn()

    const { getByText } = render(
      <CityCard
        name="Kyiv"
        temperature={20}
        weatherDescription="clear sky"
        icon="01d"
        onRemove={onRemove}
        onRefresh={onRefresh}
      />
    )

    const cardTitle = getByText('Kyiv')
    fireEvent.click(cardTitle)
    expect(pushMock).toHaveBeenCalledWith('/city/Kyiv')
  })

  it('does not navigate when clicking on buttons', () => {
    const onRemove = jest.fn()
    const onRefresh = jest.fn()

    const { getByRole } = render(
      <CityCard
        name="Kyiv"
        temperature={20}
        weatherDescription="clear sky"
        icon="01d"
        onRemove={onRemove}
        onRefresh={onRefresh}
      />
    )

    const deleteButton = getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('shows loading state', () => {
    const { getByRole } = render(
      <CityCard
        name="Kyiv"
        temperature={20}
        weatherDescription="clear sky"
        icon="01d"
        isLoading={true}
      />
    )
    expect(getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows error message', () => {
    const { getByText } = render(
      <CityCard
        name="Kyiv"
        temperature={20}
        weatherDescription="clear sky"
        icon="01d"
        isError={true}
      />
    )
    expect(getByText(/error loading weather/i)).toBeInTheDocument()
  })
})