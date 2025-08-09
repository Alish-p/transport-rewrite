import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CustomerBasicWidget, CustomerFinanceWidget, CustomerAdditionalWidget } from '../widgets';

export function CustomerDetailView({ customer }) {
  const { customerName } = customer || {};

  return (
    <DashboardContent>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 9,
          bgcolor: 'background.default',
          py: { xs: 2, md: 3 },
        }}
      >
        <CustomBreadcrumbs
          heading="Customer Info"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Customers List', href: paths.dashboard.customer.root },
            { name: `${customerName}` },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
      </Box>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <CustomerBasicWidget customer={customer} />
          </Grid>
          <Grid xs={12} md={4}>
            <CustomerFinanceWidget customer={customer} />
          </Grid>
          <Grid xs={12} md={4}>
            <CustomerAdditionalWidget customer={customer} />
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}
