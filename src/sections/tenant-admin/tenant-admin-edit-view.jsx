import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import TenantAdminForm from './tenant-admin-form';
import { TenantAdminPayments } from './tenant-admin-payments';

export default function TenantAdminEditView({ tenant, onUpdated }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={tenant?.name ? `Edit: ${tenant.name}` : 'Edit Tenant'}
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Tenants', href: paths.dashboard.tenants.root }, { name: 'Edit' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <TenantAdminForm currentTenant={tenant} onSaved={onUpdated} />
        </Grid>
        <Grid xs={12} md={6}>
          <TenantAdminPayments tenant={tenant} onTenantUpdated={onUpdated} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

