import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  DriverBasicWidget,
  DriverFinanceWidget,
  DriverSubtripsTable,
  DriverAdditionalWidget,
} from '../widgets';

export function DriverDetailView({ driver }) {
  const { driverName } = driver || {};

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
          heading="Driver Info"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Drivers List', href: paths.dashboard.driver.root },
            { name: `${driverName}` },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
      </Box>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <DriverBasicWidget driver={driver} />
          </Grid>
          <Grid xs={12} md={4}>
            <DriverFinanceWidget driver={driver} />
          </Grid>
          <Grid xs={12} md={4}>
            <DriverAdditionalWidget driver={driver} />
          </Grid>
          <Grid xs={12}>
            <DriverSubtripsTable driver={driver} />
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}
