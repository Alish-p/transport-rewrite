import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import TransporterPaymentFormAndPreview from '../transporter-payment-form-and-preview';

export function TransporterPaymentCreateView({ transporterList }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="TPR-XXX"
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Transporter Payment', href: '/dashboard/transporter-payment' },
          { name: 'TPR-XXX' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TransporterPaymentFormAndPreview transporterList={transporterList} />
    </DashboardContent>
  );
}
