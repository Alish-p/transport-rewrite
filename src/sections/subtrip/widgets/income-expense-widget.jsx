// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Card, Stack, Typography } from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

// components
import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function IncomeWidgetSummary({
  title,
  type,
  total,
  icon,
  percent,
  color = 'primary',
  chart,
  sx,
  ...other
}) {
  const theme = useTheme();

  const { series, options } = chart;

  const chartOptions = useChart({
    colors: [theme.palette[color].main],
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    xaxis: {
      labels: { show: false },
    },
    yaxis: {
      labels: { show: false },
    },
    stroke: {
      width: 4,
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (value) => fCurrency(value),
        title: {
          formatter: () => '',
        },
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.56,
        opacityTo: 0.56,
      },
    },
    ...options,
  });

  return (
    <Card
      sx={{
        width: 1,
        boxShadow: 0,
        color: theme.palette[color].darker,
        bgcolor: theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >
      <Iconify
        icon={icon}
        sx={{
          p: 1.5,
          top: 24,
          right: 24,
          width: 48,
          height: 48,
          borderRadius: '50%',
          position: 'absolute',
          color: theme.palette[color].lighter,
          bgcolor: theme.palette[color].dark,
        }}
      />

      <Stack spacing={1} sx={{ p: 3 }}>
        <Typography variant="subtitle2">{title}</Typography>

        <Typography variant="h3">{fCurrency(total) || 0}</Typography>

        <TrendingInfo type={type} />
      </Stack>

      <Chart type="area" series={[{ data: series }]} options={chartOptions} height={120} />
    </Card>
  );
}

// ----------------------------------------------------------------------

function TrendingInfo({ type }) {
  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap" spacing={0.5}>
      <Iconify icon={type === 'expense' ? 'eva:trending-down-fill' : 'eva:trending-up-fill'} />

      <Typography variant="subtitle2" component="span">
        <Box component="span" sx={{ opacity: 0.72, typography: 'body2' }}>
          {`  Total ${type} of Subtrip. `}
        </Box>
      </Typography>
    </Stack>
  );
}
