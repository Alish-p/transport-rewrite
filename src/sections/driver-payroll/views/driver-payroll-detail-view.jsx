import { useParams } from 'react-router';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import DriverSalaryPreview from '../driver-salary-preview';
import DriverSalaryToolbar from '../driver-salary-toolbar';
import { fetchPayrollReceipt, updatePayrollStatus } from '../../../redux/slices/driver-payroll';

export const PAYSLIP_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
];

export function DriverPayrollDetailView() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { payrollReceipt, isLoading } = useSelector((state) => state.driverPayroll);

  useEffect(() => {
    dispatch(fetchPayrollReceipt(id));
  }, [dispatch, id]);

  const payrollReceiptStatus = payrollReceipt?.status;

  const handleChangeStatus = useCallback(
    (event) => {
      const newStatus = event.target.value;

      dispatch(updatePayrollStatus(id, newStatus));
    },
    [dispatch, id]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={id}
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Payslip', href: '/dashboard/payslip' },
          { name: id },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {payrollReceipt && (
        <DriverSalaryToolbar
          payslip={payrollReceipt}
          currentStatus={payrollReceiptStatus || ''}
          onChangeStatus={handleChangeStatus}
          statusOptions={PAYSLIP_STATUS_OPTIONS}
        />
      )}

      {payrollReceipt && !isLoading && <DriverSalaryPreview driverSalary={payrollReceipt} />}
    </DashboardContent>
  );
}
