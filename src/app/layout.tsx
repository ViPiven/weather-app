import type { Metadata } from "next"
import '@/styles/globals.scss'
import { QueryProvider } from '@/providers/QueryProvider'
import { MuiThemeProvider } from '@/providers/MuiThemeProvider'
import { AppBar, Toolbar, Typography, Container } from '@mui/material'

export const metadata: Metadata = {
  title: 'Weather Now',
  description: 'Weather app for selected cities',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <MuiThemeProvider>
            <AppBar position="static" color="default" elevation={1}>
              <Toolbar>
                <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                  🌤️ Weather Now
                </Typography>
              </Toolbar>
            </AppBar>
            <Container component="main" sx={{ py: 2 }}>
              {children}
            </Container>
          </MuiThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}