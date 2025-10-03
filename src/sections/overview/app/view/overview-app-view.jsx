import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { _appFeatured } from 'src/_mock';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';

import { SvgColor, svgColorClasses } from 'src/components/svg-color';

import { useAuthContext } from 'src/auth/hooks';

import { AppWidget } from '../app-widget';
import { AppWelcome } from '../app-welcome';
import { AppFeatured } from '../app-featured';
import { TopRoutesTable } from '../app-top-routes-table';
import { DashboardTotalWidget } from '../app-total-widget';
import { FinancialMonthlyChart } from '../app-finance-charts';
import { InvoicePiechartWidget } from '../app-invoice-pie-chart';
import { SubtripExpiryTable } from '../app-subtrip-expiry-table';
import { DriverInsightsTable } from '../app-driver-insights-table';
import { AppDailySummaryWidget } from '../app-daily-summary-widget';
import { CustomerFreightTable } from '../app-customer-freight-table';
import { AppSubtripExpensesCategory } from '../app-subtrip-expenses';
import { VehicleInsightsTable } from '../app-vehicle-insights-table';
import { AppInvoiceAmountSummary } from '../app-invoice-amount-summary';
import { AppMaterialWeightSummary } from '../app-material-weight-summary';
import { AppSubtripCompletedChart } from '../app-subtrips-completed-chart';
import { TransporterInsightsTable } from '../app-transporter-insights-table';
import { AppTransporterPaymentSummary } from '../app-transporter-payment-summary';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  vehicle: icon('ic_vehicle'),
  driver: icon('ic-user'),
  customer: icon('ic_customer'),
  transporter: icon('ic_transporter'),
  subtrip: icon('ic_subtrip'),
  invoice: icon('ic-invoice'),
};

export function OverviewAppView({
  counts,
  subtripMonthlyData,
  invoiceStatusSummary,
  invoiceAmountSummary,
  transporterPaymentSummary,
}) {
  const { user } = useAuthContext();

  const {
    invoices,
    vehicles,
    transporters,
    customers,
    drivers,
    subtrips,
    totalPendingTransporterPayment,
    totalPendingSalary,
  } = counts;

  return (
    <DashboardContent>
      <Grid container spacing={3}>
        <Grid xs={12} md={7}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.name || 'User'} `}
            description="Begin leveraging the Tranzit portal to streamline and manage your logistics operations seamlessly."
            img={<SeoIllustration hideBackground />}
            action={
              <Button variant="contained" color="primary">
                Explore
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={5}>
          <AppFeatured list={_appFeatured} />
        </Grid>

        {/* Total's section */}
        <>
          <Grid xs={6} sm={4} md={2}>
            <DashboardTotalWidget
              title="Total Vehicles"
              total={vehicles}
              color="warning"
              icon={ICONS.vehicle}
            />
          </Grid>

          <Grid xs={6} sm={4} md={2}>
            <DashboardTotalWidget
              title="Total Drivers"
              total={drivers}
              color="primary"
              icon={ICONS.driver}
            />
          </Grid>

          <Grid xs={6} sm={4} md={2}>
            <DashboardTotalWidget
              title="Total Customers"
              total={customers}
              color="secondary"
              icon={ICONS.customer}
            />
          </Grid>

          <Grid xs={6} sm={4} md={2}>
            <DashboardTotalWidget
              title="Total Transporters"
              total={transporters}
              color="info"
              icon={ICONS.transporter}
            />
          </Grid>

          <Grid xs={6} sm={4} md={2}>
            <DashboardTotalWidget
              title="Total Invoice Generated"
              total={invoices}
              color="error"
              icon={ICONS.invoice}
            />
          </Grid>

          <Grid xs={6} sm={4} md={2}>
            <DashboardTotalWidget
              title="Total Subtrips Completed"
              total={subtrips}
              color="success"
              icon={ICONS.subtrip}
            />
          </Grid>
        </>

        {invoiceAmountSummary && (
          <Grid xs={12} md={6}>
            <AppInvoiceAmountSummary summary={invoiceAmountSummary} />
          </Grid>
        )}

        {transporterPaymentSummary && (
          <Grid xs={12} md={6}>
            <AppTransporterPaymentSummary summary={transporterPaymentSummary} />
          </Grid>
        )}

        {invoices && (
          <Grid xs={12} md={6} lg={4}>
            <InvoicePiechartWidget
              title="Invoices"
              subheader="Invoice generated through the dashboard"
              chart={{
                series: invoiceStatusSummary?.series || [],
              }}
            />
          </Grid>
        )}

        <Grid xs={12} md={6} lg={8}>
          <AppSubtripCompletedChart
            title="Subtrips Completed"
            subheader="(+23%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                subtripMonthlyData
                  ? {
                    name: String(subtripMonthlyData.year),
                    data: [
                      { name: 'Own', data: subtripMonthlyData.own },
                      { name: 'Market', data: subtripMonthlyData.market },
                    ],
                  }
                  : {
                    name: 'Year',
                    data: [
                      { name: 'Own', data: Array(12).fill(0) },
                      { name: 'Market', data: Array(12).fill(0) },
                    ],
                  },
              ],
            }}
          />
        </Grid>


        <Grid xs={12}>
          <AppDailySummaryWidget />
        </Grid>


        <Grid xs={12} lg={8}>
          <SubtripExpiryTable
            title="⚠️ Expiring Eway Bills"
            subheader="Active subtrips with Eway Bills expiring within the next 24 hours. Please take timely action."
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          {/* <AppSubtripStatusWidget title="Subtrip Status" summary={subtripStatusSummary} /> */}
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <AppWidget
              title="Pending Transporter Payment"
              total={totalPendingTransporterPayment}
              icon="ri:money-rupee-circle-line"
            />

            <AppWidget
              title="Pending Driver Salary"
              total={totalPendingSalary}
              icon="healthicons:truck-driver"
              sx={{ bgcolor: 'info.dark', [`& .${svgColorClasses.root}`]: { color: 'info.light' } }}
            />
          </Box>
        </Grid>

        <Grid xs={12} md={12}>
          <CustomerFreightTable
            title="📦 Customer-wise Summary"
            subheader="Shows total weight transferred and freight amount for each customer."
          />
        </Grid>

        <Grid xs={12} md={12}>
          <TopRoutesTable title="🛣️ Top Routes" subheader="Most frequently travelled routes" />
        </Grid>

        <Grid xs={12} md={12}>
          <TransporterInsightsTable
            title="🚛 Transporter Insights"
            subheader="Trips completed by each transporter"
          />
        </Grid>

        <Grid xs={12} md={12}>
          <VehicleInsightsTable
            title="🚚 Vehicle Insights"
            subheader="Trips completed by each vehicle"
          />
        </Grid>

        <Grid xs={12} md={12}>
          <DriverInsightsTable
            title="👷 Driver Insights"
            subheader="Trips completed by each driver"
          />
        </Grid>

        <Grid xs={12} lg={6}>
          <AppMaterialWeightSummary title="Material summary" />
        </Grid>

        <Grid xs={12} lg={6}>
          <AppSubtripExpensesCategory title="Expenses categories" />
        </Grid>

        <Grid xs={12} lg={6}>
          <FinancialMonthlyChart title="Financial overview" />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
