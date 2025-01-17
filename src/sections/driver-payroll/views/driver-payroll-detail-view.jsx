import { useState, useCallback } from 'react';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { dispatch } from '../../../redux/store';
import PayslipDetail from '../driver-salary-details';
import DriverSalaryToolbar from '../driver-salary-toolbar';
import { updatePayrollStatus } from '../../../redux/slices/driver-payroll';

export const INVOICE_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
];

export function DriverPayrollDetailView({ payslip, loading }) {
  const {
    _id,
    subtripComponents,
    driverId: driver,
    invoiceStatus,
    createdDate,
    otherSalaryComponent,
  } = payslip || {};

  const [currentStatus, setCurrentStatus] = useState(payslip?.invoiceStatus);

  const handleChangeStatus = useCallback(
    (event) => {
      const newStatus = event.target.value;
      setCurrentStatus(newStatus);
      dispatch(updatePayrollStatus(_id, newStatus));
    },
    [_id]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="INV-123"
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Payslip', href: '/dashboard/payslip' },
          { name: 'PAY-123' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {payslip && (
        <DriverSalaryToolbar
          payslip={payslip}
          currentStatus={currentStatus || ''}
          onChangeStatus={handleChangeStatus}
          statusOptions={INVOICE_STATUS_OPTIONS}
        />
      )}

      <PayslipDetail
        invoiceNo={_id}
        selectedSubtripsData={subtripComponents?.map((st) => st.subtripId)}
        driver={driver}
        status={currentStatus}
        createdDate={createdDate}
        otherSalaryComponent={otherSalaryComponent}
      />
    </DashboardContent>
  );
}
