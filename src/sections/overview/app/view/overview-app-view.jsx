import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import { _appFeatured } from 'src/_mock';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';

import { SvgColor } from 'src/components/svg-color';

import { EwaybillByStateWidget } from 'src/sections/ewaybill/ewaybill-by-state-widget';

import { useAuthContext } from 'src/auth/hooks';

import { AppWelcome } from '../app-welcome';
import { AppFeatured } from '../app-featured';
import { DashboardTotalWidget } from '../app-total-widget';
import { AppMonthlySummaryTabs } from '../monthly-summary';
import { FinancialMonthlyChart } from '../app-finance-charts';
import { InvoicePiechartWidget } from '../app-invoice-pie-chart';
import { SubtripExpiryTable } from '../app-subtrip-expiry-table';
import { AppDailySummaryWidget } from '../app-daily-summary-widget';
import { AppSubtripExpensesCategory } from '../app-subtrip-expenses';
import { AppInvoiceAmountSummary } from '../app-invoice-amount-summary';
import { AppMaterialWeightSummary } from '../app-material-weight-summary';
import { VehicleDocumentsPieChart } from '../app-vehicle-documents-pie-chart';
import { AppTransporterPaymentSummary } from '../app-transporter-payment-summary';
import { DashboardSubtripCompletedWidget } from '../dashboard-subtrip-completed-widget';

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
  invoiceStatusSummary,
  invoiceAmountSummary,
  transporterPaymentSummary,
  vehicleDocsSummary,
}) {
  const { user } = useAuthContext();

  const { invoices, vehicles, transporters, customers, drivers, subtrips } = counts;

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
              title="Total Jobs Completed"
              total={subtrips}
              color="success"
              icon={ICONS.subtrip}
            />
          </Grid>
        </>

        {invoiceAmountSummary && (
          <Grid xs={12} sm={6}>
            <AppInvoiceAmountSummary summary={invoiceAmountSummary} />
          </Grid>
        )}

        {transporterPaymentSummary && (
          <Grid xs={12} sm={6}>
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
          <DashboardSubtripCompletedWidget />
        </Grid>

        <Grid xs={12}>
          <AppDailySummaryWidget />
        </Grid>

        <Grid xs={12} md={12}>
          <AppMonthlySummaryTabs />
        </Grid>

        <Grid xs={12} lg={8}>
          <SubtripExpiryTable
            title="⚠️ Expiring Eway Bills"
            subheader="Active jobs with Eway Bills expiring within the next 24 hours. Please take timely action."
          />
        </Grid>

        {vehicleDocsSummary && (
          <Grid xs={12} md={6} lg={4}>
            <VehicleDocumentsPieChart
              title="Vehicle Documents"
              subheader="Status of vehicle documents in the fleet"
              chart={{
                series: [
                  { label: 'Missing', value: vehicleDocsSummary?.missing ?? 0 },
                  { label: 'Expired', value: vehicleDocsSummary?.expired ?? 0 },
                  { label: 'Expiring', value: vehicleDocsSummary?.expiring ?? 0 },
                  { label: 'Valid', value: vehicleDocsSummary?.valid ?? 0 },
                ],
              }}
            />
          </Grid>
        )}

        <Grid xs={12} lg={6}>
          <AppMaterialWeightSummary title="Material summary" />
        </Grid>

        <Grid xs={12} lg={6}>
          <AppSubtripExpensesCategory title="Expenses categories" />
        </Grid>

        <Grid xs={12} lg={6}>
          <FinancialMonthlyChart title="Financial overview" />
        </Grid>

        <Grid xs={12}>
          <EwaybillByStateWidget />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
