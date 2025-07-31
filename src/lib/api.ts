const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'

export const getWeatherByCity = async (city: string) => {
  const res = await fetch(
    `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  )
  if (!res.ok) throw new Error(`Failed to fetch weather for ${city}`)

  const data = await res.json()
  return {
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    tempMin: data.main.temp_min,
    tempMax: data.main.temp_max,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    wind: data.wind.speed,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    clouds: data.clouds.all,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
  }
}

interface ForecastItem {
  dt_txt: string
  main: {
    temp: number
  }
}

interface ForecastResponse {
  list: ForecastItem[]
}

export const getForecastByCity = async (city: string) => {
  const res = await fetch(
    `${FORECAST_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  )
  if (!res.ok) throw new Error(`Failed to fetch forecast for ${city}`)

  const data: ForecastResponse = await res.json()
  return data.list.slice(0, 8).map((item) => ({
    time: item.dt_txt,
    temp: item.main.temp,
  }))
}