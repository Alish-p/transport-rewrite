import React, { useMemo } from 'react';

import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { TABLE_COLUMNS } from './config/table-columns';

export default function DocumentsTableRow({
  row,
  selected,
  onSelectRow,
  onOpenDetails,
  visibleColumns,
  disabledColumns,
  columnOrder,
}) {
  const orderedColumns = useMemo(
    () =>
      columnOrder?.length
        ? columnOrder.map((id) => TABLE_COLUMNS.find((c) => c.id === id)).filter(Boolean)
        : TABLE_COLUMNS,
    [columnOrder]
  );

  const handleRowClick = (e) => {
    const { target } = e;
    if (target && typeof target.closest === 'function') {
      const isInteractive = target.closest(
        'a, button, input, textarea, select, [role="button"], .MuiIconButton-root, .MuiCheckbox-root, .MuiLink-root'
      );
      if (isInteractive) return;
    }
    if (onOpenDetails) onOpenDetails(row);
  };

  return (
    <TableRow hover selected={!!selected} onClick={handleRowClick} sx={{ cursor: 'pointer' }}>
      {onSelectRow ? (
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={!!selected} onClick={onSelectRow} />
        </TableCell>
      ) : null}

      {orderedColumns.map((column) =>
        visibleColumns[column.id] || disabledColumns[column.id] ? (
          <TableCell key={column.id} align={column.align}>
            {column.render ? (
              column.render(row)
            ) : (
              <ListItemText
                primary={column.getter(row) || '-'}
                primaryTypographyProps={{ typography: 'body2', noWrap: true }}
              />
            )}
          </TableCell>
        ) : null
      )}
    </TableRow>
  );
}
