import { useNavigate } from 'react-router';

import { Table, Paper, TableBody, TableContainer } from '@mui/material';

import { paths } from 'src/routes/paths';

import { TableNoData, TableHeadCustom } from 'src/components/table';

import ExpenseListRow from './basic-expense-table-row';
import { useDeleteExpense } from '../../query/use-expense';
import { expenseTableConfig } from './basic-expense-table-config';

// ----------------------------------------------------------------------

export default function ExpenseListTable({ expenses }) {
  const navigate = useNavigate();
  const deleteExpense = useDeleteExpense();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHeadCustom headLabel={expenseTableConfig} />

        <TableBody>
          {expenses.map((expense) => (
            <ExpenseListRow
              key={expense._id}
              row={expense}
              onDeleteRow={() => {
                deleteExpense(expense._id);
              }}
              onEditRow={() => navigate(paths.dashboard.expense.edit(expense._id))}
              onViewRow={() => navigate(paths.dashboard.expense.details(expense._id))}
            />
          ))}
          <TableNoData notFound={expenses.length === 0} />
        </TableBody>
      </Table>
    </TableContainer>
  );
}
