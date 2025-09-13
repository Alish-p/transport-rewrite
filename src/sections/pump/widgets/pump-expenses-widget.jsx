import dayjs from 'dayjs';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';

import { fDate } from 'src/utils/format-time';
import { fNumber } from 'src/utils/format-number';
import { exportToExcel } from 'src/utils/export-to-excel';

import { usePaginatedExpenses } from 'src/query/use-expense';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useDateRangePicker, CustomDateRangePicker } from 'src/components/custom-date-range-picker';
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

export function PumpExpensesWidget({ pumpId, title = 'Pump Expenses', ...other }) {
  const table = useTable({ defaultOrderBy: 'date', defaultRowsPerPage: 5 });

  const rangePicker = useDateRangePicker(dayjs().startOf('month'), dayjs());

  const { data, isLoading } = usePaginatedExpenses({
    pumpId,
    startDate: rangePicker.startDate && rangePicker.startDate.format('YYYY-MM-DD'),
    endDate: rangePicker.endDate && rangePicker.endDate.format('YYYY-MM-DD'),
    page: table.page + 1,
    rowsPerPage: table.rowsPerPage,
  });

  const expenses = data?.expenses || [];
  const totalCount = data?.totals?.all?.count || 0;

  const handleChangeStartDate = (newValue) => {
    rangePicker.onChangeStartDate(newValue);
    table.onResetPage();
  };

  const handleChangeEndDate = (newValue) => {
    rangePicker.onChangeEndDate(newValue);
    table.onResetPage();
  };

  const handleDownload = async () => {
    const exportRows = expenses.map((row, idx) => ({
      'No.': table.page * table.rowsPerPage + idx + 1,
      'Vehicle No': row.vehicleId?.vehicleNo || '-',
      'Expense Type': row.expenseType || '-',
      'Diesel Rate': row.dieselPrice ?? '-',
      Date: row.date ? fDate(new Date(row.date)) : '-',
      Amount: typeof row.amount === 'number' ? row.amount : Number(row.amount) || 0,
    }));

    await exportToExcel(exportRows, 'Pump-Expenses');
  };

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader="Expenses incurred at this pump"
        sx={{ mb: 3 }}
        action={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={rangePicker.onOpen}
              startIcon={<Iconify icon="solar:calendar-date-bold" />}
            >
              {rangePicker.shortLabel}
            </Button>

            <Button
              variant="outlined"
              color="primary"
              onClick={handleDownload}
              startIcon={<Iconify icon="eva:download-fill" />}
            >
              Download
            </Button>
          </Stack>
        }
      />

      <Scrollbar sx={{ minHeight: 401, maxHeight: 401 }}>
        <Table sx={{ minWidth: 680 }}>
          <TableHeadCustom
            headLabel={[
              { id: 'index', label: 'No.' },
              { id: 'vehicle', label: 'Vehicle No' },
              { id: 'type', label: 'Expense Type' },
              { id: 'dieselRate', label: 'Diesel Rate' },
              { id: 'date', label: 'Date' },
              { id: 'amount', label: 'Amount', align: 'right' },
            ]}
          />

          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : expenses.length ? (
              <>
                {expenses.map((row, idx) => (
                  <TableRow key={row._id}>
                    <TableCell>{table.page * table.rowsPerPage + idx + 1}</TableCell>
                    <TableCell>{row.vehicleId?.vehicleNo || '-'}</TableCell>
                    <TableCell>{row.expenseType || '-'}</TableCell>
                    <TableCell>{row.dieselPrice || '-'}</TableCell>
                    <TableCell>{row.date ? fDate(new Date(row.date)) : '-'}</TableCell>
                    <TableCell align="right">{fNumber(row.amount)}</TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <TableNoData notFound />
            )}
          </TableBody>
        </Table>
      </Scrollbar>

      <TablePaginationCustom
        count={totalCount}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        dense={table.dense}
        onChangeDense={table.onChangeDense}
        rowsPerPageOptions={[5, 25, 100, 250]}
      />

      <CustomDateRangePicker
        variant="calendar"
        open={rangePicker.open}
        onClose={rangePicker.onClose}
        startDate={rangePicker.startDate}
        endDate={rangePicker.endDate}
        onChangeStartDate={handleChangeStartDate}
        onChangeEndDate={handleChangeEndDate}
      />
    </Card>
  );
}

export default PumpExpensesWidget;
