import React from 'react';

import { useBoolean } from 'src/hooks/use-boolean';

import { GenericTableRow } from 'src/components/table';

import { TABLE_COLUMNS } from './work-order-table-config';
import { WorkOrderStartDialog } from './work-order-start-dialog';

export default function WorkOrderTableRow({
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
  const startWorkDialog = useBoolean(false);

  const handleView = onViewRow ? () => onViewRow(row._id) : undefined;
  const handleEdit = onEditRow ? () => onEditRow(row._id) : undefined;
  const handleDelete = onDeleteRow ? () => onDeleteRow(row._id) : undefined;

  const customActions = [];

  if (row.status === 'open') {
    customActions.push({
      label: 'Start Work',
      icon: 'solar:play-bold',
      color: 'warning.main',
      onClick: () => {
        startWorkDialog.onTrue();
      },
    });
  }

  return (
    <>
      <GenericTableRow
        row={row}
        columns={TABLE_COLUMNS}
        selected={selected}
        onSelectRow={onSelectRow}
        onViewRow={handleView}
        onEditRow={handleEdit}
        onDeleteRow={handleDelete}
        customActions={customActions}
        visibleColumns={visibleColumns}
        disabledColumns={disabledColumns}
        columnOrder={columnOrder}
      />

      <WorkOrderStartDialog
        open={startWorkDialog.value}
        onClose={startWorkDialog.onFalse}
        workOrder={row}
      />
    </>
  );
}
