import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { InvoiceProvider } from '../context/InvoiceContext';
import InvoiceFormAndPreview from '../invoice-form-and-preview';

export function InvoiceCreateView({ customerList }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create Invoice"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Invoice', href: paths.dashboard.invoice.root },
          { name: 'Create' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <InvoiceProvider customerList={customerList}>
        <InvoiceFormAndPreview />
      </InvoiceProvider>
    </DashboardContent>
  );
}
