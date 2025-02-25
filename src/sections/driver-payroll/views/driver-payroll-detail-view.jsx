import { useCallback } from 'react';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import DriverSalaryPreview from '../driver-salary-preview';
import DriverSalaryToolbar from '../driver-salary-toolbar';
import { useUpdateDriverPayrollStatus } from '../../../query/use-driver-payroll';

export const PAYSLIP_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
];

export function DriverPayrollDetailView({ driverPayroll }) {
  const driverPayrollStatus = useUpdateDriverPayrollStatus();

  const { status, _id } = driverPayroll;

  const handleChangeStatus = useCallback(
    (event) => {
      const newStatus = event.target.value;

      driverPayrollStatus({ id: _id, status: newStatus });
    },
    [_id, driverPayrollStatus]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={_id}
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Payslip', href: '/dashboard/payslip' },
          { name: _id },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DriverSalaryToolbar
        payslip={driverPayroll}
        currentStatus={status || ''}
        onChangeStatus={handleChangeStatus}
        statusOptions={PAYSLIP_STATUS_OPTIONS}
      />

      <DriverSalaryPreview driverSalary={driverPayroll} />
    </DashboardContent>
  );
}
