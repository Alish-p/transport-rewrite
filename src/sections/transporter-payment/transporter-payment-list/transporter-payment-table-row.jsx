import React from 'react';

import { GenericTableRow } from 'src/components/table';

import { TABLE_COLUMNS } from '../transporter-payment-table-config';

export default function TransporterPaymentTableRow({
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
  return (
    <GenericTableRow
      row={row}
      columns={TABLE_COLUMNS}
      selected={selected}
      onSelectRow={onSelectRow}
      onViewRow={onViewRow}
      onEditRow={onEditRow}
      onDeleteRow={onDeleteRow}
      visibleColumns={visibleColumns}
      disabledColumns={disabledColumns}
      columnOrder={columnOrder}
    />
  );
}
