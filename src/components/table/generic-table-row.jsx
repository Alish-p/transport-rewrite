import React from 'react';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function GenericTableRow({
  row,
  columns,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
  visibleColumns = {},
  disabledColumns = {},
}) {
  const confirm = useBoolean();
  const popover = usePopover();

  const renderCellContent = (column) => {
    const value = column.getter(row);
    return (
      <TableCell align={column.align}>
        {column.render ? (
          column.render(value, row)
        ) : (
          <ListItemText
            primary={value || '-'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          />
        )}
      </TableCell>
    );
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {columns.map(
          (column) =>
            (visibleColumns[column.id] || disabledColumns[column.id]) && (
              <React.Fragment key={column.id}>{renderCellContent(column)}</React.Fragment>
            )
        )}

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
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
          {onViewRow && (
            <MenuItem
              onClick={() => {
                onViewRow(row);
                popover.onClose();
              }}
            >
              <Iconify icon="solar:eye-bold" />
              View
            </MenuItem>
          )}

          {onEditRow && (
            <MenuItem
              onClick={() => {
                onEditRow(row);
                popover.onClose();
              }}
            >
              <Iconify icon="solar:pen-bold" />
              Edit
            </MenuItem>
          )}

          {onDeleteRow && <Divider sx={{ borderStyle: 'dashed' }} />}

          {onDeleteRow && (
            <MenuItem
              onClick={() => {
                confirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          )}
        </MenuList>
      </CustomPopover>

      {onDeleteRow && (
        <ConfirmDialog
          open={confirm.value}
          onClose={confirm.onFalse}
          title="Delete"
          content="Are you sure want to delete?"
          action={
            <Button variant="contained" color="error" onClick={() => onDeleteRow(row)}>
              Delete
            </Button>
          }
        />
      )}
    </>
  );
}
