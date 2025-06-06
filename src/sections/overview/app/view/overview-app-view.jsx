import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { CONFIG } from 'src/config-global';
import { _appRelated, _appFeatured } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';

import { SvgColor, svgColorClasses } from 'src/components/svg-color';

import { useAuthContext } from 'src/auth/hooks';

import { AppWidget } from '../app-widget';
import { AppWelcome } from '../app-welcome';
import { AppFeatured } from '../app-featured';
import { AppTopRelated } from '../app-top-related';
import { AppAreaInstalled } from '../app-area-installed';
import { Iconify } from '../../../../components/iconify';
import { DashboardTotalWidget } from '../app-total-widget';
import { AppCurrentDownload } from '../app-current-download';
import { SubtripExpiryTable } from '../app-subtrip-expiry-table';
import { AppSubtripExpensesCategory } from '../app-subtrip-expenses';
import { CustomerFreightTable } from '../app-customer-freight-table';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  vehicle: icon('ic_vehicle'),
  driver: icon('ic-user'),
  customer: icon('ic_customer'),
  transporter: icon('ic_transporter'),
  subtrip: icon('ic_subtrip'),
  invoice: icon('ic-invoice'),
}


export function OverviewAppView({ dashboardData }) {
  const { user } = useAuthContext();

  const theme = useTheme();

  const { invoices, vehicles, transporters, customers, drivers } = dashboardData;

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={7}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.name || 'User'} `}
            description="Begin leveraging the Transport Plus portal to streamline and manage your logistics operations seamlessly."
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
              total={874}
              color="warning"
              icon={ICONS.vehicle}
            />
          </Grid>

          <Grid xs={6} sm={4} md={2}>
            <DashboardTotalWidget
              title="Total Drivers"
              total={870}
              color="primary"
              icon={ICONS.driver}
            />
          </Grid>


          <Grid xs={6} sm={4} md={2}>
            <DashboardTotalWidget
              title="Total Customers"
              total={87}
              color="secondary"
              icon={ICONS.customer}
            />
          </Grid>


          <Grid xs={6} sm={4} md={2}>
            <DashboardTotalWidget
              title="Total Transporters"
              total={128}
              color="info"
              icon={ICONS.transporter}
            />
          </Grid>


          <Grid xs={6} sm={4} md={2}>
            <DashboardTotalWidget
              title="Total Invoice Generated"
              total={190}
              color="error"
              icon={ICONS.invoice}
            />
          </Grid>

          <Grid xs={6} sm={4} md={2}>
            <DashboardTotalWidget
              title="Total Subtrips Completed"
              total={2972}
              color="success"
              icon={ICONS.subtrip}
            />
          </Grid>

        </>


        {invoices && (
          <Grid xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title="Invoices"
              subheader="Invoice generated through the dashboard"
              chart={{
                series: [
                  { label: 'Pending', value: 100 },
                  { label: 'Paid', value: 899 },
                  { label: 'OverDue', value: 19 },
                ],
              }}
            />
          </Grid>
        )}

        <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
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
                {
                  name: '2025',
                  data: [
                    { name: 'Own', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 18, 10] },
                    { name: 'Market', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 18, 10] },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} lg={8}>
          <SubtripExpiryTable
            title="⚠️ Expiring Eway Bills"
            subheader="Active subtrips with Eway Bills expiring within the next 24 hours. Please take timely action."
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopRelated title="Related applications" list={_appRelated} />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <CustomerFreightTable
            title="📦 Customer-wise Summary"
            subheader="Shows total weight transferred and freight amount for each customer."
          />
        </Grid>



        <Grid xs={12} md={6} lg={4}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <AppWidget
              title="Conversion"
              total={38566}
              icon="solar:user-rounded-bold"
              chart={{ series: 48 }}
            />

            <AppWidget
              title="Applications"
              total={55566}
              icon="fluent:mail-24-filled"
              chart={{
                series: 75,
                colors: [theme.vars.palette.info.light, theme.vars.palette.info.main],
              }}
              sx={{ bgcolor: 'info.dark', [`& .${svgColorClasses.root}`]: { color: 'info.light' } }}
            />
          </Box>
        </Grid>

        <Grid xs={12} lg={8}>
          <AppSubtripExpensesCategory
            title="Expenses categories"
            chart={{
              series: [
                { label: 'Entertainment', value: 22 },
                { label: 'Fuel', value: 18 },
                { label: 'Fast food', value: 16 },
                { label: 'Cafe', value: 17 },
                { label: 'Сonnection', value: 14 },
                { label: 'Healthcare', value: 22 },
                { label: 'Fitness', value: 10 },
                { label: 'Supermarket', value: 21 },
              ],
              icons: [
                <Iconify icon="streamline:dices-entertainment-gaming-dices-solid" />,
                <Iconify icon="maki:fuel" />,
                <Iconify icon="ion:fast-food" />,
                <Iconify icon="maki:cafe" />,
                <Iconify icon="basil:mobile-phone-outline" />,
                <Iconify icon="solar:medical-kit-bold" />,
                <Iconify icon="ic:round-fitness-center" />,
                <Iconify icon="solar:cart-3-bold" />,
              ],
            }}
          />
        </Grid>


      </Grid>
    </DashboardContent>
  );
}
