import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import DriverDeductionForm from '../driver-deductions-form';

export function DriverDeductionsEditView({ driverList, driverDeduction }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Drive Deduction"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Payroll', href: paths.dashboard.driverDeductions.root },
          { name: 'Driver Deduction Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DriverDeductionForm driverList={driverList} currentDriverDeduction={driverDeduction} />
    </DashboardContent>
  );
}
