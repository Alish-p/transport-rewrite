import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { dispatch } from 'src/redux/store';
import { fetchPayrollReceipt } from 'src/redux/slices/driver-payroll';

import { DriverPayrollDetailView } from 'src/sections/driver-payroll/views';

// ----------------------------------------------------------------------

const metadata = { title: `Driver Payroll details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchPayrollReceipt(id));
  }, [id]);

  const { payrollReceipt: payslipData, isLoading } = useSelector((state) => state.driverPayroll);

  console.log(payslipData);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      {!isLoading && <DriverPayrollDetailView payslip={payslipData} loading={isLoading} />}
    </>
  );
}
