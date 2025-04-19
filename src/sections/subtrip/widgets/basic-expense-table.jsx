import { useState } from 'react';
import { useNavigate } from 'react-router';

import {
  Box,
  Card,
  Chip,
  Table,
  Paper,
  Stack,
  Button,
  Tooltip,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import { fNumber, fCurrency } from 'src/utils/format-number';

import { useDeleteExpense } from 'src/query/use-expense';

import { Iconify } from 'src/components/iconify';
import { TableNoData } from 'src/components/table';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { subtripExpenseTypes } from '../../expense/expense-config';

export const BasicExpenseTable = ({ selectedSubtrip, withDelete = false, withAdd = false }) => {
  const deleteExpense = useDeleteExpense();
  const navigate = useNavigate();
  const confirm = useBoolean();

  const [selectedExpense, setSelectedExpense] = useState(null);

  const subtripExpenses = selectedSubtrip?.expenses || [];
  const totalExpenses = subtripExpenses.reduce((acc, expense) => acc + expense.amount, 0);

  return (
    <Card sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">Existing Expenses</Typography>

        <Stack direction="row" spacing={1}>
          <Chip
            label={`Total: ${fCurrency(totalExpenses)}`}
            color="info"
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
          {withAdd && (
            <Button
              variant="contained"
              size="small"
              color="primary"
              startIcon={<Iconify icon="mdi:plus" />}
              onClick={() => {
                navigate(`${paths.dashboard.expense.new}?currentSubtrip=${selectedSubtrip._id}`);
              }}
            >
              Add Expense
            </Button>
          )}
        </Stack>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center" width="15%">
                Date
              </TableCell>
              <TableCell align="center" width="20%">
                Type
              </TableCell>
              <TableCell align="center" width="15%">
                Diesel Ltr
              </TableCell>
              <TableCell align="center" width="15%">
                Diesel Price
              </TableCell>
              <TableCell align="center" width="20%">
                Amount
              </TableCell>
              <TableCell align="center" width="15%">
                Remarks
              </TableCell>
              {withDelete && (
                <TableCell align="center" width="15%">
                  Delete
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {subtripExpenses.map((expense) => (
              <TableRow key={expense._id} hover>
                <TableCell align="center">{fDate(expense.date)}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                    <Iconify
                      icon={
                        subtripExpenseTypes.find((type) => type.value === expense.expenseType)
                          ?.icon || 'mdi:help-circle'
                      }
                      sx={{ color: 'primary.main' }}
                    />
                    <Typography variant="body2" noWrap>
                      {expense.expenseType}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  {expense.dieselLtr ? `${fNumber(expense.dieselLtr)} L` : '-'}
                </TableCell>
                <TableCell align="center">
                  {expense.dieselPrice ? `${fNumber(expense.dieselPrice)}` : '-'}
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="medium">
                    {fCurrency(expense.amount)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={expense.remarks || '-'}>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                      {expense.remarks || '-'}
                    </Typography>
                  </Tooltip>
                </TableCell>
                {withDelete && (
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        confirm.onTrue();
                        setSelectedExpense(expense);
                      }}
                    >
                      <Iconify icon="mdi:delete" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
            <TableNoData notFound={subtripExpenses.length === 0} />
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        onConfirm={() => deleteExpense(selectedExpense._id)}
        title="Delete Expense"
        message="Are you sure you want to delete this expense?"
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Expense"
        content="Are you sure you want to delete this expense?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
              deleteExpense(selectedExpense._id);
            }}
          >
            Delete
          </Button>
        }
      />
    </Card>
  );
};
