import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import BankForm from '../bank-form';

export function BankCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add New Bank"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Bank List', href: paths.dashboard.bank.list },
          { name: 'Add New Bank' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BankForm />
    </DashboardContent>
  );
}
