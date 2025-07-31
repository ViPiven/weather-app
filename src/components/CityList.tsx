'use client'

import React from 'react'
import { useCityStore } from '@/store/useCityStore'
import { CityItem } from '@/components/CityItem'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export const CityList = () => {
  const { cities } = useCityStore()

  if (cities.length === 0) {
    return (
      <Typography
        sx={{
          textAlign: 'center',
          mt: 4,
          fontSize: '1.2rem',
          color: 'text.secondary',
        }}
      >
        No cities added yet. Try adding one!
      </Typography>
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        mt: 2,
        mb: 2,
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      }}
    >
      {cities.map((name) => (
        <CityItem key={name} name={name} />
      ))}
    </Box>
  )
}