import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  RouteInfoWidget,
  RouteBasicWidget,
  RouteSalaryWidget,
  RouteSubtripsTable,
} from '../widgets';

export function RouteDetailView({ route }) {
  const { routeName } = route || {};

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
          heading="Route Info"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Routes List', href: paths.dashboard.route.root },
            { name: `${routeName}` },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
      </Box>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <RouteBasicWidget route={route} />
          </Grid>
          <Grid xs={12} md={6}>
            <RouteInfoWidget route={route} />
          </Grid>
          <Grid xs={12}>
            <RouteSalaryWidget route={route} />
          </Grid>
          <Grid xs={12}>
            <RouteSubtripsTable route={route} />
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}
