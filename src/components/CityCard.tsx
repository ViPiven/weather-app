'use client'

import { useRouter } from 'next/navigation'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import RefreshIcon from '@mui/icons-material/Refresh'
import DeleteIcon from '@mui/icons-material/Delete'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { MouseEvent } from 'react'
import Image from 'next/image'

type Props = {
  name: string
  temperature: number
  weatherDescription: string
  icon: string
  onRefresh?: () => void
  onRemove?: () => void
  isLoading?: boolean
  isError?: boolean
}

export const CityCard = ({
  name,
  temperature,
  weatherDescription,
  icon,
  onRefresh,
  onRemove,
  isLoading,
  isError,
}: Props) => {
  const router = useRouter()

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement

    if (
      target.closest('button')
    ) {
      return
    }

    router.push(`/city/${name}`)
  }

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        '&:hover': { boxShadow: 4 },
        cursor: 'pointer',
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom noWrap>
          {name}
        </Typography>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress size={28} />
          </Box>
        ) : isError ? (
          <Typography color="error" align="center">
            Error loading weather
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mt: 1,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Image
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={weatherDescription}
              width={60}
              height={60}
              priority
            />
            <Box textAlign="center">
              <Typography variant="h5">{Math.round(temperature)}°C</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {weatherDescription}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <IconButton aria-label="refresh" onClick={(e) => { e.stopPropagation(); onRefresh?.() }}>
          <RefreshIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={(e) => { e.stopPropagation(); onRemove?.() }}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}