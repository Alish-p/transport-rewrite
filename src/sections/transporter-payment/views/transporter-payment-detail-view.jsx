import { useParams } from 'react-router';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DashboardContent } from 'src/layouts/dashboard';
import { fetchPayment, updatePaymentStatus } from 'src/redux/slices/transporter-payment';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import TransporterPaymentPreview from '../transport-payment-preview';
import TransporterPaymentToolbar from '../transporter-payment-toolbar';

export const TRANSPORTER_PAYMENT_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
];

export function TransporterPaymentDetailView() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { payment: transporterPayment, isLoading } = useSelector(
    (state) => state.transporterPayment
  );

  useEffect(() => {
    dispatch(fetchPayment(id));
  }, [dispatch, id]);

  const status = transporterPayment?.status;

  const handleChangeStatus = useCallback(
    (event) => {
      const newStatus = event.target.value;

      dispatch(updatePaymentStatus(id, newStatus));
    },
    [dispatch, id]
  );
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={id}
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Transporter Payment', href: '/dashboard/transporterPayment' },
          { name: id },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {transporterPayment && !isLoading && (
        <TransporterPaymentToolbar
          transporterPayment={transporterPayment}
          currentStatus={status || ''}
          onChangeStatus={handleChangeStatus}
          statusOptions={TRANSPORTER_PAYMENT_OPTIONS}
        />
      )}

      {transporterPayment && !isLoading && (
        <TransporterPaymentPreview transporterPayment={transporterPayment} />
      )}
    </DashboardContent>
  );
}
