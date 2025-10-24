import dayjs from 'dayjs';
import { useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';

import { fDate } from 'src/utils/format-time';
import { fNumber } from 'src/utils/format-number';

import { usePaginatedExpenses } from 'src/query/use-expense';

import { Scrollbar } from 'src/components/scrollbar';
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

export function TransporterExpensesWidget({ transporterId, title = 'Expenses', ...other }) {
  const today = dayjs();
  const currentMonthIndex = today.month();
  const monthOptions = Array.from({ length: currentMonthIndex + 1 }, (_, i) => {
    const m = today.month(i);
    return { label: m.format('MMM-YYYY'), value: m.format('YYYY-MM') };
  });

  const [selectedMonth, setSelectedMonth] = useState(monthOptions[currentMonthIndex].value);

  const table = useTable({ defaultOrderBy: 'date', defaultRowsPerPage: 5 });

  const startDate = dayjs(selectedMonth).startOf('month').format('YYYY-MM-DD');
  const endDate = dayjs(selectedMonth).endOf('month').format('YYYY-MM-DD');

  const { data, isLoading } = usePaginatedExpenses({
    transporterId,
    startDate,
    endDate,
    page: table.page + 1,
    rowsPerPage: table.rowsPerPage,
  });

  const expenses = data?.expenses || [];
  const totalCount = data?.totals?.all?.count || 0;

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    table.onResetPage();
  };

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader="Expenses incurred by transporter vehicles"
        sx={{ mb: 3 }}
        action={
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select value={selectedMonth} onChange={handleMonthChange}>
              {monthOptions.map(({ label, value }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        }
      />

      <Scrollbar sx={{ minHeight: 401, maxHeight: 401 }}>
        <Table sx={{ minWidth: 680 }}>
          <TableHeadCustom
            headLabel={[
              { id: 'index', label: 'No.' },
              { id: 'vehicle', label: 'Vehicle No' },
              { id: 'type', label: 'Expense Type' },
              { id: 'dieselLtr', label: 'Diesel Ltr' },
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
                    <TableCell>{row.dieselLtr || '-'}</TableCell>
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
      />
    </Card>
  );
}

export default TransporterExpensesWidget;
