import dayjs from 'dayjs';
import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fShortenNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartSelect, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

export function AppSubtripCompletedChart({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const currentYear = dayjs().format('YYYY');

  const [selectedSeries, setSelectedSeries] = useState(currentYear);

  const chartColors = chart.colors ?? [
    theme.palette.primary.dark,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  const chartOptions = useChart({
    chart: { stacked: true },
    colors: chartColors,
    stroke: { width: 0 },
    xaxis: { categories: chart.categories },
    tooltip: {
      y: {
        formatter: (value) => value,
      },
    },
    // Show total (own + market) labels on top of each stacked bar
    plotOptions: {
      bar: {
        columnWidth: '40%',
        dataLabels: {
          total: {
            enabled: true,
            style: {
              color: theme.vars.palette.text.primary,
            },
          },
        },
      },
    },
    ...chart.options,
  });

  const handleChangeSeries = useCallback((newValue) => {
    setSelectedSeries(newValue);
  }, []);

  const currentSeries = chart.series.find((i) => i.name === selectedSeries);

  const legendItems = currentSeries?.data || [];

  const legendTotals = legendItems.map(({ data }) => data.reduce((sum, v) => sum + v, 0));
  const legendValues = legendTotals.map((total) => fShortenNumber(total));

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <ChartSelect
            options={chart.series.map((item) => item.name)}
            value={selectedSeries}
            onChange={handleChangeSeries}
          />
        }
        sx={{ mb: 3 }}
      />

      <ChartLegends
        colors={chartOptions?.colors}
        labels={legendItems.map((item) => item.name)}
        values={legendValues}
        sx={{
          px: 3,
          gap: 3,
        }}
      />

      <Chart
        key={selectedSeries}
        type="bar"
        series={currentSeries?.data}
        options={chartOptions}
        height={320}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}
