import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import RouteForm from '../route-form';

export function RouteEditView({ route, customers }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Route"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Route List',
            href: paths.dashboard.route.list,
          },
          { name: route?.routeName },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RouteForm currentRoute={route} customers={customers} />
    </DashboardContent>
  );
}
