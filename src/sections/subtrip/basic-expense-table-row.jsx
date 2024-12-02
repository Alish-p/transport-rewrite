// ExpenseListRow.js

import {
  Button,
  Divider,
  TableRow,
  MenuItem,
  MenuList,
  TableCell,
  IconButton,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { expenseTableConfig } from './basic-expense-table-config';

// ----------------------------------------------------------------------

export default function ExpenseListRow({ row, onDeleteRow, onEditRow, onViewRow }) {
  const popover = usePopover();
  const confirm = useBoolean();

  return (
    <>
      <TableRow hover>
        {expenseTableConfig.map((config) => (
          <TableCell key={config.id} align={config.type === 'number' ? 'right' : 'left'}>
            {config.type === 'date' ? fDate(row[config.id]) : row[config.id]}
          </TableCell>
        ))}
        <TableCell align="right">
          <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={popover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem onClick={() => onViewRow(row)}>
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
          <MenuItem onClick={() => onEditRow(row)}>
            <Iconify icon="eva:edit-fill" />
            Edit
          </MenuItem>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="eva:trash-2-outline" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure you want to delete this expense?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
