'use client'

import { ThemeProvider, CssBaseline, createTheme } from '@mui/material'
import { ReactNode } from 'react'

const theme = createTheme()

export function MuiThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}