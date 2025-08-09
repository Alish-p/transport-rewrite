import dayjs from 'dayjs';
import { useTheme } from '@emotion/react';
import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Select, Divider, MenuItem, CardHeader, FormControl } from '@mui/material';

import { fShortenNumber } from 'src/utils/format-number';

import { useCustomerMonthlyMaterialWeight } from 'src/query/use-customer';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart, ChartLegends } from 'src/components/chart';

export function CustomerMaterialSummaryWidget({ customer }) {
  const theme = useTheme();
  const { _id: customerId } = customer || {};

  const today = dayjs();
  const currentMonthIndex = today.month();
  const monthOptions = Array.from({ length: currentMonthIndex + 1 }, (_, i) => {
    const m = today.month(i);
    return {
      label: m.format('MMM-YYYY'),
      value: m.format('YYYY-MM'),
    };
  });

  const [selectedMonth, setSelectedMonth] = useState(monthOptions[currentMonthIndex].value);

  const { data: summary = [] } = useCustomerMonthlyMaterialWeight(customerId, selectedMonth);

  const mapped = useMemo(
    () =>
      summary.map((item) => ({
        label: item.materialType,
        value: item.totalLoadingWeight,
      })),
    [summary]
  );

  const chartColorsAll = mapped.map(
    (_, idx) =>
      [
        theme.palette.secondary.dark,
        theme.palette.error.main,
        theme.palette.primary.main,
        theme.palette.warning.main,
        theme.palette.info.dark,
        theme.palette.info.main,
        theme.palette.success.main,
        theme.palette.warning.dark,
      ][idx % 8]
  );

  const [activeIndexes, setActiveIndexes] = useState([]);

  useEffect(() => {
    setActiveIndexes(mapped.map((_, idx) => idx));
  }, [mapped]);

  const filtered = mapped.filter((_, idx) => activeIndexes.includes(idx));
  const chartColors = chartColorsAll.filter((_, idx) => activeIndexes.includes(idx));
  const chartSeries = filtered.map((item) => item.value);

  const chartOptions = useChart({
    chart: { offsetY: 12 },
    colors: chartColors,
    labels: filtered.map((item) => item.label),
    stroke: { width: 1, colors: [theme.palette.background.paper] },
    fill: { opacity: 0.88 },
    tooltip: { y: { formatter: (value) => fShortenNumber(value) } },
    plotOptions: { pie: { donut: { labels: { show: false } } } },
  });

  return (
    <Card>
      <CardHeader
        title="Material Summary"
        avatar={<Iconify icon="solar:box-bold" color="primary.main" width={24} />}
        action={
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              {monthOptions.map(({ label, value }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        }
      />

      <Box
        sx={{
          pt: 4,
          pb: 3,
          rowGap: 3,
          columnGap: 5,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Chart
          type="polarArea"
          series={chartSeries}
          options={chartOptions}
          width={{ xs: 240, md: 280 }}
          height={{ xs: 240, md: 280 }}
        />

        <ChartLegends
          colors={chartColorsAll}
          labels={mapped.map((item) => item.label)}
          sublabels={mapped.map((item) => fShortenNumber(item.value))}
          activeIndexes={activeIndexes}
          onToggle={(idx) =>
            setActiveIndexes((prev) =>
              prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
            )
          }
          sx={{ gap: 2.5, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}
        />
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box
        display="grid"
        gridTemplateColumns="repeat(2, 1fr)"
        sx={{ textAlign: 'center', typography: 'h4' }}
      >
        <Box sx={{ py: 2, borderRight: `dashed 1px ${theme.vars.palette.divider}` }}>
          <Box sx={{ mb: 1, typography: 'body2', color: 'text.secondary' }}>Categories</Box>
          {mapped.length}
        </Box>

        <Box sx={{ py: 2 }}>
          <Box sx={{ mb: 1, typography: 'body2', color: 'text.secondary' }}>Weight</Box>
          {fShortenNumber(mapped.reduce((sum, i) => sum + i.value, 0))}
        </Box>
      </Box>
    </Card>
  );
}

export default CustomerMaterialSummaryWidget;
