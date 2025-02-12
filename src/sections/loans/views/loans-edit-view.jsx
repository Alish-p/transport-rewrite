import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import LoanForm from '../loans-form';

export function LoanEditView({ driverList, loan }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Loan"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'loan', href: paths.dashboard.loan.root },
          { name: 'Loan Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <LoanForm currentLoan={loan} />
    </DashboardContent>
  );
}
