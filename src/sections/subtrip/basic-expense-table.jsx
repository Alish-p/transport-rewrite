import {
  Table,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
} from '@mui/material';

import ExpenseListRow from './basic-expense-table-row';
import { expenseTableConfig } from './basic-expense-table-config';

// ----------------------------------------------------------------------

export default function ExpenseListTable({ expenses, onDeleteRow, onEditRow }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {expenseTableConfig.map((config) => (
              <TableCell key={config.id} align={config.type === 'number' ? 'right' : 'left'}>
                {config.label}
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense) => (
            <ExpenseListRow
              key={expense._id}
              row={expense}
              onDeleteRow={() => onDeleteRow(expense._id)}
              onEditRow={() => onEditRow(expense)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
