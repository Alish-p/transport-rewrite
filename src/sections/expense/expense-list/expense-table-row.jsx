import React from 'react';

import { GenericTableRow } from 'src/components/table';

import { TABLE_COLUMNS } from '../expense-table-config';

// ----------------------------------------------------------------------

export default function ExpenseTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
  visibleColumns,
  disabledColumns,
  columnOrder,
}) {
  const isCancelled = row?.status === 'Cancelled';
  const handleView = onViewRow ? () => onViewRow(row._id) : undefined;
  const handleEdit = !isCancelled && onEditRow ? () => onEditRow(row._id) : undefined;
  const handleDelete = !isCancelled && onDeleteRow ? () => onDeleteRow(row._id) : undefined;

  return (
    <GenericTableRow
      row={row}
      columns={TABLE_COLUMNS}
      selected={selected}
      onSelectRow={onSelectRow}
      onViewRow={handleView}
      onEditRow={handleEdit}
      onDeleteRow={handleDelete}
      visibleColumns={visibleColumns}
      disabledColumns={disabledColumns}
      columnOrder={columnOrder}
      rowProps={
        isCancelled
          ? {
              sx: {
                opacity: 0.6,
                textDecoration: 'line-through',
                '& .MuiTableCell-root': { textDecoration: 'line-through' },
              },
            }
          : {}
      }
    />
  );
}
