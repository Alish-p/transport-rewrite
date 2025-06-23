import dayjs from 'dayjs';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useVehicleBillingSummary } from 'src/query/use-vehicle';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableSkeleton } from 'src/components/table';
import { useDateRangePicker, CustomDateRangePicker } from 'src/components/custom-date-range-picker';

import { AppWidget } from 'src/sections/overview/app/app-widget';

const TABLE_HEAD = [
  { id: '_id', label: 'ID' },
  { id: 'customerName', label: 'Customer' },
  { id: 'routeName', label: 'Route' },
  { id: 'startDate', label: 'Start' },
  { id: 'endDate', label: 'End' },
  { id: 'loadingWeight', label: 'Weight' },
  { id: 'rate', label: 'Rate' },
  { id: 'amt', label: 'Amount' },
  { id: 'totalExpense', label: 'Expense' },
];

export function VehicleBillingSummary({ vehicleId }) {
  const rangePicker = useDateRangePicker(dayjs().startOf('month'), dayjs());

  const { data, isLoading } = useVehicleBillingSummary(
    {
      id: vehicleId,
      startDate: rangePicker.startDate && rangePicker.startDate.format('YYYY-MM-DD'),
      endDate: rangePicker.endDate && rangePicker.endDate.format('YYYY-MM-DD'),
    },
    { keepPreviousData: true }
  );

  const subtrips = data?.subtrips || [];
  const totals = data?.totals || {};

  return (
    <Card sx={{ mt: 5 }}>
      <CardHeader
        title="Profit and Expense Reports"
        action={
          <Button
            variant="outlined"
            onClick={rangePicker.onOpen}
            startIcon={<Iconify icon="solar:calendar-date-bold" />}
          >
            {rangePicker.shortLabel}
          </Button>
        }
      />

      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 3 }}>
        <AppWidget
          title="Subtrip Expense"
          total={totals.subtripExpense || 0}
          icon="ri:money-rupee-circle-line"
          sx={{ flexGrow: 1 }}
        />
        <AppWidget
          title="Vehicle Expense"
          total={totals.vehicleExpense || 0}
          icon="mdi:truck"
          sx={{ flexGrow: 1, bgcolor: 'warning.dark' }}
        />
        <AppWidget
          title="Total Profit"
          total={totals.totalProfit || 0}
          icon="solar:chart-bold"
          sx={{ flexGrow: 1, bgcolor: 'success.dark' }}
        />
      </Stack>

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size="small">
            <TableHead>
              <TableRow>
                {TABLE_HEAD.map((head) => (
                  <TableCell key={head.id}>{head.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableSkeleton />
              ) : (
                subtrips.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row._id}</TableCell>
                    <TableCell>{row.customerName}</TableCell>
                    <TableCell>{row.routeName}</TableCell>
                    <TableCell>{fDate(row.startDate)}</TableCell>
                    <TableCell>{fDate(row.endDate)}</TableCell>
                    <TableCell>{row.loadingWeight}</TableCell>
                    <TableCell>{row.rate}</TableCell>
                    <TableCell>{fCurrency(row.amt)}</TableCell>
                    <TableCell>{fCurrency(row.totalExpense)}</TableCell>
                  </TableRow>
                ))
              )}
              <TableNoData notFound={!isLoading && subtrips.length === 0} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <CustomDateRangePicker
        variant="calendar"
        open={rangePicker.open}
        onClose={rangePicker.onClose}
        startDate={rangePicker.startDate}
        endDate={rangePicker.endDate}
        onChangeStartDate={rangePicker.onChangeStartDate}
        onChangeEndDate={rangePicker.onChangeEndDate}
      />
    </Card>
  );
}
