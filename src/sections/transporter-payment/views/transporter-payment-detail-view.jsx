import { useCallback } from 'react';

import { DashboardContent } from 'src/layouts/dashboard';
import { useUpdateTransporterPaymentStatus } from 'src/query/use-transporter-payment';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import TransporterPaymentPreview from '../transport-payment-preview';
import TransporterPaymentToolbar from '../transporter-payment-toolbar';

export const TRANSPORTER_PAYMENT_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
];

export function TransporterPaymentDetailView({ transporterPayment }) {
  const { _id, status } = transporterPayment;

  const updateTransporterPaymentStatus = useUpdateTransporterPaymentStatus();

  const handleChangeStatus = useCallback(
    (event) => {
      const newStatus = event.target.value;
      updateTransporterPaymentStatus({ id: _id, status: newStatus });
    },
    [_id, updateTransporterPaymentStatus]
  );
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={_id}
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Transporter Payment', href: '/dashboard/transporterPayment' },
          { name: _id },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <TransporterPaymentToolbar
        transporterPayment={transporterPayment}
        currentStatus={status || ''}
        onChangeStatus={handleChangeStatus}
        statusOptions={TRANSPORTER_PAYMENT_OPTIONS}
      />

      <TransporterPaymentPreview transporterPayment={transporterPayment} />
    </DashboardContent>
  );
}
