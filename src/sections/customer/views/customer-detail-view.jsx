import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CustomerBasicWidget, CustomerFinanceWidget, CustomerAdditionalWidget } from '../widgets';

export function CustomerDetailView({ customer }) {
  const {
    _id,
    customerName,
    GSTNo,
    PANNo,
    address,
    state,
    pinCode,
    cellNo,
    bankDetails,
    gstEnabled,
    transporterCode,
    invoicePrefix,
    invoiceSuffix,
    currentInvoiceSerialNumber,
    invoiceDueInDays,
  } = customer || {};

  return (
    <DashboardContent>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 9,
          bgcolor: 'background.default',
          py: { xs: 2, md: 3 },
        }}
      >
        <CustomBreadcrumbs
          heading="Customer Info"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Customers List', href: paths.dashboard.customer.root },
            { name: `${customerName}` },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.customer.edit(_id)}
              variant="contained"
              startIcon={<Iconify icon="solar:pen-bold" />}
            >
              Edit Customer
            </Button>
          }
        />
      </Box>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <CustomerBasicWidget customer={{ customerName, address, state, pinCode, cellNo }} />
          </Grid>
          <Grid xs={12} md={4}>
            <CustomerFinanceWidget customer={{ bankDetails, gstEnabled, GSTNo, PANNo }} />
          </Grid>
          <Grid xs={12} md={4}>
            <CustomerAdditionalWidget
              customer={{
                transporterCode,
                invoicePrefix,
                invoiceSuffix,
                currentInvoiceSerialNumber,
                invoiceDueInDays,
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}
