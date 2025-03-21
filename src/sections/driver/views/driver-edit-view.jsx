import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import DriverForm from '../driver-form';

// ----------------------------------------------------------------------

export function DriverEditView({ driver, bankList }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Driver"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Drivers List',
            href: paths.dashboard.driver.list,
          },
          { name: driver?.driverName },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DriverForm currentDriver={driver} bankList={bankList} />
    </DashboardContent>
  );
}
