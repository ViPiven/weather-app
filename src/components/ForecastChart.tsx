'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

type ForecastData = {
  time: string
  temp: number
}[]

export const ForecastChart = ({ data }: { data: ForecastData }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const formatHour = (timeStr: string) => {
    const date = new Date(timeStr)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const avgTemp =
    data.reduce((sum, d) => sum + d.temp, 0) / (data.length || 1)
  const lineColor =
    avgTemp < 5 ? '#1976d2' : avgTemp < 20 ? '#ffa726' : '#e53935'

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: isMobile ? 45 : 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

          <XAxis
            dataKey="time"
            tickFormatter={formatHour}
            tick={{
              fontSize: 12,
              textAnchor: isMobile ? 'end' : 'middle',
            }}
            angle={isMobile ? -40 : 0}
            height={isMobile ? 60 : 30}
            stroke="#555"
            interval={0}
          />

          <YAxis
            unit="°C"
            tick={{ fontSize: 12 }}
            stroke="#555"
            width={50}
            domain={['dataMin - 2', 'dataMax + 2']}
            allowDecimals={false}
          />

          <Tooltip
            labelFormatter={formatHour}
            formatter={(value: unknown) => [`${value}°C`, 'Temp']}
            contentStyle={{ fontSize: 13 }}
          />

          <Line
            type="monotone"
            dataKey="temp"
            stroke={lineColor}
            strokeWidth={2}
            dot={{ r: 4, stroke: lineColor, fill: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}
