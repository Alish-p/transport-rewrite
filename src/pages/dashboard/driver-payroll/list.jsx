import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useSelector, useDispatch } from 'src/redux/store';
import { fetchPayrollReceipts } from 'src/redux/slices/driver-payroll';

import { DriverPayrollListView } from 'src/sections/driver-payroll/views';

// ----------------------------------------------------------------------

const metadata = { title: `DriverPayroll list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPayrollReceipts());
  }, [dispatch]);

  const { payrollReceipts, isLoading } = useSelector((state) => state.driverPayroll);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <DriverPayrollListView payrollReceipts={payrollReceipts} />
    </>
  );
}
