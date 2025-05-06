/* eslint-disable react/prop-types */
import React from 'react';

// @mui
import { MenuList } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { TABLE_COLUMNS } from '../config/table-columns';

// ----------------------------------------------------------------------

export default function SubtripTableRow({ row, selected, onSelectRow, onViewRow, visibleColumns }) {
  const popover = usePopover();

  const renderCellContent = (columnConfig, rowData) => {
    const value = columnConfig.getter(rowData);

    return (
      <TableCell align={columnConfig.align}>
        {columnConfig.render ? (
          columnConfig.render(value, rowData)
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
        {/* Select column */}
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {/* Render columns */}
        {TABLE_COLUMNS.map(
          (column) =>
            visibleColumns[column.id] && (
              <React.Fragment key={column.id}>{renderCellContent(column, row)}</React.Fragment>
            )
        )}

        {/* Action column */}
        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Popover */}
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={popover.anchorEl}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              onViewRow(row._id);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
