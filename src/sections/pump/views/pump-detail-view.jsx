import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { HeroHeaderCard } from 'src/components/hero-header-card';

import {
  PumpBasicWidget,
  PumpFinanceWidget,
  PumpExpensesWidget,
  PumpDieselPriceWidget,
  PumpDieselPricesWidget,
} from '../widgets';

export function PumpDetailView({ pump }) {
  const { name, ownerName, phone, address } = pump || {};

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
          title={name}
          status="Active"
          icon="solar:gas-station-bold"
          meta={[
            { icon: 'mdi:account', label: ownerName },
            { icon: 'mdi:phone', label: phone },
            { icon: 'mdi:map-marker', label: address },
          ]}
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
      </Box>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container spacing={2}>
          {/* Top row: 3 columns to better use width */}
          <Grid xs={12} md={4}>
            <PumpBasicWidget pump={pump} />
          </Grid>
          <Grid xs={12} md={4}>
            <PumpFinanceWidget pump={pump} />
          </Grid>
          <Grid xs={12} md={4}>
            <PumpDieselPriceWidget pumpId={pump._id} />
          </Grid>


          <Grid xs={12} lg={5}>
            <PumpDieselPricesWidget pump={pump} />
          </Grid>
          <Grid xs={12} lg={7}>
            <PumpExpensesWidget pumpId={pump._id} />
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}
