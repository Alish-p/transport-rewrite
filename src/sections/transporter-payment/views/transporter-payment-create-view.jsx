import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import TransporterPaymentFormAndPreview from '../transporter-payment-form-and-preview';

export function TransporterPaymentCreateView({ transporterList }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create Transporter Payment"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Transporter Payment', href: paths.dashboard.transporterPayment.root },
          { name: 'Create' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <TransporterPaymentFormAndPreview transporterList={transporterList} />
    </DashboardContent>
  );
}
