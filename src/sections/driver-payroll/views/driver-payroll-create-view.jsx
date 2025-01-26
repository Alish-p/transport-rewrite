import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import DriverSalaryFormAndPreview from '../driver-salary-form-and-preview';

export function DriverPayrollCreateView({ driverList }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create Drive Salary"
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Payroll', href: '/dashboard/driver-payroll' },
          { name: 'Driver Salary Creation' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DriverSalaryFormAndPreview driverList={driverList} />
    </DashboardContent>
  );
}
