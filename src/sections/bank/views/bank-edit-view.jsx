import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import BankForm from '../bank-form';

export function BankEditView({ bank }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Bank"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Bank List',
            href: paths.dashboard.bank.list,
          },
          { name: bank?.bankName },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BankForm currentBank={bank} />
    </DashboardContent>
  );
}
