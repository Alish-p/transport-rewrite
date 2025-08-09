import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

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
      <CustomBreadcrumbs
        heading="Customer Info"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Customers List', href: paths.dashboard.customer.root },
          { name: `${customerName}` },
        ]}
        sx={{ my: { xs: 3, md: 5 } }}
      />
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <CustomerBasicWidget
              customerId={_id}
              customer={{ customerName, address, state, pinCode, cellNo }}
            />
          </Grid>
          <Grid xs={12} md={4}>
            <CustomerFinanceWidget
              customerId={_id}
              customer={{ bankDetails, gstEnabled, GSTNo, PANNo }}
            />
          </Grid>
          <Grid xs={12} md={4}>
            <CustomerAdditionalWidget
              customerId={_id}
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
