import React, { useMemo } from 'react';

import Button from '@mui/material/Button';

import { useBoolean } from 'src/hooks/use-boolean';

import { useUpdateTransporterPaymentStatus } from 'src/query/use-transporter-payment';

import { GenericTableRow } from 'src/components/table';
import { ConfirmDialog } from 'src/components/custom-dialog';

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
  const markPaidConfirm = useBoolean();
  const cancelConfirm = useBoolean();
  const updateStatus = useUpdateTransporterPaymentStatus();

  const canMarkPaid = row?.status === 'generated';

  const customActions = useMemo(() => {
    const actions = [];
    if (canMarkPaid) {
      actions.push({
        label: 'Mark as Paid',
        icon: 'mdi:cash-check',
        color: 'success.main',
        onClick: () => markPaidConfirm.onTrue(),
      });
    }

    if (row?.status !== 'cancelled' && onDeleteRow) {
      actions.push({
        label: 'Cancel',
        icon: 'mdi:close-circle',
        color: 'error.main',
        onClick: () => cancelConfirm.onTrue(),
      });
    }

    return actions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canMarkPaid, row?.status, onDeleteRow]);

  return (
    <>
      <GenericTableRow
        row={row}
        columns={TABLE_COLUMNS}
        selected={selected}
        onSelectRow={onSelectRow}
        onViewRow={onViewRow}
        onEditRow={onEditRow}
        customActions={customActions}
        visibleColumns={visibleColumns}
        disabledColumns={disabledColumns}
        columnOrder={columnOrder}
      />

      {canMarkPaid && (
        <ConfirmDialog
          open={markPaidConfirm.value}
          onClose={markPaidConfirm.onFalse}
          title="Mark as Paid"
          content={`Are you sure you want to mark payment "${row.paymentId}" as paid?`}
          action={
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                updateStatus({ id: row._id, status: 'paid' });
                markPaidConfirm.onFalse();
              }}
            >
              Mark as Paid
            </Button>
          }
        />
      )}

      {onDeleteRow && row?.status !== 'cancelled' && (
        <ConfirmDialog
          open={cancelConfirm.value}
          onClose={cancelConfirm.onFalse}
          title="Cancel Transporter Payment"
          content={`Are you sure you want to cancel the transporter payment "${row.paymentId}"?`}
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                onDeleteRow();
                cancelConfirm.onFalse();
              }}
            >
              Cancel
            </Button>
          }
        />
      )}
    </>
  );
}
