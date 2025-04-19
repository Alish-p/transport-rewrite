import {
  Box,
  Card,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  TableContainer,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';
import { fNumber, fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { TableNoData } from 'src/components/table';

import { subtripExpenseTypes } from '../../expense/expense-config';

export const BasicExpenseTable = ({ selectedSubtrip }) => {
  const subtripExpenses = selectedSubtrip?.expenses || [];

  return (
    <Card sx={{ mt: 3, p: 2 }}>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1">Existing Expenses</Typography>
        <Typography variant="subtitle2" color="primary">
          {`Total Expenses: ${fCurrency(
            subtripExpenses.reduce((acc, expense) => acc + expense.amount, 0)
          )}`}
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Diesel Ltr</TableCell>
              <TableCell align="center">Diesel Price</TableCell>
              <TableCell align="center">Amount</TableCell>
              <TableCell align="center">Remarks</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {subtripExpenses.map((expense) => (
              <TableRow key={expense._id}>
                <TableCell align="center">{fDate(expense.date)}</TableCell>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <Iconify
                      icon={
                        subtripExpenseTypes.find((type) => type.value === expense.expenseType).icon
                      }
                      sx={{ mr: 1 }}
                    />
                    {expense.expenseType}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {expense.dieselLtr ? `${fNumber(expense.dieselLtr)} L` : '-'}
                </TableCell>
                <TableCell align="center">
                  {expense.dieselPrice ? `${fNumber(expense.dieselPrice)}` : '-'}
                </TableCell>
                <TableCell align="center">{fCurrency(expense.amount)}</TableCell>

                <TableCell align="center">{expense.remarks || '-'}</TableCell>
              </TableRow>
            ))}
            <TableNoData notFound={subtripExpenses.length === 0} />
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};
