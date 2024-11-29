import { Table, Paper, TableBody, TableContainer } from '@mui/material';

import ExpenseListRow from './basic-expense-table-row';
import { expenseTableConfig } from './basic-expense-table-config';
import { TableNoData, TableHeadCustom } from '../../components/table';

// ----------------------------------------------------------------------

export default function ExpenseListTable({ expenses, onDeleteRow, onEditRow }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHeadCustom headLabel={expenseTableConfig} />

        <TableBody>
          {expenses.map((expense) => (
            <ExpenseListRow
              key={expense._id}
              row={expense}
              onDeleteRow={() => onDeleteRow(expense._id)}
              onEditRow={() => onEditRow(expense)}
            />
          ))}
          <TableNoData notFound={expenses.length === 0} />
        </TableBody>
      </Table>
    </TableContainer>
  );
}
