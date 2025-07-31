import { AddCityForm } from '@/components/AddCityForm'
import { CityList } from '@/components/CityList'
import { Container, Typography } from '@mui/material'

export default function Home() {
  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Cities
      </Typography>
      <AddCityForm />
      <CityList />
    </Container>
  )
}