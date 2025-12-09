import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export function PurchaseOrderEditView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Purchase Order"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Purchase Orders', href: paths.dashboard.purchaseOrder.list },
          { name: 'Edit Purchase Order' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={3}>
        <Alert severity="success" variant="outlined">
          <Stack spacing={2}>
            <Typography variant="subtitle1">Purchase Order Editing Not Available</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              For data integrity reasons, purchase orders cannot be edited once created. If you need
              to make changes, please delete the existing purchase order and create a new one
              instead.
            </Typography>
          </Stack>
        </Alert>
      </Stack>
    </DashboardContent>
  );
}
