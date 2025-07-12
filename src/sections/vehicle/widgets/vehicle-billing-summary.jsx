/* eslint-disable react/no-unstable-nested-components */
import dayjs from 'dayjs';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { wrapText } from 'src/utils/change-case';
import { fCurrency } from 'src/utils/format-number';
import { fDateRangeShortLabel } from 'src/utils/format-time';

import { PDFDownloadButton } from 'src/pdfs/common';
import { useVehicleBillingSummary } from 'src/query/use-vehicle';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableSkeleton } from 'src/components/table';
import { useDateRangePicker, CustomDateRangePicker } from 'src/components/custom-date-range-picker';

const TABLE_HEAD = [
  { id: 'index', label: '#' },
  { id: '_id', label: 'ID' },
  { id: 'customerName', label: 'Customer' },
  { id: 'routeName', label: 'Route' },
  { id: 'date', label: 'Date' },
  { id: 'loadingWeight', label: 'Weight' },
  { id: 'rate', label: 'Rate' },
  { id: 'amt', label: 'Amount' },
  { id: 'totalExpense', label: 'Expense' },
  { id: 'netProfit', label: 'Net Profit' },
];

export function VehicleBillingSummary({ vehicleId, vehicleNo }) {
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

  const getDocument = async () => {
    const { default: VehiclePnlPdf } = await import('src/pdfs/vehicle-pnl-pdf');

    const start = rangePicker.startDate?.format('YYYY-MM-DD');
    const end = rangePicker.endDate?.format('YYYY-MM-DD');

    return () => (
      <VehiclePnlPdf vehicleNo={vehicleNo} startDate={start} endDate={end} subtrips={subtrips} />
    );
  };

  return (
    <Card>
      <CardHeader
        title="P&L Report"
        subheader="Only subtrips with completed billing are listed below. Subtrips still in receive or loaded status are not included."
        action={
          <Stack direction={{ sm: 'column', md: 'row' }} spacing={1}>
            <Button
              variant="outlined"
              onClick={rangePicker.onOpen}
              startIcon={<Iconify icon="solar:calendar-date-bold" />}
            >
              {rangePicker.shortLabel}
            </Button>
            <PDFDownloadButton
              buttonText="Download"
              fileName={`vehicle-pnl-${vehicleNo}.pdf`}
              getDocument={getDocument}
            />
          </Stack>
        }
      />

      <TableContainer sx={{ position: 'relative', overflow: 'unset', mt: 3 }}>
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
                subtrips.map((row, index) => {
                  const netProfit = row.amt - row.totalExpense;

                  return (
                    <TableRow key={row._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <RouterLink
                          to={paths.dashboard.subtrip.details(row._id)}
                          style={{ color: 'green', textDecoration: 'underline' }}
                        >
                          {row._id}
                        </RouterLink>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={row.customerName}>
                          <Typography variant="body2" noWrap>
                            {wrapText(row.customerName || '-', 20)}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={row.routeName}>
                          <Typography variant="body2" noWrap>
                            {wrapText(row.routeName || '-', 20)}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{fDateRangeShortLabel(row.startDate, row.endDate)}</TableCell>
                      <TableCell>{row.loadingWeight}</TableCell>
                      <TableCell>{row.rate}</TableCell>
                      <TableCell>{fCurrency(row.amt)}</TableCell>
                      <TableCell>{fCurrency(row.totalExpense)}</TableCell>
                      <TableCell sx={{ color: netProfit > 0 ? 'success.main' : 'error.main' }}>
                        {fCurrency(netProfit)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
              {subtrips.length > 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ fontWeight: 'fontWeightBold' }}>
                    Total
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'fontWeightBold' }}>
                    {fCurrency(subtrips.reduce((sum, r) => sum + r.amt, 0))}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'fontWeightBold' }}>
                    {fCurrency(subtrips.reduce((sum, r) => sum + r.totalExpense, 0))}
                  </TableCell>
                  {(() => {
                    const totalNet = subtrips.reduce((sum, r) => sum + r.amt - r.totalExpense, 0);
                    return (
                      <TableCell
                        sx={{
                          fontWeight: 'fontWeightBold',
                          color: totalNet > 0 ? 'success.main' : 'error.main',
                        }}
                      >
                        {fCurrency(totalNet)}
                      </TableCell>
                    );
                  })()}
                </TableRow>
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
