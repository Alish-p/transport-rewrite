// @mui
// components
import { useNavigate } from 'react-router';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

import { Box, Card, Grid, Stack, Button, Dialog, Typography, DialogActions } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { HeroHeader } from 'src/components/hero-header-card';

import { getTripTotalKm } from 'src/sections/trip/utils/trip-utils';
import { SUBTRIP_EXPENSE_TYPES } from 'src/sections/expense/expense-config';

import { useTenantContext } from 'src/auth/tenant';

import TripSheetPdf from '../pdfs/trip-sheet-pdf';
import DriverCard from '../widgets/DriverWidgets';
import VehicleCard from '../widgets/VehicleWidgets';
import SimpleSubtripList from '../basic-subtrip-table';
import ProfitExpenseChart from '../widgets/SubtripColumnChart';
import { TripExpensesWidget } from '../widgets/trip-expenses-widget';
import AnalyticsWidgetSummary from '../../subtrip/widgets/summary-widget';

// ----------------------------------------------------------------------
// Helper function to calculate trip dashboard data
function getTripDashboardData(trip) {
  const totalJobs = trip?.subtrips?.length || 0;
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
          ?.filter((expense) => expense.expenseType === SUBTRIP_EXPENSE_TYPES.DIESEL)
          .reduce((subSum, expense) => subSum + (expense.amount || 0), 0) || 0;
      return sum + dieselExpenses;
    }, 0) || 0;

  const totalDieselLtr =
    trip?.subtrips?.reduce((sum, subtrip) => {
      const dieselLtrs =
        subtrip.expenses
          ?.filter((expense) => expense.expenseType === SUBTRIP_EXPENSE_TYPES.DIESEL)
          .reduce((subSum, expense) => subSum + (expense.dieselLtr || 0), 0) || 0;
      return sum + dieselLtrs;
    }, 0) || 0;

  const totalKm = getTripTotalKm(trip);

  return {
    totalJobs,
    totalAdblueAmt,
    totalExpenses,
    totalIncome,
    totalDieselAmt,
    totalDieselLtr,
    totalKm,
  };
}

// ----------------------------------------------------------------------

export function TripDetailView({ trip }) {
  const navigate = useNavigate();

  const {
    totalJobs,
    totalAdblueAmt,
    totalExpenses,
    totalIncome,
    totalDieselAmt,
    totalDieselLtr,
    totalKm,
  } = getTripDashboardData(trip);

  const { vehicleId = {}, driverId = {}, _id, tripStatus, subtrips, tripNo } = trip;

  // Trip Sheet dialog state
  const viewTripSheet = useBoolean();
  const tenant = useTenantContext();

  const isOwnVehicle = Boolean(trip?.vehicleId?.isOwn);
  const subtripsArr = Array.isArray(trip?.subtrips) ? trip.subtrips : [];
  const allSubtripsBilled =
    subtripsArr.length > 0 && subtripsArr.every((st) => st?.subtripStatus === 'billed');
  const canViewTripSheet = isOwnVehicle && allSubtripsBilled;

  const tripSheetTooltipTitle = !isOwnVehicle
    ? 'Trip Sheet is only available for Own vehicles'
    : !allSubtripsBilled
      ? 'Trip Sheet is visible only when all subtrips are billed'
      : '';

  return (
    <DashboardContent>
      <HeroHeader
        offsetTop={70}
        title={`Trip #${tripNo}`}
        status={tripStatus}
        icon="mdi:routes"
        meta={[
          {
            icon: 'mdi:account',
            label: driverId?.driverName,
            href: driverId?._id ? paths.dashboard.driver.details(driverId._id) : undefined,
          },

          {
            icon: 'mdi:truck-outline',
            label: vehicleId?.vehicleNo,
            href: vehicleId?._id ? paths.dashboard.vehicle.details(vehicleId._id) : undefined,
          },
        ]}
        menus={[
          {
            label: 'View',
            icon: 'solar:eye-bold',
            items: [
              {
                label: 'Trip Sheet',
                onClick: () => viewTripSheet.onTrue(),
                disabled: !canViewTripSheet,
                tooltip: tripSheetTooltipTitle,
              },
            ],
          },
          {
            label: 'Download',
            icon: 'material-symbols:download',
            items: [
              {
                label: 'Trip Sheet',
                render: ({ close }) => (
                  <PDFDownloadLink
                    document={<TripSheetPdf trip={trip} tenant={tenant} />}
                    fileName={`${trip.tripNo}_trip_sheet.pdf`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                    }}
                    onClick={() => setTimeout(close, 0)}
                  >
                    {({ loading }) => (
                      <>
                        <Iconify
                          icon={loading ? 'line-md:loading-loop' : 'eva:download-fill'}
                          sx={{ mr: 2 }}
                        />
                        Trip Sheet
                      </>
                    )}
                  </PDFDownloadLink>
                ),
                disabled: !canViewTripSheet,
              },
            ],
          },
        ]}
        actions={[
          {
            label: 'Edit',
            icon: 'solar:pen-bold',
            onClick: () => navigate(paths.dashboard.trip.edit(_id)),
          },
        ]}
      />

      {/* View Trip Sheet Dialog */}
      <Dialog fullScreen open={viewTripSheet.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions sx={{ p: 1.5 }}>
            <Button color="primary" variant="outlined" onClick={viewTripSheet.onFalse}>
              Close
            </Button>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <TripSheetPdf trip={trip} tenant={tenant} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
      <Grid container spacing={3} mt={3}>
        {/* Top row: Analytics on left, Driver/Vehicle on right */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <AnalyticsWidgetSummary
                title="Total Jobs"
                total={totalJobs}
                icon="ant-design:car-filled"
                sx={{ flexGrow: 1, minHeight: 200 }}
              />
              <AnalyticsWidgetSummary
                title="Total Expenses"
                total={totalExpenses}
                color="error"
                icon="ant-design:dollar-circle-filled"
                sx={{ flexGrow: 1, minHeight: 200 }}
              />
              <AnalyticsWidgetSummary
                title="Total Income"
                total={totalIncome}
                color="success"
                icon="ant-design:euro-circle-filled"
                sx={{ flexGrow: 1, minHeight: 200 }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <AnalyticsWidgetSummary
                title="Total Kilometers"
                total={totalKm}
                color="info"
                icon="ant-design:environment-filled"
                sx={{ flexGrow: 1, minHeight: 200 }}
              />
              <AnalyticsWidgetSummary
                title="Total Diesel Amount"
                total={totalDieselAmt}
                subtext={`${totalDieselLtr || 0} Ltr`}
                color="warning"
                icon="ant-design:fire-filled"
                sx={{ flexGrow: 1, minHeight: 200 }}
              />
              <AnalyticsWidgetSummary
                title="Total AdBlue Amount"
                total={totalAdblueAmt}
                color="primary"
                icon="ant-design:medicine-box-filled"
                sx={{ flexGrow: 1, minHeight: 200 }}
              />
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <DriverCard
              driver={driverId}
              sx={{ minHeight: 200 }}
              onDriverEdit={() => {
                navigate(paths.dashboard.driver.edit(trip?.driverId?._id));
              }}
            />
            <VehicleCard
              vehicle={vehicleId}
              sx={{ minHeight: 200 }}
              onVehicleEdit={() => {
                navigate(paths.dashboard.vehicle.edit(trip?.vehicleId?._id));
              }}
            />
          </Stack>
        </Grid>

        {/* Full-width Jobs */}
        <Grid item xs={12}>
          <Card sx={{ minHeight: 400, p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" m={2}>
              <Typography variant="h5"> Job List </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  navigate({
                    pathname: paths.dashboard.subtrip.jobCreate,
                    search: `?id=${_id}`,
                  });
                }}
              >
                New Job
              </Button>
            </Stack>
            <SimpleSubtripList subtrips={subtrips} />
          </Card>
        </Grid>

        {/* Expenses + Profit/Loss side-by-side on md+, stacked on xs/sm */}
        <Grid item container spacing={2} xs={12}>
          <Grid item xs={12} md={8}>
            <TripExpensesWidget tripId={_id} />
          </Grid>
          <Grid item xs={12} md={4}>
            <ProfitExpenseChart
              subtrips={subtrips}
              title="Job Profit/Expense"
              subheader="Profit and expense Job wise"
            />
          </Grid>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
