// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Card, Chip, Stack, Typography } from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

// components
import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function IncomeWidgetSummary({
  title,
  total,
  icon,
  color = 'primary',
  chart,
  description,
  infoNote,
  badge,
  badgeColor = 'default',
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
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle2">{title}</Typography>
          {badge && (
            <Chip
              label={badge}
              size="small"
              color={badgeColor}
              sx={{ fontSize: 10, height: 18, fontWeight: 600 }}
            />
          )}
        </Stack>

        <Typography variant="h3">
          {typeof total === 'number' ? fCurrency(total) : total || 0}
        </Typography>

        {description && (
          <Typography variant="caption" sx={{ opacity: 0.72, fontStyle: 'italic' }}>
            {description}
          </Typography>
        )}

        {infoNote && (
          <Box
            sx={{
              mt: 0.5,
              px: 1,
              py: 0.5,
              borderRadius: 0.75,
              bgcolor: (t) =>
                t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              width: 'fit-content',
            }}
          >
            <Iconify icon="eva:info-fill" width={14} sx={{ flexShrink: 0 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: 11 }}>
              {infoNote}
            </Typography>
          </Box>
        )}
      </Stack>

      <Chart type="area" series={[{ data: series }]} options={chartOptions} height={120} />
    </Card>
  );
}
