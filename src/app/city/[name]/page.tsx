'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getWeatherByCity, getForecastByCity } from '@/lib/api'
import { ForecastChart } from '@/components/ForecastChart'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Image from 'next/image'

export default function CityPage() {
  const params = useParams<{ name: string }>()
  const cityName = params.name
  const router = useRouter()

  const { data: weather, isLoading: wLoading, isError: wError } = useQuery({
    queryKey: ['weather', cityName],
    queryFn: () => getWeatherByCity(cityName),
    enabled: !!cityName,
  })

  const { data: forecast, isLoading: fLoading, isError: fError } = useQuery({
    queryKey: ['forecast', cityName],
    queryFn: () => getForecastByCity(cityName),
    enabled: !!cityName,
  })

  if (wLoading || fLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (wError || fError || !weather || !forecast) {
    return (
      <Typography color="error" textAlign="center" mt={4}>
        Error loading data
      </Typography>
    )
  }

  return (
    <Box
      px={{ xs: 2, md: 5 }}
      py={4}
      maxWidth={1000}
      mx="auto"
      sx={{ overflowX: 'hidden' }}
    >
      <Box mb={3} display="flex">
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/')}
        >
          Back to cities
        </Button>
      </Box>

      <Typography variant="h4" mb={4} textAlign="center">
        Weather in {cityName}
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 6 }} component={"div"}>
          <Paper
            elevation={3}
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              padding: 2,
              height: '100%',
            }}
          >
            <Image
              src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
              alt={weather.description}
              width={96}
              height={96}
              priority
            />
            <Box>
              <Typography variant="h5">{Math.round(weather.temp)}°C</Typography>
              <Typography textTransform="capitalize">
                {weather.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Feels like {Math.round(weather.feelsLike)}°C
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} component={"div"}>
          <Paper elevation={3} sx={{ padding: 2, fontSize: 14 }}>
            <p>
              🌡️ Min/Max: {Math.round(weather.tempMin)}°C /{' '}
              {Math.round(weather.tempMax)}°C
            </p>
            <p>💧 Humidity: {weather.humidity}%</p>
            <p>💨 Wind: {weather.wind} m/s</p>
            <p>🌥️ Clouds: {weather.clouds}%</p>
            <p>🔽 Pressure: {weather.pressure} hPa</p>
            <p>
              🌅 Sunrise:{' '}
              {new Date(weather.sunrise * 1000).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p>
              🌇 Sunset:{' '}
              {new Date(weather.sunset * 1000).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: { xs: 280, md: 320 },
          overflow: 'hidden',
          boxSizing: 'border-box',
          px: { xs: 1, sm: 2 },
        }}
      >
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ pt: 1, pb: 0, fontSize: { xs: '1rem', md: '1.1rem' } }}
        >
          Hourly forecast
        </Typography>

        <Box
          sx={{
            flexGrow: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ForecastChart data={forecast} />
        </Box>
      </Paper>
    </Box>
  )
}
