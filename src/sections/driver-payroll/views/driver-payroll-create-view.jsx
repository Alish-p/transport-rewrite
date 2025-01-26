import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import DriverSalaryFormAndPreview from '../driver-salary-form-and-preview';

export function DriverPayrollCreateView({ driverList }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="PAY-XXX"
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Payroll', href: '/dashboard/driver-payroll' },
          { name: 'PAY-XXX' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DriverSalaryFormAndPreview driverList={driverList} />
    </DashboardContent>
  );
}
