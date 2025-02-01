import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import DieselPrice from '../diesel-price-form';

export function DieselPriceCreateView({ pumpsList }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add New Diesel Price"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Diesel Price List', href: paths.dashboard.dieselPrice.list },
          { name: 'Add New Diesel Price' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DieselPrice pumpsList={pumpsList} />
    </DashboardContent>
  );
}
