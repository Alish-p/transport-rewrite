import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import TenantForm from '../tenant-form';

export function TenantEditView({ tenant }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Tenant Settings"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Tenant Settings' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TenantForm currentTenant={tenant} />
    </DashboardContent>
  );
}
