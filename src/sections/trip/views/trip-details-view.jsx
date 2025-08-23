// @mui
// components
import { useNavigate } from 'react-router';

import { Box, Card, Grid, Stack, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useCloseTrip } from 'src/query/use-trip';
import { DashboardContent } from 'src/layouts/dashboard';

import { HeroHeaderCard } from 'src/components/hero-header-card';

import TripToolbar from '../widgets/TripToolbar';
import DriverCard from '../widgets/DriverWidgets';
import VehicleCard from '../widgets/VehicleWidgets';
import SimpleSubtripList from '../basic-subtrip-table';
import ProfitExpenseChart from '../widgets/SubtripColumnChart';
import { TripExpensesWidget } from '../widgets/trip-expenses-widget';
import AnalyticsWidgetSummary from '../../subtrip/widgets/summary-widget';

// ----------------------------------------------------------------------
// Helper function to calculate trip dashboard data
function getTripDashboardData(trip) {
  const totalTrips = trip?.subtrips?.length || 0;
  const totalAdblueAmt = trip?.subtrips?.reduce((sum, st) => sum + (st.totalAdblueAmt || 0), 0);

  const totalExpenses =
    trip?.subtrips?.reduce((sum, subtrip) => {
      const subtripExpenses =
        subtrip.expenses?.reduce((subSum, expense) => subSum + expense.amount, 0) || 0;
      return sum + subtripExpenses;
    }, 0) || 0;

  const totalIncome =
    trip?.subtrips?.reduce((sum, subtrip) => sum + subtrip.rate * subtrip.loadingWeight, 0) || 0;

  const totalDieselAmt =
    trip?.subtrips?.reduce((sum, subtrip) => {
      const dieselExpenses =
        subtrip.expenses
          ?.filter((expense) => expense.expenseType === 'fuel')
          .reduce((subSum, expense) => subSum + expense.amount, 0) || 0;
      return sum + dieselExpenses;
    }, 0) || 0;

  const totalKm =
    trip?.subtrips?.reduce((sum, subtrip) => {
      const kmCovered = (subtrip.endKm || 0) - (subtrip.startKm || 0);
      return sum + kmCovered;
    }, 0) || 0;

  return {
    totalTrips,
    totalAdblueAmt,
    totalExpenses,
    totalIncome,
    totalDieselAmt,
    totalKm,
  };
}

// ----------------------------------------------------------------------

export function TripDetailView({ trip }) {
  const navigate = useNavigate();

  const closeTrip = useCloseTrip();

  const { totalTrips, totalAdblueAmt, totalExpenses, totalIncome, totalDieselAmt, totalKm } =
    getTripDashboardData(trip);

  const { vehicleId = {}, driverId = {}, _id, tripStatus, subtrips } = trip;

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
          title={`Trip #${_id}`}
          status={tripStatus}
          icon="mdi:routes"
          meta={[
            {
              icon: 'mdi:account',
              label: driverId?.driverName,
              href: vehicleId?._id ? paths.dashboard.vehicle.details(vehicleId._id) : undefined,
            },

            {
              icon: 'mdi:truck-outline',
              label: vehicleId?.vehicleNo,
              href: vehicleId?._id ? paths.dashboard.vehicle.details(vehicleId._id) : undefined,
            },
          ]}
        />
      </Box>

      <TripToolbar
        backLink={paths.dashboard.trip.list}
        status={tripStatus}
        tripData={trip}
        onTripClose={() => closeTrip(_id)}
        onEdit={() => {
          navigate(paths.dashboard.trip.edit(_id));
        }}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column', md: 'column' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <AnalyticsWidgetSummary
                title="Total Trips"
                total={totalTrips}
                icon="ant-design:car-filled"
                sx={{ flexGrow: { xs: 0, sm: 1 }, flexBasis: { xs: 'auto', sm: 0 } }}
              />
              <AnalyticsWidgetSummary
                title="Total Expenses"
                total={totalExpenses}
                color="error"
                icon="ant-design:dollar-circle-filled"
                sx={{ flexGrow: { xs: 0, sm: 1 }, flexBasis: { xs: 'auto', sm: 0 } }}
              />
              <AnalyticsWidgetSummary
                title="Total Income"
                total={totalIncome}
                color="success"
                icon="ant-design:euro-circle-filled"
                sx={{ flexGrow: { xs: 0, sm: 1 }, flexBasis: { xs: 'auto', sm: 0 } }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <AnalyticsWidgetSummary
                title="Total Kilometers"
                total={totalKm}
                color="info"
                icon="ant-design:environment-filled"
                sx={{ flexGrow: { xs: 0, sm: 1 }, flexBasis: { xs: 'auto', sm: 0 } }}
              />
              <AnalyticsWidgetSummary
                title="Total Diesel Amount"
                total={totalDieselAmt}
                color="warning"
                icon="ant-design:fire-filled"
                sx={{ flexGrow: { xs: 0, sm: 1 }, flexBasis: { xs: 'auto', sm: 0 } }}
              />
              <AnalyticsWidgetSummary
                title="Total AdBlue Amount"
                total={totalAdblueAmt}
                color="primary"
                icon="ant-design:medicine-box-filled"
                sx={{ flexGrow: { xs: 0, sm: 1 }, flexBasis: { xs: 'auto', sm: 0 } }}
              />
            </Stack>
            <Grid item xs={12} md={12}>
              <Card sx={{ minHeight: 400, padding: '10px' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" m={2}>
                  <Typography variant="h5"> Subtrip List </Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigate({
                        pathname: paths.dashboard.subtrip.new,
                        search: `?id=${_id}`,
                      });
                    }}
                    disabled={tripStatus === 'billed'}
                  >
                    New Subtrip
                  </Button>
                </Stack>
                <SimpleSubtripList subtrips={subtrips} />
              </Card>
              <TripExpensesWidget tripId={_id} />
            </Grid>
            <Grid item container spacing={1} xs={12} md={12}>
              <Grid item xs={5} md={6}>
                <ProfitExpenseChart
                  subtrips={subtrips}
                  title="Subtrip Profit/Expense"
                  subheader="Profit and expense Subtrip Wise"
                />
              </Grid>
            </Grid>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3} direction={{ xs: 'column', md: 'column' }}>
            <DriverCard
              driver={driverId}
              onDriverEdit={() => {
                navigate(paths.dashboard.driver.edit(trip?.driverId?._id));
              }}
            />
            <VehicleCard
              vehicle={vehicleId}
              onVehicleEdit={() => {
                navigate(paths.dashboard.vehicle.edit(trip?.vehicleId?._id));
              }}
            />
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
