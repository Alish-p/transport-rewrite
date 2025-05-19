import { useCallback } from 'react';

import { DashboardContent } from 'src/layouts/dashboard';
import { useUpdateTransporterPaymentStatus } from 'src/query/use-transporter-payment';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TRANSPORTER_PAYMENT_OPTIONS } from '../utils/constant';
import TransporterPaymentView from '../transporter-payment-view';
import TransporterPaymentToolbar from '../transporter-payment-toolbar';

export function TransporterPaymentDetailView({ transporterPayment }) {
  const { _id, status, paymentId } = transporterPayment;

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
        heading={paymentId}
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Transporter Payment', href: '/dashboard/transporterPayment' },
          { name: paymentId },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <TransporterPaymentToolbar
        transporterPayment={transporterPayment}
        currentStatus={status || ''}
        onChangeStatus={handleChangeStatus}
        statusOptions={TRANSPORTER_PAYMENT_OPTIONS}
      />

      <TransporterPaymentView transporterPayment={transporterPayment} />
    </DashboardContent>
  );
}
