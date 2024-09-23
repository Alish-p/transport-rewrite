// ExpenseListRow.js
import { useState } from 'react';

import { TableRow, MenuItem, TableCell, IconButton } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { expenseTableConfig } from './basic-expense-table-config';
import { usePopover, CustomPopover } from '../../components/custom-popover';

// ----------------------------------------------------------------------

export default function ExpenseListRow({ row, onDeleteRow, onEditRow }) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const popover = usePopover();

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover>
        {expenseTableConfig.map((config) => (
          <TableCell key={config.id} align={config.type === 'number' ? 'right' : 'left'}>
            {config.type === 'date' ? fDate(row[config.id]) : row[config.id]}
          </TableCell>
        ))}
        <TableCell align="right">
          <IconButton color={openPopover ? 'primary' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover open={popover.open} onClose={popover.onClose}>
        <MenuItem onClick={() => onEditRow(row)}>
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure you want to delete this expense?"
        action={
          <MenuItem variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </MenuItem>
        }
      />
    </>
  );
}
