import React from 'react';

import { GenericTableRow } from 'src/components/table';

import { TABLE_COLUMNS } from './driver-payroll-table-config';

export default function DriverPayrollTableRow({
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
  const handleView = onViewRow ? () => onViewRow() : undefined;
  const handleEdit = onEditRow ? () => onEditRow() : undefined;
  const handleDelete = onDeleteRow ? () => onDeleteRow() : undefined;

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
    />
  );
}
