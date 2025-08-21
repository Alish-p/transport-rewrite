import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

import { DashboardContent } from 'src/layouts/dashboard';

import { HeroHeaderCard } from 'src/components/hero-header-card';

import {
  TransporterBasicWidget,
  TransporterFinanceWidget,
  TransporterExpensesWidget,
  TransporterPaymentsWidget,
  TransporterSubtripsWidget,
  TransporterVehiclesWidget,
  TransporterAdditionalWidget,
} from '../widgets';

export function TransporterDetailView({ transporter }) {
  const { transportName, ownerName, cellNo, status } = transporter || {};

  return (
    <DashboardContent>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 9,
          bgcolor: 'background.default',
          p: { xs: 2, md: 3 },
        }}
      >
        <HeroHeaderCard
          title={transportName}
          status={status || 'Active'}
          icon="mdi:truck"
          meta={[
            { icon: 'mdi:account', label: ownerName },
            { icon: 'mdi:phone', label: cellNo },
          ]}
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

          <Grid xs={12} md={9}>
            <TransporterPaymentsWidget transporterId={transporter._id} />
          </Grid>
          <Grid xs={12} md={3}>
            <TransporterVehiclesWidget transporterId={transporter._id} />
          </Grid>
          <Grid xs={12}>
            <TransporterSubtripsWidget transporterId={transporter._id} />
          </Grid>
          <Grid xs={12}>
            <TransporterExpensesWidget transporterId={transporter._id} />
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}
