import React, { useMemo } from 'react';

import { useBoolean } from 'src/hooks/use-boolean';

import { GenericTableRow } from 'src/components/table';

import { INVOICE_STATUS } from '../invoice-config';
import { TABLE_COLUMNS } from '../invoice-table-config';
import InvoicePaymentDialog from '../invoice-payment-dialog';

export default function InvoiceTableRow({
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
  const payDialog = useBoolean();

  const handleView = onViewRow ? () => onViewRow(row._id) : undefined;
  const handleEdit = onEditRow ? () => onEditRow(row._id) : undefined;
  const handleDelete = onDeleteRow ? () => onDeleteRow(row._id) : undefined;

  const { invoiceStatus } = row;
  const canRecordPayment =
    invoiceStatus === INVOICE_STATUS.PENDING ||
    invoiceStatus === INVOICE_STATUS.PARTIAL_RECEIVED ||
    invoiceStatus === INVOICE_STATUS.OVERDUE;

  const customActions = useMemo(() => {
    if (!canRecordPayment) return [];

    return [
      {
        label: 'Record Payment',
        icon: 'mdi:cash-check',
        color: 'success.main',
        onClick: () => payDialog.onTrue(),
      },
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canRecordPayment]);

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

      {canRecordPayment && (
        <InvoicePaymentDialog
          open={payDialog.value}
          onClose={payDialog.onFalse}
          invoice={row}
        />
      )}
    </>
  );
}
