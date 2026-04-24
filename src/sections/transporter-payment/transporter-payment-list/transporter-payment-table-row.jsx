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
  const updateStatus = useUpdateTransporterPaymentStatus();

  const canMarkPaid = row?.status !== 'paid';

  const customActions = useMemo(() => {
    if (!canMarkPaid) return [];

    return [
      {
        label: 'Mark as Paid',
        icon: 'mdi:cash-check',
        color: 'success.main',
        onClick: () => markPaidConfirm.onTrue(),
      },
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canMarkPaid]);

  return (
    <>
      <GenericTableRow
        row={row}
        columns={TABLE_COLUMNS}
        selected={selected}
        onSelectRow={onSelectRow}
        onViewRow={onViewRow}
        onEditRow={onEditRow}
        onDeleteRow={onDeleteRow}
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
    </>
  );
}
