import { useState } from 'react';

// @mui
import { Box, Card, CardHeader } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';
// components

// ----------------------------------------------------------------------

export default function BankingBalanceStatistics({ title, subheader, chart, ...other }) {
  const { categories, colors, series, options } = chart;

  const [seriesData, setSeriesData] = useState('Year');

  const chartOptions = useChart({
    colors,
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories,
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value}`,
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      {series.map((item) => (
        <Box key={item.type} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.type === seriesData && (
            <Chart type="bar" series={item.data} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </Card>
  );
}
