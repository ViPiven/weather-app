'use client'

import { useQuery } from '@tanstack/react-query'
import { getWeatherByCity } from '@/lib/api'
import { CityCard } from '@/components/CityCard'
import { useCityStore } from '@/store/useCityStore'

export const CityItem = ({ name }: { name: string }) => {
  const { removeCity } = useCityStore()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['weather', name],
    queryFn: () => getWeatherByCity(name),
  })

  return (
    <CityCard
      name={name}
      temperature={data?.temp ?? 0}
      weatherDescription={data?.description ?? ''}
      icon={data?.icon ?? ''}
      onRefresh={() => refetch()}
      onRemove={() => removeCity(name)}
      isLoading={isLoading}
      isError={isError}
    />
  )
}