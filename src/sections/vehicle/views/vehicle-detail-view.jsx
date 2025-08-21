import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link, Grid, Card, Stack, CardHeader, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGps } from 'src/query/use-gps';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { HeroHeaderCard } from 'src/components/hero-header-card';

import { VehicleFuelWidget } from '../widgets/vehicle-fuel-widget';
import { VehicleLocationMap } from '../widgets/vehicle-location-map';
import { VehicleBillingSummary } from '../widgets/vehicle-billing-summary';
import { VehicleOdometerWidget } from '../widgets/vehicle-odometer-widget';
import { VehicleSubtripsWidget } from '../widgets/vehicle-subtrips-widget';

// ----------------------------------------------------------------------

export function VehicleDetailView({ vehicle }) {
  const {
    vehicleNo,
    vehicleType,
    modelType,
    vehicleCompany,
    noOfTyres,
    chasisNo,
    engineNo,
    manufacturingYear,
    loadingCapacity,
    engineType,
    fuelTankCapacity,
    transporter,
    trackingLink,
  } = vehicle;

  const { data: gpsData } = useGps(vehicleNo, { enabled: !!vehicleNo && vehicle.isOwn });
  const odometer = gpsData?.totalOdometer || 0;
  const fuelValue = parseFloat(String(gpsData?.fuel || '0').replace(/[^0-9.]/g, '')) || 0;

  const renderDetails = (
    <Card>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:information-outline" width={24} />
            <Typography variant="h6">Details</Typography>
          </Stack>
        }
      />

      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        {/* Vehicle Number */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:road-variant" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Vehicle Number
          </Box>
          <Typography>{vehicleNo || '-'}</Typography>
        </Stack>

        {/* Vehicle Type */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:car" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Type
          </Box>
          <Typography>{vehicleType || '-'}</Typography>
        </Stack>

        {/* Model Type */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:car-estate" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Model
          </Box>
          <Typography>{modelType || '-'}</Typography>
        </Stack>

        {/* Company */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:domain" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Make
          </Box>
          <Typography>{vehicleCompany || '-'}</Typography>
        </Stack>

        {/* Number of Tyres */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:car-tire-alert" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Tyres
          </Box>
          <Typography>{noOfTyres ? `${noOfTyres} Tyres` : '-'}</Typography>
        </Stack>

        {/* Chasis No. */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:hexagon-outline" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Chasis No.
          </Box>
          <Typography>{chasisNo || '-'}</Typography>
        </Stack>

        {/* Engine No. */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:engine" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Engine No.
          </Box>
          <Typography>{engineNo || '-'}</Typography>
        </Stack>

        {/* Manufacturing Year */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:calendar-range" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Year
          </Box>
          <Typography>{manufacturingYear || '-'}</Typography>
        </Stack>

        {/* Loading Capacity */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:weight-lifter" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Loading Capacity
          </Box>
          <Typography>{loadingCapacity ? `${loadingCapacity} kg` : '-'}</Typography>
        </Stack>

        {/* Engine Type */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:engine-outline" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Engine Type
          </Box>
          <Typography>{engineType || '-'}</Typography>
        </Stack>

        {/* Fuel Tank Capacity */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:gas-station" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Fuel Tank
          </Box>
          <Typography>{fuelTankCapacity ? `${fuelTankCapacity} L` : '-'}</Typography>
        </Stack>

        {/* Tracking Link */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:map-marker-path" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Tracking URL
          </Box>
          <Typography>
            {trackingLink ? (
              <Link href={trackingLink} target="_blank" rel="noopener">
                View Tracker
              </Link>
            ) : (
              '-'
            )}
          </Typography>
        </Stack>

        {/* Transporter */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:account" width={20} />
          <Box component="span" sx={{ color: 'text.secondary', width: 180, flexShrink: 0 }}>
            Transporter
          </Box>
          <Typography>{transporter?.transportName || '-'}</Typography>
        </Stack>
      </Stack>
    </Card>
  );

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
          title={vehicleNo}
          status={vehicle.isOwn ? 'Own Vehicle' : 'Market Vehicle'}
          icon="mdi:truck-outline"
          meta={[
            { icon: 'mdi:car', label: vehicleType },
            { icon: 'mdi:domain', label: vehicleCompany },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.vehicle.edit(vehicle._id)}
              variant="contained"
              startIcon={<Iconify icon="solar:pen-bold" />}
            >
              Edit Vehicle
            </Button>
          }
        />
      </Box>

      <Grid container spacing={3} mt={3}>
        <Grid xs={12} md={7} container spacing={3} sx={{ p: 3 }} item>
          <Grid xs={12} sm={6} item>
            <VehicleOdometerWidget total={Math.round(odometer)} />
          </Grid>
          <Grid xs={12} sm={6} item>
            <VehicleFuelWidget value={fuelValue} total={400} />
          </Grid>
          <Grid sm={12} item>
            <VehicleLocationMap vehicleNo={vehicleNo} isOwn={vehicle.isOwn} />
          </Grid>
        </Grid>

        <Grid xs={12} md={5} item>
          {renderDetails}
        </Grid>

        <Grid xs={12} item>
          <VehicleBillingSummary vehicleId={vehicle._id} vehicleNo={vehicleNo} />
        </Grid>

        <Grid xs={12} item>
          <VehicleSubtripsWidget vehicleId={vehicle._id} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
