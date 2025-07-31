'use client'

import { useState } from 'react'
import { useCityStore } from '@/store/useCityStore'
import { useMutation } from '@tanstack/react-query'
import { getWeatherByCity } from '@/lib/api'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt'

export const AddCityForm = () => {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const { addCity, cities } = useCityStore()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const mutation = useMutation({
    mutationFn: (city: string) => getWeatherByCity(city),
    onSuccess: (_, city) => {
      addCity(city.trim())
      setInput('')
      setError('')
    },
    onError: () => {
      setError('City not found')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmed = input.trim()

    if (!trimmed) {
      setError('Please enter a city name')
      return
    }

    if (cities.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setError('City already added')
      return
    }

    mutation.mutate(trimmed)
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 2,
        mb: 3,
        alignItems: isMobile ? 'stretch' : 'flex-start',
      }}
    >
      <TextField
        fullWidth
        label="Enter city name"
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          if (error) setError('')
        }}
        error={!!error}
        helperText={error || (isMobile ? '' : ' ')}
        slotProps={{
          formHelperText: {
            sx: {
              minHeight: isMobile ? 'auto' : '1.5em',
              mb: isMobile ? 0 : 0.5,
            },
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        size={isMobile ? 'large' : 'medium'}
        startIcon={<AddLocationAltIcon />}
        disabled={mutation.isPending}
        sx={{
          minWidth: isMobile ? '100%' : 120,
          height: isMobile ? 'auto' : '56px',
          paddingY: isMobile ? 1.5 : 1,
          textTransform: 'none',
          fontWeight: 'bold',
        }}
      >
        {mutation.isPending ? 'Checking...' : 'Add'}
      </Button>
    </Box>
  )
}