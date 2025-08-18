import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PumpBasicWidget, PumpFinanceWidget, PumpExpensesWidget } from '../widgets';

export function PumpDetailView({ pump }) {
  const { name } = pump || {};

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Pump Info"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Pumps List', href: paths.dashboard.pump.root },
          { name: `${name}` },
        ]}
        sx={{ my: { xs: 3, md: 5 } }}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.pump.edit(pump._id)}
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
          >
            Edit Pump
          </Button>
        }
      />
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <PumpBasicWidget pump={pump} />
          </Grid>
          <Grid xs={12} md={6}>
            <PumpFinanceWidget pump={pump} />
          </Grid>
          <Grid xs={12}>
            <PumpExpensesWidget pumpId={pump._id} />
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}
