import dayjs from 'dayjs';

import { useCustomerSubtripMonthlyData } from 'src/query/use-customer';

import { AppSubtripCompletedChart } from 'src/sections/overview/app/app-subtrips-completed-chart';

export function CustomerSubtripCompletedWidget({ customer }) {
  const { _id: customerId } = customer || {};
  const currentYear = dayjs().year();

  const { data: subtripMonthlyData } = useCustomerSubtripMonthlyData(customerId, currentYear);

  const chart = {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    series: [
      subtripMonthlyData
        ? {
            name: String(subtripMonthlyData.year),
            data: [
              { name: 'Own', data: subtripMonthlyData.own },
              { name: 'Market', data: subtripMonthlyData.market },
            ],
          }
        : {
            name: String(currentYear),
            data: [
              { name: 'Own', data: Array(12).fill(0) },
              { name: 'Market', data: Array(12).fill(0) },
            ],
          },
    ],
  };

  return (
    <AppSubtripCompletedChart
      title="Subtrips Completed"
      chart={chart}
      sx={{ borderTop: (t) => `4px solid ${t.palette.primary.main}`, height: 1 }}
    />
  );
}

export default CustomerSubtripCompletedWidget;
