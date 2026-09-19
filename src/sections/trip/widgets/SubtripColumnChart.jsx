import { Card, CardHeader } from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';

import { SUBTRIP_STATUS } from 'src/sections/subtrip/constants';

// ----------------------------------------------------------------------

export default function ProfitExpenseChart({ subtrips, title, subheader }) {
  const activeSubtrips = (subtrips || []).filter(
    (st) => st?.subtripStatus !== SUBTRIP_STATUS.CANCELLED
  );

  // Calculate profit and expenses for each subtrip
  const series = [
    {
      name: 'Profit',
      data: activeSubtrips.map((subtrip) => subtrip.freightDetails?.freightAmount || 0),
    },
    {
      name: 'Expenses',
      data: activeSubtrips.map(
        (subtrip) =>
          subtrip?.expenses
            ?.filter((e) => e.status !== 'Cancelled')
            .reduce((total, expense) => total + expense.amount, 0) || 0
      ),
    },
  ];

  const chartOptions = useChart({
    stroke: {
      show: true,
      width: 3,
      colors: ['transparent'],
    },
    xaxis: {
      categories: activeSubtrips.map((subtrip) => subtrip.subtripNo),
    },
    yaxis: {
      labels: {
        formatter: (value) => Math.round(value),
      },
    },
    tooltip: {
      y: {
        formatter: (value) => fCurrency(value),
      },
    },
    plotOptions: { bar: { columnWidth: '36%' } },
  });

  return (
    <Card>
      <CardHeader title={title} subheader={subheader} />
      <Chart type="bar" series={series} options={chartOptions} height={320} />
    </Card>
  );
}
