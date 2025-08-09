import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {
  TransporterBasicWidget,
  TransporterFinanceWidget,
  TransporterVehiclesWidget,
  TransporterAdditionalWidget,
} from '../widgets';

export function TransporterDetailView({ transporter }) {
  const { transportName } = transporter || {};

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
          heading="Transporter Info"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Transporters List', href: paths.dashboard.transporter.root },
            { name: `${transportName}` },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
      </Box>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <TransporterBasicWidget transporter={transporter} />
          </Grid>
          <Grid xs={12} md={4}>
            <TransporterFinanceWidget transporter={transporter} />
          </Grid>
          <Grid xs={12} md={4}>
            <TransporterAdditionalWidget transporter={transporter} />
          </Grid>
          <Grid xs={12} md={3}>
            <TransporterVehiclesWidget transporterId={transporter._id} />
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}
