import { useSearchParams } from 'react-router-dom';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import PurchaseOrderForm from '../purchase-order-form';

export function PurchaseOrderCreateView() {
  const [searchParams] = useSearchParams();
  const vendorId = searchParams.get('vendor');
  const vendorName = searchParams.get('vendorName');
  const vendorAddress = searchParams.get('vendorAddress');
  const vendorPhone = searchParams.get('vendorPhone');

  const currentPurchaseOrder = vendorId 
    ? { 
        vendor: { 
          _id: vendorId, 
          name: vendorName || '', 
          address: vendorAddress || '', 
          phone: vendorPhone || '' 
        } 
      } 
    : undefined;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create Purchase Order"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Purchase Orders', href: paths.dashboard.purchaseOrder.list },
          { name: 'New Purchase Order' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PurchaseOrderForm currentPurchaseOrder={currentPurchaseOrder} />
    </DashboardContent>
  );
}

