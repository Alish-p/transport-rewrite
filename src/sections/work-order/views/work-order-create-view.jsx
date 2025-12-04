import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import WorkOrderForm from '../work-order-form';

export function WorkOrderCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create Work Order"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Work Orders', href: paths.dashboard.workOrder.list },
          { name: 'New Work Order' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <WorkOrderForm />
    </DashboardContent>
  );
}

