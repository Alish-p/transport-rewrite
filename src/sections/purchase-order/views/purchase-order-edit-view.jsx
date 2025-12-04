import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import PurchaseOrderForm from '../purchase-order-form';

export function PurchaseOrderEditView({ purchaseOrder }) {
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

      <PurchaseOrderForm currentPurchaseOrder={purchaseOrder} />
    </DashboardContent>
  );
}

