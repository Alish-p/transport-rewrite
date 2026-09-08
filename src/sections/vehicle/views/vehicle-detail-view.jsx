import { useNavigate } from 'react-router';
import { useMemo, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Tab, Tabs, Link, Grid, Card, Stack, Divider, CardHeader, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useSearchParams } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useGps } from 'src/query/use-gps';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { HeroHeader } from 'src/components/hero-header-card';

import { useAuthContext } from 'src/auth/hooks';

import { VehicleFuelWidget } from '../widgets/vehicle-fuel-widget';
import { VehicleTyreLayoutView } from './vehicle-tyre-layout-view';
import { VehicleLocationMap } from '../widgets/vehicle-location-map';
import { VehicleChallanWidget } from '../widgets/vehicle-challan-widget';
import { VehicleBillingSummary } from '../widgets/vehicle-billing-summary';
import { VehicleOdometerWidget } from '../widgets/vehicle-odometer-widget';
import { VehicleSubtripsWidget } from '../widgets/vehicle-subtrips-widget';
import { VehicleDocumentsWidget } from '../widgets/vehicle-documents-widget';
import { VehicleWorkOrdersWidget } from '../widgets/vehicle-work-orders-widget';
import { VehicleMonthlyAnalyticsWidget } from '../widgets/vehicle-monthly-analytics-widget';

// ----------------------------------------------------------------------

const VALID_TABS = ['overview', 'tyres', 'workOrders'];

export function VehicleDetailView({ vehicle }) {
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const { tenant } = useAuthContext();
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

  const transporterName = transporter?.transportName;
  const transporterId = transporter?._id;

  // Read tab from URL, fallback to 'overview'
  const currentTab = useMemo(() => {
    const tabParam = searchParams.get('tab');
    return VALID_TABS.includes(tabParam) ? tabParam : 'overview';
  }, [searchParams]);

  const handleChangeTab = useCallback(
    (_event, newValue) => {
      const next = new URLSearchParams(searchParams);
      if (newValue === 'overview') {
        next.delete('tab');
      } else {
        next.set('tab', newValue);
      }
      const qs = next.toString();
      navigate(qs ? `?${qs}` : '.', { replace: true });
    },
    [searchParams, navigate]
  );

  const { data: gpsData } = useGps(vehicleNo, { enabled: !!vehicleNo && vehicle.isOwn });
  const odometer = gpsData?.totalOdometer || 0;
  const fuelValue =
    Math.round(parseFloat(String(gpsData?.fuel || '0').replace(/[^0-9.]/g, ''))) || 0;

  // Show Work Orders tab for own vehicles OR when maintenance & inventory is enabled
  const showWorkOrdersTab = vehicle.isOwn || tenant?.integrations?.maintenanceAndInventory?.enabled;

  const renderDetails = (
    <Card>
      <CardHeader
        title="Vehicle Details"
        avatar={<Iconify icon="solar:bus-bold" color="primary.main" width={24} />}
        action={
          vehicleNo ? (
            <Label variant="soft" color="primary" sx={{ typography: 'subtitle2' }}>
              {vehicleNo}
            </Label>
          ) : null
        }
        sx={{
          p: 2.5,
          pb: 1.5,
          '& .MuiCardHeader-avatar': { mr: 1 },
          '& .MuiCardHeader-title': { fontWeight: 'fontWeightBold' },
        }}
      />

      {/* 1. General Information */}
      <SectionHeader icon="solar:info-circle-bold" title="General Info" />
      <Stack spacing={1} sx={{ px: 2.5, pb: 2 }}>
        <InfoRow icon="mdi:road-variant" label="Vehicle Number" value={vehicleNo} />
        <InfoRow icon="mdi:car" label="Type" value={vehicleType} />
        <InfoRow icon="mdi:domain" label="Make" value={vehicleCompany} />
        <InfoRow icon="mdi:car-estate" label="Model" value={modelType} />
        <InfoRow icon="mdi:calendar-range" label="Year" value={manufacturingYear} />
        <InfoRow
          icon="mingcute:wheel-line"
          label="Tyres"
          value={noOfTyres ? `${noOfTyres} Tyres` : null}
        />
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {/* 2. Specifications & Capacity */}
      <SectionHeader icon="solar:settings-bold" title="Specifications & Capacity" />
      <Stack spacing={1} sx={{ px: 2.5, pb: 2 }}>
        <InfoRow
          icon="mdi:weight-lifter"
          label="Loading Capacity"
          value={loadingCapacity ? `${loadingCapacity} Ton` : null}
        />
        <InfoRow icon="mdi:engine-outline" label="Engine Type" value={engineType} />
        <InfoRow icon="mdi:engine" label="Engine No." value={engineNo} />
        <InfoRow icon="mdi:hexagon-outline" label="Chasis No." value={chasisNo} />
        <InfoRow
          icon="mdi:gas-station"
          label="Fuel Tank"
          value={fuelTankCapacity ? `${fuelTankCapacity} L` : null}
        />
      </Stack>

      {/* 3. Assignment & Tracking */}
      {(transporterName || trackingLink) && (
        <>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <SectionHeader icon="solar:map-point-bold" title="Assignment & Tracking" />
          <Stack spacing={1} sx={{ px: 2.5, pb: 2 }}>
            {transporterName && (
              <InfoRow
                icon="mdi:account"
                label="Transporter"
                value={
                  transporterId ? (
                    <Link
                      component={RouterLink}
                      href={paths.dashboard.transporter.details(transporterId)}
                      color="primary"
                      underline="hover"
                      sx={{ fontWeight: 600, fontSize: '0.8125rem' }}
                    >
                      {transporterName}
                    </Link>
                  ) : (
                    transporterName
                  )
                }
              />
            )}
            {trackingLink && (
              <InfoRow
                icon="mdi:map-marker-path"
                label="Tracking URL"
                value={
                  <Link
                    href={trackingLink}
                    target="_blank"
                    rel="noopener"
                    color="primary"
                    underline="hover"
                    sx={{ fontWeight: 600, fontSize: '0.8125rem' }}
                  >
                    View Tracker
                  </Link>
                }
              />
            )}
          </Stack>
        </>
      )}
    </Card>
  );

  return (
    <DashboardContent>
      <HeroHeader
        offsetTop={70}
        title={vehicleNo}
        status={vehicle.isOwn ? 'Own' : 'Market'}
        icon="mdi:truck-outline"
        meta={[
          { icon: 'mdi:car', label: vehicleType },
          // Show transporter (linked) only for non-own vehicles
          ...(!vehicle.isOwn && transporter?._id
            ? [
                {
                  icon: 'mdi:account',
                  label: transporter?.transportName,
                  href: paths.dashboard.transporter.details(transporter._id),
                },
              ]
            : []),
        ]}
        actions={[
          {
            label: 'Edit',
            icon: 'solar:pen-bold',
            onClick: () => navigate(paths.dashboard.vehicle.edit(vehicle._id)),
          },
        ]}
      />

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          my: { xs: 3, md: 2 },
        }}
      >
        <Tab value="overview" label="Overview" icon={<Iconify icon="mdi:eye" width={20} />} />
        <Tab value="tyres" label="Tyres" icon={<Iconify icon="mingcute:wheel-line" width={20} />} />
        {showWorkOrdersTab && (
          <Tab
            value="workOrders"
            label="Work Orders"
            icon={<Iconify icon="mdi:wrench" width={20} />}
          />
        )}
      </Tabs>

      {currentTab === 'overview' && (
        <Grid container spacing={3}>
          <Grid xs={12} md={7} container spacing={3} item>
            <Grid xs={12} sm={6} item>
              <VehicleOdometerWidget total={Math.round(odometer)} />
            </Grid>
            <Grid xs={12} sm={6} item>
              <VehicleFuelWidget value={fuelValue} total={400} />
            </Grid>
            {tenant?.integrations?.challanApi?.enabled && (
              <Grid xs={12} sm={6} item>
                <VehicleChallanWidget vehicleNo={vehicleNo} isOwn={vehicle.isOwn} />
              </Grid>
            )}
            <Grid xs={12} item>
              <VehicleLocationMap vehicleNo={vehicleNo} isOwn={vehicle.isOwn} />
            </Grid>
          </Grid>

          <Grid xs={12} md={5} item>
            {renderDetails}
          </Grid>

          {vehicle.isOwn && (
            <>
              <Grid xs={12} item>
                <VehicleMonthlyAnalyticsWidget vehicleId={vehicle._id} />
              </Grid>

              <Grid xs={12} item>
                <VehicleDocumentsWidget vehicleId={vehicle._id} vehicleNo={vehicleNo} />
              </Grid>

              <Grid xs={12} item>
                <VehicleBillingSummary vehicleId={vehicle._id} vehicleNo={vehicleNo} />
              </Grid>
            </>
          )}

          <Grid xs={12} item>
            <VehicleSubtripsWidget vehicleId={vehicle._id} />
          </Grid>
        </Grid>
      )}

      {currentTab === 'tyres' && <VehicleTyreLayoutView vehicle={vehicle} />}

      {currentTab === 'workOrders' && showWorkOrdersTab && (
        <VehicleWorkOrdersWidget vehicleId={vehicle._id} vehicleNo={vehicleNo} />
      )}
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function SectionHeader({ icon, title }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2.5, pt: 1.5, pb: 1 }}>
      <Iconify icon={icon} width={16} sx={{ color: 'primary.main' }} />
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          color: 'text.secondary',
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function InfoRow({ icon, label, value }) {
  if (value === undefined || value === null || value === '' || value === '-') return null;

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="space-between"
      spacing={1.5}
      sx={{ typography: 'body2', minHeight: 24 }}
    >
      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ minWidth: 0, flexShrink: 0 }}>
        {icon && <Iconify icon={icon} width={16} sx={{ color: 'text.disabled', flexShrink: 0 }} />}
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
          {label}
        </Typography>
      </Stack>
      <Box sx={{ textAlign: 'right', minWidth: 0, flex: 1, ml: 1 }}>
        {typeof value === 'string' || typeof value === 'number' ? (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: '0.8125rem',
              color: 'text.primary',
              wordBreak: 'break-word',
            }}
          >
            {value}
          </Typography>
        ) : (
          value
        )}
      </Box>
    </Stack>
  );
}

