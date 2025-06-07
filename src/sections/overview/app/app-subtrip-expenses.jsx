import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';

import { fCurrency } from 'src/utils/format-number';

import { useMonthlyExpenseSummary } from 'src/query/use-dashboard';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart, ChartLegends } from 'src/components/chart';

import { subtripExpenseTypes } from 'src/sections/expense/expense-config';

// ----------------------------------------------------------------------

export function AppSubtripExpensesCategory({ title, subheader, ...other }) {
    const theme = useTheme();

    // build list of months similar to customer freight table
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

    const { data: summary = [] } = useMonthlyExpenseSummary(selectedMonth);

    const mapped = useMemo(() => summary.map((item) => {
        const cfg = subtripExpenseTypes.find((t) => t.value === item.expenseType);
        return {
            label: cfg?.label || item.expenseType,
            value: item.totalAmount,
            icon: cfg?.icon,
        };
    }), [summary]);

    const chartColors = mapped.map((_, idx) =>
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

    const chartSeries = mapped.map((item) => item.value);

    const chartOptions = useChart({
        chart: { offsetY: 12 },
        colors: chartColors,
        labels: mapped.map((item) => item.label),
        stroke: { width: 1, colors: [theme.palette.background.paper] },
        fill: { opacity: 0.88 },
        tooltip: { y: { formatter: (value) => fCurrency(value) } },
        plotOptions: { pie: { donut: { labels: { show: false } } } },
    });

    const icons = mapped.map((item) => <Iconify icon={item.icon} />);

    return (
        <Card {...other}>
            <CardHeader
                title={title}
                subheader={subheader}
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
                    colors={chartOptions?.colors}
                    labels={chartOptions?.labels}
                    icons={icons}
                    sublabels={mapped.map((item) => fCurrency(item.value))}
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
                    <Box sx={{ mb: 1, typography: 'body2', color: 'text.secondary' }}>Amount</Box>
                    {fCurrency(mapped.reduce((sum, i) => sum + i.value, 0))}
                </Box>
            </Box>
        </Card>
    );
}