import { useState, useCallback } from 'react';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import TransporterPaymentDetails from '../transporter-payment-details';

export const INVOICE_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'draft', label: 'Draft' },
];

export function TransporterPaymentDetailView({ transporterPayment, loading }) {
  const handleChangeStatus = useCallback((event) => {
    setCurrentStatus(event.target.value);
  }, []);

  const {
    _id,
    subtrips,
    transporterId: transporter,
    status,
    createdDate,
  } = transporterPayment || {};

  const [currentStatus, setCurrentStatus] = useState(transporterPayment?.status);

  if (loading) return <>Loading</>;
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="INV-123"
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Transporter Payment', href: '/dashboard/transporterPayment' },
          { name: 'PAY-123' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {/* {transporterPayment && (
        <TransporterPaymentToolbar
          transporterPayment={transporterPayment}
          currentStatus={currentStatus || ''}
          onChangeStatus={handleChangeStatus}
          statusOptions={INVOICE_STATUS_OPTIONS}
        />
      )} */}

      <TransporterPaymentDetails
        paymentNo={_id}
        selectedSubtripsData={subtrips?.map((st) => st.subtripId)}
        transporter={transporter}
        status={currentStatus}
        createdDate={createdDate}
      />
    </DashboardContent>
  );
}
