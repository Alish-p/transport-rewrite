import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import LoanForm from '../loans-form';

export function LoansCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create Loan"
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Payroll', href: '/dashboard/driver-payroll' },
          { name: 'Driver Salary Creation' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <LoanForm />
    </DashboardContent>
  );
}
