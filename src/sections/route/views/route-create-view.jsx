import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import RouteForm from '../route-form';

export function RouteCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add New Route"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Route List', href: paths.dashboard.route.list },
          { name: 'Add New Route' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RouteForm />
    </DashboardContent>
  );
}
