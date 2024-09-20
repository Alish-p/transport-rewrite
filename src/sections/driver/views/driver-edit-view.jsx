import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import DriverForm from '../driver-form';
import { DashboardContent } from '../../../layouts/dashboard';

// ----------------------------------------------------------------------

export function DriverEditView({ driver }) {
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

      <DriverForm currentDriver={driver} />
    </DashboardContent>
  );
}
