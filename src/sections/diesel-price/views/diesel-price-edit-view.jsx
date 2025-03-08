import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import DieselPriceForm from '../diesel-price-form';

export function DieselPriceEditView({ dieselPrice, pumpsList }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Diesel Price"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Diesel Price List',
            href: paths.dashboard.diesel.list,
          },
          { name: dieselPrice?.pumpName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DieselPriceForm currentDieselPrice={dieselPrice} pumpsList={pumpsList} />
    </DashboardContent>
  );
}
