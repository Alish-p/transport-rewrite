import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

export function ExpenseChart({ title, subheader, chart, noDataMessage, ...other }) {
  const theme = useTheme();

  const chartSeries = chart.series.map((item) => item.value);
  const hasData = chartSeries.length > 0 && chartSeries.some((value) => value > 0);

  const chartColors = chart.colors ?? [
    theme.palette.secondary.dark,
    theme.palette.error.main,
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.info.dark,
    theme.palette.info.main,
    theme.palette.success.main,
    theme.palette.warning.dark,
    theme.palette.info.light,
    theme.palette.error.dark,
    theme.palette.success.light,
    theme.palette.secondary.dark,
  ];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    labels: chart.series.map((item) => item.label),
    stroke: { width: 0 },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      y: {
        formatter: (value) => fNumber(value),
        title: { formatter: (seriesName) => `${seriesName}` },
      },
    },
    plotOptions: { pie: { donut: { labels: { show: false } } } },
    ...chart.options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      {hasData ? (
        <>
          <Chart
            type="pie"
            series={chartSeries}
            options={chartOptions}
            width={{ xs: 240, xl: 260 }}
            height={{ xs: 240, xl: 260 }}
            sx={{ my: 6, mx: 'auto' }}
          />

          <Divider sx={{ borderStyle: 'dashed' }} />

          <ChartLegends
            labels={chartOptions?.labels}
            colors={chartOptions?.colors}
            sx={{ p: 3, justifyContent: 'center' }}
          />
        </>
      ) : (
        <Box sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {noDataMessage || 'No data to display'}
          </Typography>
        </Box>
      )}
    </Card>
  );
}
