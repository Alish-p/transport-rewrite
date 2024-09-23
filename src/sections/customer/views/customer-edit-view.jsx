import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import CustomerNewForm from '../customer-form';
import { DashboardContent } from '../../../layouts/dashboard';

// ----------------------------------------------------------------------

export function CustomerEditView({ customer }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Customer"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Customer List',
            href: paths.dashboard.customer.list,
          },
          { name: customer?.customerName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CustomerNewForm currentCustomer={customer} />
    </DashboardContent>
  );
}
